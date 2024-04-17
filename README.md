# Kuroshiro-Browser

## Foreword

This project was purely created to serve as a PoC and testing grounds for converting, pruning, updating, and combining the code for the modules in following other repos:

- **Kuroshiro**: <https://github.com/sglkc/kuroshiro-ts>
- **Kuroshiro-Analyzer-Kuromoji**: <https://github.com/sglkc/kuroshiro-analyzer-kuromoji-ts>
- **Kuromoji.js**: <https://github.com/sglkc/kuromoji.js>
  - Uncompressed dicts pulled from <https://github.com/aiktb/kuromoji.js>

i.e. The webapp itself is pretty much the default Vite template for vanilla JS with minor changes.

## Why not use the npm modules as is?

The primary reason for this is that none of the above repos are being actively maintained anymore and as such were woefully out of date as a whole. In the case of kuromoji, while compatible is some regards with the browser due to browserify, it was still utilizing CommonJS instead of ESM in the source and was experiencing issues with the compression libraries, so I had to go through each file and update to ESM and class notation, along with utilizing the uncompressed dat files for the time being to sidestep the compression library issues at the moment.

When it comes to Kuroshiro and Kuroshiro-Analyzer-Kuromoji, the only reason these needed to be extracted out here was due to the internal dependencies on kuromoji (which had to be reworked). Ultimately, there was not really all that much to these two once I extracted the source code (no dependencies other than each other and kuromoji, and really the relevant parts of these were only really 1 js file each...).

## License

You can find the licenses for each of the pieces of subcode below the relevant source folders. They are as follows:

- [Kuroshiro](src/kuroshiro) - [MIT](src/kuroshiro/LICENSE)
- [Kuroshiro-Analyzer-Kuromoji](src/kuroshiro-analyzer-kuromoji) - [MIT](src/kuroshiro-analyzer-kuromoji/LICENSE)
- [Kuromoji.js](src/kuromoji) - [Apache 2.0](src/kuromoji/LICENSE-2.0.txt)
