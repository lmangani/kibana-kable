import template from './kable_expression_suggestions.html';

const app = require('ui/modules').get('apps/kable', []);

app.directive('kableExpressionSuggestions', () => {
  return {
    restrict: 'E',
    scope: {
      suggestions: '=',
      suggestionsType: '=',
      selectedIndex: '=',
      onClickSuggestion: '&',
      shouldPopover: '=',
    },
    replace: true,
    template,
    link: function (scope) {
      // This will prevent the expression input from losing focus.
      scope.onMouseDown = e => e.preventDefault();
    }
  };
});
