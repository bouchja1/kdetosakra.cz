'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_COMMENT_END = _require2.TOKEN_COMMENT_END;

var _require3 = require('../constants/tokenizer-contexts'),
    COMMENT_END_CONTEXT = _require3.COMMENT_END_CONTEXT,
    DATA_CONTEXT = _require3.DATA_CONTEXT;

var syntaxHandlers = {
  commentEnd: function commentEnd(state, tokens, contextFactories) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });
    var dataContext = contextFactories[DATA_CONTEXT](contextFactories);

    tokens.push({
      type: TOKEN_COMMENT_END,
      content: state.accumulatedContent + state.decisionBuffer,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.decisionBuffer = '';
    state.currentContext = dataContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '>') {
    return function (state, tokens) {
      return syntaxHandlers.commentEnd(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function commentEndContextFactory(contextFactories, options) {
  return {
    factoryName: COMMENT_END_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};