var path = require('path');
var test = require('tape');
var pull = require('pull-stream');
var file = require('..');

test('small file split', function(t) {
  var expected = ['a', 'b', 'c', 'd', 'e'];

  t.plan(expected.length);

  pull(
    file.read(path.resolve(__dirname, 'assets', 'multiline.txt')),
    file.split('\n'),
    pull.drain(function(value) {
      t.equal(value.toString(), expected.shift());
    })
  );
});

test('small file split (constrain buffer size)', function(t) {
  var expected = ['this', 'is', 'a', 'test of multiline splits', 'yeah'];

  t.plan(expected.length);

  pull(
    file.read(path.resolve(__dirname, 'assets', 'multiline2.txt'), { bufferSize: 2 }),
    file.split('\n'),
    pull.drain(function(value) {
      t.equal(value.toString(), expected.shift());
    })
  );
});
