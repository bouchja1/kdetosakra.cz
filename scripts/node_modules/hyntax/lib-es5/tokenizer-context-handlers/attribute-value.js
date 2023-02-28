"use strict";

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace;

var _require2 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_VALUE_WRAPPED_CONTEXT = _require2.ATTRIBUTE_VALUE_WRAPPED_CONTEXT,
    ATTRIBUTES_CONTEXT = _require2.ATTRIBUTES_CONTEXT,
    ATTRIBUTE_VALUE_BARE_CONTEXT = _require2.ATTRIBUTE_VALUE_BARE_CONTEXT;

var _require3 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_VALUE_WRAPPER_START = _require3.TOKEN_ATTRIBUTE_VALUE_WRAPPER_START;

function wrapper(state, tokens) {
  var wrapper = state.decisionBuffer;
  tokens.push({
    type: TOKEN_ATTRIBUTE_VALUE_WRAPPER_START,
    content: wrapper,
    startPosition: state.caretPosition,
    endPosition: state.caretPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTE_VALUE_WRAPPED_CONTEXT;
  state.contextParams[ATTRIBUTE_VALUE_WRAPPED_CONTEXT] = {
    wrapper: wrapper
  };
  state.caretPosition++;
}

function bare(state) {
  state.accumulatedContent = state.decisionBuffer;
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTE_VALUE_BARE_CONTEXT;
  state.caretPosition++;
}

function tagEnd(state) {
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTES_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '"' || chars === '\'') {
    return wrapper(state, tokens);
  }

  if (chars === '>' || chars === '/') {
    return tagEnd(state, tokens);
  }

  if (!isWhitespace(chars)) {
    return bare(state, tokens);
  }

  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};