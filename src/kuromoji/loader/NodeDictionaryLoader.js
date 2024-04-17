import fs from "fs";
import node_zlib from "zlib";
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
 * NodeDictionaryLoader inherits DictionaryLoader
 * @param {string} dic_path Dictionary path
 * @constructor
 */
class NodeDictionaryLoader extends DictionaryLoader {
    constructor(dic_path) {
        super(dic_path);
    }
    /**
     * Utility function
     * @param {string} file Dictionary file path
     * @param {NodeDictionaryLoader~onLoad} callback Callback function
     */
    loadArrayBuffer(file, callback) {
        fs.readFile(file, function (err, buffer) {
            if (err) {
                return callback(err);
            }
            node_zlib.gunzip(buffer, function (err2, decompressed) {
                if (err2) {
                    return callback(err2);
                }
                var typed_array = new Uint8Array(decompressed);
                new Uint8Array(0);
                callback(null, typed_array.buffer);
            });
        });
    }
}
export default NodeDictionaryLoader;
