import {fixPeriod} from '../../src/lib/punctuation/period'
import assert from 'assert'
import Locale from '../../src/locale/locale'

describe('Replace 2 periods at the end of the sentecne with a single period\n', () => {
  let testCase = {
    'Sentence ending..': 'Sentence ending.',
    'He is a vice president at Apple Inc..': 'He is a vice president at Apple Inc.',
  }

  Object.keys(testCase).forEach((key) => {
    it('', () => {
      assert.equal(fixPeriod(key, new Locale('rue')), testCase[key])
    })
  })
})
