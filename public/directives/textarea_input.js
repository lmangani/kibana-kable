import _ from 'lodash';
import $ from 'jquery';
import PEG from 'pegjs';

import grammar from 'raw-loader!../chain.peg';
import './kable_expression_suggestions/kable_expression_suggestions';
import kableExpressionInputTemplate from './kable_expression_input.html';
import {
  SUGGESTION_TYPE,
  Suggestions,
  suggest,
  insertAtLocation,
} from './kable_expression_input_helpers';
import { comboBoxKeyCodes } from '@elastic/eui';
import { ArgValueSuggestionsProvider } from './kable_expression_suggestions/arg_value_suggestions';

const Parser = PEG.buildParser(grammar);

var app = require('ui/modules').get('apps/kable', []);

/*
app.directive('textareaInput', function ($compile, Private, $rootScope, $document, $http, $interval, $timeout) {
  return {
    restrict: 'C',
    link: function ($scope, $elem, attrs) {
      console.log('bind');
      // lol[0].scrollHeight
      $elem.on('keydown', function (e) {
        // $elem.height($elem[0].scrollHeight - 10);

        if (e.keyCode !== 13) return;
        $elem.submit();
        e.preventDefault();
      })
    }
  };
});

*/

app.directive('timelionExpressionInput', function ($document, $http, $interval, $timeout, Private, $compile) {
  return {
    restrict: 'E',
    scope: {
      rows: '=',
      sheet: '=',
      updateChart: '&',
      shouldPopoverSuggestions: '@',
    },
    replace: true,
    template: kableExpressionInputTemplate,
    link: function (scope, elem) {
      const argValueSuggestions = Private(ArgValueSuggestionsProvider);
      const expressionInput = elem.find('[data-expression-input]');
      const functionReference = {};
      let suggestibleFunctionLocation = {};

      scope.suggestions = new Suggestions();

      function init() {
        $http.get('../api/kable/functions').then(function (resp) {
          Object.assign(functionReference, {
            byName: _.indexBy(resp.data, 'name'),
            list: resp.data,
          });
        });
      }

      function setCaretOffset(caretOffset) {
        // Wait for Angular to update the input with the new expression and *then* we can set
        // the caret position.
        $timeout(() => {
          expressionInput.focus();
          expressionInput[0].selectionStart = expressionInput[0].selectionEnd = caretOffset;
          scope.$apply();
        }, 0);
      }

      function insertSuggestionIntoExpression(suggestionIndex) {
        if (scope.suggestions.isEmpty()) {
          return;
        }

        const { min, max } = suggestibleFunctionLocation;
        let insertedValue;
        let insertPositionMinOffset = 0;

        switch (scope.suggestions.type) {
          case SUGGESTION_TYPE.FUNCTIONS: {
            // Position the caret inside of the function parentheses.
            insertedValue = `${scope.suggestions.list[suggestionIndex].name}()`;

            // min advanced one to not replace function '.'
            insertPositionMinOffset = 1;
            break;
          }
          case SUGGESTION_TYPE.ARGUMENTS: {
            // Position the caret after the '='
            insertedValue = `${scope.suggestions.list[suggestionIndex].name}=`;
            break;
          }
          case SUGGESTION_TYPE.ARGUMENT_VALUE: {
            // Position the caret after the argument value
            insertedValue = `${scope.suggestions.list[suggestionIndex].name}`;
            break;
          }
        }

        const updatedExpression = insertAtLocation(insertedValue, scope.sheet, min + insertPositionMinOffset, max);
        scope.sheet = updatedExpression;

        const newCaretOffset = min + insertedValue.length;
        setCaretOffset(newCaretOffset);
      }

      function scrollToSuggestionAt(index) {
        // We don't cache these because the list changes based on user input.
        const suggestionsList = $('[data-suggestions-list]');
        const suggestionListItem = $('[data-suggestion-list-item]')[index];
        // Scroll to the position of the item relative to the list, not to the window.
        suggestionsList.scrollTop(suggestionListItem.offsetTop - suggestionsList[0].offsetTop);
      }

      function getCursorPosition() {
        if (expressionInput.length) {
          return expressionInput[0].selectionStart;
        }
        return null;
      }

      async function getSuggestions() {
        const suggestions = await suggest(
          scope.sheet,
          functionReference.list,
          Parser,
          getCursorPosition(),
          argValueSuggestions
        );

        // We're using ES6 Promises, not $q, so we have to wrap this in $apply.
        scope.$apply(() => {
          if (suggestions) {
            scope.suggestions.setList(suggestions.list, suggestions.type);
            scope.suggestions.show();
            suggestibleFunctionLocation = suggestions.location;
            $timeout(() => {
              const suggestionsList = $('[data-suggestions-list]');
              suggestionsList.scrollTop(0);
            }, 0);
            return;
          }

          suggestibleFunctionLocation = undefined;
          scope.suggestions.reset();
        });
      }

      function isNavigationalKey(keyCode) {
        const keyCodes = _.values(comboBoxKeyCodes);
        return keyCodes.includes(keyCode);
      }

      scope.onFocusInput = () => {
        // Wait for the caret position of the input to update and then we can get suggestions
        // (which depends on the caret position).
        $timeout(getSuggestions, 0);
      };

      scope.onBlurInput = () => {
        scope.suggestions.hide();
      };

      scope.onKeyDownInput = e => {
        // If we've pressed any non-navigational keys, then the user has typed something and we
        // can exit early without doing any navigation. The keyup handler will pull up suggestions.
        if (!isNavigationalKey(e.keyCode)) {
          return;
        }

        switch (e.keyCode) {
          case comboBoxKeyCodes.UP:
            if (scope.suggestions.isVisible) {
              // Up and down keys navigate through suggestions.
              e.preventDefault();
              scope.suggestions.stepForward();
              scrollToSuggestionAt(scope.suggestions.index);
            }
            break;

          case comboBoxKeyCodes.DOWN:
            if (scope.suggestions.isVisible) {
              // Up and down keys navigate through suggestions.
              e.preventDefault();
              scope.suggestions.stepBackward();
              scrollToSuggestionAt(scope.suggestions.index);
            }
            break;

          case comboBoxKeyCodes.TAB:
            // If there are no suggestions or none is selected, the user tabs to the next input.
            if (scope.suggestions.isEmpty() || scope.suggestions.index < 0) {
              // Before letting the tab be handled to focus the next element
              // we need to hide the suggestions, otherwise it will focus these
              // instead of the time interval select.
              scope.suggestions.hide();
              return;
            }

            // If we have suggestions, complete the selected one.
            e.preventDefault();
            insertSuggestionIntoExpression(scope.suggestions.index);
            break;

          case comboBoxKeyCodes.ENTER:
            if (e.metaKey || e.ctrlKey) {
              // Re-render the chart when the user hits CMD+ENTER.
              e.preventDefault();
              scope.updateChart();
	      elem.submit();
            } else if (!scope.suggestions.isEmpty()) {
              // If the suggestions are open, complete the expression with the suggestion.
              e.preventDefault();
              insertSuggestionIntoExpression(scope.suggestions.index);
            }
            break;

          case comboBoxKeyCodes.ESCAPE:
            e.preventDefault();
            scope.suggestions.hide();
            break;
        }
      };

      scope.onKeyUpInput = e => {
        // If the user isn't navigating, then we should update the suggestions based on their input.
        if (!isNavigationalKey(e.keyCode)) {
          getSuggestions();
        }
      };

      scope.onClickExpression = () => {
        getSuggestions();
      };

      scope.onClickSuggestion = index => {
        insertSuggestionIntoExpression(index);
      };

      scope.getActiveSuggestionId = () => {
        if(scope.suggestions.isVisible && scope.suggestions.index > -1) {
          return `kableSuggestion${scope.suggestions.index}`;
        }
        return '';
      };

      init();
    }
  };
});
