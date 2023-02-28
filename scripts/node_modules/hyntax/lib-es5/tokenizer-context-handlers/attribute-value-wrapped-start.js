'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_VALUE_WRAPPER_START = _require2.TOKEN_ATTRIBUTE_VALUE_WRAPPER_START;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_VALUE_WRAPPED_CONTEXT = _require3.ATTRIBUTE_VALUE_WRAPPED_CONTEXT;

function wrapper(state, tokens) {
  var range = calculateTokenCharactersRange(state, { keepBuffer: true });

  tokens.push({
    type: TOKEN_ATTRIBUTE_VALUE_WRAPPER_START,
    content: state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTE_VALUE_WRAPPED_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  var wrapperChar = state.contextParams[ATTRIBUTE_VALUE_WRAPPED_CONTEXT].wrapper;

  if (chars === wrapperChar) {
    return wrapper(state, tokens);
  }
}

module.exports = {
  parseSyntax: parseSyntax
};