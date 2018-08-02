var _ = require('lodash');
var Type = require('../../lib/type');
var elasticsearch = require('elasticsearch');

module.exports = new Type('null', {
  help: 'null or undefined'
});