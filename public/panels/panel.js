var _ = require('lodash');
var $ = require('jquery');

module.exports = function Panel (name, config) {

  this.name = name;

  this.help = config.help || '';

  this.accepts = config.accepts || [];

  this.args = config.args || [];

  if (!config.render) throw new Error ('Panel must have a rendering function');

  this.render = config.render || function ($scope, $elem, dataObj) {
    $elem.text('No rendering function found, crapping out some JSON for you...')
    $elem.append('<pre></pre>');
    $('pre', $elem).text(JSON.stringify(dataObj, null, ' '));
  }

};
