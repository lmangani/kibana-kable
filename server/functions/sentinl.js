var _ = require('lodash');
var Strand = require('../lib/strand');

module.exports = new Strand('sentinl', {
  args: [
    {
      name: 'title',
      types: ['string'],
    },
    {
      name: 'condition',
      types: ['string'],
    },
    {
      name: 'actions',
      types: ['string'],
    },
    {
      name: 'trigger',
      types: ['string'],
    }
  ],
  help: 'Create watcher',
  fn: function sentinl (args, kblConfig) {
    return null;
  }
});
