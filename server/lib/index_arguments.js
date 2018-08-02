var _ = require('lodash');

function repositionArguments(functionDef, parserArgs) {
  var orderedArgs = [];

  // We still have named args

  _.each(parserArgs, function (parserArg, i) {
    if (_.isObject(parserArg) && parserArg.type === 'named') {
      var argIndex = _.findIndex(functionDef.args, function (orderedArg) {
        return parserArg.name === orderedArg.name;
      });
      orderedArgs[argIndex] = parserArg.value;
    } else {
      orderedArgs[i] = parserArg;
    }
  });

  // Named args are gone now. Let's index stuff

  return orderedArgs;
};

function indexArguments(functionDef, orderedArgs) {

  var indexedArgs = {};
  var argumentsDef = functionDef.args;

  _.each(orderedArgs, function (unorderedArg, i) {
    if (!argumentsDef[i]) throw new Error ('Unknown argument #' + i + ' supplied to ' + functionDef.name);

    indexedArgs[argumentsDef[i].name] = unorderedArg;
  });

  return indexedArgs;
};


module.exports = function (functionDef, parserArgs) {
  var orderedArgs = repositionArguments(functionDef, parserArgs);
  var indexedArgs = indexArguments(functionDef, orderedArgs);

  //indexedArgs.__ordered = orderedArgs;

  return indexedArgs;
}
