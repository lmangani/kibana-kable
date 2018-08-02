import $ from 'ui/flot-charts';

var Panel = require('plugins/kable/panels/panel');
var getColumn = require('plugins/kable/lib/get_column');

var _ = require('lodash');
//var $ = require('jquery');

module.exports = new Panel('pies', {
  help: 'Draw a timeseries chart',
  args: [
    {
      name: 'labels',
      type: 'column',
      required: true,
      help: 'The column containing your labels'
    },
    {
      name: 'values',
      type: 'column',
      required: true,
      help: 'The column with the values you want to plot'
    }
  ],
  render: function piesPanel() {
    return function ($scope, $elem, dataTable, config) {
      console.log('loaded chart');
      var defaultOptions = {
        series: {
          pie: {
            show: true
          }
        },
        colors: [
          '#6eadc1',
          '#57c17b',
          '#6f87d8',
          '#663db8',
          '#bc52bc',
          '#9e3533',
          '#daa05d'
        ],
      };

      function drawPlot() {
        if (!config.labels || !config.values || !dataTable) {
          $elem.text('Hey schmo, I need both some labels and some values, also some data. Bum.');
          return;
        }

        var rows = dataTable.data.rows;
        var columns = dataTable.data.header;



        /*
        var grouped;
        if (config.color && config.color.length) {
          grouped = _.groupBy(rows, function (row) {
            return _.chain(config.color)
            .map(function (color) {return columns.indexOf(color);})
            .map(function (index) {return row[index];})
            .values().join('::')
          });
        } else {
          grouped = {
            _all: rows
          };
        }

        var data = _.flatten(_.map(grouped, function (rows, label) {
          return _.map(config.yaxis, function (column) {
            var timestamps = getColumn(config.xaxis, rows, columns);
            var values = getColumn(column, rows, columns);

            return {
              label: `${label}::${column}`,
              data: _.zip(timestamps, values),
              shadowSize: 0
            };
          })
        }));
        */

        var tuples = _.zip(
          getColumn(config.labels, rows, columns),
          getColumn(config.values, rows, columns));

        var data = _.map(tuples, function (slice) {
          return {label: slice[0], data: slice[1]};
        });

        $elem.height($elem.parent().parent().height());
        $scope.plot = $.plot($elem, data, defaultOptions);
      }

      $(window).resize(function () {
        drawPlot();
      });

      $scope.$on('$destroy', function () {
        $(window).off('resize'); //remove the handler added earlier
      });

      drawPlot();

    }
  }
});
