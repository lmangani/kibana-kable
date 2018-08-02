module.exports = function (arg, config, dataTable) {

  var options = _.map(dataTable.data.header, function (header) {
    return {
      name: header,
      value: header
    }
  });

  return {
    key: arg.name,
    type: 'kblSelectSingle',
    className: 'col-sm-' + (arg.span || 12),
    templateOptions: {
      optionsAttr: 'formly-options',
      label: arg.label || arg.name,
      description: arg.help,
      options: options,
      span: arg.span
    }
  };
};
