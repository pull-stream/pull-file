/* jshint node: true */
'use strict';

var pull = require('pull-core');
var throughs = require('./throughs');

/**
  # pull-file

  This is a simple module which uses raw file reading methods available in
  the node `fs` module to read files on-demand.  It's a work in progress
  and feedback is welcome :)

  [
  ![Build Status]
  (https://travis-ci.org/DamonOehlman/pull-file.png?branch=master)
  ](https://travis-ci.org/DamonOehlman/pull-file)

**/
exports.read = pull.Source(require('./read'));

// initialise the through helpers
for (var k in throughs) {
  exports[k] = pull.Through(throughs[k]);
}
