# pull-file

This is a simple module which uses raw file reading methods available in
the node `fs` module to read files on-demand.  It's a work in progress
and feedback is welcome :)

[
![Build Status]
(https://travis-ci.org/DamonOehlman/pull-file.png?branch=master)
](https://travis-ci.org/DamonOehlman/pull-file)

### read(filename, opts)

Read from the target file as required:

```js
var file = require('pull-file');
var pull = require('pull-stream');

pull(
  file.read(__dirname +  '/bigfile'),
  pull.drain(console.log) // see the chunks :)
);
```

## Through Streams

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
