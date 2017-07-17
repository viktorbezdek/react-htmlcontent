import {fixSoundRecordingCopyright} from '../../src/lib/symbols/sound-recording-copyright'
import assert from 'assert'
import Locale from '../../src/locale/locale'

describe('Fix copyright ©\n', () => {
  let testCase = {
    '(p)2017': '℗ 2017',
    'Company (p)2017': 'Company ℗ 2017',
    'Company (P)2017': 'Company ℗ 2017',
    'Company ℗2017': 'Company ℗ 2017',
    'Company ℗ 2017': 'Company ℗ 2017',
    'Company(p) 2017': 'Company ℗ 2017',
    'Company(P) 2017': 'Company ℗ 2017',
    'Company℗ 2017': 'Company ℗ 2017',
    'Sec­tion 7(p)': 'Sec­tion 7(p)',
  }

  Object.keys(testCase).forEach((key) => {
    it('', () => {
      assert.equal(fixSoundRecordingCopyright(key, new Locale('en-us')), testCase[key])
    })
  })
})
