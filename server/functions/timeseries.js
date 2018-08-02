const _ = require('lodash');
const Strand = require('../lib/strand');
const searchRequest = require('../types/search_request');


module.exports = new Strand('timeseries', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'field',
      types: ['string', 'null']
    },
    {
      name: 'interval',
      types: ['string', 'number', 'null']
    },
    {
      name: 'format',
      types: ['string', 'null']
    }
  ],
  help: 'Create a timeseries',
  fn: function timeseries(args, kblConfig) {
    args.field = args.field || args._input_.timefield;

    const dateHistogramConfig = searchRequest.methods.appendDslField(args.field, {interval: args.interval || '1y'}, args._input_);

    return searchRequest.methods.addAgg({
      searchRequest: args._input_,
      newContext: true,
      name: 'time_' + args.field.replace('.', '_'),
      agg: {
        date_histogram: dateHistogramConfig
      }
    });
  }
});
