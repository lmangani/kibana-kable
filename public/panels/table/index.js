var Panel = require('../panel');
var template = require('./index.html');
require('./index.less');

module.exports = new Panel('table', {
  help: 'Makes a pretty table',
  render: function jsonPanel($compile, $rootScope) {
    return function ($scope, $elem, dataObj) {
      $scope.rowObj = dataObj;
      $elem.html(template);
      $compile($elem)($scope);
    }
  }
});
