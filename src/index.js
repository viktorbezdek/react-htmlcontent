import React from 'react';
import { string } from 'prop-types';
import rules from './lib/rules';

const HTMLContent = ({ children, tagName }) => {
  const Tag = tagName;
  const sanititzed = rules.reduce((r, f) => f(r), children);
  return (
    <Tag dangerouslySetInnerHTML={{ __html: sanititzed }} />
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
