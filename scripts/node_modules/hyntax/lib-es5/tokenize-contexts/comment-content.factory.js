'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_COMMENT_CONTENT = _require2.TOKEN_COMMENT_CONTENT;

var _require3 = require('../constants/tokenizer-contexts'),
    COMMENT_CONTENT_CONTEXT = _require3.COMMENT_CONTENT_CONTEXT,
    COMMENT_END_CONTEXT = _require3.COMMENT_END_CONTEXT;

var syntaxHandlers = {
  commentEnd: function commentEnd(state, tokens, contextFactories) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: false });
    var commentContentContext = contextFactories[COMMENT_END_CONTEXT](contextFactories);

    tokens.push({
      type: TOKEN_COMMENT_CONTENT,
      content: state.accumulatedContent,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = commentContentContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '-' || chars === '--') {
    /**
     * Signals to wait for more characters in
     * the decision buffer to decide about syntax
     */
    return function () {};
  }

  if (chars === '-->') {
    return function (state, tokens) {
      return syntaxHandlers.commentEnd(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function commentContentContextFactory(contextFactories, options) {
  return {
    factoryName: COMMENT_CONTENT_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};