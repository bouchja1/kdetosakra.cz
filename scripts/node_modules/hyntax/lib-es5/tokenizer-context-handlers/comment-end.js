'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_COMMENT_END = _require2.TOKEN_COMMENT_END;

var _require3 = require('../constants/tokenizer-contexts'),
    DATA_CONTEXT = _require3.DATA_CONTEXT;

function commentEnd(state, tokens) {
  var range = calculateTokenCharactersRange(state, { keepBuffer: true });

  tokens.push({
    type: TOKEN_COMMENT_END,
    content: state.accumulatedContent + state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DATA_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '>') {
    return commentEnd(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
}

module.exports = {
  parseSyntax: parseSyntax
};