'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START = _require2.TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_ATTRIBUTE_WRAPPED_START_CONTEXT = _require3.DOCTYPE_ATTRIBUTE_WRAPPED_START_CONTEXT,
    DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT = _require3.DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT;

var syntaxHandlers = {
  wrapper: function wrapper(state, tokens, contextFactories, options) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });
    var doctypeAttributeWrappedContext = contextFactories[DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT](contextFactories, options);

    tokens.push({
      type: TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START,
      content: state.decisionBuffer,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.decisionBuffer = '';
    state.currentContext = doctypeAttributeWrappedContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === options.wrapper) {
    return function (state, tokens) {
      return syntaxHandlers.wrapper(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function doctypeAttributeWrappedStartContextFactory(contextFactories, options) {
  return {
    factoryName: DOCTYPE_ATTRIBUTE_WRAPPED_START_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};