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
  , _ = require('underscore');

/**
 * Expose `back`.
 */

var back = module.exports;

var exists = function(obj) {
  return ("undefined" !== typeof obj && obj !== null);
};


/**
 * API proto.
 */

back._translations = {};
back.translations_load_path = ['./locales'];

back.navigate = function (path) {
  try {
    return path.split('.').reduce(function(obj,i){ return obj[i] }, back._translations);
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
  var self = back;
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
  if (typeof options !== "undefined" && options !== null) {
    if (typeof options["translations_dir"] !== "undefined" && options["translations_dir"] !== null) {
      this.translations_load_path.push( options["translations_dir"] );
    } else if (typeof options["translations_load_path"] !== "undefined" && options["translations_load_path"] !== null) {
      this.translations_load_path = options["translations_load_path"];
    }
  }

  // Load find the list of translation files available
  this.load(function(err) {
    if (err) {
      console.log("Problem loading translations: " + err);
    }
  });
};

back.load = function(callback) {
  this.eachLoadPath(function(path, namespace) {

    var pattern = '' + path + '/**/*.json';
    var self = back;
    
    glob(pattern, function(err, matches) {
      if (err) {
        callback(err);
      } else {
        // Load the file into the _translations hash
        for(var i = 0; i < matches.length; i++) {
          // TODO: load files asynchronously
          self.loadTranslationFile(matches[i], path, namespace);
        }      
        callback(null);
      }
    });

  });
}

back.eachLoadPath = function(callback) {
  for (var i = 0; i < this.translations_load_path.length; i++) {
    var path_item = this.translations_load_path[i];
    if ('string' === typeof path_item) {
      callback(path_item, null);
    } else {
      for (var namespace in path_item) {
        callback(path_item[namespace], namespace);
      }
    }
  }
};


back.toDotPath = function(filename, prefix, namespace) {
  var extractor = new RegExp("^" + prefix + "\/(.+)_([^_]+)\\.json$");
  var match = filename.match(extractor);
  if (match) {
    var replacement = '$2/$1';
    if (exists(namespace)) {
      replacement = '$2/' + namespace + '/$1';
    }
    return filename.replace(extractor, replacement).replace(/\//g,'.');
  }

  return filename;
}

/**
 * Load the contents of the given file and mount them into the
 * appropriate spot in the `_translations` hash.
 *
 * @api private
 */

back.loadTranslationFile = function(filename, prefix, namespace) {
  var contents;
  try {
    contents = require(filename);
  } catch(e) {
    console.log('Error reading \'' + filename + '\': ' + e);
    return;
  }

  var dotPath = this.toDotPath(filename, prefix, namespace);
  var json = JSON.parse(contents);
  this.mergeAtPath(dotPath, json);
};

/**
 * Load utility functions into scope.
 */
require('./util');
