'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_VALUE_WRAPPER_START = _require2.TOKEN_ATTRIBUTE_VALUE_WRAPPER_START;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_VALUE_WRAPPED_START_CONTEXT = _require3.ATTRIBUTE_VALUE_WRAPPED_START_CONTEXT,
    ATTRIBUTE_VALUE_WRAPPED_CONTEXT = _require3.ATTRIBUTE_VALUE_WRAPPED_CONTEXT;

var syntaxHandlers = {
  wrapper: function wrapper(state, tokens, contextFactories, options) {
    var attributeValueWrappedContext = contextFactories[ATTRIBUTE_VALUE_WRAPPED_CONTEXT](contextFactories, options);
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });

    tokens.push({
      type: TOKEN_ATTRIBUTE_VALUE_WRAPPER_START,
      content: state.decisionBuffer,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.decisionBuffer = '';
    state.currentContext = attributeValueWrappedContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === options.wrapper) {
    return function (state, tokens) {
      return syntaxHandlers.wrapper(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function attributeValueWrappedStartContextFactory(contextFactories, options) {
  return {
    factoryName: ATTRIBUTE_VALUE_WRAPPED_START_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};