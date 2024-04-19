import { getFurigana, initKuroshiro, default as Kuroshiro } from "../src/kuroshiro/index.js";
import { default as KuroshiroAnalyzerKuromoji } from "../src/kuroshiro-analyzer-kuromoji/analyzer.js";
import { default as Kuromoji } from "../src/kuromoji/kuromoji.js";
import DictionaryLoader from "../src/kuromoji/loader/DictionaryLoader.js";

// DictionaryLoader.setURLsToModule();

export { getFurigana, initKuroshiro, Kuroshiro, KuroshiroAnalyzerKuromoji, Kuromoji, DictionaryLoader};
