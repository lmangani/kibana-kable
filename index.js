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

 	 const functions = require('./server/lib/load_functions').getFunctions('functions');

 	 function addFunction(func) {
 	   _.assign(functions, processFunctionDefinition(func));
 	 }

 	 function getFunction(name) {
 	   if (!functions[name]) throw new Error ('No such function: ' + name);
 	   return functions[name];
 	 }

 	 server.plugins.timelion = {
 	   functions: functions,
 	   addFunction: addFunction,
 	   getFunction: getFunction
 	 };

    }

  });
};
