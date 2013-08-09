/* jshint node: true */
'use strict';

var fs = require('fs');

module.exports = function(filename, opts) {
  var mode = (opts || {}).mode || 0x1B6; // 0666
  var bufferSize = (opts || {}).bufferSize || 1024;
  var buffer = new Buffer(bufferSize);
  var fd;

  function readNext(cb) {
    fs.read(fd, buffer, 0, bufferSize, null, function(err, count) {
      if (err) {
        return cb(err);
      }

      cb(count === 0, buffer.slice(0, count));
    });
  }

  function open(cb) {
    console.log('attempting open: ' + filename);
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
      return cb(end);
    }

    if (! fd) {
      return open(cb);
    }

    return readNext(cb);
  };
};