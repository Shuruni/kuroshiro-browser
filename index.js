import './style.css'
import { default as Kuroshiro } from "./src/kuroshiro/core.js"


// Setup the JavaScript for the Application...
setupFurigana(document.querySelector('#furiganaForm'), document.querySelector('#jpInput'), document.querySelector('#furiganaField'));


/**
 * Initializes Kuroshiro, and sets up an Event Listener to generate furigana on the {inputEl} output to the {outputEl} upon the submission of the {formEl} provided
 * @param {*} formEl 
 * @param {*} inputEl 
 * @param {*} outputEl 
 */
function setupFurigana(formEl, inputEl, outputEl) {
  // setFurigana(outputEl, "<ruby>振仮名<rp>(</rp><rt>ふりがな</rt><rp>)</rp></ruby><ruby>追加<rp>(</rp><rt>ついか</rt><rp>)</rp></ruby><ruby>希望<rp>(</rp><rt>きぼう</rt><rp>)</rp></ruby>の<ruby>文章<rp>(</rp><rt>ぶんしょう</rt><rp>)</rp></ruby>を<ruby>入力<rp>(</rp><rt>にゅうりょく</rt><rp>)</rp></ruby>してください")
  setFurigana(outputEl, "Loading Kuroshiro Library... (~12.4MB)")
  
  Kuroshiro.buildAndInitWithKuromoji().then((kuroshiro) => {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      kuroshiro.getFurigana(sanitize(inputEl.value)).then((v) => setFurigana(outputEl, v), (r) => console.error(r));
    })
    setFurigana(outputEl, "Welcome! Enter <ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby> to add <ruby>振仮名<rp>(</rp><rt>ふりがな</rt><rp>)</rp></ruby> to in the field below to get Started!")
  }).catch((e) => {
    console.error(e);
    setFurigana(outputEl, "ERROR! Failed to Load Kuroshiro Library. Check Console for Specific Error details...")
  });
}

/**
 * Updates the contents of the {outputEl} to the provided {furigana}
 * @param {*} outputEl 
 * @param {*} furigana 
 */
function setFurigana (outputEl, furigana) {
  outputEl.innerHTML = `${furigana}`
}

/**
 * Performs basic sanitization of user input {string} by replacing html reserved characters with HTML entity encoded variants of the same.
 * @param {*} string 
 * @returns sanitized input string
 */
function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}
