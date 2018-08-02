var _ = require('lodash');
var toBool = require('../lib/to_bool');
var Strand = require('../lib/strand');

module.exports = new Strand('search', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'search',
      types: ['search'],
    }
  ],
  help: 'Make with the querying',
  fn: function search (args, kblConfig) {
    var scripts = args._input_.scripts; // object containing field names and scripts.
    var output = args._input_;
    output.query = toBool(args.search, scripts);
    return output;
  }
});
