var _ = require('lodash');
var Type = require('../../lib/type');
var elasticsearch = require('elasticsearch');

module.exports = new Type('string', {
  help: 'Some letters strung together. Words and such',
  to: {
    stringList: function (str) {
      return str.split(',').map(function (trimmable) {
        return trimmable.trim();
      });
    },
    numberList: function (str) {
      return str.split(',').map(function (trimmable) {
        return parseFloat(trimmable.trim());
      });
    }
  }
});
