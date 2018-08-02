var _ = require('lodash');
var Strand = require('../lib/strand');
var searchRequest = require('../types/search_request');

module.exports = new Strand('index', {
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
      name: 'count',
      types: ['number']
    }
  ],
  help: 'Specify the index to search',
  fn: function top(args, kblConfig) {
    var termsConfig = searchRequest.methods.appendDslField(args.field, {size: args.count}, args._input_);

    return searchRequest.methods.addAgg({
      searchRequest: args._input_,
      newContext: true,
      name: 'top_' + args.field.replace('.', '_'),
      agg: {
        terms: termsConfig
      }
    });
  }
});
