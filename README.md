Strong i18n
===========

Simply the best way to internationalize your Node.js app if you're
serious about your work.

Install It
----------

Add it to your `package.json`:

    "dependencies": {
        ...
      , "strong": ">= 0.1.0"
    }

And then install app dependencies:

    npm install -d


Use It
------

`strong.translate()` is aliased to `t()` and `i18n()` for use in your views.

CoffeeScript:

`views/home/index.eco`:

    <h1><%= @t 'title' %></h1>
    OR
    <h1><%= @i18n 'title' %></h1>

`app.coffee`:

    @configure ->
      @register '.eco' strong.decorator( zappa.adapter 'eco' )

`locales/home/index_en.json`:

    {
      "title": "My Page Title"
    }

Javascript:

`views/home/index.ejs`:

    <h1><%= t('title') %></h1>
    OR
    <h1><%= i18n('title') %></h1>

`app.js`:

    app.register('.ejs', strong.decorator(require('ejs')));

`locales/home/index_en.json`:

    {
      "title": "My Page Title"
    }

Express middleware
------------------
The is an optional Express middleware you can use that will parse the Accept-Language header and set
a locale property in your Express locals for use in your templates (res.locals.locale).
strong.translate (or the t or i18n aliases) will automatically lookup the locale set by the middleware

CoffeeScript:

`app.coffee`:

    app.dynamicHelpers
          locale: strong.localeHelper

Javascript:

`app.js`:

    app.dynamicHelpers({
        locale: strong.localeHelper
    });

Stuff You Care About
--------------------

* Each view has its own translations file.
* Translation keys are organized into a hierarchy to match your views.
* If a translation key isn't found at one level, it backs up the hierarchy looking for it.
* It's separated into an API and a simple default backend, which you can
  replace.
* It "just works" with Zappa when you use Eco and EJS with Express. Other templating libraries _may_ work.
* Works in CoffeeScript and JavaScript.
* Supports region-specific locales (pt-PT, pt-BR, en-GB) as well as simple locales (en, es, de)
* locale can be an array (['pt-BR', 'pt', 'es', 'en-GB', 'en']) and it will look up the best match in order


How To Run the Unit Tests
-------------------------
[![Build Status](https://secure.travis-ci.org/fs-webdev/strong.png)](http://travis-ci.org/fs-webdev/strong)

Just use `npm`:

    npm test


Write Your Own Backend
----------------------

Want to store your translations in Redis, MongoDB, or some other cool
new thing? It's easy. The API will handle all the substitutions, and
selection among pluralization options.

*API-Backend Contract*

This is how the API will expect to access the translations.

*Replace the storage backend*

    strong.back = require('strong-redis');

*It must respond to `navigate` calls like this:*

    # All keys will be of the form '<locale>.<path>.<key>'
    strong.back.navigate('en.home.index.title');

*When that key corresponds to a message that should be pluralized, return a Map:*

    {
        'one': '1 message'
      , 'other': '%{count} messages'
    }

*Otherwise, simply return the string:*

    'Hello, %{name.first}'

And you're done!