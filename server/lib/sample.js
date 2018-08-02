// search q=* | top=geo.country_code count=2 | metric avg=bytes | top=geo.region count=2 | metric avg=bytes
var Promise = require('bluebird');
var runner = require('./runner');

var expression = null

Promise.resolve(runner(expression)).then(function (resp) {
  console.log(resp);
});
