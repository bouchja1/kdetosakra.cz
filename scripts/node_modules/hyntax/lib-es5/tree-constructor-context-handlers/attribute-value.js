"use strict";

var _require = require('../constants/token-types'),
    TOKEN_OPEN_TAG_END = _require.TOKEN_OPEN_TAG_END,
    TOKEN_OPEN_TAG_END_SCRIPT = _require.TOKEN_OPEN_TAG_END_SCRIPT,
    TOKEN_OPEN_TAG_END_STYLE = _require.TOKEN_OPEN_TAG_END_STYLE,
    TOKEN_ATTRIBUTE_KEY = _require.TOKEN_ATTRIBUTE_KEY,
    TOKEN_ATTRIBUTE_ASSIGNMENT = _require.TOKEN_ATTRIBUTE_ASSIGNMENT,
    TOKEN_ATTRIBUTE_VALUE = _require.TOKEN_ATTRIBUTE_VALUE,
    TOKEN_ATTRIBUTE_VALUE_WRAPPER_START = _require.TOKEN_ATTRIBUTE_VALUE_WRAPPER_START,
    TOKEN_ATTRIBUTE_VALUE_WRAPPER_END = _require.TOKEN_ATTRIBUTE_VALUE_WRAPPER_END;

function getLastAttribute(state) {
  var attributes = state.currentNode.content.attributes;
  return attributes[attributes.length - 1];
}

function handleValueEnd(state) {
  state.currentContext = state.currentContext.parentRef;
  return state;
}

function handleAttributeValue(state, token) {
  var attribute = getLastAttribute(state);
  attribute.value = token;
  state.caretPosition++;
  return state;
}

function handleAttributeValueWrapperStart(state, token) {
  var attribute = getLastAttribute(state);
  attribute.startWrapper = token;
  state.caretPosition++;
  return state;
}

function handleAttributeValueWrapperEnd(state, token) {
  var attribute = getLastAttribute(state);
  attribute.endWrapper = token;
  state.caretPosition++;
  return state;
}

module.exports = function attributeValue(token, state) {
  var VALUE_END_TOKENS = [TOKEN_OPEN_TAG_END, TOKEN_OPEN_TAG_END_SCRIPT, TOKEN_OPEN_TAG_END_STYLE, TOKEN_ATTRIBUTE_KEY, TOKEN_ATTRIBUTE_ASSIGNMENT];

  if (VALUE_END_TOKENS.indexOf(token.type) !== -1) {
    return handleValueEnd(state);
  }

  if (token.type === TOKEN_ATTRIBUTE_VALUE) {
    return handleAttributeValue(state, token);
  }

  if (token.type === TOKEN_ATTRIBUTE_VALUE_WRAPPER_START) {
    return handleAttributeValueWrapperStart(state, token);
  }

  if (token.type === TOKEN_ATTRIBUTE_VALUE_WRAPPER_END) {
    return handleAttributeValueWrapperEnd(state, token);
  }

  state.caretPosition++;
  return state;
};