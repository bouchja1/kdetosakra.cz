"use strict";

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace,
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_ATTRIBUTE = _require2.TOKEN_DOCTYPE_ATTRIBUTE;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_ATTRIBUTES_CONTEXT = _require3.DOCTYPE_ATTRIBUTES_CONTEXT;

function attributeEnd(state, tokens) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  tokens.push({
    type: TOKEN_DOCTYPE_ATTRIBUTE,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_ATTRIBUTES_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (isWhitespace(chars) || chars === '>') {
    return attributeEnd(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};