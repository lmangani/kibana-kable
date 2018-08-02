var panelContext = require.context("./", true, /^\.\/[^\/]+\/index\.js$/);
var panels = _.chain(panelContext.keys())
  .map(function (panelPath) { return panelContext(panelPath); })
  .indexBy('name')
  .value();

module.exports = panels;
