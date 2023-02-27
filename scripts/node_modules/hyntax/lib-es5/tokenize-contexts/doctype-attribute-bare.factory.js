'use strict';

var _require = require('../helpers'),
    isWhitespace = _require.isWhitespace,
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_DOCTYPE_ATTRIBUTE = _require2.TOKEN_DOCTYPE_ATTRIBUTE;

var _require3 = require('../constants/tokenizer-contexts'),
    DOCTYPE_ATTRIBUTE_BARE_CONTEXT = _require3.DOCTYPE_ATTRIBUTE_BARE_CONTEXT,
    DOCTYPE_ATTRIBUTES_CONTEXT = _require3.DOCTYPE_ATTRIBUTES_CONTEXT;

var syntaxHandlers = {
  attributeEnd: function attributeEnd(state, tokens, contextFactories, options) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: false });
    var doctypeAttributesContext = contextFactories[DOCTYPE_ATTRIBUTES_CONTEXT](contextFactories, options);

    tokens.push({
      type: TOKEN_DOCTYPE_ATTRIBUTE,
      content: state.accumulatedContent,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = doctypeAttributesContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (isWhitespace(chars) || chars === '>') {
    return function (state, tokens) {
      return syntaxHandlers.attributeEnd(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function doctypeAttributeBareContextFactory(contextFactories, options) {
  return {
    factoryName: DOCTYPE_ATTRIBUTE_BARE_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};