import Kuroshiro from "./core";

import KuromojiAnalyzer from "../kuroshiro-analyzer-kuromoji/analyzer";

export function getFurigana(kuroshiro, text, debug={...console, success:console.log}) {
  return new Promise((resolve, reject) => {
    kuroshiro.convert(text, { to: "hiragana", mode: "furigana"}).then((result) => {
      debug.debug(result);
      resolve(result);
    }).catch((e) => {
      debug.error(`failed to get furigana: ${e}`);
      reject(e);
    })
  })
}

export function initKuroshiro() {
  const kuroshiro = new Kuroshiro();
  return new Promise((resolve, reject) => {
    kuroshiro.init(new KuromojiAnalyzer()).then(() => {
      resolve(kuroshiro);
    }).catch((e) => {
      console.error(e);
      reject(e);
    })
  })
}

export default getFurigana;