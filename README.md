Strong i18n
===========

Simply the best way to internationalize your Node.js app if you're
serious about your work.

What It Looks Like
------------------

*API Use*

`views/home/index.eco`:

    <!-- Use a local view key -->
    <h1><%=t '.title' %></h1>
    <!-- Use a global key -->
    <h1><%=t '*common_title' %></h1>

`app.coffee`:

    configure ->
      app.register '.eco' internode.detector( zappa.adapter 'eco' )

*API-Backend Contract*

This is how the API will expect to access the translations. The backend
can implement access to this (potentially virtual) data structure
however it sees fit.

`locales['en']`:

    {
        "common_title": "Everyone Should Use This Title!!"
      , "home":
        {
            "index":
            {
                "title": "My Page Title"
            }
        }
    }

*Simple Default Backend File Setup*

`locales/home/index/en.json`:

    {
      "title": "My Page Title"
    }

`locales/en.json`:

    {
      "common_title": "Everyone Should Use This Title!!"
    }


Stuff You Care About
--------------------

* Each view has its own translations file.
* Translation keys are organized into a hierarchy to match your views.
* You can use "global" keys in any view.
* It's separated into an API and a simple default backend, which you can
  replace.
* It won't cloud your JavaScript global namespace.
* It "just works" with Node.js, Connect, Express, and Zappa when you use
  Jade, EJS, Eco, or other standard view templating libraries.
* Works in CoffeeScript and JavaScript.


How To Run the Unit Tests
-------------------------

First, make sure to install the module's dependencies:

    npm install -d

Now run jasmine:

    ./node_modules/.bin/jasmine-node spec

You should see the tests run.
