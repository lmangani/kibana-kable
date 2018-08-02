var _ = require('lodash');
var $ = require('jquery');

require('plugins/kable/form_components/formly/types');

var formComponents = require('./load_forms');
var panelTypes = require('plugins/kable/panels/load');

var template = require('./index.html')

var app = require('ui/modules').get('apps/kable', []);

app.directive('kablePanelConfig', function ($window) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      config: '=configConfig',
      dataPromise: '=configData',
    },
    link: function ($scope, $elem, attrs) {
      $scope.panelTypes = panelTypes;

      $scope.form = [];

      $scope.$watchCollection('config', function () {
        if (!$scope.config.type) return;

        var panelArgs = panelTypes[$scope.config.type].args;

        $scope.dataPromise.then(function (data) {
          $scope.form = _.map(panelArgs, function (arg) {
            return formComponents[arg.type](arg, $scope.config, data);
          });
        });
      })

      $scope.download = function (asJS) {
        $scope.dataPromise.then(function (dataTable) {
          var header = _.map(dataTable.data.header, function (column) {
            return `"${column}"`;
          }).join(',');
          var rows = _.map(dataTable.data.rows, function (row) {
            var columns = _.map(row, function (cell) {
              return typeof cell === 'number' ? cell : `"${cell}"`
            })
            return columns.join(',')
          })

          rows.unshift(header);
          var loggable = rows.join(asJS ? '],\n[' : '\n');
          loggable = asJS ? `var data = [\n[${loggable}]\n]` : loggable;

          $window.open('data:text/' + (asJS ? 'plain' : 'csv') + ' ;charset=utf-8,' + encodeURIComponent(loggable));
        });
      };

    }
  };
});
