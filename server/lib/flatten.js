// search q=* | top=country count=3 | metric avg=bytes | bins=bytes size=250000 | metric avg=bytes

// This should be the value of the named agg in the response, without the agg.
// Eg if you had {myagg: {value:10}}, you would pass this the {value:10}
// Eventually break this out into other files with handlers for each kind of metric agg

var _ = require('lodash');
var flattenHit = require('./flatten_hit');

module.exports = function flatten(obj) {
  var headerComplete;
  var header = [];
  var rows = [];

  function getMetricHandler(aggResult) {
    // Top_hits metric
    if (aggResult.hits) {
      return function (row, val, key) {
        console.log('LOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOL', val.hits.hits[0]._source, key);
        // Flatten source before iterating;
        var hit = flattenHit(_.get(val, 'hits.hits[0]'), []);
        console.log(hit);
        _.each(hit, function (fieldVal, fieldName) {
          if (!headerComplete) addHeader(key);
          row.push(fieldVal);
        });
      };
    // Doc Count metric
    } else if (aggResult.doc_count != null) {
      return function (row, val, key) {
        if (!headerComplete) addHeader(key);
        row.push(val.doc_count);
      };
    // Most single value metrics
    } else { // everything else
      return function (row, val, key) {
        if (!headerComplete) addHeader(key);
        row.push(val.value);
      };
    }
  }

  function appendMetric(row, val, key) {
    var appendFn = getMetricHandler(val);
    appendFn(row, val, key);
  }

  function addHeader(name) {
    var i = 0;
    var originalName = name;
    while (_.contains(header, name)) {
      i++;
      name = originalName + '_' + i;
    }
    header.push(name);
  }

  function processBucketAgg(row, bucketAgg) {
    var sample = bucketAgg.buckets[0];
    if (!sample) return;

    if (!headerComplete) {
      addHeader(bucketAgg.name);
      if (sample.key_as_string) addHeader(bucketAgg.name + '_string');
      addHeader(bucketAgg.name + '_count');
    }

    _.each(bucketAgg.buckets, function (bucket) {
      var newRow = row.slice(0);
      newRow.push(bucket.key);
      if (sample.key_as_string) newRow.push(bucket.key_as_string);
      newRow.push(bucket.doc_count);
      table(bucket, newRow);
    });
  }

  function table(obj, row) {
    row = row || [];

    var bucketAggs = [];
    _.forOwn(obj, function (val, key) {
      if (_.isPlainObject(val)) {
        if (val.buckets) {
          // Its a bucket agg!
          bucketAggs.push({name: key, buckets: val.buckets});
        } else {
          appendMetric(row, val, key);
        }
      }
    });

    if (bucketAggs.length === 0) {
      rows.push(row);
      headerComplete = true;
    } else if (bucketAggs.length === 1) {
      processBucketAgg(row, bucketAggs[0]);
    } else {
      throw new Error ('Can only flatten 1 bucket agg per level');
    }

    return {
      header: header, // This is gross.
      rows: rows
    };
  }
  return table(obj);
};
