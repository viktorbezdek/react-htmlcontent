import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import HTMLContent from '../src/index'

import { Button, Welcome } from '@storybook/react/demo'

const demoText = `<h1>Ita graviter et severe voluptatem secrevit a bono.</h1>

<p className="lala-jede-2">Lorem-ipsum dolor sit amet, consectetur adipiscing elit. Igitur ne dolorem quidem. <i>In schola desinis.</i> <mark>At hoc in eo M.</mark> </p>

<p>Sint ista Graecorum; Memini me adesse P. <code>Hic ambiguo ludimur.</code> <a href="http://loripsum.net/" target="_blank">Omnes enim iucundum motum, quo sensus hilaretur.</a> Sed nunc, quod agimus; Inde igitur, inquit, ordiendum est. <i>Ut aliquid scire se gaudeant?</i> </p>

<blockquote cite="http://loripsum.net">
	Sin autem est in ea, quod quidam volunt, nihil impedit hanc nostram comprehensionem summi boni.
</blockquote>


<p>Duo Reges: constructio interrete. <code>Tu quidem reddes;</code> <mark>Venit ad extremum;</mark> Sed ad illum redeo. <b>Quid de Pythagora?</b> </p>

<h2>Quid sequatur, quid repugnet, vident.</h2>

<p>Sed quot homines, tot sententiae; Hic nihil fuit, quod quaereremus. Praeteritis, inquit, gaudeo. Itaque hic ipse iam pridem est reiectus; </p>

<pre>
Itaque idem natura victus, cui obsisti non potest, dicit
alio loco id, quod a te etiam paulo ante dictum est, non
posse iucunde vivi nisi etiam honeste.

Nam et complectitur verbis, quod vult, et dicit plane, quod
intellegam;
</pre>


<ol>
	<li>Etsi ea quidem, quae adhuc dixisti, quamvis ad aetatem recte isto modo dicerentur.</li>
	<li>Quod dicit Epicurus etiam de voluptate, quae minime sint voluptates, eas obscurari saepe et obrui.</li>
	<li>Hoc est non dividere, sed frangere.</li>
</ol>


<h3>Hoc etsi multimodis reprehendi potest, tamen accipio, quod dant.</h3>

<p>Quid est enim aliud esse versutum? Facillimum id quidem est, inquam. <i>Perge porro;</i> <a href="http://loripsum.net/" target="_blank">Nos commodius agimus.</a> <a href="http://loripsum.net/" target="_blank">Vide, quantum, inquam, fallare, Torquate.</a> </p>

<ul>
	<li>Qui bonum omne in virtute ponit, is potest dicere perfici beatam vitam perfectione virtutis;</li>
	<li>Praeclare hoc quidem.</li>
	<li>Idem iste, inquam, de voluptate quid sentit?</li>
	<li>Illa argumenta propria videamus, cur omnia sint paria peccata.</li>
	<li>Negat enim summo bono afferre incrementum diem.</li>
</ul>

<p>
  <img src="//unsplash.it/640x480" alt="Já jsem fakt kráva, ale je to fajne."/>
</p>


<dl>
	<dt><dfn>Ut pulsi recurrant?</dfn></dt>
	<dd>Quorum sine causa fieri nihil putandum est.</dd>
	<dt><dfn>Scrupulum, inquam, abeunti;</dfn></dt>
	<dd>Vulgo enim dicitur: Iucundi acti labores, nec male Euripidesconcludam, si potero, Latine;</dd>
	<dt><dfn>Quae sequuntur igitur?</dfn></dt>
	<dd>Qua tu etiam inprudens utebare non numquam.</dd>
	<dt><dfn>Tria genera bonorum;</dfn></dt>
	<dd>At iam decimum annum in spelunca iacet.</dd>
</dl>`

storiesOf('About component', module).add('to Storybook', () => (
  <div>
    <h1>React HTMLContent</h1>
    <p />
  </div>
))

storiesOf('HTMLContent', module)
  .add('displays HTML', () => <HTMLContent>{demoText}</HTMLContent>)
  .add('displays HTML in article tag', () => <HTMLContent tagName='article'>{`<h1>Title</h1> <h2>Subtitle</h2> <img src="http://unsplash.it/100x100" alt="Awesome image" /> Ahoj, ja jsem <b>HTMLContent</b>.`}</HTMLContent>)
  .add('Correctly sanitizes HTML', () => <HTMLContent>{`Ahoj, ja jsem <b>HTMLContent</b> a obsahuju <script>alert('yolo')</script> and <a href="javascript:alert('boom')">JS in href</a>.`}</HTMLContent>)
  .add('fixes typography', () =>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ width: '45%' }}>
        <h5>Original</h5>
        <p dangerouslySetInnerHTML={{ __html: demoText }} />
      </div>
      <div style={{ width: '45%' }}>
        <h5>After typography tweaks</h5>
        <HTMLContent>{demoText}</HTMLContent>
      </div>
    </div>
  )
