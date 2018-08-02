var _ = require('lodash');
var Type = require('../../lib/type');
var to
var elasticsearch = require('elasticsearch');

module.exports = new Type('search', {
  help: 'An abstract of boolean clauses, easily transformed into an Elasticsearch boolean query'
});
