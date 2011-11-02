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

api = exports = module.exports;

var plural = require('./strong-pluralization');

function TranslationNotFoundError() {
  this.msg = arguments[0];
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
  var context = this._context.split('.');
  var effective_key = [locale, context.join('.'), key].join('.');
  var template = this.back.navigate(effective_key);
  console.log("Attempting", effective_key);
  while (context.length > 0 && (typeof template === "undefined" || template === null)) {
    context = context.splice(1);
    effective_key = [locale, context.join('.'), key].join('.');
    template = this.back.navigate(effective_key);
    console.log("Attempting", effective_key);
  }
  console.log("TODO: Fixup key attempts...", effective_key);
  if (typeof template === 'object' && typeof options["count"] === 'number') {
    var category = plural.category(locale, options.count);
    template = template[category];
  }
  if (typeof template === "undefined" || template === null) {
    throw new Error("TranslationNotFound: Could not find key '" + effective_key + "'.");
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
  if (typeof options !== "undefined" && options !== null) locale = options["locale"];

  // If that didn't work, then ask for the current locale and trust that 
  // we'll get back either the explicitly defined locale or the default_locale.
  if (typeof locale === "undefined" || locale === null) locale = this.locale;
  
  return locale;
};


/**
 * Wrap the given Express template engine so we can later automatically extract
 * the view path from the file's location relative to the view root.
 *
 * @param {Object} Express template engine
 * @api public
 */

api.maker = function(engine, extra_path) {
  this._engine = engine;
  this._extra_path = extra_path;
  return this;
};


/**
 * Determine the context for this template rendering.
 * The context is based entirely on the filename & path from the app's view root.
 *
 * @param {Object} template
 * @param {Object} data
 * @api public
 */

api.compile = function (template, data) {
  var common_path_length = data.root.length + 1;
  if (this._extra_path !== null && 'undefined' !== typeof this._extra_path) {
    common_path_length += this._extra_path.length;
  }
  var without_common_path = data.filename.split('').splice(common_path_length).join('');
  var view_path = without_common_path.split('.').reverse().splice(1).reverse().join('.');
  this._context = view_path.split('/').join('.');
  return this._engine.compile(template, data);
};
    
/**
* Load utility functions into scope.
*/
require('./util');
