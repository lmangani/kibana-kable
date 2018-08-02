var Panel = require('../panel');
var template = require('./index.html');
require('./index.less');
require('ui/doc_table/doc_table')

module.exports = new Panel('docs', {
  help: 'Show the docs',
  render: function jsonPanel($compile, $rootScope) {
    return function ($scope, $elem, dataObj) {
      $scope.docs = dataObj.docs;
      $elem.html(template);
      $compile($elem)($scope);
    }
  }
});
