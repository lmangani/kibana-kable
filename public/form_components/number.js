module.exports = function (arg, config, dataTable) {
  return {
    key: arg.name,
    type: 'kblInput',
    className: 'col-sm-' + (arg.span || 12),
    templateOptions: {
      inputType: 'number',
      label: arg.label || arg.name,
      description: arg.help,
      span: arg.span
    }
  };
};
