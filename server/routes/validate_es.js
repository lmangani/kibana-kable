export default function (server) {
  server.route({
    method: 'GET',
    path: '/api/kable/validate/es',
    handler: function (request, reply) {
      return request.getUiSettingsService().getAll().then((uiSettings) => {
        const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');

        const timefield = ( uiSettings['kable:es.timefield'] || '@timestamp' );

        const body = {
          index: ( uiSettings['es.default_index'] || '_all' ),
          fields: timefield
        };

        callWithRequest(request, 'fieldStats', body).then(function (resp) {
          reply({
            ok: true,
            field: timefield,
            min: resp.indices._all.fields[timefield].min_value,
            max: resp.indices._all.fields[timefield].max_value
          });
        }).catch(function (resp) {
          reply({
            ok: false,
            resp: resp
          });
        });
      });

    }
  });
}
