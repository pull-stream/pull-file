/* jshint node: true */
'use strict';

var pull = require('pull-core');
var fs = require('fs');

/**
  # pull-file

  This is a simple module which uses raw file reading methods available in
  the node `fs` module to read files on-demand.  It's a work in progress
  and feedback is welcome :)

  ## Example Usage

  ```js
  var file = require('pull-file');
  var pull = require('pull-stream');

  pull(
    file(__dirname +  '/bigfile'),
    pull.log() // see the chunks :)
  );
  ```

**/
module.exports = pull.Source(function(filename, opts) {
  var mode = (opts || {}).mode || 0x1B6; // 0666
  var bufferSize = (opts || {}).bufferSize || 1024;
  var fd;

  function readNext(cb) {
    fs.read(
      fd,
      new Buffer(bufferSize),
      0,
      bufferSize,
      null,
      function(err, count, buffer) {
        if (err) {
          return cb(err);
        }

        cb(count === 0, buffer.slice(0, count));
      }
    );
  }

  function open(cb) {
    fs.open(filename, 'r', mode, function(err, descriptor) {
      if (err) {
        return cb(err);
      }

      // save the file descriptor
      fd = descriptor;

      // read the next bytes
      return readNext(cb);
    });
  }

  return function(end, cb) {
    if (end) {
      return fs.close(fd, function() {
        cb(end);
      });
    }

    if (! fd) {
      return open(cb);
    }

    return readNext(cb);
  };
});