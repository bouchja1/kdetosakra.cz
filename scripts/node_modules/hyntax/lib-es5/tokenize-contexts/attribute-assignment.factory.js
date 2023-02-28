'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_ASSIGNMENT = _require2.TOKEN_ATTRIBUTE_ASSIGNMENT;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_ASSIGNMENT_CONTEXT = _require3.ATTRIBUTE_ASSIGNMENT_CONTEXT,
    ATTRIBUTE_VALUE_CONTEXT = _require3.ATTRIBUTE_VALUE_CONTEXT;

var syntaxHandlers = {
  equal: function equal(state, tokens, contextFactories, options) {
    var attributeValueContext = contextFactories[ATTRIBUTE_VALUE_CONTEXT](contextFactories, options);
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });

    tokens.push({
      type: TOKEN_ATTRIBUTE_ASSIGNMENT,
      content: '' + state.accumulatedContent + state.decisionBuffer,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.decisionBuffer = '';
    state.currentContext = attributeValueContext;
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '=') {
    return function (state, tokens) {
      return syntaxHandlers.equal(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function attributeKeyContextFactory(contextFactories, options) {
  return {
    factoryName: ATTRIBUTE_ASSIGNMENT_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};