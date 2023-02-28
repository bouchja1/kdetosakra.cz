'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_ATTRIBUTE_KEY = _require2.TOKEN_ATTRIBUTE_KEY;

var _require3 = require('../constants/tokenizer-contexts'),
    ATTRIBUTE_KEY_CONTEXT = _require3.ATTRIBUTE_KEY_CONTEXT,
    ATTRIBUTES_CONTEXT = _require3.ATTRIBUTES_CONTEXT;

var syntaxHandlers = {
  keyEnd: function keyEnd(state, tokens, contextFactories, options) {
    var attributesContext = contextFactories[ATTRIBUTES_CONTEXT](contextFactories, options);
    var range = calculateTokenCharactersRange(state, { keepBuffer: false });

    tokens.push({
      type: TOKEN_ATTRIBUTE_KEY,
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

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  var KEY_BREAK_CHARS = [' ', '\n', '\t', '=', '/', '>'];

  if (KEY_BREAK_CHARS.indexOf(chars) !== -1) {
    return function (state, tokens) {
      return syntaxHandlers.keyEnd(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function attributeKeyContextFactory(contextFactories, options) {
  return {
    factoryName: ATTRIBUTE_KEY_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};