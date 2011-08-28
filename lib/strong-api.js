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

exports = module.exports = StrongAPI;

/**
 * API proto.
 */

var api = StrongAPI.prototype;

/**
 * Initialize a new `StrongAPI` with an optional `backend`.
 *
 * @param {Object} obj
 * @return {StrongAPI}
 * @api public
 */

function StrongAPI(backend){
  this.init(backend);
};

/**
 * Initialize the api using the provided backend implementation.
 *
 * @param {Object} backend
 * @api private
 */

api.init = function(backend){
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

};

/**
 * Retrieve the string associated with the given key in the appropriate locale.
 * The locale can be specified either globally by setting `api.locale`, by
 * setting `api.default_locale`, or by setting the `locale` property on the 
 * `options` object passed into this method.
 *
 * @param {String} key
 * @param {Object} options
 * @return {String} value for that key in the appropriate locale
 * @api public
 */

api.translate = function(key, options) {
  // Provide an empty options object if none was given.
  if (options == null) options = {};

  var locale = options["locale"];
  if (typeof locale === "undefined" || locale === null) locale = this.locale;

  return "I am a translated string for locale: " + locale;
};
