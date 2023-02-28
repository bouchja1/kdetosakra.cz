'use strict';

var _require = require('../helpers'),
    parseOpenTagName = _require.parseOpenTagName,
    isWhitespace = _require.isWhitespace,
    calculateTokenCharactersRange = _require.calculateTokenCharactersRange;

var _require2 = require('../constants/token-types'),
    TOKEN_OPEN_TAG_START = _require2.TOKEN_OPEN_TAG_START,
    TOKEN_OPEN_TAG_START_SCRIPT = _require2.TOKEN_OPEN_TAG_START_SCRIPT,
    TOKEN_OPEN_TAG_START_STYLE = _require2.TOKEN_OPEN_TAG_START_STYLE;

var _require3 = require('../constants/tokenizer-contexts'),
    OPEN_TAG_START_CONTEXT = _require3.OPEN_TAG_START_CONTEXT,
    OPEN_TAG_END_CONTEXT = _require3.OPEN_TAG_END_CONTEXT,
    ATTRIBUTES_CONTEXT = _require3.ATTRIBUTES_CONTEXT;

function handleTagEndAfterScriptOpenTagStart(state, tokens, contextFactories) {
  var openTagEndContext = contextFactories[OPEN_TAG_END_CONTEXT](contextFactories, { tagName: 'script' });
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  tokens.push({
    type: TOKEN_OPEN_TAG_START_SCRIPT,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.caretPosition -= state.decisionBuffer.length;
  state.decisionBuffer = '';
  state.currentContext = openTagEndContext;
}

function handleTagEndAfterStyleOpenTagStart(state, tokens, contextFactories) {
  var openTagEndContext = contextFactories[OPEN_TAG_END_CONTEXT](contextFactories, { tagName: 'style' });
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  tokens.push({
    type: TOKEN_OPEN_TAG_START_STYLE,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.caretPosition -= state.decisionBuffer.length;
  state.decisionBuffer = '';
  state.currentContext = openTagEndContext;
}

function handleTagEndAfterOpenTagStart(state, tokens, contextFactories) {
  var openTagEndContext = contextFactories[OPEN_TAG_END_CONTEXT](contextFactories, { tagName: undefined });
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  tokens.push({
    type: TOKEN_OPEN_TAG_START,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.caretPosition -= state.decisionBuffer.length;
  state.decisionBuffer = '';
  state.currentContext = openTagEndContext;
}

function handleWhitespaceAfterScriptOpenTagStart(state, tokens, contextFactories) {
  var attributesContext = contextFactories[ATTRIBUTES_CONTEXT](contextFactories, { tagName: 'script' });
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  tokens.push({
    type: TOKEN_OPEN_TAG_START_SCRIPT,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.caretPosition -= state.decisionBuffer.length;
  state.decisionBuffer = '';
  state.currentContext = attributesContext;
}

function handleWhitespaceAfterStyleOpenTagStart(state, tokens, contextFactories) {
  var attributesContext = contextFactories[ATTRIBUTES_CONTEXT](contextFactories, { tagName: 'style' });
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  tokens.push({
    type: TOKEN_OPEN_TAG_START_STYLE,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.caretPosition -= state.decisionBuffer.length;
  state.decisionBuffer = '';
  state.currentContext = attributesContext;
}

function handleWhitespaceAfterOpenTagStart(state, tokens, contextFactories) {
  var attributesContext = contextFactories[ATTRIBUTES_CONTEXT](contextFactories, { tagName: undefined });
  var range = calculateTokenCharactersRange(state, { keepBuffer: false });

  tokens.push({
    type: TOKEN_OPEN_TAG_START,
    content: state.accumulatedContent,
    startPosition: range.startPosition,
    endPosition: range.endPosition
  });

  state.accumulatedContent = '';
  state.caretPosition -= state.decisionBuffer.length;
  state.decisionBuffer = '';
  state.currentContext = attributesContext;
}

var syntaxHandlers = {
  tagEnd: function tagEnd(state, tokens, contextFactories, options) {
    var tagName = parseOpenTagName(state.accumulatedContent);

    switch (tagName) {
      case 'script':
        {
          handleTagEndAfterScriptOpenTagStart(state, tokens, contextFactories, options);
          break;
        }

      case 'style':
        {
          handleTagEndAfterStyleOpenTagStart(state, tokens, contextFactories, options);
          break;
        }

      default:
        {
          handleTagEndAfterOpenTagStart(state, tokens, contextFactories, options);
        }
    }
  },
  whitespace: function whitespace(state, tokens, contextFactories, options) {
    var tagName = parseOpenTagName(state.accumulatedContent);

    switch (tagName) {
      case 'script':
        {
          handleWhitespaceAfterScriptOpenTagStart(state, tokens, contextFactories, options);
          break;
        }

      case 'style':
        {
          handleWhitespaceAfterStyleOpenTagStart(state, tokens, contextFactories, options);
          break;
        }

      default:
        {
          handleWhitespaceAfterOpenTagStart(state, tokens, contextFactories, options);
        }
    }
  }
};

function _parseSyntax(chars, syntaxHandlers, contextFactories, options) {
  if (chars === '>' || chars === '/') {
    return function (state, tokens) {
      return syntaxHandlers.tagEnd(state, tokens, contextFactories, options);
    };
  }

  if (isWhitespace(chars)) {
    return function (state, tokens) {
      return syntaxHandlers.whitespace(state, tokens, contextFactories, options);
    };
  }
}

module.exports = function openTagStartContextFactory(contextFactories, options) {
  return {
    factoryName: OPEN_TAG_START_CONTEXT,
    parseSyntax: function parseSyntax(chars) {
      return _parseSyntax(chars, syntaxHandlers, contextFactories, options);
    }
  };
};