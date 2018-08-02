const _ = require('lodash');
const Type = require('../../lib/type');
const searchRequest = require('../search_request');

module.exports = new Type('dataTable', {
  help: 'A simple array of arrays representing retrieved data',
  methods: {
    getColumn: function (dataTable, name) {
      const index = dataTable.data.header.indexOf(name);
      if (index === -1) throw new Error ('Unknown column: ' + name);

      return _.map(dataTable.data.rows, index);
    },
    addColumn: function (dataTable, name, column) {
      if (column.length !== dataTable.data.rows.length) throw new Error ('All columns must be of equal length');

      // So this is cool. _.zip.apply basically toggles between a row structure and a column structure.
      const columns = _.zip.apply(this, dataTable.data.rows);

      const index = dataTable.data.header.indexOf(name);
      if (index < 0) {
        columns.push(column);
        dataTable.data.header.push(name);
      } else {
        columns[index] = column;
      }

      // BLAM, back to rows!
      dataTable.data.rows = _.zip.apply(this, columns);
      return dataTable;
    },
    addRow: function (dataTable, row) {
      if (row.length !== dataTable.data.header.length) throw new Error ('All rows must be of equal length');
      dataTable.data.rows.push(row);

      return dataTable;
    }

  },
  from: {
    // If there is no expression
    null: function () {
      const request = searchRequest.from.null();
      return searchRequest.to.dataTable(request);
    }
  }
});
