"use strict";

var _require = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_KEY = _require.TOKEN_ATTRIBUTE_KEY,
    TOKEN_ATTRIBUTE_ASSIGNMENT = _require.TOKEN_ATTRIBUTE_ASSIGNMENT,
    TOKEN_OPEN_TAG_END = _require.TOKEN_OPEN_TAG_END,
    TOKEN_OPEN_TAG_END_SCRIPT = _require.TOKEN_OPEN_TAG_END_SCRIPT,
    TOKEN_OPEN_TAG_END_STYLE = _require.TOKEN_OPEN_TAG_END_STYLE;

var _require2 = require('../constants/tree-constructor-contexts'),
    ATTRIBUTE_CONTEXT = _require2.ATTRIBUTE_CONTEXT;

function handlerAttributeStart(state) {
  if (state.currentNode.content.attributes === undefined) {
    state.currentNode.content.attributes = [];
  } // new empty attribute


  state.currentNode.content.attributes.push({});
  state.currentContext = {
    parentRef: state.currentContext,
    type: ATTRIBUTE_CONTEXT
  };
  return state;
}

function handleOpenTagEnd(state) {
  state.currentContext = state.currentContext.parentRef;
  return state;
}

module.exports = function attributes(token, state) {
  var ATTRIBUTE_START_TOKENS = [TOKEN_ATTRIBUTE_KEY, TOKEN_ATTRIBUTE_ASSIGNMENT];

  if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
    return handlerAttributeStart(state);
  }

  var ATTRIBUTES_END_TOKENS = [TOKEN_OPEN_TAG_END, TOKEN_OPEN_TAG_END_SCRIPT, TOKEN_OPEN_TAG_END_STYLE];

  if (ATTRIBUTES_END_TOKENS.indexOf(token.type) !== -1) {
    return handleOpenTagEnd(state);
  }

  state.caretPosition++;
  return state;
};