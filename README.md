# Monaca Website

This repository contains assets and other public materials that are published on http://monaca.io Website.

## Directory structure

### /dist

Compiled files will be placed into here

_grunt server command don't watch assets directory, so please run "build" manually after you moved any filed in assets folder._

### /src/templates

Assemble templates.

layouts/default.hbs
: Master template

layouts:index.hbs
: Template for index.html

pages/*.hbs
: Template for each HTML files

partials/footer.hbs
: Global footer

partials/header.hbs
: Global header

### /docs

docs/styleguide
: Style guide

## Available Grunt tasks

### Build Website

```
grunt build
```

1. Copy assets in /src/assets into /dist.
2. Compile sass files.
3. Concat JS files in /src/js. Created "all.js" is placed to /dist/js.


### Watch and live-reload

If you wanna launch both English and Japanese server, do: 

```
grunt server
```

or type like this for single server:

```
grunt server:ja
grunt server:en
```

_server command don't watch assets directory, so please run "build" manually after you moved any filed in assets folder._

### Deploy to the server

```
grunt deploy
```

Note: Required to create aws_keys.json manually.

## i18n

### Separate Templates

Place "hoge.en.hbs" or "hoge.ja.hbs" and "hoge.html" will be created.
Note that \*.{en|ja}.hbs have higher priority than \*.hbs, so if you place both hoge.hbs and hoge.en.hbs, hoge.en.hbs is used.

### Use Same Template

We can use shortcode in hbs files
 
```html
<html>
    <body>
        <p>{{i18n "hoge"}}</p>
    </body>
</html>
```

```html
{{#is language "ja"}}
    <p>簡単な分岐はできます</p>
{{else}}
    <p>like this</p>
{{/is}}
```

```html
{{i18n "key"}} <- HTML will be escaped
{{{i18n "key"}}} <- Call with triple brackets will prevent escaping
```

Translation files
: /src/data/i18n/*.json


## Bower Components

* Twitter Bootstrap

* jQuery

* CodeMirror

These components are copied to appropriate directories by "grunt copy".

## [Assemble](http://assemble.io/)

Assemble is a component and static site generator that makes it dead simple to build modular sites, documentation and components from reusable templates and data.

* Documentation
* Plugins - Plugins extend the core functionality of Assemble.
* Helpers - Documentation for the helpers in the [handlebars-helpers](http://github.com/assemble/handlebars-helpers) library.

## Copyright

Copyright(c) 2014 Monaca team in Asial Corporation. All rights reserved.
