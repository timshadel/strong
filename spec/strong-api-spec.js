describe('strong', function(){
  var strong = require('../lib/strong');
  
  beforeEach(function () {
    strong.init();
  });

  it('should translate in the default default locale', function() {
    strong.back.put('en.everything', 'I am a translated string for locale: en');
    expect(strong.translate('everything')).toEqual('I am a translated string for locale: en');
  });

  it('should translate in the recently set default locale', function() {
    strong.back.put('de.everything', 'I am a translated string for locale: de');
    strong.default_locale = 'de';
    expect(strong.translate('everything')).toEqual('I am a translated string for locale: de');
  });

  it('should translate in the current locale', function() {
    strong.back.put('en.everything', 'I am a translated string for locale: en');
    strong.default_locale = 'de';
    strong.locale = 'en';
    expect(strong.translate('everything')).toEqual('I am a translated string for locale: en');
  });

  it('should translate in the option-specified locale', function() {
    strong.back.put('es.everything', 'I am a translated string for locale: es');
    strong.default_locale = 'de';
    strong.locale = 'en';
    expect(strong.translate('everything', { locale: 'es' })).toEqual('I am a translated string for locale: es');
  });

  // Interpolation
  // it('should use named arguments as substitutions', function() {
  //   strong.back.put('en.hello', 'Hello, {name}');
  //   // Make sure you can toss variables at it
  //   var user = { name: 'Johnny' };
  //   expect(strong.translate( 'hello', user )).toEqual( 'Hello, Johnny' );
  // });
  // 
  // it('should navigate the object to fill substitution arguments', function() {
  //   strong.back.put('en.hello', 'Hello, {name.first}');
  //   // Make sure you can use dot notation
  //   var user = { name: { first: 'Johnny', last: 'Smith' } };
  //   expect(strong.translate( 'hello', user )).toEqual( 'Hello, Johnny' );
  // });

});
