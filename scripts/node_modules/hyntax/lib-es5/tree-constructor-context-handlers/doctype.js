"use strict";

var _require = require('../constants/token-types'),
    TOKEN_DOCTYPE_END = _require.TOKEN_DOCTYPE_END,
    TOKEN_DOCTYPE_ATTRIBUTE = _require.TOKEN_DOCTYPE_ATTRIBUTE,
    TOKEN_DOCTYPE_START = _require.TOKEN_DOCTYPE_START,
    TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START = _require.TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START;

var _require2 = require('../constants/tree-constructor-contexts'),
    DOCTYPE_ATTRIBUTES_CONTEXT = _require2.DOCTYPE_ATTRIBUTES_CONTEXT;

function handleDoctypeStart(state, token) {
  state.currentNode.content.start = token;
  state.caretPosition++;
  return state;
}

function handleDoctypeEnd(state, token) {
  state.currentNode.content.end = token;
  state.currentNode = state.currentNode.parentRef;
  state.currentContext = state.currentContext.parentRef;
  state.caretPosition++;
  return state;
}

function handleDoctypeAttributes(state) {
  state.currentContext = {
    parentRef: state.currentContext,
    type: DOCTYPE_ATTRIBUTES_CONTEXT
  };
  return state;
}

module.exports = function doctype(token, state) {
  if (token.type === TOKEN_DOCTYPE_START) {
    return handleDoctypeStart(state, token);
  }

  if (token.type === TOKEN_DOCTYPE_END) {
    return handleDoctypeEnd(state, token);
  }

  var ATTRIBUTES_START_TOKENS = [TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START, TOKEN_DOCTYPE_ATTRIBUTE];

  if (ATTRIBUTES_START_TOKENS.indexOf(token.type) !== -1) {
    return handleDoctypeAttributes(state, token);
  }

  state.caretPosition++;
  return state;
};