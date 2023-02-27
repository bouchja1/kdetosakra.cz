'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_COMMENT_START = _require2.TOKEN_COMMENT_START;

var _require3 = require('../constants/tokenizer-contexts'),
    COMMENT_START_CONTEXT = _require3.COMMENT_START_CONTEXT,
    COMMENT_CONTENT_CONTEXT = _require3.COMMENT_CONTENT_CONTEXT;

var syntaxHandlers = {
  commentStart: function commentStart(state, tokens, contextFactories) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });
    var commentContentContext = contextFactories[COMMENT_CONTENT_CONTEXT](contextFactories);

    tokens.push({
      type: TOKEN_COMMENT_START,
      content: state.accumulatedContent + state.decisionBuffer,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.decisionBuffer = '';
    state.currentContext = commentContentContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '<' || chars === '<!' || chars === '<!-') {
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
}

module.exports = function commentStartContextFactory(contextFactories, options) {
  return {
    factoryName: COMMENT_START_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};