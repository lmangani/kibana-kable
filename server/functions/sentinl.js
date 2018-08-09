var _ = require('lodash');
var Strand = require('../lib/strand');

module.exports = new Strand('sentinl', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'condition',
      types: ['string'],
    },
    {
      name: 'action',
      types: ['string'],
    }
  ],
  help: 'Create watcher',
  fn: function sentinl (args, kblConfig) {
    return null;
  }
});
