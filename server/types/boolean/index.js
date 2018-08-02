var _ = require('lodash');
var Type = require('../../lib/type');
var elasticsearch = require('elasticsearch');

module.exports = new Type('boolean', {
  help: 'true or false'
});