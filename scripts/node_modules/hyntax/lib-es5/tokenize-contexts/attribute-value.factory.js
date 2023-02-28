'use strict';

var _require = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_VALUE_CONTEXT = _require.ATTRIBUTE_VALUE_CONTEXT,
    ATTRIBUTES_CONTEXT = _require.ATTRIBUTES_CONTEXT,
    ATTRIBUTE_VALUE_WRAPPED_START_CONTEXT = _require.ATTRIBUTE_VALUE_WRAPPED_START_CONTEXT,
    ATTRIBUTE_VALUE_BARE_CONTEXT = _require.ATTRIBUTE_VALUE_BARE_CONTEXT;

var syntaxHandlers = {
  wrapper: function wrapper(state, tokens, contextFactories, options) {
    var attributeValueWrappedStartContext = contextFactories[ATTRIBUTE_VALUE_WRAPPED_START_CONTEXT](contextFactories, Object.assign({}, options, { wrapper: state.decisionBuffer }));

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributeValueWrappedStartContext;
  },
  bare: function bare(state, tokens, contextFactories, options) {
    var attributeValueBareContext = contextFactories[ATTRIBUTE_VALUE_BARE_CONTEXT](contextFactories, options);

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributeValueBareContext;
  },
  tagEnd: function tagEnd(state, tokens, contextFactories, options) {
    var attributesContext = contextFactories[ATTRIBUTES_CONTEXT](contextFactories, options);

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributesContext;
  }
};

var BARE_VALUE_PATTERN = /\S/;

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '"' || chars === '\'') {
    return function (state, tokens) {
      return syntaxHandlers.wrapper(state, tokens, contextFactories, options);
    };
  }

  if (chars === '>' || chars === '/') {
    return function (state, tokens) {
      return syntaxHandlers.tagEnd(state, tokens, contextFactories, options);
    };
  }

  if (BARE_VALUE_PATTERN.test(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.bare(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function attributeValueContextFactory(contextFactories, options) {
  return {
    factoryName: ATTRIBUTE_VALUE_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};