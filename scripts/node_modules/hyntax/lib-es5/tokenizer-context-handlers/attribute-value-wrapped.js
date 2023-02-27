"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_VALUE = _require2.TOKEN_ATTRIBUTE_VALUE,
    TOKEN_ATTRIBUTE_VALUE_WRAPPER_END = _require2.TOKEN_ATTRIBUTE_VALUE_WRAPPER_END;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTES_CONTEXT = _require3.ATTRIBUTES_CONTEXT,
    ATTRIBUTE_VALUE_WRAPPED_CONTEXT = _require3.ATTRIBUTE_VALUE_WRAPPED_CONTEXT;

function wrapper(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  var endWrapperPosition = range.endPosition + 1;
  tokens.push({
    type: TOKEN_ATTRIBUTE_VALUE,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  }, {
    type: TOKEN_ATTRIBUTE_VALUE_WRAPPER_END,
    content: state.decisionBuffer,
    startPosition: endWrapperPosition,
    endPosition: endWrapperPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTES_CONTEXT;
  state.caretPosition++;
  state.contextParams[ATTRIBUTE_VALUE_WRAPPED_CONTEXT] = undefined;
}

function parseSyntax(chars, state, tokens) {
  var wrapperChar = state.contextParams[ATTRIBUTE_VALUE_WRAPPED_CONTEXT].wrapper;

  if (chars === wrapperChar) {
    return wrapper(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};