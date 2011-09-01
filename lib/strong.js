/*!
 * Strong i18n for express
 * Copyright(c) 2011 Tim Shadel
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var strong = require('./strong-api');

/**
 * Start off by exposing the API directly.
 */

exports = module.exports = strong;

strong.back = require('./strong-back');
