var _ = require('lodash');
var Type = require('../../lib/type');

module.exports = new Type('array', {
  help: 'A simple array of arrays representing retrieved data',
  from: {
    // If there is no expression
    string: function (inputString) {
      return _.map(inputString.split(','), function (elem) {
        return  elem.trim();
      });
    },
    number: function (inputNumber) {
      console.log('castings');
      return [inputNumber];
    }
  }
});
