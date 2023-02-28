"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_CLOSE_TAG = _require2.TOKEN_CLOSE_TAG;

var _require3 = require('../constants/tokenizer-contexts'),
    DATA_CONTEXT = _require3.DATA_CONTEXT;

function closingCornerBrace(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: true
  });
  tokens.push({
    type: TOKEN_CLOSE_TAG,
    content: state.accumulatedContent + state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DATA_CONTEXT;
  state.caretPosition++;
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