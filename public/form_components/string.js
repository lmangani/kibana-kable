module.exports = function (arg, config, dataTable) {
  return {
    key: arg.name,
    type: 'kblInput',
    className: 'col-sm-' + (arg.span || 12),
    templateOptions: {
      inputType: 'text',
      label: arg.label || arg.name,
      placeholder: arg.help,
      span: arg.span
    }
  };
};
