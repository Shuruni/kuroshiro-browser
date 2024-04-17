import Kuroshiro from "./core";

import KuromojiAnalyzer from "../kuroshiro-analyzer-kuromoji/analyzer"

const kuroshiro = new Kuroshiro();

kuroshiro.init(new KuromojiAnalyzer());

export async function getFurigana(text, debug={...console, success:console.log}) {
  const result = await kuroshiro.convert(text, { to: "hiragana", mode: "furigana"});
  
  debug.debug(result)

  if (!result) {
    debug.error('failed to get furigana')
    return "error_failed_to_get_furigana"
  }
  return result
}
