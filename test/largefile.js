var path = require('path');
var test = require('tape');
var pull = require('pull-stream');
var file = require('..');

test('large file', function(t) {
  var expected = ['JTY', 'AU', '01', '0', '609', 'Australia/Sydney', '2012-02-29', ''];

  t.plan(1);

  pull(
    file(path.resolve(__dirname, 'assets', 'AU.txt')),
    pull.collect(function(err, items) {
      var lastFields = items[items.length - 1].toString().split(/\s+/);
      t.deepEqual(lastFields.slice(-expected.length), expected, 'ok');
    })
  );
});
