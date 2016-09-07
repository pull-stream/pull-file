
var pull = require('pull-stream')
var fs = require('fs')
var File = require('../')

var tape = require('tape')

tape('append to a file', function (t) {

  var filename = '/tmp/test_pull-file_append'+Date.now()

  ;(function next () {
    fs.appendFile(filename, new Date() +'\n', function (e) {
      setTimeout(next, 1000)
    })
    
  })()

  pull(
    File(filename, {live: true}),
    pull.drain(function (chunk) {
      console.log('chunk', chunk.toString())
    }, function (err) {
      if(err) throw err
      t.fail('stream ended')

    })
  )


})



