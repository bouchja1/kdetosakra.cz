'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_ASSIGNMENT = _require2.TOKEN_ATTRIBUTE_ASSIGNMENT;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_VALUE_CONTEXT = _require3.ATTRIBUTE_VALUE_CONTEXT;

function equal(state, tokens) {
  var range = calculateTokenCharactersRange(state, { keepBuffer: true });

  tokens.push({
    type: TOKEN_ATTRIBUTE_ASSIGNMENT,
    content: state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTE_VALUE_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '=') {
    return equal(state, tokens);
  }
}

module.exports = {
  parseSyntax: parseSyntax
};