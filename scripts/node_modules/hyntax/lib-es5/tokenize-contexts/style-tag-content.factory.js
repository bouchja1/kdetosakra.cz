'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_STYLE_TAG_CONTENT = _require2.TOKEN_STYLE_TAG_CONTENT;

var _require3 = require('../constants/tokenizer-contexts'),
    STYLE_CONTENT_CONTEXT = _require3.STYLE_CONTENT_CONTEXT,
    CLOSE_TAG_CONTEXT = _require3.CLOSE_TAG_CONTEXT;

var syntaxHandlers = {
  closingStyleTag: function closingStyleTag(state, tokens, contextFactories) {
    var closeTagContext = contextFactories[CLOSE_TAG_CONTEXT](contextFactories, { withinContent: 'style' });

    if (state.accumulatedContent !== '') {
      var range = calculateTokenCharactersRange(state, { keepBuffer: false });

      tokens.push({
        type: TOKEN_STYLE_TAG_CONTENT,
        content: state.accumulatedContent,
        startPosition: range.startPosition,
        endPosition: range.endPosition
      });
    }

    state.accumulatedContent = '';
    state.caretPosition -= state.decisionBuffer.length;
    state.decisionBuffer = '';
    state.currentContext = closeTagContext;
  }
};

var INCOMPLETE_CLOSING_TAG_PATTERN = /<\/[^>]+$/;
var CLOSING_STYLE_TAG_PATTERN = /<\/style\s*>/i;

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '<' || chars === '</' || INCOMPLETE_CLOSING_TAG_PATTERN.test(chars)) {
    /**
     * Signals to wait for more characters in
     * the decision buffer to decide about syntax
     */
    return function () {};
  }

  if (CLOSING_STYLE_TAG_PATTERN.test(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.closingStyleTag(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function styleTagContentContextFactory(contextFactories, options) {
  return {
    factoryName: STYLE_CONTENT_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};