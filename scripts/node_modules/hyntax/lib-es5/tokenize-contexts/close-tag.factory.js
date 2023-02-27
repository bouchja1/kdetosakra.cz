'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_CLOSE_TAG = _require2.TOKEN_CLOSE_TAG,
    TOKEN_CLOSE_TAG_SCRIPT = _require2.TOKEN_CLOSE_TAG_SCRIPT,
    TOKEN_CLOSE_TAG_STYLE = _require2.TOKEN_CLOSE_TAG_STYLE;

var _require3 = require('../constants/tokenizer-contexts'),
    CLOSE_TAG_CONTEXT = _require3.CLOSE_TAG_CONTEXT,
    DATA_CONTEXT = _require3.DATA_CONTEXT;

/**
 * @param withinContent — type of content withing
 * which the close tag was found
 */


function getCloseTokenType(withinContent) {
  switch (withinContent) {
    case 'script':
      {
        return TOKEN_CLOSE_TAG_SCRIPT;
      }

    case 'style':
      {
        return TOKEN_CLOSE_TAG_STYLE;
      }

    case 'data':
      {
        return TOKEN_CLOSE_TAG;
      }
  }
}

var syntaxHandlers = {
  closingCornerBrace: function closingCornerBrace(state, tokens, contextFactories, options) {
    var tokenType = getCloseTokenType(options.withinContent);
    var dataContext = contextFactories[DATA_CONTEXT](contextFactories, options);
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });

    tokens.push({
      type: tokenType,
      content: '' + state.accumulatedContent + state.decisionBuffer,
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

module.exports = function closeTagContextFactory(contextFactories, options) {
  return {
    factoryName: CLOSE_TAG_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};