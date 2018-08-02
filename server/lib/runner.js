const _ = require('lodash');
const Promise = require('bluebird');
const Boom = require('boom');
const fs = require('fs');
const path = require('path');

const Parser = require('pegjs').buildParser(fs.readFileSync(path.resolve(__dirname, './kable.peg'), 'utf8'));
const argType = require('./arg_type');
const types = require('../types');
const castingProvider = require('./cast');
const functions = require('./load_functions');
const indexArguments = require('./index_arguments');

module.exports = function (kblConfig) {
  // Invokes a modifier function, resolving arguments into series as needed
  function invoke(fnName, args) {
    const functionDef = functions[fnName];
    if (!functionDef) throw new Error ('Unknown function: ' + fnName);

    // Make the arguments to the function into an object
    args = indexArguments(functions[fnName], args);

    // Resolve any chains down to their resolved types
    args = _.mapValues(args, function (arg, name) {
      // If you want multiple item.types, add a switch here with the handling
      if (argType(arg) === 'chain') {
        return invokeChain(arg);
      } else {
        return arg;
      }
    });

    // Cast arguments to required types as needed
    args = Promise.props(args)
    .then(function (args) {

      // Validate and cast arguments, the piped object is available as _pipe_
      return _.mapValues(args, function (arg, name) {
        // Arguments must be defined on the function, or the function must supply a "_default_" argument
        const argDef = functionDef.args.byName[name] || functionDef.args.byName._default_;

        if (!argDef) throw 'Unknown argument "' + name + '" supplied to ' + fnName;

        const cast = castingProvider(types, kblConfig);

        try {
          return cast(arg, argDef.types);
        } catch (e) {
          throw e;
          // + '" as "' + name + '" supplied to ' + fnName
        }
      });
    });

    // Finally pass the arguments to the function
    args = Promise.props(args)
    .then(function (args) {
      return functionDef.fn(args, kblConfig);
    });

    return args;
  }

  function invokeChain(chainObj, result) {
    if (chainObj.chain.length === 0) return invoke('finalize', [result]);

    const chain = _.clone(chainObj.chain);
    const link = chain.shift();

    const args = link.arguments || {};
    args.unshift(result || {type: 'null', value: null});


    const promise = invoke(link.function, args);
    return promise.then(function (result) {
      return invokeChain({type:'chain', chain: chain}, result);
    });
  }

  return function run(payload) {
    let result;

    const expression = payload.expression;

    if (expression && expression.trim().length) {
      const chain = Parser.parse(expression);
      result = invokeChain(chain);
    } else {
      result = {type: 'null', value: null};
    }

    return Promise.resolve(result)
    .catch(function (e) {
      return Promise.reject(Boom.badRequest(e.toString()));
    });
  };
};

function logObj(obj, thing) {
  console.log(JSON.stringify(obj, null, ' '));
}

/*
function dbg(expression) {
  console.log(expression);
  var result = run(expression);
  Promise.resolve(result).then(function (result) {
    logObj(result);
  });
}
*/

//dbg('index=usagov* | top=geo.country_code count=2 | metric avg=bytes | top=geo.region count=2 | metric avg=bytes');
//dbg('.index(relay*).top(relay_actor, count=0)');

//module.exports = dbg
