import { getFurigana } from "./src/kuroshiro"


export default function setupFurigana(formEl, inputEl, outputEl) {
  setFurigana(outputEl, "<ruby>振仮名<rp>(</rp><rt>ふりがな</rt><rp>)</rp></ruby><ruby>追加<rp>(</rp><rt>ついか</rt><rp>)</rp></ruby><ruby>希望<rp>(</rp><rt>きぼう</rt><rp>)</rp></ruby>の<ruby>文章<rp>(</rp><rt>ぶんしょう</rt><rp>)</rp></ruby>を<ruby>入力<rp>(</rp><rt>にゅうりょく</rt><rp>)</rp></ruby>してください")
  
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    getFurigana(inputEl.value).then((v) => setFurigana(outputEl, v), (r) => console.error(r));
  })
  
}

function setFurigana (outputEl, furigana) {
  outputEl.innerHTML = `${furigana}`
}