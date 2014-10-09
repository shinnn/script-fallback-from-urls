'use strict';

var argv = require('minimist')(process.argv.slice(2));
var pkg = require('./package.json');

function help() {
  var chalk = require('chalk');

  console.log([
    chalk.cyan(pkg.name) + chalk.gray(' v' + pkg.version),
    pkg.description,
    '',
    'Usage: ' + pkg.name + ' <url1> <url2> [<url3> ...] --variable <variable>',
    '',
    chalk.yellow('--variable, --var, -V') + '  Specify a required global variable',
    '',
    'Options:',
    chalk.yellow('--no-min,            ') + '  Do not minify output',
    chalk.yellow('--help,            -h') + '  Print usage information',
    chalk.yellow('--version,         -v') + '  Print version',
    ''
  ].join('\n'));
}

var variable = argv.var || argv.variable || argv.V;

if (argv.version || argv.v) {
  console.log(pkg.version);
} else if (argv.help || argv.h || argv._.length === 0) {
  help();
} else if (argv._.length < 2) {
  process.stderr.write('More than 2 URLs required.\n', function() {
    process.exit(1);
  });
} else if (variable === undefined || variable === true) {
  process.stderr.write('--variable <variable> required.\n', function() {
    process.exit(1);
  });
} else {
  var urls = argv._.map(function(el) {
    return '' + el;
  });

  console.log(require('./' + pkg.main)(variable, urls, {min: argv.min}));
}
