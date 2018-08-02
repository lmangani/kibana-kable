module.exports = function (arg, config, dataTable) {
  return {
    key: arg.name,
    type: 'kblCheckbox',
    className: 'col-sm-' + (arg.span || 1),
    defaultValue: arg.default,
    templateOptions: {
      inputType: 'checkbox',
      label: arg.label || arg.name,
      description: arg.help,
      span: arg.span
    }
  };
};
