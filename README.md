# Kuroshiro-Browser

## Foreword

This project was created to serve as a PoC and testing grounds for converting, pruning, updating, and combining the code for the modules in following other repos:

- **Kuroshiro**: <https://github.com/sglkc/kuroshiro-ts>
- **Kuroshiro-Analyzer-Kuromoji**: <https://github.com/sglkc/kuroshiro-analyzer-kuromoji-ts>
- **Kuromoji.js**: <https://github.com/sglkc/kuromoji.js>

## Why not use the existing npm packages as is?

The primary reason for this is that none of the above repos are being actively maintained anymore and as such were woefully out of date as a whole. In the case of [Kuromoji](https://github.com/sglkc/kuromoji.js), while compatible is some regards with the browser due to browserify, it is undoubtedly created with node in mind first with browser support slapped on as an afterthought and was experiencing issues with the dictionary loading and compression libraries. As I result I had to go through each file and update some things for browser support as well as rewrite the DictionaryLoader entirely to fix the loading incompatibility when run in browser. I also went through and changed the compression of the dictionaries over to using Brotli rather than gz for some extra space savings (~96 MB -> ~18MB (gz) -> ~12MB (br)).

When it comes to [Kuroshiro](https://github.com/sglkc/kuroshiro-ts) and [Kuroshiro-Analyzer-Kuromoji](https://github.com/sglkc/kuroshiro-analyzer-kuromoji-ts), the only reason these needed to be extracted out here was due to the internal dependencies on kuromoji (which had to be reworked) and also in order to add some QOL helper functions to help with my use case and fixing the DictUrl Load issue. Ultimately, there was not really all that much to these two once I extracted the source code (no dependencies other than each other and kuromoji, and really the relevant parts of these were only really ~1 or so js file each).

## How do I use this new package in my project?

Since I've combined [Kuroshiro](https://github.com/sglkc/kuroshiro-ts), [Kuroshiro-Analyzer-Kuromoji](https://github.com/sglkc/kuroshiro-analyzer-kuromoji-ts), and [Kuromoji](https://github.com/sglkc/kuromoji.js), it only makes sense that there is no way for the API to be exactly the same (as there are multiple things being exported...). That said it is largely unchanged, so you can still load the same components out of it as needed (though only Kuroshiro is really needed now with the changes):

```javascript
import { Kuroshiro, KuroshiroAnalyzerKuromoji, Kuromoji } from "kuroshiro-browser"
```

There are 2 additional things you **MUST** take into account when adding this package as a dependency:
  
1. You have need a way of determining in code whether you are running in production or not (and make sure to pass that info to the builders!) (See [RE: Breaking Change to API](#re-breaking-change-to-api) )
2. As Part of/after the Build, a script runs that copies the files from `node_modules/kuroshiro-browser/dist/dict` to your build output directory.
    - The most straightforward way of doing this would be to add something like the following to your package.json:

      ```json
      {
        "scripts": {
          "postbuild": "mkdir -p ./dist/dict; cp -r ./node_modules/kuroshiro-browser/dist/dict/* ./dist/dict;"
        }
      }
      ```

      This will only work on POSIX Compatible Systems (so everything except Windows), so isn't really ideal, but if you just need something to test with while you are trying it out, this will work.

    - Alternatively, you can just manually copy the dict directory into your project's public folder and forgo this, though that requires an extra manual step that is prone to forgetfulness.

## Usage Examples

Using Await/Async

```javascript
import { Kuroshiro } from "kuroshiro-browser"
const IS_PROD = (import.meta.env.MODE == 'production')
const textToConvert = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！"

const kuroshiro = await Kuroshiro.buildAndInitWithKuromoji(IS_PROD)
const furigana = await kuroshiro.getFurigana(textToConvert)

console.log(furigana)
// <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
```

Using Promises

```javascript
import { Kuroshiro } from "kuroshiro-browser"
const IS_PROD = (import.meta.env.MODE == 'production')
const textToConvert = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！"

Kuroshiro.buildAndInitWithKuromoji(IS_PROD).then((kuroshiro) => {
  kuroshiro.getFurigana(textToConvert).then((furigana) => {
    console.log(furigana)
    // <ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！
  })
})
```

Also note that most other examples using the original Kuroshiro API will still work: (See [Kuroshiro](https://github.com/sglkc/kuroshiro-ts) for more Examples)

```javascript
// normal
await kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", {mode:"okurigana", to:"hiragana"});
// result：かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！
```

## The API Breakdown

```javascript
Kuroshiro {
  // Existing API
  async init(analyzer, IS_PROD = (import.meta.env.MODE == 'production')) //Modified to set dictUrls based on env
  async convert(str, options)
  Util = {
    isHiragana,
    isKatakana,
    isKana,
    isKanji,
    isJapanese,
    hasHiragana,
    hasKatakana,
    hasKana,
    hasKanji,
    hasJapanese,
    kanaToHiragna,
    kanaToKatakana,
    kanaToRomaji
  };

  // Added
  static buildAndInitWithKuromoji(IS_PROD = (import.meta.env.MODE == 'production')) // Preferred Constructor
  getFurigana(text, debug={...console, success:console.log}) //Shorthand Command with optional debug callback
}

// No API Changes
KuroshiroAnalyzerKuromoji {
  init()
  parse(str = "")
}

// No API Changes
Kuromoji {
  builder()
  dictionaryBuilder()
}
```

### RE: Breaking Change to API

While mostly unchanged, there is 1 major breaking change that requires attention in case you want to use this as a drop in replacement. As you may have noticed, when a library needs to reference static data files that it contains, this is usually done using fs if we were using node. Unfortunately, this is unavailable to us when working in the browser. Instead we can fetch the resource using the path to the file. This is completely fine when the asset is located in a folder like public (such as when testing this library's project standalone), though once we load this as a package, those assets that are packaged with it are no longer located at the importing project's url root, so the dictionaries will suddenly fail to load.

"Well", you might say, "The built package will usually be stored under the `node_modules/<package_name>`, so why not just point to that?". Great Question! and in fact that is in exactly what you have to do in order to fetch the files from the package... while you are in the development environment that is... If you do this the urls will properly resolve to the correct locations while you are developing, though once you perform a build, the node_modules directory with those files is no longer going to be an option available to you (for obivous reasons...).

So what was the solution I came up with? While it is a bit hacky, on the DictionaryLoader in Kuromoji, I created a static field to store all dictUrls and a static method called `DictionaryLoader.generateDictUrls(IS_PROD)` which, given you let it know if you're running in prod or not, will set the urls accordingly. There just so happens to be a nice environment variable that Vite makes available to us called `import.meta.env.MODE` which will let us know if we are running in production or not. The kicker is that this is relative to the module you are checking it in, so if you put this in the library, it will already be resolved to "production" since that was the build for the library.

As such, in order to load the correct Urls for the dictionaries, we MUST inform the library whether we are in prod or dev from the project that is using the library, otherwise we don't get a proper answer and all the dictionary Urls break.

## License

You can find the licenses for each of the pieces of subcode below the relevant source folders. They are as follows:

- [Kuroshiro](src/kuroshiro) - [MIT](src/kuroshiro/LICENSE)
- [Kuroshiro-Analyzer-Kuromoji](src/kuroshiro-analyzer-kuromoji) - [MIT](src/kuroshiro-analyzer-kuromoji/LICENSE)
- [Kuromoji.js](src/kuromoji) - [Apache 2.0](src/kuromoji/LICENSE-2.0.txt)
