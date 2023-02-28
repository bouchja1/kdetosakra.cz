"use strict";

var _require = require('../helpers'),
    parseOpenTagName = _require.parseOpenTagName,
    isWhitespace = _require.isWhitespace,
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_OPEN_TAG_START = _require2.TOKEN_OPEN_TAG_START,
    TOKEN_OPEN_TAG_START_SCRIPT = _require2.TOKEN_OPEN_TAG_START_SCRIPT,
    TOKEN_OPEN_TAG_START_STYLE = _require2.TOKEN_OPEN_TAG_START_STYLE;

var _require3 = require('../constants/tokenizer-contexts'),
    OPEN_TAG_END_CONTEXT = _require3.OPEN_TAG_END_CONTEXT,
    ATTRIBUTES_CONTEXT = _require3.ATTRIBUTES_CONTEXT;

var tokensMap = {
  'script': TOKEN_OPEN_TAG_START_SCRIPT,
  'style': TOKEN_OPEN_TAG_START_STYLE,
  'default': TOKEN_OPEN_TAG_START
};

function tagEnd(state, tokens) {
  var tagName = parseOpenTagName(state.accumulatedContent);
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  tokens.push({
    type: tokensMap[tagName] || tokensMap["default"],
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.decisionBuffer = '';
  state.accumulatedContent = '';
  state.currentContext = OPEN_TAG_END_CONTEXT;
  state.contextParams[OPEN_TAG_END_CONTEXT] = {
    tagName: tagName
  };
}

function whitespace(state, tokens) {
  var tagName = parseOpenTagName(state.accumulatedContent);
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  tokens.push({
    type: tokensMap[tagName] || tokensMap["default"],
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTES_CONTEXT;
  state.contextParams[ATTRIBUTES_CONTEXT] = {
    tagName: tagName
  };
  state.caretPosition++;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '>' || chars === '/') {
    return tagEnd(state, tokens);
  }

  if (isWhitespace(chars)) {
    return whitespace(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};