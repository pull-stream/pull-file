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
  file.read(path.resolve(__dirname, 'bigfile')),
  pull.drain(console.log) // see the chunks :)
);
```
