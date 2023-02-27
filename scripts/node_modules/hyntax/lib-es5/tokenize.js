"use strict";

var _contextHandlersMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dataContext = require('./tokenizer-context-handlers/data');

var openTagStartContext = require('./tokenizer-context-handlers/open-tag-start');

var closeTagContext = require('./tokenizer-context-handlers/close-tag');

var openTagEndContext = require('./tokenizer-context-handlers/open-tag-end');

var attributesContext = require('./tokenizer-context-handlers/attributes');

var attributeKeyContext = require('./tokenizer-context-handlers/attribute-key');

var attributeValueContext = require('./tokenizer-context-handlers/attribute-value');

var attributeValueBareContext = require('./tokenizer-context-handlers/attribute-value-bare');

var attributeValueWrappedContext = require('./tokenizer-context-handlers/attribute-value-wrapped');

var scriptContentContext = require('./tokenizer-context-handlers/script-tag-content');

var styleContentContext = require('./tokenizer-context-handlers/style-tag-content');

var doctypeStartContext = require('./tokenizer-context-handlers/doctype-start');

var doctypeEndContextFactory = require('./tokenizer-context-handlers/doctype-end');

var doctypeAttributesContext = require('./tokenizer-context-handlers/doctype-attributes');

var doctypeAttributeWrappedContext = require('./tokenizer-context-handlers/doctype-attribute-wrapped');

var doctypeAttributeBareEndContext = require('./tokenizer-context-handlers/doctype-attribute-bare');

var commentContentContext = require('./tokenizer-context-handlers/comment-content');

var _require = require('./constants/tokenizer-contexts'),
    DATA_CONTEXT = _require.DATA_CONTEXT,
    OPEN_TAG_START_CONTEXT = _require.OPEN_TAG_START_CONTEXT,
    CLOSE_TAG_CONTEXT = _require.CLOSE_TAG_CONTEXT,
    ATTRIBUTES_CONTEXT = _require.ATTRIBUTES_CONTEXT,
    OPEN_TAG_END_CONTEXT = _require.OPEN_TAG_END_CONTEXT,
    ATTRIBUTE_KEY_CONTEXT = _require.ATTRIBUTE_KEY_CONTEXT,
    ATTRIBUTE_VALUE_CONTEXT = _require.ATTRIBUTE_VALUE_CONTEXT,
    ATTRIBUTE_VALUE_BARE_CONTEXT = _require.ATTRIBUTE_VALUE_BARE_CONTEXT,
    ATTRIBUTE_VALUE_WRAPPED_CONTEXT = _require.ATTRIBUTE_VALUE_WRAPPED_CONTEXT,
    SCRIPT_CONTENT_CONTEXT = _require.SCRIPT_CONTENT_CONTEXT,
    STYLE_CONTENT_CONTEXT = _require.STYLE_CONTENT_CONTEXT,
    DOCTYPE_START_CONTEXT = _require.DOCTYPE_START_CONTEXT,
    DOCTYPE_END_CONTEXT = _require.DOCTYPE_END_CONTEXT,
    DOCTYPE_ATTRIBUTES_CONTEXT = _require.DOCTYPE_ATTRIBUTES_CONTEXT,
    DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT = _require.DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT,
    DOCTYPE_ATTRIBUTE_BARE_CONTEXT = _require.DOCTYPE_ATTRIBUTE_BARE_CONTEXT,
    COMMENT_CONTENT_CONTEXT = _require.COMMENT_CONTENT_CONTEXT;

var contextHandlersMap = (_contextHandlersMap = {}, _defineProperty(_contextHandlersMap, DATA_CONTEXT, dataContext), _defineProperty(_contextHandlersMap, OPEN_TAG_START_CONTEXT, openTagStartContext), _defineProperty(_contextHandlersMap, CLOSE_TAG_CONTEXT, closeTagContext), _defineProperty(_contextHandlersMap, ATTRIBUTES_CONTEXT, attributesContext), _defineProperty(_contextHandlersMap, OPEN_TAG_END_CONTEXT, openTagEndContext), _defineProperty(_contextHandlersMap, ATTRIBUTE_KEY_CONTEXT, attributeKeyContext), _defineProperty(_contextHandlersMap, ATTRIBUTE_VALUE_CONTEXT, attributeValueContext), _defineProperty(_contextHandlersMap, ATTRIBUTE_VALUE_BARE_CONTEXT, attributeValueBareContext), _defineProperty(_contextHandlersMap, ATTRIBUTE_VALUE_WRAPPED_CONTEXT, attributeValueWrappedContext), _defineProperty(_contextHandlersMap, SCRIPT_CONTENT_CONTEXT, scriptContentContext), _defineProperty(_contextHandlersMap, STYLE_CONTENT_CONTEXT, styleContentContext), _defineProperty(_contextHandlersMap, DOCTYPE_START_CONTEXT, doctypeStartContext), _defineProperty(_contextHandlersMap, DOCTYPE_END_CONTEXT, doctypeEndContextFactory), _defineProperty(_contextHandlersMap, DOCTYPE_ATTRIBUTES_CONTEXT, doctypeAttributesContext), _defineProperty(_contextHandlersMap, DOCTYPE_ATTRIBUTE_WRAPPED_CONTEXT, doctypeAttributeWrappedContext), _defineProperty(_contextHandlersMap, DOCTYPE_ATTRIBUTE_BARE_CONTEXT, doctypeAttributeBareEndContext), _defineProperty(_contextHandlersMap, COMMENT_CONTENT_CONTEXT, commentContentContext), _contextHandlersMap);

function tokenizeChars(chars, state, tokens, _ref) {
  var isFinalChunk = _ref.isFinalChunk,
      positionOffset = _ref.positionOffset;
  var charIndex = state.caretPosition - positionOffset;

  while (charIndex < chars.length) {
    var context = contextHandlersMap[state.currentContext];
    state.decisionBuffer += chars[charIndex];
    context.parseSyntax(state.decisionBuffer, state, tokens);
    charIndex = state.caretPosition - positionOffset;
  }

  if (isFinalChunk) {
    var _context = contextHandlersMap[state.currentContext]; // Move the caret back, as at this point
    // it in the position outside of chars array,
    // and it should not be taken into account
    // when calculating characters range

    state.caretPosition--;

    if (_context.handleContentEnd !== undefined) {
      _context.handleContentEnd(state, tokens);
    }
  }
}

function tokenize() {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var existingState = arguments.length > 1 ? arguments[1] : undefined;

  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      isFinalChunk = _ref2.isFinalChunk;

  isFinalChunk = isFinalChunk === undefined ? true : isFinalChunk;
  var state;

  if (existingState !== undefined) {
    state = Object.assign({}, existingState);
  } else {
    state = {
      currentContext: DATA_CONTEXT,
      contextParams: {},
      decisionBuffer: '',
      accumulatedContent: '',
      caretPosition: 0
    };
  }

  var chars = state.decisionBuffer + content;
  var tokens = [];
  var positionOffset = state.caretPosition - state.decisionBuffer.length;
  tokenizeChars(chars, state, tokens, {
    isFinalChunk: isFinalChunk,
    positionOffset: positionOffset
  });
  return {
    state: state,
    tokens: tokens
  };
}

module.exports = tokenize;