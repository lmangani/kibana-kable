import processFunctionDefinition from './server/lib/process_function_definition';

var path = require('path');
var _ = require('lodash');

module.exports = function (kibana) {
  return new kibana.Plugin({

    name: 'kable',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      app: {
        title: 'Kable',
        description: 'Weeeeee',
        icon: 'plugins/kable/icon.svg',
        main: 'plugins/kable/app',
        injectVars: function (server, options) {
          var config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            esApiVersion: config.get('elasticsearch.apiVersion'),
            esUrl: config.get('elasticsearch.url')
          };
        }
      },
      home: [
        'plugins/kable/register_feature'
      ],
      uiSettingDefaults: {
        'kable:showTutorial': {
          value: false,
          description: 'Should I show the tutorial by default when entering the kable app?'
        },
        'kable:es.timefield': {
          value: '@timestamp',
          description: 'Default field containing a timestamp when using .es()'
        },
        'kable:es.default_index': {
          value: '_all',
          description: 'Default elasticsearch index to search with .es()'
        },
      }
    },

    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init: function (server, options) {
      // Add server routes and initalize the plugin here
      require('./server/routes/run')(server);
      require('./server/routes/functions')(server);
      require('./server/routes/legacy')(server);
      require('./server/routes/validate_es')(server);

 	 const functions = require('./server/lib/load_functions').getFunctions('functions');
 	 const legacy = require('./server/lib/load_functions').getTypes;

 	 function addFunction(func) {
 	   _.assign(functions, processFunctionDefinition(func));
 	 }

 	 function getFunction(name) {
 	   if (!functions[name]) throw new Error ('No such function: ' + name);
 	   return functions[name];
 	 }

 	 server.plugins.kable = {
 	   functions: functions,
	   legacy: legacy,
 	   addFunction: addFunction,
 	   getFunction: getFunction
 	 };

    }

  });
};
