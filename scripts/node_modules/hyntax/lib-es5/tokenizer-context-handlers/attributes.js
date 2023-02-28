"use strict";

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace,
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/tokenizer-contexts'),
    ATTRIBUTES_CONTEXT = _require2.ATTRIBUTES_CONTEXT,
    OPEN_TAG_END_CONTEXT = _require2.OPEN_TAG_END_CONTEXT,
    ATTRIBUTE_VALUE_CONTEXT = _require2.ATTRIBUTE_VALUE_CONTEXT,
    ATTRIBUTE_KEY_CONTEXT = _require2.ATTRIBUTE_KEY_CONTEXT;

var _require3 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_ASSIGNMENT = _require3.TOKEN_ATTRIBUTE_ASSIGNMENT;

function tagEnd(state) {
  var tagName = state.contextParams[ATTRIBUTES_CONTEXT].tagName;
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = OPEN_TAG_END_CONTEXT;
  state.contextParams[OPEN_TAG_END_CONTEXT] = {
    tagName: tagName
  };
  state.contextParams[ATTRIBUTES_CONTEXT] = undefined;
}

function noneWhitespace(state) {
  state.accumulatedContent = state.decisionBuffer;
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTE_KEY_CONTEXT;
  state.caretPosition++;
}

function equal(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: true
  });
  tokens.push({
    type: TOKEN_ATTRIBUTE_ASSIGNMENT,
    content: state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTE_VALUE_CONTEXT;
  state.caretPosition++;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '>' || chars === '/') {
    return tagEnd(state, tokens);
  }

  if (chars === '=') {
    return equal(state, tokens);
  }

  if (!isWhitespace(chars)) {
    return noneWhitespace(state, tokens);
  }

  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};