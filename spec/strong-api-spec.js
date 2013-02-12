var sinon = require('sinon')
  , should = require('should');

describe('strong', function(){
  var strong = require('../lib/strong')
    , res = {};

  beforeEach(function () {
    strong.init();
  });

  it('should translate in the default locale', function() {
    strong.back.putAtPath('en.everything', 'I am a translated string for locale: en');
    strong.translate('everything').should.equal('I am a translated string for locale: en');
  });

  it('should translate in the recently set default locale', function() {
    strong.back.putAtPath('de.everything', 'I am a translated string for locale: de');
    strong.default_locale = 'DE';
    strong.translate('everything').should.equal('I am a translated string for locale: de');
  });

  it('should translate in IETF default locale', function() {
    strong.back.putAtPath('pt.everything', 'I am a translated string for locale: pt');
    strong.back.putAtPath('pt-br.everything', 'I am a translated string for locale: pt-br');
    strong.default_locale = 'pt-BR';
    strong.translate('everything').should.equal('I am a translated string for locale: pt-br');
  });

  it('should translate in the default locale if not found in locale', function() {
    strong.back.putAtPath('de.everything', 'I am a translated string for locale: de');
    strong.default_locale = 'DE';
    strong.locale = [ 'es', 'zh' ];
    strong.translate('everything').should.equal('I am a translated string for locale: de');
  });

  it('should translate in the current locale', function() {
    strong.back.putAtPath('en.everything', 'I am a translated string for locale: en');
    strong.default_locale = 'de';
    strong.locale = 'en';
    strong.translate('everything').should.equal('I am a translated string for locale: en');
  });

  it('should translate in the current IETF locale', function() {
    strong.back.putAtPath('es-mx.everything', 'I am a translated string for locale: es-mx');
    strong.default_locale = 'de';
    strong.locale = 'es-MX';
    strong.translate('everything').should.equal('I am a translated string for locale: es-mx');
  });

  it('should translate in the current IETF locale with fallback', function() {
    strong.back.putAtPath('es-ES.everything', 'I am a translated string for locale: es-ES');
    strong.back.putAtPath('es.everything', 'I am a translated string for locale: es');
    strong.default_locale = 'de';
    strong.locale = 'es-MX';
    strong.translate('everything').should.equal('I am a translated string for locale: es');
  });

  it('should translate in the current locale list', function() {
    strong.back.putAtPath('en.everything', 'I am a translated string for locale: en');
    strong.default_locale = 'de';
    strong.locale = ['es', 'en'];
    strong.translate('everything').should.equal('I am a translated string for locale: en');
  });

  it('should translate in the current locale list', function() {
    strong.back.putAtPath('en.everything', 'I am a translated string for locale: en');
    strong.back.putAtPath('de.everything', 'I am a translated string for locale: de');
    strong.back.putAtPath('es.everything', 'I am a translated string for locale: es');
    strong.default_locale = 'de';
    strong.locale = ['es', 'en'];
    strong.translate('everything').should.equal('I am a translated string for locale: es');
  });

  it('should translate in the current locale list', function() {
    strong.back.putAtPath('en.everything', 'I am a translated string for locale: en');
    strong.default_locale = 'de';
    strong.locale = ['es', 'en'];
    strong.translate('everything').should.equal('I am a translated string for locale: en');
  });

  it('should translate in the option-specified locale', function() {
    strong.back.putAtPath('es.everything', 'I am a translated string for locale: es');
    strong.default_locale = 'de';
    strong.locale = 'en';
    strong.translate('everything', { locale: 'es' }).should.equal('I am a translated string for locale: es');
  });

  it('should translate in the option-specified locale list', function() {
    strong.back.putAtPath('es.everything', 'I am a translated string for locale: es');
    strong.default_locale = 'de';
    strong.locale = 'en';
    strong.translate('everything', { locale: [ 'pt', 'es' ] }).should.equal('I am a translated string for locale: es');
  });

  // Interpolation
  it('should use named arguments as substitutions', function() {
    strong.back.putAtPath('en.hello', 'Hello, %{name}');
    // Make sure you can toss variables at it
    var user = { name: 'Johnny' };
    strong.translate( 'hello', user ).should.equal( 'Hello, Johnny' );
  });
  
  it('should navigate the object to fill substitution arguments', function() {
    strong.back.putAtPath('en.hello', 'Hello, %{name.first}');
    // Make sure you can use dot notation
    var user = { name: { first: 'Johnny', last: 'Smith' } };
    strong.translate( 'hello', user ).should.equal( 'Hello, Johnny' );
  });

  // Pluralization
  it('should select an appropriate pluralization option', function() {
    strong.back.putAtPath('en.message_count', { one: '1 message', other: '%{count} messages' } );
  
    strong.translate( 'message_count', { count: 0 } ).should.equal( '0 messages' );
    strong.translate( 'message_count', { count: 1 } ).should.equal( '1 message' );
    strong.translate( 'message_count', { count: 2 } ).should.equal( '2 messages' );
  });

  // Not found
  it('should raise a TranslationNotFound error when the key isn\'t found.', function() {
    strong.back.putAtPath('zh.everything', 'I am a translated string for locale: zh');
    (function(){ strong.translate('everything'); }).should.throw("TranslationNotFound: Could not find key 'everything'.  Attempted: 'en.everything'");
  });

  it('should raise a TranslationNotFound error when the key isn\'t found in multiple locales.', function() {
    strong.back.putAtPath('zh.everything', 'I am a translated string for locale: zh');
    strong.default_locale = 'DE';
    // duplicate locale (en-us) should be ignored
    strong.locale = [ 'pt-PT', 'pt', 'en-US', 'en', 'es-ES', 'ES', 'en-gb', 'en-us', 'pt-br' ];
    (function(){ strong.translate('everything'); }).should.throw("TranslationNotFound: Could not find key 'everything'.  Attempted: 'pt-pt.everything', 'pt.everything', 'en-us.everything', 'en.everything', 'es-es.everything', 'es.everything', 'en-gb.everything', 'pt-br.everything', 'de.everything'");
  });

  // localeHelper
  it('should parse languages from accept-language header.', function() {
    var req = {
      headers: {
        "accept-language": "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.6,es-ES;q=0.5,es;q=0.4,en-gb;q=0.3,pt-br;q=0.1"
      }
    };
    var locale = strong.localeHelper(req, res);
    locale.should.eql([ 'pt-PT', 'pt', 'en-US', 'en', 'es-ES', 'es', 'en-gb', 'pt-br' ]);
  });

  it('should work with missing accept-language header.', function() {
    var req = {
      headers: {}
    };
    var locale = strong.localeHelper(req, res);

    should.not.exist(locale);
  });

  it('should work with Express 3 req.acceptedLanguages.', function() {
    var req = {
      acceptedLanguages: [ 'pt-PT', 'pt', 'en-US', 'en', 'es-ES', 'ES', 'en-gb', 'pt-br' ]
    };
    var locale = strong.localeHelper(req, res);

    locale.should.equal(req.acceptedLanguages);
  });
});

describe('strong.decorator', function () {
  var strong = require('../lib/strong');
  var mockData, mockEngine, translateMock, originalTranslate;

  beforeEach(function () {
    strong.init();
    mockData = {};
    mockEngine = {
      compile: function () {
        return function (mockData) {
          return mockData;
        };
      }
    };
    var compileFunction = strong.decorator(mockEngine, "mockAppName").compile({}, {filename: "testfile"});
    var template = compileFunction(mockData);
    translateMock = sinon.spy();
    originalTranslate = strong.translate;
    strong.translate = translateMock;
  });

  afterEach(function () {
    strong.translate = originalTranslate;
  });

  it('should create a t() and i18n() function.', function () {
    mockData.t.should.be.a('function');
    mockData.i18n.should.be.a('function');
    mockData.i18n.should.equal(mockData.t);
  });

  it('should call translate with key and view_path.', function () {
    mockData.t.apply({}, ['everything']);
    translateMock.calledWith("everything", { view_path: [ 'mockAppName', 'testfile' ] }).should.be.ok;
  });

  it('should call translate with res.locals.locale if it exists.', function () {
    mockData.t.apply({locale:['es','zh']}, ['everything']);
    translateMock.calledWith("everything", { locale: ['es', 'zh'], view_path: [ 'mockAppName', 'testfile' ] }).should.be.ok;
  });

  it('should override res.locals.locale with options passed to t().', function () {
    mockData.t.apply({locals:{locale:['es','zh']}}, ['everything', {locale:['pt-BR', 'en']}]);
    translateMock.calledWith("everything", { locale: ['pt-BR', 'en'], view_path: [ 'mockAppName', 'testfile' ] }).should.be.ok;
  });

});
