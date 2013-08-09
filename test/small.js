var path = require('path');
var test = require('tape');
var pull = require('pull-stream');
var readfile = require('..');

test('small text', function(t) {
  t.plan(1);

  pull(
    readfile(path.resolve(__dirname, 'assets', 'test.txt')),
    pull.map(function(data) {
      return data.toString()
    }),
    pull.collect(function(err, items) {
      t.equal(items.join(''), 'hello')
    })
  );
});
