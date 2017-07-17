import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import HTMLContent from '../src/index'

import { Button, Welcome } from '@storybook/react/demo'

const demoText = `Pisu jako prase,ale takový jsem já a říkam: "Jděte k šípku, <em>hovada</em>!".Myslivec - střelec zvířátek.`

storiesOf('About component', module).add('to Storybook', () => <div>
  <h1>React HTMLContent</h1>
  <p />
</div>)

storiesOf('HTMLContent', module)
  .add('displays HTML', () => (
    <HTMLContent>Ahoj,já jsem obyčejný text -- mimochodem, původně v sobě   mám v sobě typografické chyby.Špatné datum 12.12.2000.</HTMLContent>
  ))
  .add('displays HTML in article tag', () => (
    <HTMLContent tagName='article'>{`Ahoj, ja jsem <b>HTMLContent</b>.`}</HTMLContent>
  ))
  .add('fixes typography', () => (
    <div>
      <h5>Original</h5>
      <p dangerouslySetInnerHTML={{__html: demoText}} />
      <h5>After typography tweaks</h5>
      <HTMLContent tagName='p'>{demoText}</HTMLContent>
    </div>
  ))
