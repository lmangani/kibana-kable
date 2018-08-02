var _ = require('lodash');
var Strand = require('../lib/strand');
var getFieldScript = require('../types/search_request').methods.getFieldScript;

module.exports = new Strand('exregex', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'src',
      types: ['string']
    },
    {
      name: 'replace',
      types: ['string'],
    },
    {
      name: 'with',
      types: ['string']
    },
    {
      name: 'dest',
      types: ['string']
    },
  ],
  help: 'Make with the querying',
  fn: function search(args, kblConfig) {
    var output = args._input_;
    var field = getFieldScript(args.src, args._input_);
    output.scripts = output.scripts || {};
    // /^.*\.(.*)\.*\/.*$/
    output.scripts[args.dest] = `${args.replace}.matcher(${field}).replaceAll('${args.with}')`;


    return output;
  }
});
