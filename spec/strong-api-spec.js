describe('strong-api', function(){
  var StrongAPI = require('../lib/strong-api');
  var api;
  
  beforeEach(function () {
    api = new StrongAPI();
  });

  it('should translate in the default default locale', function() {
    expect(api.translate('everything')).toEqual('I am a translated string for locale: en');
  });

  it('should translate in the recently set default locale', function() {
    api.default_locale = 'de';
    expect(api.translate('everything')).toEqual('I am a translated string for locale: de');
  });

  it('should translate in the current locale', function() {
    api.default_locale = 'de';
    api.locale = 'en';
    expect(api.translate('everything')).toEqual('I am a translated string for locale: en');
  });

  it('should translate in the option-specified locale', function() {
    api.default_locale = 'de';
    api.locale = 'en';
    expect(api.translate('everything', { locale: 'es' })).toEqual('I am a translated string for locale: es');
  });

  // Interpolation
  it('should use named arguments as substitutions', function() {
    // Setup the test case, assuming you have this string
    var fake_back = { 'en': { '.hello': 'Hello, %(name)' } };

    // Make sure you can toss variables at it
    var user = {'name': 'Johnny'};
    var result = api.translate( '.hello', user );
    expect(result).toEqual( 'Hello, Johnny' );
  });

});