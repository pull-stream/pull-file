
var Stats = require('statistics')
var cont = require('cont')

function bench (a, b, N) {

  N = N || 20,n = N
  var results_a = [], results_b = []
  var A, B

  var wins = 0

  ;(function next () {

    cont.series([
      function (cb) {
        a(function (err, data) {
          results_a.push(A = data)
          cb()

        })
      },
      function (cb) {
        b(function (err, data) {
          results_b.push(B = data)
          cb()
        })
      }
    ].sort(function () {
      return Math.random() - 0.5
    }))(function (err) {
      if(A.time < B.time)
        wins ++

      console.log('winner:', A.time < B.time ? 'A' : 'B', A, B)

      if(n-->0) next()
      else {
        console.log(results_a)
        console.log(results_b)
        console.log('chance A wins:', wins/N, wins, N - wins)
      }
    })
  })()

}

if(!module.parent) {
  var file = process.argv[2]
  var pull = require('./rate')
  var node = require('./node-rate')
  bench(function (cb) {
    pull(file, cb)
  }, function (cb) {
    node(file, cb)
  })

}


