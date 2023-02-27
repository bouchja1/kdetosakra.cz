'use strict';

var _require = require('../constants/tokenizer-contexts'),
    ATTRIBUTES_CONTEXT = _require.ATTRIBUTES_CONTEXT,
    OPEN_TAG_END_CONTEXT = _require.OPEN_TAG_END_CONTEXT,
    ATTRIBUTE_ASSIGNMENT_CONTEXT = _require.ATTRIBUTE_ASSIGNMENT_CONTEXT,
    ATTRIBUTE_KEY_CONTEXT = _require.ATTRIBUTE_KEY_CONTEXT;

var syntaxHandlers = {
  tagEnd: function tagEnd(state, tokens, contextFactories, options) {
    var openTagEndContext = contextFactories[OPEN_TAG_END_CONTEXT](contextFactories, options);

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = openTagEndContext;
  },
  noneWhitespace: function noneWhitespace(state, tokens, contextFactories, options) {
    var attributeKeyContext = contextFactories[ATTRIBUTE_KEY_CONTEXT](contextFactories, options);

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributeKeyContext;
  },
  equal: function equal(state, tokens, contextFactories, options) {
    var attributeAssignmentContext = contextFactories[ATTRIBUTE_ASSIGNMENT_CONTEXT](contextFactories, options);

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributeAssignmentContext;
  }
};

var ATTRIBUTE_KEY_PATTERN = /^\S/;

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '>' || chars === '/') {
    return function (state, tokens) {
      return syntaxHandlers.tagEnd(state, tokens, contextFactories, options);
    };
  }

  if (chars === '=') {
    return function (state, tokens) {
      return syntaxHandlers.equal(state, tokens, contextFactories, options);
    };
  }

  if (ATTRIBUTE_KEY_PATTERN.test(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.noneWhitespace(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function attributesContextFactory(contextFactories, options) {
  return {
    factoryName: ATTRIBUTES_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};