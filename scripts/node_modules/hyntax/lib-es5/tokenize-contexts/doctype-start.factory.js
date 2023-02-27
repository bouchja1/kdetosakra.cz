'use strict';

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace,
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_START = _require2.TOKEN_DOCTYPE_START;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_START_CONTEXT = _require3.DOCTYPE_START_CONTEXT,
    DOCTYPE_END_CONTEXT = _require3.DOCTYPE_END_CONTEXT,
    DOCTYPE_ATTRIBUTES_CONTEXT = _require3.DOCTYPE_ATTRIBUTES_CONTEXT;

function generateDoctypeStartToken(state) {
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  return {
    type: TOKEN_DOCTYPE_START,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  };
}

var syntaxHandlers = {
  closingCornerBrace: function closingCornerBrace(state, tokens, contextFactories) {
    var doctypeEndContext = contextFactories[DOCTYPE_END_CONTEXT](contextFactories);

    tokens.push(generateDoctypeStartToken(state));

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = doctypeEndContext;
  },
  whitespace: function whitespace(state, tokens, contextFactories) {
    var attributesContext = contextFactories[DOCTYPE_ATTRIBUTES_CONTEXT](contextFactories);

    tokens.push(generateDoctypeStartToken(state));

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributesContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (isWhitespace(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.whitespace(state, tokens, contextFactories, options);
    };
  }

  if (chars === '>') {
    return function (state, tokens) {
      return syntaxHandlers.closingCornerBrace(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function doctypeStartContextFactory(contextFactories, options) {
  return {
    factoryName: DOCTYPE_START_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};