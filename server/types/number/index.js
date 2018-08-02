var _ = require('lodash');
var Type = require('../../lib/type');
var elasticsearch = require('elasticsearch');

module.exports = new Type('number', {
  help: 'Any numeric type',
  from: {
    string: function (str) {
      return parseFloat(str);
    },
    dataTable: function (dataTable) {
      if (
        dataTable.data.row.length !== 1 ||
        dataTable.data.header.length !== 1
      ) {
        throw new Error('dataTable must contain exactly 1 row and 1 column to be converted to a number')
      }

      return dataTable.data.rows[0][0];
    }
  }
});
