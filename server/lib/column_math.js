var _ = require('lodash');
var dataTableDef = require('../types/data_table');

function combineColumns (dataTable, columns, fn) {
  var columns = _.map(columns, function (col) {
    if (typeof col == 'string') return dataTableDef.methods.getColumn(dataTable, col);
    if (typeof col == 'number') return _.fill(Array(dataTable.data.rows.length), col);
    throw new Error ('Unknown column type passed to combineColumns');
  })

  var rows = _.zip.apply(this, columns);

  return _.map(rows, function (row) {
    var initial = row.shift();
    return _.reduce(row, fn, initial);
  })
}

module.exports = function (dataTable, columns, fn, dest) {
  var newColumn = combineColumns(dataTable, columns, fn);

  return dataTableDef.methods.addColumn(dataTable, (dest || columns[0]), newColumn);
}
