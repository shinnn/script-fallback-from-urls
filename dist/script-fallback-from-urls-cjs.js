/*!
 * script-fallback-from-urls.js | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/script-fallback-from-urls
*/
'use strict';

var urlError = new TypeError('The second argument should be an array of URL strings.');

function scriptFallbackFromUrls(variable, urls, options) {
  if (typeof variable !== 'string') {
    throw new TypeError('The first argument should be a string.');
  }
  if (!Array.isArray(urls)) {
    throw urlError;
  }
  if (urls.length < 2) {
    throw new Error('The second argument should be an array which contains more than two elements.');
  }

  options = options || {};

  var min = options.min;
  if (min === undefined) {
    min = true;
  }

  var html;

  for (var i = 0; i < urls.length; i++) {
    if (typeof urls[i] !== 'string') {
      throw urlError;
    }

    if (i === 0) {
      html = '<script src="' + urls[0] + '"></script>';
    } else {
      html += '<script>' + variable + '||document.write(\'' + urls[i] + '\')' +
      (min ? '' : ';') +
      '</script>';
    }

    if (!min) {
      html += '\n';
    }
  }

  return html;
}

module.exports = scriptFallbackFromUrls;
