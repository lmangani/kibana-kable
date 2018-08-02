var _ = require('lodash');
var Promise = require('bluebird');
var Boom = require('boom');
var fs = require('fs');
var path = require('path');

var Parser = require('pegjs').buildParser(fs.readFileSync(path.resolve(__dirname, './search.peg'), 'utf8'));

var operators = {
  lte: '<=',
  lt:  '<',
  eq:  '==',
  gt:  '>',
  gte: '>=',
};

function toQuery(clause, scripts) {
  var query = {};
  var scripts = scripts || {};
  if (clause.type === 'group' || clause.type === 'search') {
    query = toBool(clause.clauses, scripts);
  } else if (scripts[clause.field]) { // Is this a script? We can do this the fast way
    query = scriptToQuery(`${scripts[clause.field]} ${operators[clause.type]} params.param`, clause.value);
  } else {
    if (clause.field) {
      query = scriptToQuery(`doc['${clause.field}'].value.contains(params.param)`, clause.value);
    } else {
      query = {query_string: {query: clause.value, all_fields: true}};
    }
  }

    /*
      if (clause.type === 'eq') {
        _.set(query, `match.${clause.field}`, {query: clause.value, type: "phrase"});
      } else if (_.contains(['lt', 'gt', 'lte', 'gte'], clause.type)) {
        _.set(query, `range.${clause.field}.${clause.type}`, clause.value);
      } else {
        throw 'Unknown operator: ' + clause.type;
      }
      */

  logObj(query);

  return query;
}

function scriptToQuery(script, value) {
  return {
    bool: {
      filter: {
        script: {
          script: {
            inline: script,
            params: {
              param: value
            },
            lang: 'painless'
          }
        }
      }
    }
  };
}


/*
{must_not: [
  {bool:{filter:{script:{}}}}
]}
*/

function toBool(clauses, scripts) {
  return _.reduce(clauses, function (context, clause) {
    context.bool[clause.imperative].push(toQuery(clause, scripts));
    return context;
  }, {bool: {must: [], must_not: [], should: []}});
}

function logObj(obj) {
  console.log(JSON.stringify(obj, null, ' '));
}

module.exports = toQuery;

/*
function run(search) {
  var result = toQuery(search);
  return Promise.resolve(result)
  .catch(function (e) {
    return Promise.reject(Boom.badRequest(e.toString()));
  });
}
function logObj(obj, thing) {
  console.log(JSON.stringify(obj, null, ' '));
}
function dbg(expression) {
  console.log('Expression:', expression);
  var result = run(expression);
  Promise.resolve(result).then(function (result) {
    logObj(result);
  });
}
dbg('+foo:bar -(+stuff -things +baz:moot) lol>10 beer>:200 beer<:100 lolstuff<1.222222')
*/
