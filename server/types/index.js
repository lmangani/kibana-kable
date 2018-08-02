var _ = require('lodash');
var glob = require('glob');
var path = require('path');
var camel = require('to-camel-case');

module.exports = (function (directory) {
  var types = _.chain(glob.sync(path.resolve(__dirname, './*/index.js'))).map(function (file) {
    var typeDef = require(file);
    return [typeDef.name, typeDef];
  }).zipObject().value();

  return types;
}());