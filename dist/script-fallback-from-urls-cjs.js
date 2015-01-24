/*!
 * script-fallback-from-urls | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/script-fallback-from-urls
*/
'use strict';

var MODULE_NAME = 'script-fallback-from-urls';
var urlErrMsg = 'The second argument to ' + MODULE_NAME + ' must be an array of URL strings.';

function scriptFallbackFromUrls(variable, urls, options) {
  if (typeof variable !== 'string') {
    throw new TypeError(
      variable +
      ' is not a string. The first argument to ' + MODULE_NAME + ' must be a string.'
    );
  }
  if (!Array.isArray(urls)) {
    throw new TypeError(urls + ' is not an array. ' + urlErrMsg);
  }
  if (urls.length < 2) {
    throw new Error(
      'The second argument to ' +
      MODULE_NAME +
      ' must be an array which contains more than two elements.'
    );
  }

  options = options || {};

  var min = options.min;
  if (min === undefined) {
    min = true;
  }

  var semicolon;
  if (!min) {
    semicolon = ';';
  } else {
    semicolon = '';
  }

  var lines = ['<script src="' + urls[0] + '"></script>'];

  for (var i = 1; i < urls.length; i++) {
    if (typeof urls[i] !== 'string') {
      throw new TypeError(urls[i] + ' is not a string. ' + urlErrMsg);
    }

    lines.push(
      '<script>' +
      variable + '||document.write(\'' + urls[i] + '\')' + semicolon +
      '</script>'
    );
  }

  var newline;
  if (!min) {
    newline = '\n';
  } else {
    newline = '';
  }

  return lines.join(newline);
}

module.exports = scriptFallbackFromUrls;
