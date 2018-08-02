var _ = require('lodash');
var $ = require('jquery');

var app = require('ui/modules').get('apps/timelion', []);
var panelTypes = require('plugins/kable/panels/load');
var template = require('./kable_renderer.html');

app.directive('kableRenderer', function ($compile, Private, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      dataPromise: '=rendererData',
      config: '=rendererConfig',
    },
    template: template,
    link: function ($scope, $elem) {

      var panelScope = $rootScope.$new();

      function render () {
        var visContainer = $('.kable-vis', $elem);

        panelScope.$destroy();

        if (!$scope.dataPromise) return;
        if (!$scope.config.type) return;

        panelScope = $rootScope.$new();

        var renderFn = panelTypes[$scope.config.type].render;

        $scope.dataPromise.then(function (dataObj) {
          visContainer.empty();
          Private(renderFn)(panelScope, visContainer, dataObj, $scope.config);
        });
      }

      $scope.$watchCollection('config', render);
      $scope.$watch('dataPromise', render);
    }
  };
});
