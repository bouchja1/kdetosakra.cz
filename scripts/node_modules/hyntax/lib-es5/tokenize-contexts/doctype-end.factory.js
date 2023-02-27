'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_END = _require2.TOKEN_DOCTYPE_END;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_END_CONTEXT = _require3.DOCTYPE_END_CONTEXT,
    DATA_CONTEXT = _require3.DATA_CONTEXT;

var syntaxHandlers = {
  closingCornerBrace: function closingCornerBrace(state, tokens, contextFactories) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });

    var dataContext = contextFactories[DATA_CONTEXT](contextFactories);

    tokens.push({
      type: TOKEN_DOCTYPE_END,
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
      return syntaxHandlers.closingCornerBrace(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function doctypeEndContextFactory(contextFactories, options) {
  return {
    factoryName: DOCTYPE_END_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};