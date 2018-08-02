var _ = require('lodash');
var Strand = require('../lib/strand');
var columnMath = require('../lib/column_math');
var dataTableDef = require('../types/data_table');

module.exports = new Strand('divide', {
  args: [
    {
      name: '_input_',
      types: ['dataTable']
    },
    {
      name: 'dividend',
      types: ['number', 'string']
    },
    {
      name: 'divisor',
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
  fn: function divide(args, kblConfig) {
    return columnMath(
      args._input_,
      [args.dividend, args.divisor],
      function (dividend, divisor) {
        return (dividend / divisor)
      },
      args.dest
    );
  }
});
