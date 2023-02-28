"use strict";

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace,
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_START = _require2.TOKEN_DOCTYPE_START;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_END_CONTEXT = _require3.DOCTYPE_END_CONTEXT,
    DOCTYPE_ATTRIBUTES_CONTEXT = _require3.DOCTYPE_ATTRIBUTES_CONTEXT;

function generateDoctypeStartToken(state) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  return {
    type: TOKEN_DOCTYPE_START,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  };
}

function closingCornerBrace(state, tokens) {
  tokens.push(generateDoctypeStartToken(state));
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_END_CONTEXT;
}

function whitespace(state, tokens) {
  tokens.push(generateDoctypeStartToken(state));
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_ATTRIBUTES_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (isWhitespace(chars)) {
    return whitespace(state, tokens);
  }

  if (chars === '>') {
    return closingCornerBrace(state, tokens);
  }

  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};