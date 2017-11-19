var test = require('tape');
var pull = require('pull-stream');
var file = require('..');

var path = require('path');
var crypto = require('crypto')
var osenv = require('osenv')
var fs = require('fs')

var tmpfile = path.join(osenv.tmpdir(), 'test_pull-file_big')

function hash (data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

function asset(file) {
  return path.join(__dirname, 'assets', file)
}

test('large file in explicit buffer', function(t) {
  var buf = Buffer.alloc(65551) // prime close to 1024 * 64
  var h = crypto.createHash('sha256')

  var big = fs.readFileSync(asset('img.jpg'))

  pull(
    file(asset('img.jpg'), {buffer: buf}),
    pull.through(function (chunk) {
      h.update(chunk)
    }),
    pull.onEnd(function(err) {
      t.equal(hash(big), h.digest('hex'))
      t.end()
    })
  );
});
