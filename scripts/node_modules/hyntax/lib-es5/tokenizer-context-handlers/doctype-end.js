"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_END = _require2.TOKEN_DOCTYPE_END;

var _require3 = require('../constants/tokenizer-contexts'),
    DATA_CONTEXT = _require3.DATA_CONTEXT;

function closingCornerBrace(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: true
  });
  tokens.push({
    type: TOKEN_DOCTYPE_END,
    content: state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DATA_CONTEXT;
  state.caretPosition++;
}

function parseSyntax(chars, state, tokens) {
  return closingCornerBrace(state, tokens);
}

module.exports = {
  parseSyntax: parseSyntax
};