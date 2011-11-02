/*!
 * Strong i18n for express - Simple Backend
 * Copyright(c) 2011 Tim Shadel
 * MIT Licensed
 */

/* 
  Simple implementation of a translation backend provider.
  Conforms to the basic strong provider API contract.
*/


/**
 * Module dependencies.
 */
var glob = require('glob')
  , _ = require('underscore')
  , fs = require('fs');

/**
 * Expose `back`.
 */

back = exports = module.exports;


/**
 * API proto.
 */

back._translations = {};
back.translations_dir = './locales';

back.navigate = function (path) {
  try {
    var path_as_array = (path instanceof Array) ? path : path.split('.');
    return path_as_array.reduce(function(obj,i){ return obj[i] }, this._translations);
  } catch (e) {
    return undefined;
  }
};

back.putAtPath = function (path, value) {
  var keypath = path.split('.');
  var key = keypath.pop();

  var self = back;
  var putPoint = keypath.reduce(
    function(obj,i) {
        var result = obj[i];
        if (typeof result === "undefined" || result === null) obj[i] = {};
        return obj[i]
      }
    , self._translations);

  putPoint[key] = value;
};

function merge(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

back.mergeAtPath = function (path, object) {
  self = back;
  var mergePoint = path.split('.').reduce(
    function(obj,i) {
        var result = obj[i];
        if (typeof result === "undefined" || result === null) obj[i] = {};
        return obj[i]
      }
    , self._translations);

  merge(mergePoint, object);
};


/**
 * Initialize the api using the provided backend implementation.
 *
 * @api private
 */

back.init = function(options, on_done) {
  var self = this;

  // Initialize our backing store with no translations.
  this._translations = {};
  if (typeof options !== "undefined" && options !== null)
    if (typeof options["translations_dir"] !== "undefined" && options["translations_dir"] !== null)
      this.translations_dir = options["translations_dir"];

  // Load find the list of translation files available
  this.load(function(err) {
    if (err) {
      console.log("Problem loading translations: " + err);
    }
  });
};

back.load = function(callback) {
  pattern = '' + this.translations_dir + '/**/*.json';
  self = back;
  glob.glob(pattern, function(err, matches) {
    if (err) {
      callback(err);
    } else {
      // Load the file into the _translations hash
      for(var i = 0; i < matches.length; i++) {
        // TODO: load files asynchronously
        self.loadTranslationFile(matches[i]);
      }      
      callback(null);
    }
  });
};


back.toDotPath = function(filename) {
  var keyPath = _.flatten(filename.split('').splice(this.translations_dir.length+1).join('').split('/').reverse().map(function(e) { return e.split('.')[0].split('_').reverse() })).reverse();
  keyPath.unshift(keyPath.pop());
  return keyPath.join('.');
}

/**
 * Load the contents of the given file and mount them into the
 * appropriate spot in the `_translations` hash.
 *
 * @api private
 */

back.loadTranslationFile = function(filename) {
  var contents;
  try {
    contents = fs.readFileSync(filename);
  } catch(e) {
    console.log('Error reading \'' + filename + '\': ' + e);
    return;
  }

  var dotPath = this.toDotPath(filename);
  var json = JSON.parse(contents);
  this.mergeAtPath(dotPath, json);
};

/**
 * Load utility functions into scope.
 */
require('./util');
