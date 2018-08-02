require('./wrappers');
require('ui-select');
require('ui-select/dist/select.css');

const formly = require('angular-formly');
const formlyTemplate = require('angular-formly-templates-bootstrap');
const angular = require('angular');

var app = require('ui/modules').get('apps/kable', [formly, formlyTemplate, 'ui.select']);

app.config(function (formlyConfigProvider) {

  formlyConfigProvider.setType({
    name: 'kblInput',
    extends: 'input',
    wrapper: ['kblInputLabel', 'bootstrapHasError']
  });

  formlyConfigProvider.setType({
    name: 'kblSelect',
    extends: 'select',
    wrapper: ['kblInputLabel', 'bootstrapHasError']
  });

  formlyConfigProvider.setType({
    name: 'kblCheckbox',
    extends: 'checkbox',
    template: `
    <div>
      <label>
        {{to.label}}
      </label>
      <div>
        <input ng-required="{{to.required}}" ng-disabled="{{to.disabled}}" ng-model="model[options.key]" type="checkbox">
      </div>
    </div>
    `,
    wrapper: ['bootstrapHasError']
  });

  // UI Select types
  formlyConfigProvider.setType({
    name: 'kblSelectSingle',
    extends: 'kblSelect',
    template: `
    <ui-select ng-model="model[options.key]" theme="bootstrap" ng-required="{{to.required}}" ng-disabled="{{to.disabled}}" reset-search-input="false">
      <ui-select-match placeholder="{{to.placeholder}}"> {{$select.selected.name}} </ui-select-match>
      <ui-select-choices group-by="to.groupBy" repeat="option.value as option in to.options | filter: $select.search">
        <div>{{option.name | highlight: $select.search}}</div>
      </ui-select-choices>
    </ui-select>
    `
  });

  formlyConfigProvider.setType({
    name: 'kblSelectMultiple',
    extends: 'kblSelect',
    template: `
    <ui-select multiple ng-model="model[options.key]" theme="bootstrap" ng-required="{{to.required}}" ng-disabled="{{to.disabled}}">
      <ui-select-match placeholder="{{to.placeholder}}">{{$item.name}}</ui-select-match>
      <ui-select-choices repeat="option.value as option in to.options | filter: $select.search">
        <div>{{option.name | highlight: $select.search}}</div>
      </ui-select-choices>
    </ui-select>
    `
  });

});
