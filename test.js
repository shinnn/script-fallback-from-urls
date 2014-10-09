/*jshint unused:true */
'use strict';

var spawn = require('child_process').spawn;

var fallbackFromUrls = require('require-main')();
var test = require('tape');

var pkg = require('./package.json');

var expected = '<script src="b"></script><script>a||document.write(\'c\')</script>';
var expectedLong = '<script src="b"></script><script>a||document.write(\'c\')</script><script>a||document.write(\'d\')</script>';
var expectedUncompressed = '<script src="b"></script>\n<script>a||document.write(\'c\');</script>\n';

test('scriptFallbackFromUrls()', function(t) {
  var specs = [
    'should create script tag with a fallback.',
    'should create script tag with multiple fallbacks.',
    'should accept `min` option.',
    'should throw an type error when the first argument is not a string.',
    'should throw an error when the second argument is not an array.',
    'should throw an error when the second argument contains a non-string element.',
    'should throw an error when the second argument doesn\'t contains more than two elements.'
  ];

  t.plan(specs.length);

  t.equals(fallbackFromUrls('a', ['b', 'c']), expected, specs[0]);

  t.equals(fallbackFromUrls('a', ['b', 'c', 'd']), expectedLong, specs[1]);

  t.equals(fallbackFromUrls('a', ['b', 'c'], {min: false}), expectedUncompressed, specs[2]);

  t.throws(fallbackFromUrls.bind(null, ['a'], ['b', 'c']), /first argument/, specs[3]);

  t.throws(fallbackFromUrls.bind(null, 'a', 'b'), /second argument/, specs[4]);

  t.throws(fallbackFromUrls.bind(null, 'a', [1, true]), /second argument/, specs[5]);

  t.throws(fallbackFromUrls.bind(null, 'a', ['b']), /two/, specs[6]);
});

test('"script-fallback-from-urls" command', function(t) {
  var specs = [
    'should print script tag with a fallback.',
    'should accept --var alias.',
    'should accept -V alias.',
    'should print uncompressed HTML using --no-min flag.',
    'should fail when --variable is not used.',
    'should print message to stderr when --variable is not used.',
    'should fail when the argument of --variable is not specified.',
    'should print message to stderr when the argument of --variable is not specified.',
    'should fail when only one URL is specified.',
    'should print message to stderr when only one URL is specified.',
    'should print usage information using --help flag.',
    'should accept -h alias.',
    'should print version number using --version flag.',
    'should accept -v alias.'
  ];

  t.plan(specs.length);

  var cmd = function(args) {
    return spawn('node', [pkg.bin].concat(args), {
      stdio: [process.stdin, null, null]
    });
  };

  cmd(['--variable', 'a', 'b', 'c'])
    .stdout.on('data', function(data) {
      t.equal(data.toString(), expected + '\n', specs[0]);
    });

  cmd(['b', 'c', 'd', '--var', 'a'])
    .stdout.on('data', function(data) {
      t.equal(data.toString(), expectedLong + '\n', specs[1]);
    });

  cmd(['-V', 'a', 'b', 'c', 'd'])
    .stdout.on('data', function(data) {
      t.equal(data.toString(), expectedLong + '\n', specs[2]);
    });

  cmd(['b', 'c', '--variable', 'a', '--no-min'])
    .stdout.on('data', function(data) {
      t.equal(data.toString(), expectedUncompressed + '\n', specs[3]);
    });

  cmd(['a', 'b'])
    .on('close', function(code) {
      t.equal(code, 1, specs[4]);
    })
    .stderr.on('data', function(data) {
      t.equal(data, '--variable <variable> required.\n', specs[5]);
    })
    .setEncoding('utf8');

  cmd(['a', 'b', '--variable'])
    .on('close', function(code) {
      t.equal(code, 1, specs[6]);
    })
    .stderr.on('data', function(data) {
      t.equal(data, '--variable <variable> required.\n', specs[7]);
    })
    .setEncoding('utf8');

  cmd(['a', '--variable', 'b'])
    .on('close', function(code) {
      t.equal(code, 1, specs[8]);
    })
    .stderr.on('data', function(data) {
      t.equal(data, 'More than 2 URLs required.\n', specs[9]);
    })
    .setEncoding('utf8');

  cmd(['--help'])
    .stdout.on('data', function(data) {
      t.ok(/Usage/.test(data.toString()), specs[10]);
    });

  cmd(['--h'])
    .stdout.on('data', function(data) {
      t.ok(/Usage/.test(data.toString()), specs[11]);
    });

  cmd(['--version'])
    .stdout.on('data', function(data) {
      t.equal(data.toString(), pkg.version + '\n', specs[12]);
    });

  cmd(['--v'])
    .stdout.on('data', function(data) {
      t.equal(data.toString(), pkg.version + '\n', specs[13]);
    });
});
