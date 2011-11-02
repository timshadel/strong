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

`views/home/index.eco`:

    <h1><%= @t 'title' %></h1>

`app.coffee`:

    @configure ->
      @register '.eco' strong.decorator( zappa.adapter 'eco' )

`locales/home/index_en.json`:

    {
      "title": "My Page Title"
    }


Stuff You Care About
--------------------

* Each view has its own translations file.
* Translation keys are organized into a hierarchy to match your views.
* If a translation key isn't found at one level, it backs up the hierarchy looking for it.
* It's separated into an API and a simple default backend, which you can
  replace.
* It "just works" with Zappa when you use Eco. Other templating libraries _may_ work.
* Works in CoffeeScript and JavaScript.


How To Run the Unit Tests
-------------------------

Just use `npm`:

    npm tests


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