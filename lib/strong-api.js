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
  return this.back.get(locale + '.' + key);
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
