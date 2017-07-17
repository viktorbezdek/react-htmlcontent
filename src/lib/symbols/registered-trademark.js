import {addSpaceBeforeSymbol} from '../whitespace/spaces'
import {addNbspAfterSymbol,
				replaceSpacesWithNbspAfterSymbol} from '../whitespace/nbsp'
import {removeSpaceBeforeTerminalPunctuation,
				removeSpaceAfterPunctuation} from '../whitespace/spaces'

function replaceRwithRegisteredTrademark (string, locale) {
  let pattern = '([^0-9]|^)([' + locale.spaces + ']*)(\\(r\\)|' + locale.registeredTrademark + ')'
  let re = new RegExp(pattern, 'gi')
  let replacement = '$1' + locale.registeredTrademark

  return string.replace(re, replacement)
}

export function fixRegisteredTrademark (string, locale) {
  string = removeSpaceAfterPunctuation(string, locale)
  string = removeSpaceBeforeTerminalPunctuation(string, locale)
  string = replaceRwithRegisteredTrademark(string, locale)

  return string
}
