'use strict';

const undef = require('ifnotundef');

/**
 *
 * [![GitHub version](https://badge.fury.io/gh/pouc%2Farr-equal.svg)](https://badge.fury.io/gh/pouc%2Farr-equal)
 * [![npm version](https://badge.fury.io/js/arr-equal.svg)](https://badge.fury.io/js/arr-equal)
 * [![NPM monthly downloads](https://img.shields.io/npm/dm/arr-equal.svg?style=flat)](https://npmjs.org/package/arr-equal)
 * [![Build Status](https://travis-ci.org/pouc/arr-equal.svg?branch=master)](https://travis-ci.org/pouc/arr-equal)
 * [![Dependency Status](https://gemnasium.com/badges/github.com/pouc/arr-equal.svg)](https://gemnasium.com/github.com/pouc/arr-equal)
 * [![Coverage Status](https://coveralls.io/repos/github/pouc/arr-equal/badge.svg?branch=master)](https://coveralls.io/github/pouc/arr-equal?branch=master)
 * [![Known Vulnerabilities](https://snyk.io/test/github/pouc/arr-equal/badge.svg)](https://snyk.io/test/github/pouc/arr-equal)
 *
 * Check if two arrays are equal with options (deep? shallow? ...)
 *
 * Deep comparison compares arrays recursively.
 * Other type of objects (objets, buffers, ...) are still compared with strict equality (===).
 *
 * @module arr-equal
 * @typicalname equal
 * @author Lo&iuml;c Formont
 *
 * @license MIT Licensed
 *
 * @example
 * ```javascript
 * var equal = require("arr-equal");
 *
 * equal([1, 2, 3], [1, 2, 3]) ==> true
 *
 * equal([1, 2, 3], [1, 3, 2]) ==> false
 * equal([1, 2, 3], [1, 3, 2], {order: false}) ==> true
 *
 * equal([1, [2, 3]], [1, [2, 3]]) ==> false
 * equal([1, [2, 3]], [1, [2, 3]], {deep: true}) ==> true
 * ```
 */
module.exports = function(arr1, arr2, options) {

    const order = undef.child(options, 'order', true);
    const deep = undef.child(options, 'deep', false);

    if (!Array.isArray(arr1)) return false;
    if (!Array.isArray(arr2)) return false;

    if (arr1 === arr2) return true;

    if (arr1.length != arr2.length) return false;

    // If the order matters
    if (order) {
        for (var i = 0; i < arr1.length; i++) {
            if (!deep && arr1[i] !== arr2[i]) {
                return false;
            } else if (deep) {
                if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
                    if (!module.exports(arr1[i], arr2[i], options)) {
                        return false;
                    }
                } else if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
        }
        return true;

    // If the order doesn't matter
    } else if (!order) {

        var foundMap = {};
        for (var i = 0; i < arr1.length; i++) {
            var found = false;
            for (var j = 0; j < arr2.length; j++) {

                if (undef.check(foundMap[j])) {
                    continue;
                }

                if (!deep && arr1[i] === arr2[j]) {
                    foundMap[j] = arr2[j];
                    found = true;
                    break;
                } else if (deep) {
                    if (Array.isArray(arr1[i]) && Array.isArray(arr2[j])) {
                        if (module.exports(arr1[i], arr2[j], options)) {
                            foundMap[j] = arr2[j];
                            found = true;
                            break;
                        }
                    } else if (arr1[i] === arr2[j]) {
                        foundMap[j] = arr2[j];
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                return false;
            }
        }
        return true;

    }

    // Should not happen
    return false;

};
