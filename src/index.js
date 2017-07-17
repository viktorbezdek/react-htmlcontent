// @flow

import React from 'react'
import { string, oneOf } from 'prop-types'
import {fixTypos} from './typopo'

/**
 * Component for displaying HTML content
 * @param {Object} props
 */
const HTMLContent = props => {
  const { children, tagName } = props
  const Tag = tagName
  return <Tag dangerouslySetInnerHTML={{ __html: fixTypos(children, 'cs') }} />
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
