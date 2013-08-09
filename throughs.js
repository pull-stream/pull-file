/**
  ## Through Streams

**/

/**
  ### split(chunk)

  Will collect pieces of the file until the split chunk is found, then it
  will pass on all the data collected prior to encountering the chunk.  The
  split functionality works at a pure buffer level so if it is passed a string
  it will convert that into a Buffer before attempting the split operation.

  Usage:


  ```js
  var file = require('pull-file');
  var pull = require('pull-stream');

  pull(
    file.read(__dirname + '/test.csv'),
    file.split('\n'),
    pull.drain(console.log) // log out lines
  );
  ```
**/
exports.split = function(read, chunk, opts) {
  var queued = new Buffer(0);
  var encoding = (opts || {}).encoding || 'utf8';

  function checkMatch(q, index) {
    var match = true;

    for (var ii = chunk.length; match && ii--; ) {
      match = q[index + ii] === chunk[ii]
    }

    return match;
  }

  function nextChunk(cb) {
    var foundChunk = false;

    // create a proxy callback to monitor sending data through to the sink
    function sendChunk(end, data) {
      foundChunk = true;
      cb(end, data);

      // no longer need the monitor, so remap
      sendChunk = cb;
    }

    function next(end, data) {
      if (end) {
        // if we have data queued and end is not an error, then pass
        // the remaining along
        if (queued && queued.length && (! (end instanceof Error))) {
          cb(null, queued);
          queued = null;
        }

        return cb(end);
      }

      // update queued after splitting
      queued = splitAtChunks(
        Buffer.concat([queued, data], queued.length + data.length),
        sendChunk
      );

      // if we didn't find a chunk, go again with a read
      if (! foundChunk) {
        read(null, next);
      }
    }

    // read the next chunk
    read(null, next);
  }

  function splitAtChunks(q, cb) {
    // iterate through the data looking for a match
    for (var ii = 0, count = q.length; ii < count; ii++) {
      if (q[ii] === chunk[0] && checkMatch(q, ii)) {
        // send the data to the callback
        cb(null, q.slice(0, ii));

        // update queued to the chunk after the delimiter
        return splitAtChunks(q.slice(ii + chunk.length), cb);
      }
    }

    return q;
  }

  if (typeof chunk == 'string' || (chunk instanceof String)) {
    chunk = new Buffer(chunk, encoding);
  }

  return function(end, cb) {
    if (end) {
      return read(end, cb);
    }

    nextChunk(cb);
  };
};