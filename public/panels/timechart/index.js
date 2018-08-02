import $ from 'ui/flot-charts';

var Panel = require('plugins/kable/panels/panel');
var getColumn = require('plugins/kable/lib/get_column');

var _ = require('lodash');
//var $ = require('jquery');

//require('../flot');

module.exports = new Panel('timechart', {
  help: 'Draw a timeseries chart',
  args: [
    {
      name: 'xaxis',
      type: 'column',
      required: true,
      span: 4,
      help: 'The column containing your timestamps in millis-since-epoch format'
    },
    {
      name: 'yaxis',
      type: 'columns',
      required: true,
      span: 4,
      help: 'The columns whose values you wish to plot'
    },
    {
      name: 'color',
      label: 'Color Split',
      type: 'columns',
      span: 4,
      help: 'Columns with which to create distinct series. Each unique value in this column will be given its own color.'
    },
    {
      name: 'point_size',
      label: 'Point Size',
      type: 'column',
      span: 2,
      help: 'Column describing the size of points to draw'
    },
    {
      name: 'max_size',
      label: 'Max Point Size',
      type: 'number',
      span: 2,
      help: 'Max size of a point in pixels'
    },
    {
      name: 'point_opacity',
      label: 'Point Shade',
      type: 'column',
      span: 2,
      help: 'Column describing the opacity of the point'
    },
    {
      name: 'show_lines',
      label: 'Lines',
      type: 'checkbox',
      default: true,
      span: 2,
      help: 'Show connecting lines'
    }
  ],
  render: function timechartPanel() {
    return function ($scope, $elem, dataTable, config) {
      console.log('loaded chart');

      var defaultOptions = {
        series: {
          lines: {show: config.show_lines}
        },
        xaxis: {
          mode: 'time',
          timezone: 'browser',
          tickLength: 0,
          color: '#ee0',
          font: { size: 13, color: '#666' }
        },
        grid: {
          backgroundColor: '#fff',
          borderWidth: 0,
          borderColor: null,
          margin: 10,
        },
        legend: {position: 'nw'},
        colors: [
          '#6eadc1',
          '#57c17b',
          '#6f87d8',
          '#663db8',
          '#bc52bc',
          '#9e3533',
          '#daa05d'
        ]
      };

      function drawPlot() {
        if (!config.xaxis || !config.yaxis || !dataTable) {
          $elem.text('Hey schmo, I need both xaxis and yaxis. I also need some damn data. Make it happen');
          return;
        }

        var rows = dataTable.data.rows;
        var columns = dataTable.data.header;

        var grouped;
        if (config.color && config.color.length) {
          grouped = _.groupBy(rows, function (row) {
            return _.chain(config.color)
            .map(function (color) {return columns.indexOf(color);})
            .map(function (index) {return row[index];})
            .values().join('::');
          });
        } else {
          grouped = {
            _all: rows
          };
        }

        var data = _.flatten(_.map(grouped, function (rows, label) {
          return _.map(config.yaxis, function (column) {
            var flotColumns = [
              getColumn(config.xaxis, rows, columns),
              getColumn(column, rows, columns),
            ];


            function bubbleProvider(flotColumns) {
              var length = flotColumns[0].length;
              var radii = flotColumns[2] || _.fill(Array(length), 30);
              var fill = flotColumns[3] || _.fill(Array(length), 0);

              var maxRadii = _.max(radii);
              var maxFill = _.max(fill);

              var point = 0;
              return function (ctx, x, y, radius) {
                var radius = radii[point] / maxRadii * (config.max_size || 10);
                var pointFill = (fill[point] / maxFill);

                ctx.arc(x, y, radius, 0, Math.PI * 2, false);
                ctx.globalAlpha = pointFill;
                point++;
              };
            }

            var points;
            if (config.point_size) {
              flotColumns.push(getColumn(config.point_size, rows, columns));
              if (config.point_opacity) flotColumns.push(getColumn(config.point_opacity, rows, columns));

              points = {
                show: true,
                fill: 1,
                fillColor: false,
                symbol: bubbleProvider(flotColumns)};
            }

            return {
              points: points,
              label: `${label}::${column}`,
              data: _.zip.apply(this, flotColumns),
              shadowSize: 0
            };
          });
        }));

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

    };
  }
});
