import './style.css'
import setupFurigana from './furigana'

document.querySelector('#app').innerHTML = `
  <div>
    <h1 id="furiganaField"><ruby>振仮名<rp>(</rp><rt>ふりがな</rt><rp>)</rp></ruby><ruby>追加<rp>(</rp><rt>ついか</rt><rp>)</rp></ruby><ruby>希望<rp>(</rp><rt>きぼう</rt><rp>)</rp></ruby>の<ruby>文章<rp>(</rp><rt>ぶんしょう</rt><rp>)</rp></ruby>を<ruby>入力<rp>(</rp><rt>にゅうりょく</rt><rp>)</rp></ruby>してください</h1>
    <div class="card">
      <form id="furiganaForm">
        <input id="jpInput"></input>
        <button type="submit">Add Furigana!</button>
      </form>
    </div>
    <p class="read-the-docs">
      © 2024 by Alan Holman | <a href="https://shuruni.dev" alt="Visit My Personal Website">shuruni.dev</a>
    </p>
  </div>
`

setupFurigana(document.querySelector('#furiganaForm'), document.querySelector('#jpInput'), document.querySelector('#furiganaField'));
