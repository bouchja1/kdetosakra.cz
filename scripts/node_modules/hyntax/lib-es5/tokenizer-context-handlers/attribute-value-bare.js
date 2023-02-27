"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange,
    isWhitespace = _require.isWhitespace;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_VALUE = _require2.TOKEN_ATTRIBUTE_VALUE;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTES_CONTEXT = _require3.ATTRIBUTES_CONTEXT;

function valueEnd(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  tokens.push({
    type: TOKEN_ATTRIBUTE_VALUE,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTES_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (isWhitespace(chars) || chars === '>' || chars === '/') {
    return valueEnd(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};