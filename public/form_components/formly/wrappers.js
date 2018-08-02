require('ui-select');
require('angular');

var app = require('ui/modules').get('apps/kable', [
  require('angular-formly'),
  require('angular-formly-templates-bootstrap'),
  require('angular-ui-bootstrap'),
  'ui.select'
]);

app.config(function (formlyConfigProvider) {

  formlyConfigProvider.setWrapper({
    name: 'kblInputLabel',
    template: [
      '<label for="{{::id}}">',
        '{{to.label}} {{to.required ? "*" : ""}}',
      '</label>',
      '<formly-transclude></formly-transclude>',
    ].join(' ')
  });

  formlyConfigProvider.setWrapper({
    name: 'kblCheckboxLabel',
    template: [
      '<label for="{{::id}}">',
        '{{to.label}} {{to.required ? "*" : ""}}',
      '</label>',
      '<formly-transclude></formly-transclude>',
    ].join(' ')
  });

});
