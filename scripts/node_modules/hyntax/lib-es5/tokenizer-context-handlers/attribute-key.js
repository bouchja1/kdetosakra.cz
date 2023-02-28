"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_KEY = _require2.TOKEN_ATTRIBUTE_KEY;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTES_CONTEXT = _require3.ATTRIBUTES_CONTEXT;

function keyEnd(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  tokens.push({
    type: TOKEN_ATTRIBUTE_KEY,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = ATTRIBUTES_CONTEXT;
}

function isKeyBreak(chars) {
  return chars === '=' || chars === ' ' || chars === '\n' || chars === '\t' || chars === '/' || chars === '>';
}

function parseSyntax(chars, state, tokens) {
  if (isKeyBreak(chars)) {
    return keyEnd(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};