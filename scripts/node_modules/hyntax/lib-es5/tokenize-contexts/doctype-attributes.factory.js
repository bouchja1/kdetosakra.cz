'use strict';

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace;

var _require2 = require('../constants/tokenizer-contexts'),
    DOCTYPE_ATTRIBUTES_CONTEXT = _require2.DOCTYPE_ATTRIBUTES_CONTEXT,
    DOCTYPE_ATTRIBUTE_WRAPPED_START_CONTEXT = _require2.DOCTYPE_ATTRIBUTE_WRAPPED_START_CONTEXT,
    DOCTYPE_ATTRIBUTE_BARE_CONTEXT = _require2.DOCTYPE_ATTRIBUTE_BARE_CONTEXT,
    DOCTYPE_END_CONTEXT = _require2.DOCTYPE_END_CONTEXT;

var syntaxHandlers = {
  wrapper: function wrapper(state, tokens, contextFactories) {
    var doctypeAttributeWrappedStartContext = contextFactories[DOCTYPE_ATTRIBUTE_WRAPPED_START_CONTEXT](contextFactories, { wrapper: state.decisionBuffer });

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = doctypeAttributeWrappedStartContext;
  },
  bare: function bare(state, tokens, contextFactories) {
    var doctypeAttributeBareStartContext = contextFactories[DOCTYPE_ATTRIBUTE_BARE_CONTEXT](contextFactories);

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = doctypeAttributeBareStartContext;
  },
  closingCornerBrace: function closingCornerBrace(state, tokens, contextFactories) {
    var doctypeEndContext = contextFactories[DOCTYPE_END_CONTEXT](contextFactories);

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = doctypeEndContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '"' || chars === '\'') {
    return function (state, tokens) {
      return syntaxHandlers.wrapper(state, tokens, contextFactories, options);
    };
  }

  if (chars === '>') {
    return function (state, tokens) {
      return syntaxHandlers.closingCornerBrace(state, tokens, contextFactories, options);
    };
  }

  if (!isWhitespace(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.bare(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function doctypeAttributesContextFactory(contextFactories, options) {
  return {
    factoryName: DOCTYPE_ATTRIBUTES_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};