var _ = require('lodash');
var Strand = require('../lib/strand');
var getFieldScript = require('../types/search_request').methods.getFieldScript;

module.exports = new Strand('exsplit', {
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
      name: 'seperator',
      types: ['string'],
    },
    {
      name: 'index',
      types: ['number']
    },
    {
      name: 'dest',
      types: ['string']
    },
  ],
  help: 'Split a field at a delimiter',
  fn: function exsplit (args, kblConfig) {

    // TODO
    var output = args._input_;
    var field = getFieldScript(args.src, args._input_);
    output.scripts = output.scripts || {};
    output.scripts[args.dest] = `(Collections.list(new StringTokenizer(${field},'${args.seperator}'))[${args.index}])`;


    return output;
  }
});
