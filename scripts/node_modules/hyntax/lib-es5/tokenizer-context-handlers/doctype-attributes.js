"use strict";

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace;

var _require2 = require('../constants/tokenizer-contexts'),
    DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT = _require2.DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
    DOCTYPE_ATTRIBUTE_BARE_CONTEXT = _require2.DOCTYPE_ATTRIBUTE_BARE_CONTEXT,
    DOCTYPE_END_CONTEXT = _require2.DOCTYPE_END_CONTEXT;

var _require3 = require('../constants/token-types'),
    TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START = _require3.TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START;

function wrapper(state, tokens) {
  var wrapper = state.decisionBuffer;
  tokens.push({
    type: TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START,
    content: wrapper,
    startPosition: state.caretPosition,
    endPosition: state.caretPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT;
  state.contextParams[DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT] = {
    wrapper: wrapper
  };
  state.caretPosition++;
}

function bare(state) {
  state.accumulatedContent = state.decisionBuffer;
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_ATTRIBUTE_BARE_CONTEXT;
  state.caretPosition++;
}

function closingCornerBrace(state) {
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_END_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '"' || chars === '\'') {
    return wrapper(state, tokens);
  }

  if (chars === '>') {
    return closingCornerBrace(state, tokens);
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