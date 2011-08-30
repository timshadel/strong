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
var glob = require('glob');


/**
 * Expose `back`.
 */

back = exports = module.exports;

/**
 * API proto.
 */

var _translations = {}
  , translations_dir = './locales';


back.get = function(path) {
  return path.split('.').reduce(access, _translations);
}

/**
 * @api private
 */

back.getDir = function(path) {
  return path.split('.').reduce(mkdir_p, _translations);
}

/**
 * @api private
 */

back.put = function(path, value) {
  var keypath = path.split('.');
  var key = keypath.pop();
  var dir = keypath.reduce(mkdir_p, _translations);
  dir[key] = value;
  return value;
}

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
    } else {
      console.log("All translations loaded: " + JSON.stringify(self._translations));
    }
  });
};

back.load = function(callback) {
  pattern = '' + this.translations_dir + '/**/*.json';
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

function merge(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

function access(obj,i) {
  return obj[i]
}

function mkdir_p(obj,i) {
  var result = obj[i];
  if (typeof result === "undefined" || result === null) obj[i] = {};
  return obj[i]
}

function toDotPath(filename) {
  var keyPath = filename.split('').splice(this.translations_dir.length+1).join('').split('/').reverse().map(function(e) { return e.split('.')[0] }).reverse();
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

  var dotPath = toDotPath(filename);
  var mountPoint = this.getDir(dotPath);
  var json = JSON.parse(contents);
  merge(mountPoint, json);
};
