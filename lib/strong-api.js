/*!
 * Strong i18n for express - API
 * Copyright(c) 2011 Tim Shadel
 * MIT Licensed
 */

 /* 
    You use keys to access translations.
    Keys are prefixed by their view's path (dot-separated).
    Globally available keys have no view path.
    Each language has a tree of view paths with their own key, value pairs at the leaves.
 */

/**
 * Module dependencies.
 */

/**
 * Expose `StrongAPI`.
 */

var api = module.exports;

var plural = require('./strong-pluralization');

var exists = function(obj) {
  return ("undefined" !== typeof obj && obj !== null);
};

var TranslationNotFoundError = function (key, attempted) {
  return new Error("TranslationNotFound: Could not find key '" + key + "'.  Attempted: '" + attempted.map(function(e){ return e.join('.') }).join("', '") + "'");
}

/**
 * Initialize the api using the provided backend implementation.
 *
 * @api private
 */

api.init = function() {
  var self = this;

  // The default locale has a default value of 'en'.
  this._default_locale = 'en';

  // Create a virtual property for `default_locale` which allows
  // the value to be conveniently set and retrieved.
  this.__defineGetter__('default_locale', function() {
    return self._default_locale;
  });
  this.__defineSetter__('default_locale', function(new_default_locale) {
    self._default_locale = new_default_locale;
  });

  // Create a virtual property for `locale` which will return the most
  // recent value of `default_locale` until `locale` is specifically set.
  this._locale = undefined;
  this.__defineGetter__('locale', function() {
    return (typeof self._locale === "undefined" || self._locale === null) ? self._default_locale : self._locale;
  });
  this.__defineSetter__('locale', function(new_locale) {
    self._locale = new_locale;
  });

  if (this.hasOwnProperty('back')) {
    self.back.init();
  }
};

api.lookup = function(locale, path, key) {
  var context = exists(path) ? path.slice(0) : [];
  context.unshift(locale);
  context.push(key);

  var attempts = [];
  var template = undefined;
  while (context.length > 1 && !exists(template)) {
    template = this.back.navigate(context.join('.'));
    attempts.push( context.slice(0) );
    context.splice(1, 1);
  }

  if (!exists(template)) {
    throw TranslationNotFoundError(key, attempts);
  }
  
  return template;  
};

/**
 * Retrieve the string associated with the given key in the effective locale.
 *
 * @param {String} key
 * @param {Object} options
 * @return {String} value for that key in the appropriate locale
 * @api public
 */

api.translate = function(key, options) {
  // Provide an empty options object if none was given.
  if (options == null) options = {};

  var locale = this.effective_locale(options);
  var template = this.lookup(locale, options.view_path, key);
  if (typeof template === 'object' && typeof options["count"] === 'number') {
    var category = plural.category(locale, options.count);
    template = template[category];
  }
  return template.supplant(options);
};


/**
 * Determine the effective locale for this request.
 * The locale can be specified either globally by setting `api.default_locale`, by
 * setting `api.locale`, or by setting the `locale` property on the 
 * `options` object passed into this method.
 *
 * @param {Object} options
 * @api private
 */

api.effective_locale = function(options) {
  var locale = undefined;
  
  // Use the locale from the provided options (if a valid object) as our first choice.
  if ( exists(options) ) locale = options["locale"];

  // If that didn't work, then ask for the current locale and trust that 
  // we'll get back either the explicitly defined locale or the default_locale.
  if ( !exists(locale) ) locale = this.locale;
  
  return locale;
};


/**
 * Wrap the given Express template engine so we can later automatically extract
 * the view path from the file's location relative to the view root.
 *
 * @param {Object} Express template engine
 * @api public
 */

api.decorator = function(engine, appname) {
  var self = this;
  return {
    compile: function (template, options) {
      var template = engine.compile(template, options);
  
      // TODO: this is bad for 1) appname and 2) hacky effective_root thing in another place for a workaround...
      var effective_root = exists(options.actual_root) ? options.actual_root : options.root;
      var extractPathExpression = new RegExp("^" + effective_root + "\/(.*)\\.[^\\.]*$");
      var view_path = options.filename.replace(extractPathExpression, '$1').replace(/\/\//,'\/').split('/');
      if (exists(appname)) {
        view_path.unshift(appname);
      }
      // Define the function once per view_path, then use in all later invocations
      var translation_helper = function(key, options) {
        if ( !exists(options) ) options = {};
        options.view_path = view_path;
        return self.translate.apply(self, [key, options]);
      };
  
      return function(data) {
        data.t = translation_helper;
        return template(data);
      }
    }
  };
};
    
/**
* Load utility functions into scope.
*/
require('./util');
