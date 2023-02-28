"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_OPEN_TAG_END = _require2.TOKEN_OPEN_TAG_END,
    TOKEN_OPEN_TAG_END_SCRIPT = _require2.TOKEN_OPEN_TAG_END_SCRIPT,
    TOKEN_OPEN_TAG_END_STYLE = _require2.TOKEN_OPEN_TAG_END_STYLE;

var _require3 = require('../constants/tokenizer-contexts'),
    OPEN_TAG_END_CONTEXT = _require3.OPEN_TAG_END_CONTEXT,
    DATA_CONTEXT = _require3.DATA_CONTEXT,
    SCRIPT_CONTENT_CONTEXT = _require3.SCRIPT_CONTENT_CONTEXT,
    STYLE_CONTENT_CONTEXT = _require3.STYLE_CONTENT_CONTEXT;

var tokensMap = {
  'script': TOKEN_OPEN_TAG_END_SCRIPT,
  'style': TOKEN_OPEN_TAG_END_STYLE,
  'default': TOKEN_OPEN_TAG_END
};
var contextsMap = {
  'script': SCRIPT_CONTENT_CONTEXT,
  'style': STYLE_CONTENT_CONTEXT,
  'default': DATA_CONTEXT
};

function closingCornerBrace(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: true
  });
  var tagName = state.contextParams[OPEN_TAG_END_CONTEXT].tagName;
  tokens.push({
    type: tokensMap[tagName] || tokensMap["default"],
    content: state.accumulatedContent + state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = contextsMap[tagName] || contextsMap["default"];
  state.caretPosition++;
  state.contextParams[OPEN_TAG_END_CONTEXT] = undefined;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '>') {
    return closingCornerBrace(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};