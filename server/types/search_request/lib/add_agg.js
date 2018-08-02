var _ = require('lodash');

/*

  config = {
    prefix: 'top',
    agg: {
      terms: {
        field: 'etc...'
      }
    },
    newContext: true
  }

*/

module.exports = function (config) {
  var output = config.searchRequest;
  var aggName = config.name;
  var context = output.aggContext ? _.get(output, output.aggContext) : output;

  context.aggs = context.aggs || {};
  context.aggs[aggName] = config.agg;

  if (config.newContext) {
    output.aggContext = output.aggContext ?
      output.aggContext + '.aggs.' + aggName :
      'aggs.' + aggName;
  }

  return output;
}