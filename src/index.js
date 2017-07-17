// @flow

import React from 'react'
import { string, oneOf } from 'prop-types'
import enhanceTypo from './typography'

/**
 * Component for displaying HTML content
 * @param {Object} props
 */
const HTMLContent = props => {
  const { children, tagName, locale, ...rest } = props
  const Tag = tagName
  return <Tag dangerouslySetInnerHTML={{ __html: enhanceTypo(children, locale) }} {...rest} />
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

export {
  enhanceTypo,
}
