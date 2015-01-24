# script-fallback-from-urls

[![NPM version](https://img.shields.io/npm/v/script-fallback-from-urls.svg?style=flat)](https://www.npmjs.com/package/script-fallback-from-urls)
[![Bower version](https://img.shields.io/bower/v/script-fallback-from-urls.svg?style=flat)](https://github.com/shinnn/script-fallback-from-urls/releases)
[![Build Status](https://travis-ci.org/shinnn/script-fallback-from-urls.svg?branch=master)](https://travis-ci.org/shinnn/script-fallback-from-urls)
[![Build status](https://ci.appveyor.com/api/projects/status/5m4u2h2ln3qb2mq2?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/script-fallback-from-urls)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/script-fallback-from-urls.svg?style=flat)](https://coveralls.io/r/shinnn/script-fallback-from-urls)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/script-fallback-from-urls.svg?style=flat&label=devDeps)](https://david-dm.org/shinnn/script-fallback-from-urls#info=devDependencies)

Create HTML tags to load a JavaScript file safely

```javascript
var html = scriptFallbackFromUrls('window.angular', [
  '//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js',
  'path/to/local/angular.min.js'
], {min: false});

console.log(html);
```

yields:

```html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js"></script>
<script>window.angular||document.write('path/to/local/angular.min.js');</script>
```

## Installation

### Package managers

#### [npm](https://www.npmjs.com/)

```sh
npm i --save script-fallback-from-urls
```

#### [Bower](http://bower.io/)

```sh
bower i --save script-fallback-from-urls
```

#### [Duo](http://duojs.org/)

```javascript
var scriptFallbackFromUrls = require('shinnn/script-fallback-from-urls');
```

## API

### scriptFallbackFromUrls(*variable*, *urls* [, *option*])

*variable*: `String` (global variable name the library should creates)  
*urls*: array of `String` (URL of CDNs and local copy)  
*option*: `Object`  
Return: `String`

It returns an HTML text of `<script>` tags to load the script with single or multiple fallbacks.

Generated HTML tries to load the script from the URLs in order. If the first URL doesn't provide the global variable you specified — in most case, when the script isn't loaded successfully, it tries to load from the second URL, and so forth.

It is highly recommended that the last URL points at a local copy on your server because it is used as a last resort.

```javascript
scriptFallbackFromUrls('window.THREE', [
  '//ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js',
  '//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js',
  'path/to/local/three.min.js'
]);
//=> <script src="//ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js"></script><script>window.THREE||document.write(\'//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js\')</script><script>window.THREE||document.write(\'path/to/local/three.min.js\')</script>
```

#### option.min

Type: `Boolean`  
Default: `true`

Adds newlines and semicolons by setting this option `false`.

```javascript
scriptFallbackFromUrls('window.THREE', [
  '//ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js',
  '//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js',
  'path/to/local/three.min.js'
], {min: false});

/* =>
<script src="//ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js"></script>
<script>window.THREE||document.write('//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js');</script>
<script>window.THREE||document.write('path/to/local/three.min.js');</script>
*/
```

## CLI

You can use this module as a CLI tool by installing it [globally](https://docs.npmjs.com/files/folders#global-installation).

```sh
npm install -g inline-source-map-comment
```

### Usage

```sh
script-fallback-from-urls v1.0.0
Create script tags to load a JavaScript file with single or multiple fallbacks

Usage: script-fallback-from-urls <url1> <url2> [<url3> ...] --variable <variable>

--variable, --var, -V  Specify a required global variable

Options:
--no-min,              Do not minify output
--help,            -h  Print usage information
--version,         -v  Print version
```

### Example

```sh
$ script-fallback-from-urls http://d3js.org/d3.v3.min.js path/to/local/d3.v3.min.js --variable d3
> <script src="http://d3js.org/d3.v3.min.js"></script><script>d3||document.write('path/to/local/d3.v3.min.js')</script>
```

## License

Copyright (c) [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
