"use strict";

var _contextsMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var tag = require('./tree-constructor-context-handlers/tag');

var tagContent = require('./tree-constructor-context-handlers/tag-content');

var tagName = require('./tree-constructor-context-handlers/tag-name');

var attributes = require('./tree-constructor-context-handlers/attributes');

var attribute = require('./tree-constructor-context-handlers/attribute');

var attributeValue = require('./tree-constructor-context-handlers/attribute-value');

var comment = require('./tree-constructor-context-handlers/comment');

var doctype = require('./tree-constructor-context-handlers/doctype');

var doctypeAttributes = require('./tree-constructor-context-handlers/doctype-attributes');

var doctypeAttribute = require('./tree-constructor-context-handlers/doctype-attribute');

var scriptTag = require('./tree-constructor-context-handlers/script-tag');

var styleTag = require('./tree-constructor-context-handlers/style-tag');

var _require = require('./constants/tree-constructor-contexts'),
    TAG_CONTENT_CONTEXT = _require.TAG_CONTENT_CONTEXT,
    TAG_CONTEXT = _require.TAG_CONTEXT,
    TAG_NAME_CONTEXT = _require.TAG_NAME_CONTEXT,
    ATTRIBUTES_CONTEXT = _require.ATTRIBUTES_CONTEXT,
    ATTRIBUTE_CONTEXT = _require.ATTRIBUTE_CONTEXT,
    ATTRIBUTE_VALUE_CONTEXT = _require.ATTRIBUTE_VALUE_CONTEXT,
    COMMENT_CONTEXT = _require.COMMENT_CONTEXT,
    DOCTYPE_CONTEXT = _require.DOCTYPE_CONTEXT,
    DOCTYPE_ATTRIBUTES_CONTEXT = _require.DOCTYPE_ATTRIBUTES_CONTEXT,
    DOCTYPE_ATTRIBUTE_CONTEXT = _require.DOCTYPE_ATTRIBUTE_CONTEXT,
    SCRIPT_TAG_CONTEXT = _require.SCRIPT_TAG_CONTEXT,
    STYLE_TAG_CONTEXT = _require.STYLE_TAG_CONTEXT;

var _require2 = require('./constants/ast-nodes'),
    NODE_DOCUMENT = _require2.NODE_DOCUMENT;

var contextsMap = (_contextsMap = {}, _defineProperty(_contextsMap, TAG_CONTENT_CONTEXT, tagContent), _defineProperty(_contextsMap, TAG_CONTEXT, tag), _defineProperty(_contextsMap, TAG_NAME_CONTEXT, tagName), _defineProperty(_contextsMap, ATTRIBUTES_CONTEXT, attributes), _defineProperty(_contextsMap, ATTRIBUTE_CONTEXT, attribute), _defineProperty(_contextsMap, ATTRIBUTE_VALUE_CONTEXT, attributeValue), _defineProperty(_contextsMap, COMMENT_CONTEXT, comment), _defineProperty(_contextsMap, DOCTYPE_CONTEXT, doctype), _defineProperty(_contextsMap, DOCTYPE_ATTRIBUTES_CONTEXT, doctypeAttributes), _defineProperty(_contextsMap, DOCTYPE_ATTRIBUTE_CONTEXT, doctypeAttribute), _defineProperty(_contextsMap, SCRIPT_TAG_CONTEXT, scriptTag), _defineProperty(_contextsMap, STYLE_TAG_CONTEXT, styleTag), _contextsMap);

function processTokens(tokens, state, positionOffset) {
  var tokenIndex = state.caretPosition - positionOffset;

  while (tokenIndex < tokens.length) {
    var token = tokens[tokenIndex];
    var contextHandler = contextsMap[state.currentContext.type];
    state = contextHandler(token, state);
    tokenIndex = state.caretPosition - positionOffset;
  }

  return state;
}

module.exports = function constructTree() {
  var tokens = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var existingState = arguments.length > 1 ? arguments[1] : undefined;
  var state = existingState;

  if (existingState === undefined) {
    var rootContext = {
      type: TAG_CONTENT_CONTEXT,
      parentRef: undefined,
      content: []
    };
    var rootNode = {
      nodeType: NODE_DOCUMENT,
      parentRef: undefined,
      content: {}
    };
    state = {
      caretPosition: 0,
      currentContext: rootContext,
      currentNode: rootNode,
      rootNode: rootNode
    };
  }

  var positionOffset = state.caretPosition;
  processTokens(tokens, state, positionOffset);
  return {
    state: state,
    ast: state.rootNode
  };
};