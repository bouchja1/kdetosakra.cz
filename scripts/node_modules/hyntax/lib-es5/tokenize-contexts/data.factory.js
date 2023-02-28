'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_TEXT = _require2.TOKEN_TEXT;

var _require3 = require('../constants/tokenizer-contexts'),
    DATA_CONTEXT = _require3.DATA_CONTEXT,
    OPEN_TAG_START_CONTEXT = _require3.OPEN_TAG_START_CONTEXT,
    CLOSE_TAG_CONTEXT = _require3.CLOSE_TAG_CONTEXT,
    DOCTYPE_START_CONTEXT = _require3.DOCTYPE_START_CONTEXT,
    COMMENT_START_CONTEXT = _require3.COMMENT_START_CONTEXT;

function generateTextToken(state) {
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  return {
    type: TOKEN_TEXT,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  };
}

var syntaxHandlers = {
  openingCornerBraceWithText: function openingCornerBraceWithText(state, tokens, contextFactories) {
    var openTagStartContext = contextFactories[OPEN_TAG_START_CONTEXT](contextFactories);

    if (state.accumulatedContent.length !== 0) {
      tokens.push(generateTextToken(state));
    }

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = openTagStartContext;
  },
  openingCornerBraceWithSlash: function openingCornerBraceWithSlash(state, tokens, contextFactories) {
    var closeTagContext = contextFactories[CLOSE_TAG_CONTEXT](contextFactories, { withinContent: 'data' });

    if (state.accumulatedContent.length !== 0) {
      tokens.push(generateTextToken(state));
    }

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = closeTagContext;
  },
  doctypeStart: function doctypeStart(state, tokens, contextFactories) {
    var doctypeStartContext = contextFactories[DOCTYPE_START_CONTEXT](contextFactories);

    if (state.accumulatedContent.length !== 0) {
      tokens.push(generateTextToken(state));
    }

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = doctypeStartContext;
  },
  commentStart: function commentStart(state, tokens, contextFactories) {
    var commentStartContext = contextFactories[COMMENT_START_CONTEXT](contextFactories);

    if (state.accumulatedContent.length !== 0) {
      tokens.push(generateTextToken(state));
    }

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = commentStartContext;
  }
};

function handleDataContextContentEnd(state, tokens) {
  var textContent = '' + state.accumulatedContent + state.decisionBuffer;

  if (textContent.length !== 0) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: false });

    tokens.push({
      type: TOKEN_TEXT,
      content: textContent,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });
  }
}

var INCOMPLETE_DOCTYPE_START = /<!\w*$/;
var COMPLETE_DOCTYPE_START = /<!DOCTYPE/i;
var OPEN_TAG_START_PATTERN = /^<\w/;

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '<' || chars === '<!' || chars === '<!-' || INCOMPLETE_DOCTYPE_START.test(chars)) {
    /**
     * Signals to wait for more characters in
     * the decision buffer to decide about syntax
     */
    return function () {};
  }

  if (chars === '<!--') {
    return function (state, tokens) {
      return syntaxHandlers.commentStart(state, tokens, contextFactories, options);
    };
  }

  if (COMPLETE_DOCTYPE_START.test(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.doctypeStart(state, tokens, contextFactories, options);
    };
  }

  if (OPEN_TAG_START_PATTERN.test(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.openingCornerBraceWithText(state, tokens, contextFactories, options);
    };
  }

  if (chars === '</') {
    return function (state, tokens) {
      return syntaxHandlers.openingCornerBraceWithSlash(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function dataContextFactory(contextFactories, options) {
  return {
    factoryName: DATA_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    },
    handleContentEnd: handleDataContextContentEnd
  };
};