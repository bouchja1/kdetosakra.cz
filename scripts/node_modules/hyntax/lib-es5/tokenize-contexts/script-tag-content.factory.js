'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_SCRIPT_TAG_CONTENT = _require2.TOKEN_SCRIPT_TAG_CONTENT;

var _require3 = require('../constants/tokenizer-contexts'),
    SCRIPT_CONTENT_CONTEXT = _require3.SCRIPT_CONTENT_CONTEXT,
    CLOSE_TAG_CONTEXT = _require3.CLOSE_TAG_CONTEXT;

var syntaxHandlers = {
  closingScriptTag: function closingScriptTag(state, tokens, contextFactories) {
    var closeTagContext = contextFactories[CLOSE_TAG_CONTEXT](contextFactories, { withinContent: 'script' });

    if (state.accumulatedContent !== '') {
      var range = calculateTokenCharactersRange(state, { keepBuffer: false });

      tokens.push({
        type: TOKEN_SCRIPT_TAG_CONTENT,
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
var CLOSING_SCRIPT_TAG_PATTERN = /<\/script\s*>/i;

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '<' || chars === '</' || INCOMPLETE_CLOSING_TAG_PATTERN.test(chars)) {
    /**
     * Signals to wait for more characters in
     * the decision buffer to decide about syntax
     */
    return function () {};
  }

  if (CLOSING_SCRIPT_TAG_PATTERN.test(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.closingScriptTag(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function scriptTagContentContextFactory(contextFactories, options) {
  return {
    factoryName: SCRIPT_CONTENT_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};