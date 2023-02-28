"use strict";

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_TEXT = _require2.TOKEN_TEXT,
    TOKEN_COMMENT_START = _require2.TOKEN_COMMENT_START;

var _require3 = require('../constants/tokenizer-contexts'),
    OPEN_TAG_START_CONTEXT = _require3.OPEN_TAG_START_CONTEXT,
    CLOSE_TAG_CONTEXT = _require3.CLOSE_TAG_CONTEXT,
    DOCTYPE_START_CONTEXT = _require3.DOCTYPE_START_CONTEXT,
    COMMENT_CONTENT_CONTEXT = _require3.COMMENT_CONTENT_CONTEXT;

var COMMENT_START = '<!--';

function generateTextToken(state) {
  var range = calculateTokenCharactersRange(state, {
    keepBuffer: false
  });
  return {
    type: TOKEN_TEXT,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  };
}

function openingCornerBraceWithText(state, tokens) {
  if (state.accumulatedContent.length !== 0) {
    tokens.push(generateTextToken(state));
  }

  state.accumulatedContent = state.decisionBuffer;
  state.decisionBuffer = '';
  state.currentContext = OPEN_TAG_START_CONTEXT;
  state.caretPosition++;
}

function openingCornerBraceWithSlash(state, tokens) {
  if (state.accumulatedContent.length !== 0) {
    tokens.push(generateTextToken(state));
  }

  state.accumulatedContent = state.decisionBuffer;
  state.decisionBuffer = '';
  state.currentContext = CLOSE_TAG_CONTEXT;
  state.caretPosition++;
}

function doctypeStart(state, tokens) {
  if (state.accumulatedContent.length !== 0) {
    tokens.push(generateTextToken(state));
  }

  state.accumulatedContent = state.decisionBuffer;
  state.decisionBuffer = '';
  state.currentContext = DOCTYPE_START_CONTEXT;
  state.caretPosition++;
}

function commentStart(state, tokens) {
  if (state.accumulatedContent.length !== 0) {
    tokens.push(generateTextToken(state));
  }

  var commentStartRange = {
    startPosition: state.caretPosition - (COMMENT_START.length - 1),
    endPosition: state.caretPosition
  };
  tokens.push({
    type: TOKEN_COMMENT_START,
    content: state.decisionBuffer,
    startPosition: commentStartRange.startPosition,
    endPosition: commentStartRange.endPosition
  });
  state.accumulatedContent = '';
  state.decisionBuffer = '';
  state.currentContext = COMMENT_CONTENT_CONTEXT;
  state.caretPosition++;
}

function handleContentEnd(state, tokens) {
  var textContent = state.accumulatedContent + state.decisionBuffer;

  if (textContent.length !== 0) {
    var range = calculateTokenCharactersRange(state, {
      keepBuffer: false
    });
    tokens.push({
      type: TOKEN_TEXT,
      content: textContent,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });
  }
}

function isIncompleteDoctype(chars) {
  var charsUpperCase = chars.toUpperCase();
  return charsUpperCase === '<!' || charsUpperCase === '<!D' || charsUpperCase === '<!DO' || charsUpperCase === '<!DOC' || charsUpperCase === '<!DOCT' || charsUpperCase === '<!DOCTY' || charsUpperCase === '<!DOCTYP';
}

var OPEN_TAG_START_PATTERN = /^<\w/;

function parseSyntax(chars, state, tokens) {
  if (OPEN_TAG_START_PATTERN.test(chars)) {
    return openingCornerBraceWithText(state, tokens);
  }

  if (chars === '</') {
    return openingCornerBraceWithSlash(state, tokens);
  }

  if (chars === '<' || chars === '<!' || chars === '<!-') {
    state.caretPosition++;
    return;
  }

  if (chars === COMMENT_START) {
    return commentStart(state, tokens);
  }

  if (isIncompleteDoctype(chars)) {
    state.caretPosition++;
    return;
  }

  if (chars.toUpperCase() === '<!DOCTYPE') {
    return doctypeStart(state, tokens);
  }

  state.accumulatedContent += state.decisionBuffer;
  state.decisionBuffer = '';
  state.caretPosition++;
}

module.exports = {
  parseSyntax: parseSyntax,
  handleContentEnd: handleContentEnd
};