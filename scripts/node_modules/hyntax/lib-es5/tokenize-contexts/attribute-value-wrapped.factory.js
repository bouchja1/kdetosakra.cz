'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_VALUE = _require2.TOKEN_ATTRIBUTE_VALUE;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_VALUE_WRAPPED_CONTEXT = _require3.ATTRIBUTE_VALUE_WRAPPED_CONTEXT,
    ATTRIBUTE_VALUE_WRAPPED_END_CONTEXT = _require3.ATTRIBUTE_VALUE_WRAPPED_END_CONTEXT;

var syntaxHandlers = {
  wrapper: function wrapper(state, tokens, contextFactories, options) {
    var attributeValueWrappedEndContext = contextFactories[ATTRIBUTE_VALUE_WRAPPED_END_CONTEXT](contextFactories, options);
    var range = calculateTokenCharactersRange(state, { keepBuffer: false });

    tokens.push({
      type: TOKEN_ATTRIBUTE_VALUE,
      content: state.accumulatedContent,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributeValueWrappedEndContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === options.wrapper) {
    return function (state, tokens) {
      return syntaxHandlers.wrapper(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function attributeValueWrappedContextFactory(contextFactories, options) {
  return {
    factoryName: ATTRIBUTE_VALUE_WRAPPED_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};