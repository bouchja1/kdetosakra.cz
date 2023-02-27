'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END = _require2.TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT = _require3.DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
    DOCTYPE_ATTRIBUTES_CONTEXT = _require3.DOCTYPE_ATTRIBUTES_CONTEXT;

function wrapper(state, tokens) {
  var range = calculateTokenCharactersRange(state, { keepBuffer: true });

  tokens.push({
    type: TOKEN_DOCTYPE_ATTRIBUTE_WRAPPER_END,
    content: state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_ATTRIBUTES_CONTEXT;

  delete state.contextParams[DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT];
}

function parseSyntax(chars, state, tokens) {
  var wrapperChar = state.contextParams[DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT].wrapper;

  if (chars === wrapperChar) {
    return wrapper(state, tokens);
  }
}

module.exports = {
  parseSyntax: parseSyntax
};