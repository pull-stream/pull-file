
var pull = require('pull-stream')
var fs = require('fs')
var File = require('../')

var tape = require('tape')

tape('append to a file', function (t) {

  var filename = '/tmp/test_pull-file_append'+Date.now()

  var n = 10, r = 0, ended = false
  ;(function next () {
    --n
    fs.appendFile(filename, Date.now() +'\n', function (e) {
      if(n) setTimeout(next, 20).unref()
      else { ended = true; drain.abort() }
    })
  })()

  var drain = pull.drain(function (chunk) {
    r ++
    t.notEqual(chunk.length, 0)
  }, function (err) {
    t.equal(n, 0, 'writes')
    t.equal(r, 10, 'reads')
    t.end()
  })


  pull(File(filename, {live: true}), drain)
})




