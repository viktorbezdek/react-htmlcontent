import {fixTrademark} from '../../src/lib/symbols/trademark'
import {fixTypos} from '../../src/typopo'
import assert from 'assert'
import Locale from '../../src/locale/locale'

describe('Fix trademark ™\n', () => {
  let testCase = {
    '(tm)': '™',
    '(TM)': '™',
    '( tm )': '™',
    'Company (tm)': 'Company™',
    'Company ™': 'Company™',
  }

  Object.keys(testCase).forEach((key) => {
    it('', () => {
      assert.equal(fixTrademark(key, new Locale('en-us')), testCase[key])
    })
  })
})
