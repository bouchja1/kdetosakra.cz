"use strict";

var _require = require('../constants/token-types'),
    TOKEN_OPEN_TAG_START = _require.TOKEN_OPEN_TAG_START,
    TOKEN_OPEN_TAG_END = _require.TOKEN_OPEN_TAG_END,
    TOKEN_CLOSE_TAG = _require.TOKEN_CLOSE_TAG,
    TOKEN_ATTRIBUTE_KEY = _require.TOKEN_ATTRIBUTE_KEY,
    TOKEN_ATTRIBUTE_ASSIGNMENT = _require.TOKEN_ATTRIBUTE_ASSIGNMENT;

var _require2 = require('../constants/tree-constructor-contexts'),
    TAG_NAME_CONTEXT = _require2.TAG_NAME_CONTEXT,
    ATTRIBUTES_CONTEXT = _require2.ATTRIBUTES_CONTEXT,
    TAG_CONTENT_CONTEXT = _require2.TAG_CONTENT_CONTEXT;

function handleOpenTagStart(state, token) {
  state.currentNode.content.openStart = token;
  state.currentContext = {
    parentRef: state.currentContext,
    type: TAG_NAME_CONTEXT
  };
  return state;
}

function handleAttributeStart(state) {
  state.currentContext = {
    parentRef: state.currentContext,
    type: ATTRIBUTES_CONTEXT
  };
  return state;
}

function handleOpenTagEnd(state, token) {
  var SELF_CLOSING_TAGS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  var tagName = state.currentNode.content.name;
  state.currentNode.content.openEnd = token;

  if (SELF_CLOSING_TAGS.indexOf(tagName) !== -1) {
    state.currentNode.content.selfClosing = true;
    state.currentNode = state.currentNode.parentRef;
    state.currentContext = state.currentContext.parentRef;
    state.caretPosition++;
    return state;
  }

  state.currentNode.content.selfClosing = false;
  state.currentContext = {
    parentRef: state.currentContext,
    type: TAG_CONTENT_CONTEXT
  };
  state.caretPosition++;
  return state;
}

function handleCloseTag(state, token) {
  state.currentNode.content.close = token;
  state.currentNode = state.currentNode.parentRef;
  state.currentContext = state.currentContext.parentRef;
  state.caretPosition++;
  return state;
}

module.exports = function tag(token, state) {
  if (token.type === TOKEN_OPEN_TAG_START) {
    return handleOpenTagStart(state, token);
  }

  var ATTRIBUTE_START_TOKENS = [TOKEN_ATTRIBUTE_KEY, TOKEN_ATTRIBUTE_ASSIGNMENT];

  if (ATTRIBUTE_START_TOKENS.indexOf(token.type) !== -1) {
    return handleAttributeStart(state);
  }

  if (token.type === TOKEN_OPEN_TAG_END) {
    return handleOpenTagEnd(state, token);
  }

  if (token.type === TOKEN_CLOSE_TAG) {
    return handleCloseTag(state, token);
  }

  state.caretPosition++;
  return state;
};