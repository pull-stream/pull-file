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

test('large file', function(t) {
  var big = crypto.pseudoRandomBytes(10*1024*1024)
  fs.writeFileSync(tmpfile, big)

  pull(
    file(tmpfile),
    pull.collect(function(err, items) {
      t.equal(hash(big), hash(Buffer.concat(items)))
      t.end()
    })
  );
});


test('large file as ascii strings', function(t) {
  var big = crypto.pseudoRandomBytes(10*1024*1024).toString('base64')
  fs.writeFileSync(tmpfile, big, 'ascii');

  pull(
    file(tmpfile, {encoding: 'ascii'}),
    pull.through(function (str) {
      t.equal(typeof str, 'string');
    }),
    pull.collect(function(err, items) {
      t.equal(hash(big), hash(items.join('')))
      t.end()
    })
  );
});

test('large file fast reads', function(t) {
  var big = crypto.pseudoRandomBytes(10*1024*1024)
  fs.writeFileSync(tmpfile, big)

  var read = file(tmpfile, {bufferSize: 1024 * 1024})
  var items = []

  read(null, checkRead)
  read(null, checkRead)
  read(null, checkRead)
  read(null, checkRead)
  read(null, checkRead)

  setTimeout(function () {
    read(null, checkRead)
    read(null, checkRead)
    read(null, checkRead)
    read(null, checkRead)
    read(null, checkRead)
    read(null, function (err, data) {
      t.equal(err, true)
      t.equal(data, undefined)
      next()
    })
  }, 10)

  function checkRead (err, data) {
    t.equal(data.length, 1024 * 1024)
    items.push(data)
    next()
  }

  var i = 0
  function next () {
    if (++i === 11) {
      t.equal(hash(big), hash(Buffer.concat(items)))
      t.end()
    }
  }
})
