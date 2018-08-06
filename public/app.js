import { DocTitleProvider } from 'ui/doc_title';
import { timezoneProvider } from 'ui/vis/lib/timezone';

const moment = require('moment');
const _ = require('lodash');
require('plugins/kable/less/main.less');
require('plugins/kable/components/kable_renderer/kable_renderer');
//require('plugins/kable/directives/textarea_input');

require('plugins/kable/directives/kable_expression_input');
require('plugins/kable/directives/kable_help/kable_help');

require('plugins/kable/directives/panel_config');
require('ui/autoload/all');

const timelionLogo = require('plugins/kable/kable.svg');

document.title = 'Kable - Kibana';

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
    //template: require('plugins/kable/kable.html')
    template: require('plugins/kable/templates/index.html')
  });

app.controller('kableHelloWorld', function ($scope, $http, AppState, Notifier, timefilter, $window, Private, kbnUrl, config, $timeout) {
  
  timefilter.enableAutoRefreshSelector();
  timefilter.enableTimeRangeSelector();
  
  $scope.timefilter = timefilter;

  // Keeping this at app scope allows us to keep the current page when the user
  // switches to say, the timepicker.
  $scope.page = config.get('timelion:showTutorial', true) ? 1 : 0;
  $scope.setPage = (page) => $scope.page = page;

  const notify = new Notifier({location: 'Kable'});

  const timezone = Private(timezoneProvider)();
  // const docTitle = Private(DocTitleProvider);

  $scope.topNavMenu = [
    {
    	key: 'help',
    	description: 'Help',
    	template: '<kable-help></kable-help>',
    	testId: 'kableDocsButton',
    }
  ];

  $scope.panelTypes = panelTypes;
  $scope.state = new AppState({expression: ''});
  $scope.tab = 'vis';

  function init() {
    $scope.$listen($scope.state, 'fetch_with_changes', $scope.run);
    $scope.$listen(timefilter, 'fetch', $scope.run);
    $scope.run();
  }
  
  let refresher;
  $scope.$watchCollection('timefilter.refreshInterval', function (interval) {
    if (refresher) $timeout.cancel(refresher);
    if (interval.value > 0 && !interval.pause) {
      function startRefresh() {
        refresher = $timeout(function () {
          if (!$scope.running) $scope.run();
          startRefresh();
        }, interval.value);
      }
      startRefresh();
    }
  });

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
    $scope.dataTables = _.map($scope.state.panels, function (panel) {
      return $http.post('../api/kable/run', {
        expression: panel.expression,
        time: _.extend(timefilter.time, {
          interval: $scope.state.interval,
          timezone: timezone
        }),
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
