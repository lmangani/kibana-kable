// Insert either a `field` key, or a `script` key to an aggregation or filter/query
// This should be used every time a field is passed, otherwise you may miss out on
const _ = require('lodash');
const getFieldScript = require('./get_field_script');
module.exports = function (field, obj, searchRequest) {
  /*
  const result = {
    field: field
  };
  */

  const result = {
    script: {
      lang: 'painless',
      inline: getFieldScript(field, searchRequest)
    }
  };

  _.merge(result, obj);
  return result;
};
