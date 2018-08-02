var formComponentContext = require.context('plugins/kable/form_components', true, /js$/);

module.exports = _.chain(formComponentContext.keys())
  .map(function (path) {
    var name = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
    return [name, formComponentContext(path)];
  })
  .zipObject()
  .value();
