"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_COMMENT_END = _require2.TOKEN_COMMENT_END,
    TOKEN_COMMENT_CONTENT = _require2.TOKEN_COMMENT_CONTENT;

var _require3 = require('../constants/tokenizer-contexts'),
    DATA_CONTEXT = _require3.DATA_CONTEXT;

var COMMENT_END = '-->';

function commentEnd(state, tokens) {
  var contentRange = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  var commentEndRange = {
    startPosition: contentRange.endPosition + 1,
    endPosition: contentRange.endPosition + COMMENT_END.length
  };
  tokens.push({
    type: TOKEN_COMMENT_CONTENT,
    content: state.accumulatedContent,
    startPosition: contentRange.startPosition,
    endPosition: contentRange.endPosition
  });
  tokens.push({
    type: TOKEN_COMMENT_END,
    content: state.decisionBuffer,
    startPosition: commentEndRange.startPosition,
    endPosition: commentEndRange.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = DATA_CONTEXT;
  state.caretPosition++;
}

function parseSyntax(chars, state, tokens) {
  if (chars === '-' || chars === '--') {
    state.caretPosition++;
    return;
  }

  if (chars === COMMENT_END) {
    return commentEnd(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax
};