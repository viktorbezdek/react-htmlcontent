import {fixSingleQuotesPrimesAndApostrophes} from '../../src/lib/punctuation/single-quotes'
import Locale from '../../src/locale/locale'

import assert from 'assert'

describe('Single quotes in default language (en)\n', () => {
  let testCase = {
		/* Basic tests */
    "Let's test this: “however, 'quote this or nottin' 'n' this will be corrected for 69'ers,' he said”":
		'Let’s test this: “however, ‘quote this or nottin’ ’n’ this will be corrected for 69’ers,’ he said”',
    "Within double quotes “there are single 'quotes with mix’d punctuation', you see”.":
		'Within double quotes “there are single ‘quotes with mix’d punctuation’, you see”.',
    "He said: “What about 'name' and 'other name'?”":
		'He said: “What about ‘name’ and ‘other name’?”',
    "He said: “What about 'Localhost 3000', is that good?”":
		'He said: “What about ‘Localhost 3000’, is that good?”',

		/* Mixing quotes and primes, left for single quotes */
    "12' 45″": '12′ 45″',
    "3° 5' 30″": '3° 5′ 30″',

		/* Improperly spaced primes, left for single quotes */
    '12 ′ 45″': '12′ 45″',
    '3° 5 ′ 30″': '3° 5′ 30″',

		/* apostrophes */
    "Fish 'n' Chips": 'Fish ’n’ Chips',
    "Find 'em!": 'Find ’em!',
    "Just 'cause I wanna.": 'Just ’cause I wanna.',
    "'Tis the season": '’Tis the season',
    "'Twas the Night Before Christmas": '’Twas the Night Before Christmas',
    "'Til The Season Comes 'Round Again": '’Til The Season Comes ’Round Again',
    "Hers'": 'Hers’',
    "INCHEBA '89": 'INCHEBA ’89',
    "69'ers": '69’ers',
    "iPhone6's": 'iPhone6’s',
    "1990's": '1990’s',
    "don't": 'don’t',
    "don''t": 'don’t',
    "don''’t": 'don’t',
    "don\"'''t": 'don’t',
    'don"t': 'don’t',
  }

  Object.keys(testCase).forEach((key) => {
    it('should fix single quotes, primes and apostrophes in English', () => {
      assert.equal(fixSingleQuotesPrimesAndApostrophes(key, new Locale('en-us')), testCase[key])
    })
  })
})

describe('Single quotes in Slovak and Czech language (sk, cs)\n', () => {
  let testCase = {
    "„double quotes 'and single quotes' within“":
		'„double quotes ‚and single quotes‘ within“',

    "Hej: „Vin mu povil, 'ta de jes' take vidil' i neviril“":
		'Hej: „Vin mu povil, ‚ta de jes’ take vidil‘ i neviril“',

    "INCHEBA '89": 'INCHEBA ’89',
  }

  Object.keys(testCase).forEach((key) => {
    it('should fix single quotes, primes and apostrophes in Slovak/Czech', () => {
      assert.equal(fixSingleQuotesPrimesAndApostrophes(key, new Locale('sk')), testCase[key])
      assert.equal(fixSingleQuotesPrimesAndApostrophes(key, new Locale('cs')), testCase[key])
    })
  })
})

describe('Single quotes in Rusyn language (rue)\n', () => {
  let testCase = {
    "«double quotes 'and single quotes' within»":
		'«double quotes ‹and single quotes› within»',

    "Hej: «Vin mu povil, 'ta de jes' take vidil' i neviril»":
		'Hej: «Vin mu povil, ‹ta de jes’ take vidil› i neviril»',

    "He said: «What about 'name' and 'other name'?»":
		'He said: «What about ‹name› and ‹other name›?»',

    "INCHEBA '89": 'INCHEBA ’89',

  }

  Object.keys(testCase).forEach((key) => {
    it('should fix single quotes, primes and apostrophes in Rusyn', () => {
      assert.equal(fixSingleQuotesPrimesAndApostrophes(key, new Locale('rue')), testCase[key])
    })
  })
})
