import async from "async";
import DynamicDictionaries from "../dict/DynamicDictionaries.js";
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
    constructor(dic_path) {
        this.dic = new DynamicDictionaries();
        this.dic_path = dic_path;
    }
    loadArrayBuffer(file, callback) {
        throw new Error("DictionaryLoader#loadArrayBuffer should be overwrite");
    }
    /**
     * Load dictionary files
     * @param {DictionaryLoader~onLoad} load_callback Callback function called after loaded
     */
    load(load_callback) {
        var dic = this.dic;
        var dic_path = this.dic_path;
        var loadArrayBuffer = this.loadArrayBuffer;
        var dic_path_url = function (filename) {
            var separator = '/';
            var replace = new RegExp(separator + '{1,}', 'g');
            var path = [dic_path, filename].join(separator).replace(replace, separator);
            return path;
        };
        async.parallel([
            // Trie
            function (callback) {
                async.map(["base.dat", "check.dat"], function (filename, _callback) {
                    loadArrayBuffer(dic_path_url(filename), function (err, buffer) {
                        if (err) {
                            return _callback(err);
                        }
                        _callback(null, buffer);
                    });
                }, function (err, buffers) {
                    if (err) {
                        return callback(err);
                    }
                    var base_buffer = new Int32Array(buffers[0]);
                    var check_buffer = new Int32Array(buffers[1]);
                    dic.loadTrie(base_buffer, check_buffer);
                    callback(null);
                });
            },
            // Token info dictionaries
            function (callback) {
                async.map(["tid.dat", "tid_pos.dat", "tid_map.dat"], function (filename, _callback) {
                    loadArrayBuffer(dic_path_url(filename), function (err, buffer) {
                        if (err) {
                            return _callback(err);
                        }
                        _callback(null, buffer);
                    });
                }, function (err, buffers) {
                    if (err) {
                        return callback(err);
                    }
                    var token_info_buffer = new Uint8Array(buffers[0]);
                    var pos_buffer = new Uint8Array(buffers[1]);
                    var target_map_buffer = new Uint8Array(buffers[2]);
                    dic.loadTokenInfoDictionaries(token_info_buffer, pos_buffer, target_map_buffer);
                    callback(null);
                });
            },
            // Connection cost matrix
            function (callback) {
                loadArrayBuffer(dic_path_url("cc.dat"), function (err, buffer) {
                    if (err) {
                        return callback(err);
                    }
                    var cc_buffer = new Int16Array(buffer);
                    dic.loadConnectionCosts(cc_buffer);
                    callback(null);
                });
            },
            // Unknown dictionaries
            function (callback) {
                async.map(["unk.dat", "unk_pos.dat", "unk_map.dat", "unk_char.dat", "unk_compat.dat", "unk_invoke.dat"], function (filename, _callback) {
                    loadArrayBuffer(dic_path_url(filename), function (err, buffer) {
                        if (err) {
                            return _callback(err);
                        }
                        _callback(null, buffer);
                    });
                }, function (err, buffers) {
                    if (err) {
                        return callback(err);
                    }
                    var unk_buffer = new Uint8Array(buffers[0]);
                    var unk_pos_buffer = new Uint8Array(buffers[1]);
                    var unk_map_buffer = new Uint8Array(buffers[2]);
                    var cat_map_buffer = new Uint8Array(buffers[3]);
                    var compat_cat_map_buffer = new Uint32Array(buffers[4]);
                    var invoke_def_buffer = new Uint8Array(buffers[5]);
                    dic.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
                    // dic.loadUnknownDictionaries(char_buffer, unk_buffer);
                    callback(null);
                });
            }
        ], function (err) {
            load_callback(err, dic);
        });
    }
}
export default DictionaryLoader;
