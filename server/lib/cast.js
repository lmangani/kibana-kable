const _ = require('lodash');
const argType = require('./arg_type');

module.exports = function (types, kblConfig) {
  return function (arg, allowedTypes) {
    // The supplied argument types must be defined in ./types
    const suppliedType = argType(arg);
    const suppliedTypeDef = types[suppliedType];


    if (!suppliedTypeDef) throw 'Undefined argument type "' + suppliedType;

    // If the argument accepts this type, simply return the supplied argument value
    if (_.contains(allowedTypes, suppliedType)) return arg;

    let result;
    // Otherwise, try to cast it,
    // Check the supplied type's "to" functions first, followed by the required types' "from" functions
    _.each(allowedTypes, function (allowedType) {
      const allowedTypeDef = types[allowedType];

      if (suppliedTypeDef.to[allowedType]) result = suppliedTypeDef.to[allowedType](arg, kblConfig);
      if (allowedTypeDef.from[suppliedType]) result = allowedTypeDef.from[suppliedType](arg, kblConfig);
    });

    if (_.isUndefined(result)) throw 'Could not cast ' + suppliedType + ' to any of ' + allowedTypes.join(', ');

    return result;
  };
};
