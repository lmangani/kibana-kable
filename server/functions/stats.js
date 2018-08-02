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
      name: 'stats',
      types: ['array']
    },
    {
      name: 'field',
      types: ['string']
    }
  ],
  help: 'Specify the index to search',
  fn: function stats(args, kblConfig) {

    _.each(args.stats, function (stat) {
      var agg = {};
      agg[stat] = searchRequest.methods.appendDslField(args.field, {}, args._input_);
      searchRequest.methods.addAgg({
        searchRequest: args._input_,
        newContext: false,
        name: stat + '_' + args.field.replace('.', '_'),
        agg: agg
      });
    })

    return args._input_;

  }
});
