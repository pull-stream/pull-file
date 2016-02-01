var pull = require('pull-stream')
var File = require('../')

var start = Date.now(), total = 0
pull(
  File(process.argv[2]),
//    HighWatermark(2),
  pull.drain(function (b) {
    total += b.length
  }, function (err) {
    var mb = total/(1024*1024)
    var elapsed = (Date.now() - start)/1000
    console.log(mb, elapsed, mb/elapsed)
  })
)

