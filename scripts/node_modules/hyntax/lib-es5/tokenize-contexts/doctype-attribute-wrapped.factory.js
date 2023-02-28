'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_ATTRIBUTE = _require2.TOKEN_DOCTYPE_ATTRIBUTE;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT = _require3.DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
    DOCTYPE_ATTRIBUTE_WRAPPED_END_CONTEXT = _require3.DOCTYPE_ATTRIBUTE_WRAPPED_END_CONTEXT;

var syntaxHandlers = {
  wrapper: function wrapper(state, tokens, contextFactories, options) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: false });
    var doctypeAttributeWrappedEndContext = contextFactories[DOCTYPE_ATTRIBUTE_WRAPPED_END_CONTEXT](contextFactories, options);

    tokens.push({
      type: TOKEN_DOCTYPE_ATTRIBUTE,
      content: state.accumulatedContent,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = doctypeAttributeWrappedEndContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === options.wrapper) {
    return function (state, tokens) {
      return syntaxHandlers.wrapper(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function doctypeAttributeWrappedContextFactory(contextFactories, options) {
  return {
    factoryName: DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};