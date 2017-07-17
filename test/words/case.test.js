import assert from 'assert'
import {fixCase} from '../../src/lib/words/case'
import Locale from '../../src/locale/locale'

describe('Corrects accidental uPPERCASE\n', () => {
  let testCase = {
    'Hey, JEnnifer!': 'Hey, Jennifer!',
    'CMSko': 'CMSko',
    'FPs': 'FPs',
    'ČSNka': 'ČSNka',
    'BigONE': 'BigONE', // specific brand names
    'two Panzer IVs': 'two Panzer IVs',
    'How about ABC?': 'How about ABC?',
    'cAPSLOCK': 'capslock',
    '(cAPSLOCK)': '(capslock)',
    'iPhone': 'iPhone',
    'iT': 'it',
    'Central Europe and Cyrillic tests: aĎIÉUБUГ': 'Central Europe and Cyrillic tests: aďiéuбuг',
  }

  Object.keys(testCase).forEach((key) => {
    it('', () => {
      assert.equal(fixCase(key, new Locale('en-us')), testCase[key])
    })
  })
})
