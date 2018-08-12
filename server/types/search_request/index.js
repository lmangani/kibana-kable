var _ = require('lodash');
var Type = require('../../lib/type');
var flatten = require('../../lib/flatten');
var flattenHit = require('../../lib/flatten_hit');

/*
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://admin:notsecure@localhost:9200',
  requestTimeout: 300000
});
*/

module.exports = new Type('searchRequest', {
  help: 'An unexecuted Elasticsearch request',
  methods: {
    getFieldScript: require('./lib/get_field_script'),
    appendDslField: require('./lib/append_dsl_field'),
    addAgg: require('./lib/add_agg')
  },
  from: {
    null: function (emptyObj) {
      // Gee, we're converting from empty, THRILLING.
      // Not much to do here but return our skeleton
      return {
        type: 'searchRequest', // Maybe the type class should handle appending this?
        aggs: {},
        query: {
          bool: {
            must: [],
            must_not: [],
            should: []
          }
        },
        request: {
          index: '_all'
        }
      };
    }
  },
  to: {
    dataTable: function (searchRequest, kblConfig) {

      //console.log(searchRequest.scripts);

      this.elasticRequest = kblConfig.server.plugins.elasticsearch.getCluster('data');
      var request = searchRequest.request;
      request.body = {
        size: searchRequest.docs || 10,
        query: searchRequest.query,
        aggs: searchRequest.aggs,
        stored_fields: ['_source'],
        script_fields: _.mapValues(searchRequest.scripts, (script, name) => {
          return {
            script: {
              lang: 'painless',
              source: script
            }
          };
        })
      };

      if (searchRequest.timefield) {
        var wrapper = {bool:{filter:{range:{}}}};
        wrapper.bool.filter.range[searchRequest.timefield] = {lte: kblConfig.request.time.to, gte: kblConfig.request.time.from};
        wrapper.bool.must = searchRequest.query;
        request.body.query = wrapper;
      }

      console.log(JSON.stringify(request.body, null, ' '));

//    return client.search(request)
      return this.elasticRequest.callWithInternalUser('search', request)
      .then(function (resp) {
        //console.log(JSON.stringify(resp, null, ' '));
        var data = resp.aggregations ? flatten(resp.aggregations) : {header: ['_all'], rows: [[resp.hits.total]]};

        //console.log(JSON.stringify(resp.hits, null, ' '));

        return {
          type: 'dataTable',
          _panel: {},
          requestBody: request,
          data: data,
          docs: _.map(resp.hits.hits, flattenHit)
        };
      });
    }
  }
});
