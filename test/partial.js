
var tape = require('tape')
var path = require('path')
var pull = require('pull-stream')
var File = require('../')
var cont = require('cont')
var fs = require('fs')

var crypto = require('crypto')

function hash (data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

function asset(file) {
  return path.join(__dirname, 'assets', file)
}

var MB = 1024*1024

tape('read files partially', function (t) {

  function test (file, start, end) {
    return function (cb) {
      var opts = {start: start, end: end}
      var expected
      console.log(file)
      var _expected = fs.readFileSync(file, opts)

      console.log(
          start || 0,
          end || _expected.length
      )
      expected = _expected
        .slice(
          start || 0,
          end || _expected.length
        )

      console.log('ELength', expected.length)

      pull(
        File(file, opts),
        pull.collect(function (err, ary) {
          var actual = Buffer.concat(ary)
          t.equal(actual.length, expected.length)
          t.equal(hash(actual), hash(expected))
          cb()
        })
      )
    }

  }

  cont.para([
    test(asset('AU.txt'), 0, 10*MB),
    test(asset('AU.txt'), 5*MB, 12*MB),
    test(asset('AU.txt'), 5*MB, 6*MB),
    test(asset('ipsum.txt')),
    test(asset('test.txt'), 1, 4)
  ])(function (err) {
    t.end()
  })

})




