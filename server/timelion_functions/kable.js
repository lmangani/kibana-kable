var Datasource = require('../../../src/core_plugins/timelion/server/lib/classes/datasource')
var _ = require('lodash')
import moment from 'moment';

var template = {
    type: 'seriesList',
      list: [{
        data: [],
        type: 'series',
        label: 'kable_ts'
      }]
};

var toSeriesList = function(dataTable){
  var series = template;
  if (!dataTable && !dataTable.data && !dataTable.data.header) {
	console.log('no data!',dataTable)
	return series;
  }
  var headers = dataTable.data.header;
  var t0 = _.findIndex(headers, function(item) { return item.startsWith('time_');});  
  var rows = dataTable.data.rows;
  series.list[0].data = _.compact(_.map(rows, function (pair, count) {
	if (!pair[t0] && !pair[t0+2] ) return;
        return [ pair[t0], pair[t0+2] ]
  }));
  series.list[0].label = headers[t0+2]
  return series;
}

module.exports = new Datasource('kable', {
  args: [
    {
      name: 'expression',
      types: ['string'],
      help: 'Kable Expression with timeseries',
      suggestions: [
        {
          name: '.index(_all).timeseries(field=@timestamp,interval=5m)',
          help: 'Count Histogram',
        }
      ]
    }
  ],
  help: 'Pull data from Kable Expressions.',

  fn: function kableFn (args, tlConfig) {  
	  
        var config = _.defaults(args.byName, {
          deviceId: 1,
          chartId: 1000,
          label: "Data from Kable Timeseries Expression"
        })
  
        var expression = config.expression;
        if(!expression) throw 'missing expression!';
  
        var query = { expression: expression, time: tlConfig.time };
        return tlConfig.server.inject({
	       	method: 'POST',
	       	url: '/api/kable/run',
	       	headers: {
	       	  'kbn-xsrf': 'anything',
	       	  'Content-Type': 'application/json',
	       	  'Accept': 'application/json, text/plain, */*'
	       	},  
	       	payload: query
        })
	.then(function (resp) {
	      return toSeriesList(resp.result);
        }).catch(function (e) {
	      throw e;
        });

  }

})
