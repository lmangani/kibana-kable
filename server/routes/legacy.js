import _ from 'lodash';

export default function (server) {
  server.route({
    method: 'GET',
    path: '/api/kable/legacy',
    handler: function (request, reply) {
      var tmp = { functions: server.plugins.kable.functions, legacy: server.plugins.kable.legacy };
      reply(tmp);
    }
  });
}
