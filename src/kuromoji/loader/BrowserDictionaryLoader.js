import DictionaryLoader from "./DictionaryLoader.js";

/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
/**
 * BrowserDictionaryLoader inherits DictionaryLoader, using jQuery XHR for download
 * @param {string} dic_path Dictionary path
 * @constructor
 */
class BrowserDictionaryLoader extends DictionaryLoader {
    constructor(dic_path) {
        super(dic_path)
    }
    /**
     * Utility function to load gzipped dictionary
     * @param {string} url Dictionary URL
     * @param {BrowserDictionaryLoader~onLoad} callback Callback function
     */
    loadArrayBuffer(url, callback) {
        fetch(url).then((response) => {
            if (!response.ok) {
                callback(response.statusText, null);
            }
            response.arrayBuffer().then((arraybuffer) => {
                console.debug(`Successfully Loaded Kuromoji Dict: ${url}; \n De-compressed Size of Loaded Dict: ~${(arraybuffer.byteLength / 1024 / 1024).toFixed(1)} MB;`);
                callback(null, arraybuffer);
            });
        }).catch((fetch_e) => {
            callback(fetch_e, null);
        });
    }
}

export default BrowserDictionaryLoader;

// function fetchAndDecompress(url) {
//   return new Promise((resolve, reject) => {
//     fetch(url).then((rsp) => {
//       if (!rsp.ok) {
//         reject(rsp.statusText);
//       }
//       decompressFileInResponse(rsp).then((gz) => resolve(gz)).catch((e) => reject(e));
//     }).catch((e) => {
//       reject(e);
//     });
//   })
// }

// function decompressFileInResponse(response) {
//   return new Promise((resolve, reject) => {
//     response.arrayBuffer().then((ab) => {
//       console.debug(`FILE: console.debug(url); RESPONSE MESSAGE:`);
//       console.debug(response);
//       console.log(ab);
//       resolve(ab);
//       // decompressBuffer(ab).then((gz) => resolve(gz)).catch((e) => reject(e));
//     }).catch((e) => {
//       reject(e);
//     });
//   })
// }

// function decompressBuffer(arrayBuffer) {
//   return new Promise((resolve, reject) => {
//     gunzipSync(arrayBuffer).then((gz) => {
//         resolve(gz);
//     }).catch((e) => {
//         reject(e);
//     });
//   })
// }