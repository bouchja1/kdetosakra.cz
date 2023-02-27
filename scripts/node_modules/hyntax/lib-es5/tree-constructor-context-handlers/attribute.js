"use strict";

var _require = require('../constants/token-types'),
    TOKEN_OPEN_TAG_END = _require.TOKEN_OPEN_TAG_END,
    TOKEN_OPEN_TAG_END_SCRIPT = _require.TOKEN_OPEN_TAG_END_SCRIPT,
    TOKEN_OPEN_TAG_END_STYLE = _require.TOKEN_OPEN_TAG_END_STYLE,
    TOKEN_ATTRIBUTE_KEY = _require.TOKEN_ATTRIBUTE_KEY,
    TOKEN_ATTRIBUTE_ASSIGNMENT = _require.TOKEN_ATTRIBUTE_ASSIGNMENT;

var _require2 = require('../constants/tree-constructor-contexts'),
    ATTRIBUTE_VALUE_CONTEXT = _require2.ATTRIBUTE_VALUE_CONTEXT;

function getLastAttribute(state) {
  var attributes = state.currentNode.content.attributes;
  return attributes[attributes.length - 1];
}

function handleOpenTagEnd(state) {
  state.currentContext = state.currentContext.parentRef;
  return state;
}

function handleAttributeKey(state, token) {
  var attribute = getLastAttribute(state);

  if (attribute.key !== undefined || attribute.value !== undefined) {
    state.currentContext = state.currentContext.parentRef;
    return state;
  }

  attribute.key = token;
  state.caretPosition++;
  return state;
}

function handleAttributeAssignment(state) {
  var attribute = getLastAttribute(state);

  if (attribute.value !== undefined) {
    state.currentContext = state.currentContext.parentRef;
    return state;
  }

  state.currentContext = {
    parentRef: state.currentContext,
    type: ATTRIBUTE_VALUE_CONTEXT
  };
  state.caretPosition++;
  return state;
}

module.exports = function attribute(token, state) {
  var OPEN_TAG_END_TOKENS = [TOKEN_OPEN_TAG_END, TOKEN_OPEN_TAG_END_SCRIPT, TOKEN_OPEN_TAG_END_STYLE];

  if (OPEN_TAG_END_TOKENS.indexOf(token.type) !== -1) {
    return handleOpenTagEnd(state);
  }

  if (token.type === TOKEN_ATTRIBUTE_KEY) {
    return handleAttributeKey(state, token);
  }

  if (token.type === TOKEN_ATTRIBUTE_ASSIGNMENT) {
    return handleAttributeAssignment(state);
  }

  state.caretPosition++;
  return state;
};