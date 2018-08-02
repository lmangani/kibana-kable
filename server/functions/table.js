var _ = require('lodash');
var Strand = require('../lib/strand');

module.exports = new Strand('table', {
  args: [
    {
      name: '_input_',
      types: ['dataTable']
    },
    {
      name: 'columns',
      types: ['array', 'null']
    },
    {
      name: 'as',
      types: ['array', 'null']
    }
  ],
  help: 'Select columns in a table, and optionally rename them',
  fn: function table(args, kblConfig) {

    var output = args._input_;

    if (args.columns) {
      var oldRows = output.data.rows;
      var newRows = new Array(oldRows.length);
      var oldHeader = output.data.header;
      var newHeader = [];

      _.each(args.columns, function (column, i) {
        var isIndex = !_.isNaN(parseInt(column, 10));

        var index = isIndex ? parseInt(column, 10) : oldHeader.indexOf(column);
        var columnName = isIndex ? oldHeader[index] : column;
        if (index === -1) throw new Error ('Unknown column: ' + column);

        newHeader.push(columnName);

        _.each(oldRows, function (row, i) {
          newRows[i] = newRows[i] || [];
          newRows[i].push(row[index]);
        });
      });

      output.data.rows = newRows;
      output.data.header = newHeader;
    }

    if (args.as) {
      _.each(args.as, function (column, i) {
        output.data.header[i] = column;
      });
    }

    return output;

  }
});
