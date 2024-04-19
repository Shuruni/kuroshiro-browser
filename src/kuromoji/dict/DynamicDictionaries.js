import doublearray from "doublearray";
import TokenInfoDictionary from "./TokenInfoDictionary.js";
import ConnectionCosts from "./ConnectionCosts.js";
import UnknownDictionary from "./UnknownDictionary.js";
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
 * Dictionaries container for Tokenizer
 * @param {DoubleArray} trie
 * @param {TokenInfoDictionary} token_info_dictionary
 * @param {ConnectionCosts} connection_costs
 * @param {UnknownDictionary} unknown_dictionary
 * @constructor
 */
class DynamicDictionaries {
    constructor(trie, token_info_dictionary, connection_costs, unknown_dictionary) {
        if (trie != null) {
            this.trie = trie;
        }
        else {
            this.trie = doublearray.builder(0).build([
                { k: "", v: 1 }
            ]);
        }
        if (token_info_dictionary != null) {
            this.token_info_dictionary = token_info_dictionary;
        }
        else {
            this.token_info_dictionary = new TokenInfoDictionary();
        }
        if (connection_costs != null) {
            this.connection_costs = connection_costs;
        }
        else {
            // backward_size * backward_size
            this.connection_costs = new ConnectionCosts(0, 0);
        }
        if (unknown_dictionary != null) {
            this.unknown_dictionary = unknown_dictionary;
        }
        else {
            this.unknown_dictionary = new UnknownDictionary();
        }
    }
    // from base.dat & check.dat
    loadTrie(base_buffer, check_buffer) {
        this.trie = doublearray.load(new Int32Array(base_buffer), new Int32Array(check_buffer));
        console.debug(`Successfully Loaded Kuromoji Trie Dict Files! \nDe-compressed Size of Loaded Dicts: 
            base: ~${(base_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            check: ~${(check_buffer.byteLength / 1024 / 1024).toFixed(1)} MB`);
        return this;
    }
    loadTokenInfoDictionaries(token_info_buffer, pos_buffer, target_map_buffer) {
        this.token_info_dictionary.loadDictionary(new Uint8Array(token_info_buffer));
        this.token_info_dictionary.loadPosVector(new Uint8Array(pos_buffer));
        this.token_info_dictionary.loadTargetMap(new Uint8Array(target_map_buffer));
        console.debug(`Successfully Loaded Kuromoji Token Info Dict Files! \nDe-compressed Size of Loaded Dict Files: 
            token_info: ~${(token_info_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            pos: ~${(pos_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            target_map: ~${(target_map_buffer.byteLength / 1024 / 1024).toFixed(1)} MB`);
        return this;
    }
    loadConnectionCosts(cc_buffer) {
        this.connection_costs.loadConnectionCosts(new Int16Array(cc_buffer));
        console.debug(`Successfully Loaded Kuromoji Connection Cost Dict Files! \nDe-compressed Size of Loaded Dict Files: 
            cc: ~${(cc_buffer.byteLength / 1024 / 1024).toFixed(1)} MB`);
        return this;
    }
    loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer) {
        this.unknown_dictionary.loadUnknownDictionaries(new Uint8Array(unk_buffer), new Uint8Array(unk_pos_buffer), new Uint8Array(unk_map_buffer), new Uint8Array(cat_map_buffer), new Uint32Array(compat_cat_map_buffer), new Uint8Array(invoke_def_buffer));
        console.debug(`Successfully Loaded Kuromoji Unknown Dict Files! \nDe-compressed Size of Loaded Dict Files: 
            unk: ~${(unk_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            unk_pos: ~${(unk_pos_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            unk_map: ~${(unk_map_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            cat_map: ~${(cat_map_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            compat_cat_map: ~${(compat_cat_map_buffer.byteLength / 1024 / 1024).toFixed(1)} MB
            invoke_def: ~${(invoke_def_buffer.byteLength / 1024 / 1024).toFixed(1)} MB`);
        return this;
    }
}
export default DynamicDictionaries;
