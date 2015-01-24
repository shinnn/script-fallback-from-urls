'use strict';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    'var': 'variable',
    'V': 'variable',
    'h': 'help',
    'v': 'version'
  },
  string: ['_'],
  boolean: ['help', 'version']
});

if (argv.version) {
  console.log(require('./package.json').version);

} else if (argv.help || argv._.length === 0) {
  var sumUp = require('sum-up');
  var yellow = require('chalk').yellow;

  var pkg = require('./package.json');

  console.log([
    sumUp(pkg),
    '',
    'Usage: ' + pkg.name + ' <url1> <url2> [<url3> ...] --variable <variable>',
    '',
    yellow('--variable, --var, -V') + '  Specify a required global variable',
    '',
    'Options:',
    yellow('--no-min,            ') + '  Do not minify output',
    yellow('--help,            -h') + '  Print usage information',
    yellow('--version,         -v') + '  Print version',
    ''
  ].join('\n'));

} else if (argv._.length < 2) {
  process.stderr.write('More than 2 URLs required.\n', function() {
    process.exit(1);
  });

} else if (argv.variable === undefined || argv.variable === true) {
  process.stderr.write('--variable <variable> required.\n', function() {
    process.exit(1);
  });

} else {
  console.log(require('./')(argv.variable, argv._, {min: argv.min}));
}
