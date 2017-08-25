// @flow

import React from 'react'
import { string, oneOf } from 'prop-types'
import enhanceTypoBase from './typography'

const enhanceTypo = (data, locale = 'cs', config) =>
  data.replace(/([^<]*)(\s?<[A-z]+[^>]*>)([\s\S]*?)\s?(<\/[A-z]+>\s?)([^<]*)/gi, function (
    _,
    beforeTag: string,
    startTag: string,
    body: string,
    endTag: string,
    afterTag: string
  ) {
    if (/(<[A-z]+[^>]*>)(.*?)(<\/[A-z]+>)/g.test(body)) {
      return enhanceTypoInHTML(body)
    } else {
      return (
        enhanceTypoBase(beforeTag, locale, config) +
        (beforeTag.lastIndexOf(' ') === beforeTag.length - 1 ? ' ' : '') +
        startTag +
        enhanceTypoBase(body, locale, config) +
        endTag +
        enhanceTypoBase(afterTag, locale, config)
      )
    }
  })

/**
 * Component for displaying HTML content
 * @param {Object} props
 */
const HTMLContent = props => {
  const { children, tagName, locale, ...rest } = props
  const Tag = tagName
  return (
    <Tag
      dangerouslySetInnerHTML={{
        __html: finalEnhanceTypo(children),
      }}
      {...rest}
    />
  )
}

HTMLContent.propTypes = {
  /**
   * HTML string to display
   */
  children: string.isRequired,
  /**
   * Tag name or react component (supporting dangerouslySetInnerHTML) to wrap HTML
   */
  tagName: string,
  /**
   * Locale of HTML text
   */
  locale: oneOf(['cs', 'sk', 'en-us', 'rue']),
}

HTMLContent.defaultProps = {
  tagName: 'div',
  locale: 'cs',
}

export default HTMLContent

export { enhanceTypo }
