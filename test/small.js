var test = require('tape');
var pull = require('pull-stream');
var readfile = require('pull-readfile');

test('small text', function(t) {
  t.plan(1);

  pull(
    readfile(path.resolve(__dirname, 'assets', 'test.txt')),
    pull.drain(function(data) {
      console.log(data);
    });
  );
});
