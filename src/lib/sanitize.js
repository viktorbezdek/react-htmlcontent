import htmlparser from 'htmlparser2'
import extend from 'xtend'
import quoteRegexp from 'regexp-quote'

function each (obj, cb) {
  if (obj) {
    Object.keys(obj).forEach(function (key) {
      cb(obj[key], key)
    })
  }
}

// Avoid false positives with .__proto__, .hasOwnProperty, etc.
function has (obj, key) {
  return ({}).hasOwnProperty.call(obj, key)
}

// Ignore the _recursing flag; it's there for recursive
// invocation as a guard against this exploit:
// https://github.com/fb55/htmlparser2/issues/105

/* eslint-disable no-unused-vars */
export default function sanitize (html, options, _recursing) {
  let result = ''

  function Frame (tag, attribs) {
    const that = this
    this.tag = tag
    this.attribs = attribs || {}
    this.tagPosition = result.length
    this.text = '' // Node inner text

    this.updateParentNodeText = function () {
      if (stack.length) {
        const parentFrame = stack[stack.length - 1]
        parentFrame.text += that.text
      }
    }
  }

  if (!options) {
    options = sanitize.defaults
    options.parser = htmlParserDefaults
  } else {
    options = extend(sanitize.defaults, options)
    if (options.parser) {
      options.parser = extend(htmlParserDefaults, options.parser)
    } else {
      options.parser = htmlParserDefaults
    }
  }

  // Tags that contain something other than HTML, or where discarding
  // the text when the tag is disallowed makes sense for other reasons.
  // If we are not allowing these tags, we should drop their content too.
  // For other tags you would drop the tag but keep its content.
  const nonTextTagsArray = options.nonTextTags || ['script', 'style', 'textarea']
  let allowedAttributesMap
  let allowedAttributesGlobMap
  if (options.allowedAttributes) {
    allowedAttributesMap = {}
    allowedAttributesGlobMap = {}
    each(options.allowedAttributes, function (attributes, tag) {
      allowedAttributesMap[tag] = []
      const globRegex = []
      attributes.forEach(function (name) {
        if (name.indexOf('*') >= 0) {
          globRegex.push(quoteRegexp(name).replace(/\\\*/g, '.*'))
        } else {
          allowedAttributesMap[tag].push(name)
        }
      })
      allowedAttributesGlobMap[tag] = new RegExp(`^(${globRegex.join('|')})$`)
    })
  }
  const allowedClassesMap = {}
  each(options.allowedClasses, function (classes, tag) {
    // Implicitly allows the class attribute
    if (allowedAttributesMap) {
      if (!has(allowedAttributesMap, tag)) {
        allowedAttributesMap[tag] = []
      }
      allowedAttributesMap[tag].push('class')
    }

    allowedClassesMap[tag] = classes
  })

  const transformTagsMap = {}
  let transformTagsAll
  each(options.transformTags, function (transform, tag) {
    let transFun
    if (typeof transform === 'function') {
      transFun = transform
    } else if (typeof transform === 'string') {
      transFun = sanitize.simpleTransform(transform)
    }
    if (tag === '*') {
      transformTagsAll = transFun
    } else {
      transformTagsMap[tag] = transFun
    }
  })

  let depth = 0
  let stack = []
  const skipMap = {}
  const transformMap = {}
  let skipText = false
  let skipTextDepth = 0

  const parser = new htmlparser.Parser({
    onopentag (name, attribs) {
      if (skipText) {
        skipTextDepth++
        return
      }
      const frame = new Frame(name, attribs)
      stack.push(frame)

      let skip = false
      const hasText = !!frame.text
      let transformedTag
      if (has(transformTagsMap, name)) {
        transformedTag = transformTagsMap[name](name, attribs)

        frame.attribs = attribs = transformedTag.attribs

        if (transformedTag.text !== undefined) {
          frame.innerText = transformedTag.text
        }

        if (name !== transformedTag.tagName) {
          frame.name = name = transformedTag.tagName
          transformMap[depth] = transformedTag.tagName
        }
      }
      if (transformTagsAll) {
        transformedTag = transformTagsAll(name, attribs)

        frame.attribs = attribs = transformedTag.attribs
        if (name !== transformedTag.tagName) {
          frame.name = name = transformedTag.tagName
          transformMap[depth] = transformedTag.tagName
        }
      }

      if (options.allowedTags && options.allowedTags.indexOf(name) === -1) {
        skip = true
        if (nonTextTagsArray.indexOf(name) !== -1) {
          skipText = true
          skipTextDepth = 1
        }
        skipMap[depth] = true
      }
      depth++
      if (skip) {
        // We want the contents but not this tag
        return
      }
      result += `<${name}`
      if (!allowedAttributesMap || has(allowedAttributesMap, name) || allowedAttributesMap['*']) {
        each(attribs, function (value, a) {
          if (!allowedAttributesMap ||
            (has(allowedAttributesMap, name) && allowedAttributesMap[name].indexOf(a) !== -1) ||
            (allowedAttributesMap['*'] && allowedAttributesMap['*'].indexOf(a) !== -1) ||
            (has(allowedAttributesGlobMap, name) && allowedAttributesGlobMap[name].test(a)) ||
            (allowedAttributesGlobMap['*'] && allowedAttributesGlobMap['*'].test(a))) {
            if ((a === 'href') || (a === 'src')) {
              if (naughtyHref(name, value)) {
                delete frame.attribs[a]
                return
              }
            }
            if (a === 'class') {
              value = filterClasses(value, allowedClassesMap[name])
              if (!value.length) {
                delete frame.attribs[a]
                return
              }
            }
            result += ` ${a}`
            if (value.length) {
              result += `="${escapeHtml(value)}"`
            }
          } else {
            delete frame.attribs[a]
          }
        })
      }
      if (options.selfClosing.indexOf(name) !== -1) {
        result += ' />'
      } else {
        result += '>'
        if (frame.innerText && !hasText && !options.textFilter) {
          result += frame.innerText
        }
      }
    },
    ontext (text) {
      if (skipText) {
        return
      }
      const lastFrame = stack[stack.length - 1]
      let tag

      if (lastFrame) {
        tag = lastFrame.tag
        // If inner text was set by transform function then let's use it
        text = lastFrame.innerText !== undefined ? lastFrame.innerText : text
      }

      if ((tag === 'script') || (tag === 'style')) {
        // htmlparser2 gives us these as-is. Escaping them ruins the content. Allowing
        // script tags is, by definition, game over for XSS protection, so if that's
        // your concern, don't allow them. The same is essentially true for style tags
        // which have their own collection of XSS vectors.
        result += text
      } else {
        const escaped = escapeHtml(text)
        if (options.textFilter) {
          result += options.textFilter(escaped)
        } else {
          result += escaped
        }
      }
      if (stack.length) {
        const frame = stack[stack.length - 1]
        frame.text += text
      }
    },
    onclosetag (name) {
      if (skipText) {
        skipTextDepth--
        if (!skipTextDepth) {
          skipText = false
        } else {
          return
        }
      }

      const frame = stack.pop()
      if (!frame) {
        // Do not crash on bad markup
        return
      }
      skipText = false
      depth--
      if (skipMap[depth]) {
        delete skipMap[depth]
        frame.updateParentNodeText()
        return
      }

      if (transformMap[depth]) {
        name = transformMap[depth]
        delete transformMap[depth]
      }

      if (options.exclusiveFilter && options.exclusiveFilter(frame)) {
        result = result.substr(0, frame.tagPosition)
        return
      }

      frame.updateParentNodeText()

      if (options.selfClosing.indexOf(name) !== -1) {
        // Already output />
        return
      }

      result += `</${name}>`
    },
  }, options.parser)
  parser.write(html)
  parser.end()

  return result

  function escapeHtml (s) {
    if (typeof (s) !== 'string') {
      s += ''
    }
    return s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;')
  }

  function naughtyHref (name, href) {
    // Browsers ignore character codes of 32 (space) and below in a surprising
    // number of situations. Start reading here:
    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet#Embedded_tab
    href = href.replace(/[\x00-\x20]+/g, '')
    // Clobber any comments in URLs, which the browser might
    // interpret inside an XML data island, allowing
    // a javascript: URL to be snuck through
    href = href.replace(/<\!\-\-.*?\-\-\>/g, '')
    // Case insensitive so we don't get faked out by JAVASCRIPT #1
    const matches = href.match(/^([a-zA-Z]+)\:/)
    if (!matches) {
      // Protocol-relative URL: "//some.evil.com/nasty"
      if (href.match(/^\/\//)) {
        return !options.allowProtocolRelative
      }

      // No scheme
      return false
    }
    const scheme = matches[1].toLowerCase()

    if (has(options.allowedSchemesByTag, name)) {
      return options.allowedSchemesByTag[name].indexOf(scheme) === -1
    }

    return !options.allowedSchemes || options.allowedSchemes.indexOf(scheme) === -1
  }

  function filterClasses (classes, allowed) {
    if (!allowed) {
      // The class attribute is allowed without filtering on this tag
      return classes
    }
    classes = classes.split(/\s+/)
    return classes.filter(function (clss) {
      return allowed.indexOf(clss) !== -1
    }).join(' ')
  }
}

// Defaults are accessible to you so that you can use them as a starting point
// programmatically if you wish

let htmlParserDefaults = {
  decodeEntities: true,
}
sanitize.defaults = {
  allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    // We don't currently allow img itself by default, but this
    // would make sense if we did
    img: ['src'],
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
  allowedSchemesByTag: {},
  allowProtocolRelative: true,
}

sanitize.simpleTransform = function (newTagName, newAttribs, merge) {
  merge = (merge === undefined) ? true : merge
  newAttribs = newAttribs || {}

  return function (tagName, attribs) {
    let attrib
    if (merge) {
      for (attrib in newAttribs) {
        attribs[attrib] = newAttribs[attrib]
      }
    } else {
      attribs = newAttribs
    }

    return {
      tagName: newTagName,
      attribs,
    }
  }
}
