"use strict";

/**
 * Parser for 'tag-name' context.
 * Parses tag name from 'open-tag-start' (<div)
 * token and save the tag name as self content.
 * Ignores tokens others than 'open-tag-start'.
 */
var parseOpenTagName = require('../helpers').parseOpenTagName;

var _require = require('../constants/token-types'),
    TOKEN_OPEN_TAG_START = _require.TOKEN_OPEN_TAG_START;

function handleTagOpenStart(state, token) {
  state.currentNode.content.name = parseOpenTagName(token.content);
  state.currentContext = state.currentContext.parentRef;
  return state;
}

module.exports = function tagName(token, state) {
  if (token.type === TOKEN_OPEN_TAG_START) {
    handleTagOpenStart(state, token);
  }

  state.caretPosition++;
  return state;
};