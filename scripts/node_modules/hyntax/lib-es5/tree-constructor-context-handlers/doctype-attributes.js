"use strict";

var _require = require('../constants/tree-constructor-contexts'),
    DOCTYPE_ATTRIBUTE_CONTEXT = _require.DOCTYPE_ATTRIBUTE_CONTEXT;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_END = _require2.TOKEN_DOCTYPE_END,
    TOKEN_DOCTYPE_ATTRIBUTE = _require2.TOKEN_DOCTYPE_ATTRIBUTE,
    TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START = _require2.TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START;

function handleDoctypeEnd(state) {
  state.currentContext = state.currentContext.parentRef;
  return state;
}

function handleAttribute(state) {
  if (state.currentNode.content.attributes === undefined) {
    state.currentNode.content.attributes = [];
  } // new empty attribute


  state.currentNode.content.attributes.push({});
  state.currentContext = {
    type: DOCTYPE_ATTRIBUTE_CONTEXT,
    parentRef: state.currentContext
  };
  return state;
}

module.exports = function doctypeAttributes(token, state) {
  if (token.type === TOKEN_DOCTYPE_END) {
    return handleDoctypeEnd(state, token);
  }

  var ATTRIBUTE_START_TOKENS = [TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_START, TOKEN_DOCTYPE_ATTRIBUTE];

  if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
    return handleAttribute(state, token);
  }

  state.caretPosition++;
  return state;
};