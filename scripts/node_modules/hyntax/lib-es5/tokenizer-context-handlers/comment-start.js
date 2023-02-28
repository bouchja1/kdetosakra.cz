'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_COMMENT_START = _require2.TOKEN_COMMENT_START;

var _require3 = require('../constants/tokenizer-contexts'),
    COMMENT_CONTENT_CONTEXT = _require3.COMMENT_CONTENT_CONTEXT;

function commentStart(state, tokens) {
  var range = calculateTokenCharactersRange(state, { keepBuffer: true });

  tokens.push({
    type: TOKEN_COMMENT_START,
    content: state.accumulatedContent + state.decisionBuffer,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = COMMENT_CONTENT_CONTEXT;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '<!--') {
    return commentStart(state, tokens);
  }
}

module.exports = {
  parseSyntax: parseSyntax
};