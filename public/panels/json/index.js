var Panel = require('../panel');

module.exports = new Panel('json', {
  help: 'Vomits out some JSON',
  args: [
    {name: 'pretty', type: 'string'}
  ],
  render: function jsonPanel($http) {
    return function ($scope, $elem, dataObj) {
    $elem.append('<pre></pre>');
    $('pre', $elem).text(JSON.stringify(dataObj, null, ' '));    }
  }
});
