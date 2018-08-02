var _ = require('lodash');
var Strand = require('../lib/strand');
var columnMath = require('../lib/column_math');
var dataTableDef = require('../types/data_table');

module.exports = new Strand('subtract', {
  args: [
    {
      name: '_input_',
      types: ['dataTable']
    },
    {
      name: 'col1',
      types: ['number', 'string']
    },
    {
      name: 'col2',
      types: ['number', 'string']
    },
    {
      name: 'dest',
      types: ['string'],
      help: 'The destination field. If not specified the destination will be the dividend field'
    }
  ],
  default_types: ['string', 'number'],
  help: 'Divide one column, or number, by another',
  fn: function subtract(args, kblConfig) {
    return columnMath(
      args._input_,
      [args.col1, args.col2],
      function (col1, col2) {
        return (col1 - col2)
      },
      args.dest
    );
  }
});
