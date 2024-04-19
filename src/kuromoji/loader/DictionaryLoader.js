// import async from "async";
import DynamicDictionaries from "../dict/DynamicDictionaries.js";

// import baseDatURL from '/dict/base.dat.br?url';

const CUR_DIR_NAME = import.meta.url.split('/').at(-2)
const IS_MODULE = CUR_DIR_NAME != 'loader'
const IS_PROD = import.meta.env.MODE == 'production'
console.info(`Kuromoji is being loaded as a ${IS_MODULE?"Package/Library.":"Standalone Application.\nDictionary File paths will be adjusted once built and Loaded as a Package/Library"}`)

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
 * DictionaryLoader base constructor
 * @param {string} dic_path Dictionary path
 * @constructor
 */
class DictionaryLoader {
    constructor() {
        this.dic = new DynamicDictionaries();
    }
    static getActualDictlUrl(baseUrl, isProd) {
        let trueUrl = IS_MODULE ? isProd?`.${baseUrl}`:`./node_modules/kuroshiro-browser/dist${baseUrl}` : `../../..${baseUrl}`;
        // console.debug(import.meta.env.MODE)
        // console.debug(trueUrl);
        return trueUrl
    }
    static dictURLs = null
    static getDictUrls() { return DictionaryLoader.dictURLs }
    static generateDictUrls(isProd) {
        DictionaryLoader.dictURLs = {
            trie: {
                base_buffer: DictionaryLoader.getActualDictlUrl("/dict/base.dat.br", isProd),
                check_buffer: DictionaryLoader.getActualDictlUrl("/dict/check.dat.br", isProd)
            },
            tokenInfo: {
                token_info_buffer: DictionaryLoader.getActualDictlUrl("/dict/tid.dat.br", isProd), 
                pos_buffer: DictionaryLoader.getActualDictlUrl("/dict/tid_pos.dat.br", isProd), 
                target_map_buffer: DictionaryLoader.getActualDictlUrl("/dict/tid_map.dat.br", isProd)
            },
            connectionCost: {
                cc_buffer: DictionaryLoader.getActualDictlUrl("/dict/cc.dat.br", isProd)
            },
            unknown: {
                unk_buffer: DictionaryLoader.getActualDictlUrl("/dict/unk.dat.br", isProd), 
                unk_pos_buffer: DictionaryLoader.getActualDictlUrl("/dict/unk_pos.dat.br", isProd), 
                unk_map_buffer: DictionaryLoader.getActualDictlUrl("/dict/unk_map.dat.br", isProd), 
                cat_map_buffer: DictionaryLoader.getActualDictlUrl("/dict/unk_char.dat.br", isProd), 
                compat_cat_map_buffer: DictionaryLoader.getActualDictlUrl("/dict/unk_compat.dat.br", isProd), 
                invoke_def_buffer: DictionaryLoader.getActualDictlUrl("/dict/unk_invoke.dat.br", isProd)
            }
          }
    }
    static loadArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                // console.info(`URL: ${url}`)
                if (!response.ok || response.headers.get("Content-Type") == 'text/html') reject(response.statusText);
                else {
                    // console.debug(`Loaded ${url}`);
                    // console.debug(response);
                    response.arrayBuffer().then((arraybuffer) => resolve(arraybuffer)).catch((e) => console.warn(e));
                }
            }).catch((e) => {
                console.warn(e)
                reject(e);
            });
        });
    }
    static loadDictCategoryBuffers(dictCategory) {
        const entries = Object.entries(dictCategory);
        const promises = entries.map(([k, dictInfo]) => DictionaryLoader.loadArrayBuffer(dictInfo))
        return Promise.all(promises)
    }
    static loadAllDictUrls() {
        const entries = Object.entries(DictionaryLoader.dictURLs);
        const promises = entries.map(([k,v]) => DictionaryLoader.loadDictCategoryBuffers(v));
        return Promise.all(promises);
    }

    /**
     * Load dictionary files
     * @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
     */
    load(load_callback) {
        var dic = this.dic;
        // console.debug(DictionaryLoader.dictURLs);
        if (!DictionaryLoader.dictURLs) DictionaryLoader.generateDictUrls(IS_PROD);
        // console.debug(`meta URL in Package: ${import.meta.url}`);
        // console.log(`MODE in Package: ${import.meta.env.MODE}`)
        // console.log(`BASE_URL in Package: ${import.meta.env.BASE_URL}`)

        DictionaryLoader.loadAllDictUrls().then((results) => {
            // console.debug(results);
            let buffers = {
                trie: results[0],
                tokenInfo: results[1],
                connectionCost: results[2],
                unknown: results[3]
            }
            // console.debug(buffers);
            dic.loadTrie(...buffers.trie);
            dic.loadTokenInfoDictionaries(...buffers.tokenInfo);
            dic.loadConnectionCosts(...buffers.connectionCost);
            dic.loadUnknownDictionaries(...buffers.unknown);
            load_callback(null, dic)
        }).catch((e) => {
            console.error("Failed to Load Dicts!")
            load_callback(e, dic)
        })
    }
}
export default DictionaryLoader;
