import sanitize from './sanitize'

const preps = ['à', 'bez', 'dle', 'do', 'k', 'ke', 'kol', 'na', 'o', 'ob', 'od', 'ode', 'po', 'pod', 'při', 'pro', 's', 'u', 'v', 've', 'a', 'i', 'vo', 'vod', 'z', 'za', 'ze', 'ač']
const rules = [
  // Sanitize html
  text => sanitize(text),
  // Add non breaking spaces
  text => text.replace(new RegExp(`(\\s(${preps.join('|')}))(\\s|\\n)([^.,])`, 'gim'), '$1&nbsp;$4'),
  text => text.replace(/(([0-9+\-*\/=]+)\s+(\1))/gim, '$2&nbsp;$3'),
  text => text.replace(/([!?]){2,}/g, '$1'), // multiple ?? !!
  // Symbols
  text => text.replace(/\s?(\(c\))|\s?(\(с\))/gi, '\xA0©'),
  text => text.replace(/\s?\(r\)/gi, '\xA0®'),
  text => text.replace(/\s?\(d\)/gi, '\xA0°'),
  text => text.replace(/\s?(\(tm\))|\s?(\(тм\))/gi, '™'),
  // Units
  text => text.replace(/\s?(dm|um|mm|cm|m|km)\^\s?2/gi, '\xA0$1²'),
  text => text.replace(/\s?(dm|um|mm|cm|m|km)\^\s?3/gi, '\xA0$1³'),
]

export default rules
