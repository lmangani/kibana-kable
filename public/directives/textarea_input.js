var _ = require('lodash');
var $ = require('jquery');

var app = require('ui/modules').get('apps/timelion', []);

app.directive('textareaInput', function ($compile, Private, $rootScope) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, attrs) {
      console.log('bind');
      // lol[0].scrollHeight
      $elem.on('keydown', function (e) {
        $elem.height($elem[0].scrollHeight - 10);


        if (e.keyCode !== 13) return;
        $elem.submit();
        e.preventDefault();
      })
    }
  };
});
