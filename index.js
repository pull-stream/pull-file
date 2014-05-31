
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

  <<< examples/ipsum-chunks.js

**/
module.exports = pull.Source(function(filename, opts) {
  var mode = (opts || {}).mode || 0x1B6; // 0666
  var bufferSize = (opts || {}).bufferSize || 1024;
  var fd;
  var ended;

  function readNext(cb) {
    fs.read(
      fd,
      new Buffer(bufferSize),
      0,
      bufferSize,
      null,
      function(err, count, buffer) {
        // if we have received an end noticiation, just discard this data
        if (ended) {
          return;
        }

        // if we encountered a read error pass it on
        if (err) {
          return cb(err);
        }

        cb(count === 0, count === 0 ? null : buffer.slice(0, count));
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
      // if we have already received the end notification, abort further
      if (ended) {
        return;
      }

      ended = end;
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
