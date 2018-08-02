var _ = require('lodash');
var Strand = require('../lib/strand');
var searchRequest = require('../types/search_request');

module.exports = new Strand('latest', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'field',
      types: ['string']
    },
    {
      name: 'by',
      types: ['string']
    }
  ],
  help: 'Get the latest value of some field',
  fn: function latest(args, kblConfig) {

    console.log('1');


    var agg = {};

    var sortObj = {};
    sortObj[args.by] = {order: 'desc'};

    console.log('2');

    console.log('3');


    agg.top_hits = {
      size: 1,
      sort: sortObj,
      _source: args.field
    };


    searchRequest.methods.addAgg({
      searchRequest: args._input_,
      newContext: false, // because this is a metric agg
      name: `latest_${args.field.replace('.', '_')}_by_${args.by}`,
      agg: agg
    });

    return args._input_;

  }
});
