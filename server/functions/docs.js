var _ = require('lodash');
var Strand = require('../lib/strand');

module.exports = new Strand('docs', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'count',
      types: ['number'],
    }
  ],
  help: 'Make with the querying',
  fn: function docs (args, kblConfig) {
    var output = args._input_;
    output.docs = args.count;
    return output;
  }
});
