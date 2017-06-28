import React from 'react';
import { string } from 'prop-types';
import rules from './lib/rules';

const HTMLContent = (props) => {
  const { children, tagName } = props
  const Tag = tagName;
  const sanitized = rules.reduce((r, f) => f(r), children);
  return (
    <Tag dangerouslySetInnerHTML={{ __html: sanitized }} />
  );
};

HTMLContent.defaultProps = {
  tagName: 'div'
};

HTMLContent.propTypes = {
  children: string.isRequired,
  tagName: string.isRequired
};

export default HTMLContent;
