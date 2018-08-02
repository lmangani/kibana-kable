module.exports = function(column, rows, columns) {
  var index = columns.indexOf(column);
  if (index === -1) throw new Error ('Unknown column: ' + column);

  return _.map(rows, index);
}
