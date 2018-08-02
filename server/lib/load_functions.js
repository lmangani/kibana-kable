var _ = require('lodash');
var glob = require('glob');
var path = require('path');
var camel = require('to-camel-case');


module.exports = (function (directory) {
  var types = _.chain(glob.sync(path.resolve(__dirname, '../functions/*.js'))).map(function (file) {
    var typeName = camel(file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.')));
    var typeDef = require(file);

    return [typeName, typeDef];
  }).zipObject().value();

  return types;
}());