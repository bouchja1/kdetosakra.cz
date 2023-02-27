'use strict';

var _require = require('../helpers'),
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_OPEN_TAG_END = _require2.TOKEN_OPEN_TAG_END,
    TOKEN_OPEN_TAG_END_SCRIPT = _require2.TOKEN_OPEN_TAG_END_SCRIPT,
    TOKEN_OPEN_TAG_END_STYLE = _require2.TOKEN_OPEN_TAG_END_STYLE;

var _require3 = require('../constants/tokenizer-contexts'),
    OPEN_TAG_END_CONTEXT = _require3.OPEN_TAG_END_CONTEXT,
    DATA_CONTEXT = _require3.DATA_CONTEXT,
    SCRIPT_CONTENT_CONTEXT = _require3.SCRIPT_CONTENT_CONTEXT,
    STYLE_CONTENT_CONTEXT = _require3.STYLE_CONTENT_CONTEXT;

function getTokenType(tagName) {
  switch (tagName) {
    case 'script':
      {
        return TOKEN_OPEN_TAG_END_SCRIPT;
      }

    case 'style':
      {
        return TOKEN_OPEN_TAG_END_STYLE;
      }

    default:
      {
        return TOKEN_OPEN_TAG_END;
      }
  }
}

function getContentContext(tagName, contextFactories, options) {
  switch (tagName) {
    case 'script':
      {
        return contextFactories[SCRIPT_CONTENT_CONTEXT](contextFactories, options);
      }

    case 'style':
      {
        return contextFactories[STYLE_CONTENT_CONTEXT](contextFactories, options);
      }

    default:
      {
        return contextFactories[DATA_CONTEXT](contextFactories, options);
      }
  }
}

var syntaxHandlers = {
  closingCornerBrace: function closingCornerBrace(state, tokens, contextFactories, options) {
    var range = calculateTokenCharactersRange(state, { keepBuffer: true });

    tokens.push({
      type: getTokenType(options.tagName),
      content: '' + state.accumulatedContent + state.decisionBuffer,
      startPosition: range.startPosition,
      endPosition: range.endPosition
    });

    state.accumulatedContent = '';
    state.decisionBuffer = '';
    state.currentContext = getContentContext(options.tagName, contextFactories, options);
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '>') {
    return function (state, tokens) {
      return syntaxHandlers.closingCornerBrace(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function openTagEndContextFactory(contextFactories, options) {
  return {
    factoryName: OPEN_TAG_END_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};