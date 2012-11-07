/*!
 * Strong i18n for express - Pluralization
 * Copyright(c) 2011 Tim Shadel
 * MIT Licensed
 */

/**
 * Simple implementation of a CLDR pluralization rules.
 * 
 * First, it checks if the count is a fraction or an integer, then chooses
 * the rules group accordingly.
 * 
 * See http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 */


/**
 * Module dependencies.
 */

/**
 * Expose `plural`.
 */

var plural = module.exports;

/**
 * Retrieve the plural category for the given locale and count.
 *
 * @param {String} locale
 * @param {Number} count
 * @api public
 */
plural.category = function(locale, count) {
  return categories[locale].category(count);
}


/**
 * Fractional rules. Only 3 groups.
 *
 * @param {Number} count is an absolute value based in [this article](http://english.stackexchange.com/questions/9735/is-1-singular-or-plural).
 * @api private
 */

plural.fraction_$other = function(count) {
  return 'other';
};

plural.fraction_$one_less_than_two = function(count) {
  return count < 2 ? 'one' : 'other';
};

plural.fraction_$one_less_than_$one = function(count) {
  return count < 1 ? 'one' : 'other';
};


/**
 * Integer rules: 1 form
 *
 * @api private
 */

plural.integer_$other = function(count) {
 return 'other';
};

/**
 * Integer rules: 2 forms
 *
 * @api private
 */

// Manx
plural.integer_$one_n_mod_10_in_1_2_or_n_mod_20_is_0_$other = function(count) {
  var mod10 = count % 10;
  var mod20 = count % 20;

  return mod10 == 1 || mod10 == 2 || mod20 == 0 ? 'one' :'other';
};

// Central Morocco Tamazight
plural.integer_$one_n_in_0_1_or_11_99_$other = function(count) {
 return count <= 1 || (11 <= count && count <= 99) ? 'one' : 'other';
};

// Macedonian
plural.integer_$one_n_mod_10_is_1_n_not_11_$other = function(count) {
  return count % 10 == 1 && count != 11 ? 'one' : 'other';
};

// Akan, et al.
plural.integer_$one_0_1_$other = function(count) {
  return count <= 1 ? 'one' : 'other';
};

// English, et al.
plural.integer_$one_1_$other = function(count) {
  return count == 1 ? 'one' : 'other';
};

/**
 * Integer rules: 3 forms
 *
 * @api private
 */

// Latvian
plural.integer_$zero_0_$one_n_mod_10_is_1_n_mod_100_not_11_$other = function(count) {
  if (count == 0) {
    return 'zero';
  } else {
    return (count % 10 == 1) && (count % 100 != 11) ? 'one' : 'other';
  }
};

// Colognian, Langi
plural.integer_$zero_0_$one_1_$other = function(count) {
  if (count == 0) {
    return 'zero';
  } else {
    return count == 1 ? 'one' : 'other';
  }
};

// Cornish, et al.
plural.integer_$one_1_$two_2_$other = function(count) {
  if (count == 2) {
    return 'two';
  } else {
    return count == 1 ? 'one' : 'other';
  }
};

// Belarusian, et al.
// other is only used for fraction
plural.integer_$one_n_mod_10_is_1_n_mod_100_not_11_$few_n_mod_10_in_2_4_n_mod_100_not_in_12_14_$many = function(count) {
  var mod10 = count % 10;
  var mod100 = count % 100;

  if ((2 <= mod10 && mod10 <= 4) && !(12 <= mod100 && mod100 <= 14)) {
    return 'few';
  } else {
    return (mod10 == 1) && (mod100 != 11) ? 'one' : 'many';
  }
};

// Polish
// other is only used for fraction
plural.integer_$one_1_$few_n_mod_10_in_2_4_n_mod_100_not_in_12_14_$many = function(count) {
  var mod10 = count % 10;
  var mod100 = count % 100;

  if ((2 <= mod10 && mod10 <= 4) && !(12 <= mod100 && mod100 <= 14)) {
    return 'few';
  } else {
    return count == 1 ? 'one' : 'many';
  }
};

// Lithuanian
plural.integer_$one_n_mod_10_is_1_n_mod_100_not_in_11_19_$few_n_mod_10_in_2_9_n_mod_100_not_in_11_19_$other = function(count) {
  var mod10 = count % 10;
  var mod100 = count % 100;

  if ((2 <= mod10 && mod10 <= 9) && !(11 <= mod100 && mod100 <= 19)) {
    return 'few';
  } else {
    return (mod10 == 1) && !(11 <= mod100 && mod100 <= 19) ? 'one' : 'other';
  }
};

// Tachelhit
plural.integer_$one_0_1_$few_2_10_$other = function(count) {
  if (2 <= count && count <= 10) {
    return 'few';
  } else {
    return count <= 1 ? 'one' : 'other';
  }
};

// Moldavian, Romanian
plural.integer_$one_1_$few_0_or_n_mod_100_in_1_19_not_1_$other = function(count) {
  var mod100 = count % 100;

  if ( count == 0 || ((11 <= mod100 && mod100 <= 19) && count != 1) ) {
    return 'few';
  } else {
    return count == 1 ? 'one' : 'other';
  }
};

// Czech
plural.integer_$one_1_$few_2_4_$other = function(count) {
  if (2 <= count && count <= 4) {
    return 'few';
  } else {
    return count == 1 ? 'one' : 'other';
  }
};


/**
 * Integer rules: 4 forms
 *
 * @api private
 */

// Slovenian
plural.integer_$one_mod_100_is_1_$two_mod_100_is_2_$few_mod_100_in_3_4_$other = function(count) {
  var mod100 = count % 100;

  if (mod100 == 1) return 'one';
  if (mod100 == 2) return 'two';
  return (3 <= mod100 && mod100 <= 4) ? 'few' : 'other';
};

// Maltese
plural.integer_$one_1_$few_0_or_mod_100_in_2_10_$many_mod_100_in_11_19_$other = function(count) {
  var mod100 = count % 100;

  if (count == 1) return 'one';
  if ((count == 0) || (2 <= mod100 && mod100 <= 10)) return 'few';
  return (11 <= mod100 && mod100 <= 19) ? 'many' : 'other';
};


/**
 * Integer rules: 6 forms
 *
 * @api private
 */

// Arabic
plural.integer_$zero_0_$one_1_$two_2_$few_mod_100_in_3_10_$many_mod_100_in_11_19_$other = function(count) {
  var mod100 = count % 100;

  if (count == 0) return 'zero';
  if (count == 1) return 'one';
  if (count == 2) return 'two';
  if (3 <= mod100 && mod100 <= 10) return 'few';
  return (11 <= mod100 && mod100 <= 99) ? 'many' : 'other';
};

// Breton, et al.
plural.integer_$zero_0_$one_1_$two_2_$few_3_$many_6_$other = function(count) {
  var mod100 = count % 100;

  if (count == 0) return 'zero';
  if (count == 1) return 'one';
  if (count == 2) return 'two';
  if (count == 3) return 'few';
  if (count == 6) return 'many';
  return 'other';
};


/**
 * Setup pluralization categories for various locales.
 */

var categories = {
  'en': {
    'category': plural.integer_$one_1_$other
   }
};



/**
 * Load utility functions into scope.
 */

require('./util');
