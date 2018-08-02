const moment = require('moment');
const _ = require('lodash');
require('plugins/kable/less/main.less');
require('plugins/kable/components/kable_renderer/kable_renderer');
require('plugins/kable/directives/textarea_input');
require('plugins/kable/directives/panel_config');

require('ui/autoload/all');

const timelionLogo = require('plugins/kable/kable.svg');

require('ui/chrome')
.setBrand({
  'logo': 'url(' + timelionLogo + ') left no-repeat #444',
  'smallLogo': 'url(' + timelionLogo + ') left no-repeat #444'
});

const app = require('ui/modules').get('app/kable', []);

const unsafeNotifications = require('ui/notify')._notifs;
const panelTypes = require('plugins/kable/panels/load');

require('ui/routes').enable();
require('ui/routes')
  .when('/', {
    template: require('plugins/kable/templates/index.html')
  });

app.controller('kableHelloWorld', function ($scope, $http, AppState, Notifier, timefilter, $window) {
  timefilter.enabled = true;
  $scope.timefilter = timefilter;

  const notify = new Notifier({location: 'Kable'});

  $scope.panelTypes = panelTypes;
  $scope.state = new AppState({expression: ''});
  $scope.tab = 'vis';

  function init() {
    $scope.run();
  }

  function getDefaultView() {
    return {
      type: 'table'
    };
  }

  function getDefaultPanel() {
    return {
      expression: '.index(_all)',
      active: 0,
      editing: false,
      views: [
        getDefaultView(),
        {type: 'docs'}
      ]
    };
  }

  $scope.dataTables = [];
  $scope.state = new AppState({panels: [getDefaultPanel()]});

  $scope.addPanel = function () {
    $scope.state.panels.push(getDefaultPanel());
    $scope.run();
  };

  $scope.addView = function (panel) {
    panel.views.push(getDefaultView());
    panel.active = panel.views.length - 1;
    $scope.state.save();
  };

  $scope.removePanel = function (index) {
    $scope.state.panels.splice(index, 1);
    $scope.dataTables.splice(index, 1);
    $scope.state.save();
  };

  $scope.removeView = function (panel, index) {
    if (index === panel.active) panel.active = 0;
    panel.views.splice(index, 1);
    $scope.state.save();
  };


  $scope.run = function () {
    $scope.state.save();
    const timefilterBounds = $scope.timefilter.getBounds();
    $scope.dataTables = _.map($scope.state.panels, function (panel) {
      return $http.post('../api/kable/run', {
        expression: panel.expression,
        time: {
          from: timefilterBounds.min.valueOf(),
          to: timefilterBounds.max.valueOf()
        }
      }).then(function (resp) {
        return resp.data;
        dismissNotifications();
      }).catch(function (err) {
        console.log(err);
        notify.error(err);
        return {};
      });
    });
  };

  $scope.$listen(timefilter, 'fetch', $scope.run);

  function dismissNotifications() {
    unsafeNotifications.splice(0, unsafeNotifications.length);
  }

  init();
});
