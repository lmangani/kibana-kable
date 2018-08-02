var _ = require('lodash');
var Strand = require('../lib/strand');

module.exports = new Strand('index', {
  args: [
    {
      name: '_input_',
      types: ['dataTable']
    }
  ],
  help: 'Finalizes a chain. Used as a forcing function for casting the end of a chain, probably no reason to call this.',
  fn: function index(args, kblConfig) {
    return args._input_;
  }
});
