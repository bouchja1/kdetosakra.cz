'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_VALUE = _require2.TOKEN_ATTRIBUTE_VALUE;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_VALUE_BARE_CONTEXT = _require3.ATTRIBUTE_VALUE_BARE_CONTEXT,
    ATTRIBUTES_CONTEXT = _require3.ATTRIBUTES_CONTEXT;

var syntaxHandlers = {
  valueEnd: function valueEnd(state, tokens, contextFactories, options) {
    var attributesContext = contextFactories[ATTRIBUTES_CONTEXT](contextFactories, options);
    var range = calculateTokenCharactersRange(state, { keepBuffer: false });

    tokens.push({
      type: TOKEN_ATTRIBUTE_VALUE,
      content: state.accumulatedContent,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = attributesContext;
  }
};

var BARE_VALUE_END_PATTERN = /\s/;

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (BARE_VALUE_END_PATTERN.test(chars) || chars === '>' || chars === '/') {
    return function (state, tokens) {
      return syntaxHandlers.valueEnd(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function attributeValueBareContextFactory(contextFactories, options) {
  return {
    factoryName: ATTRIBUTE_VALUE_BARE_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};