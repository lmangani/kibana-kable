var _ = require('lodash');
var Strand = require('../lib/strand');


module.exports = new Strand('display', {
  args: [
    {
      name: '_input_',
      types: ['dataTable']
    },
    {
      name: 'display',
      types: ['string']
    },
    {
      name: 'columns',
      types: ['array']
    }
  ],
  default_types: ['string', 'number'],
  help: 'Specify the index to search',
  fn: function display(args, kblConfig) {
    var output = args._input_;
    output._panel = {
      type: args.display,
      args: _.omit(args, '_input_', 'display')
    };

    return output;
  }
});
