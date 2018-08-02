var _ = require('lodash');
var Strand = require('../lib/strand');
var searchRequest = require('../types/search_request');

module.exports = new Strand('bottom', {
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
  help: 'Find the least common values for a field',
  fn: function top(args, kblConfig) {
    var termsConfig = searchRequest.methods.appendDslField(args.field, {size: args.count, order: {_count: 'asc'}}, args._input_);

    return searchRequest.methods.addAgg({
      searchRequest: args._input_,
      newContext: true,
      name: 'bottom_' + args.field.replace('.', '_'),
      agg: {
        terms: termsConfig
      }
    });
  }
});
