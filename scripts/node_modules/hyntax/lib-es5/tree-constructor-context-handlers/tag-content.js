"use strict";

var parseCloseTagName = require('../helpers').parseCloseTagName;

var _require = require('../constants/token-types'),
    TOKEN_OPEN_TAG_START = _require.TOKEN_OPEN_TAG_START,
    TOKEN_CLOSE_TAG = _require.TOKEN_CLOSE_TAG,
    TOKEN_COMMENT_START = _require.TOKEN_COMMENT_START,
    TOKEN_DOCTYPE_START = _require.TOKEN_DOCTYPE_START,
    TOKEN_TEXT = _require.TOKEN_TEXT,
    TOKEN_OPEN_TAG_START_SCRIPT = _require.TOKEN_OPEN_TAG_START_SCRIPT,
    TOKEN_OPEN_TAG_START_STYLE = _require.TOKEN_OPEN_TAG_START_STYLE;

var _require2 = require('../constants/tree-constructor-contexts'),
    TAG_CONTEXT = _require2.TAG_CONTEXT,
    COMMENT_CONTEXT = _require2.COMMENT_CONTEXT,
    DOCTYPE_CONTEXT = _require2.DOCTYPE_CONTEXT,
    SCRIPT_TAG_CONTEXT = _require2.SCRIPT_TAG_CONTEXT,
    STYLE_TAG_CONTEXT = _require2.STYLE_TAG_CONTEXT;

var _require3 = require('../constants/ast-nodes'),
    NODE_TAG = _require3.NODE_TAG,
    NODE_TEXT = _require3.NODE_TEXT,
    NODE_DOCTYPE = _require3.NODE_DOCTYPE,
    NODE_COMMENT = _require3.NODE_COMMENT,
    NODE_SCRIPT = _require3.NODE_SCRIPT,
    NODE_STYLE = _require3.NODE_STYLE;

function handleOpenTagStart(state) {
  if (state.currentNode.content.children === undefined) {
    state.currentNode.content.children = [];
  }

  var tagNode = {
    nodeType: NODE_TAG,
    parentRef: state.currentNode,
    content: {}
  };
  state.currentNode.content.children.push(tagNode);
  state.currentNode = tagNode;
  state.currentContext = {
    parentRef: state.currentContext,
    type: TAG_CONTEXT
  };
  return state;
}

function handleCloseTag(state, token) {
  var closeTagName = parseCloseTagName(token.content);

  if (closeTagName !== state.currentNode.content.name) {
    state.caretPosition++;
    return state;
  }

  state.currentContext = state.currentContext.parentRef;
  return state;
}

function handleCommentStart(state) {
  if (state.currentNode.content.children === undefined) {
    state.currentNode.content.children = [];
  }

  var commentNode = {
    nodeType: NODE_COMMENT,
    parentRef: state.currentNode,
    content: {}
  };
  state.currentNode.content.children.push(commentNode);
  state.currentNode = commentNode;
  state.currentContext = {
    parentRef: state.currentContext,
    type: COMMENT_CONTEXT
  };
  return state;
}

function handleDoctypeStart(state) {
  if (state.currentNode.content.children === undefined) {
    state.currentNode.content.children = [];
  }

  var doctypeNode = {
    nodeType: NODE_DOCTYPE,
    parentRef: state.currentNode,
    content: {}
  };
  state.currentNode.content.children.push(doctypeNode);
  state.currentNode = doctypeNode;
  state.currentContext = {
    parentRef: state.currentContext,
    type: DOCTYPE_CONTEXT
  };
  return state;
}

function handleText(state, token) {
  if (state.currentNode.content.children === undefined) {
    state.currentNode.content.children = [];
  }

  var textNode = {
    nodeType: NODE_TEXT,
    parentRef: state.currentNode,
    content: {
      value: token
    }
  };
  state.currentNode.content.children.push(textNode);
  state.caretPosition++;
  return state;
}

function handleOpenTagStartScript(state) {
  if (state.currentNode.content.children === undefined) {
    state.currentNode.content.children = [];
  }

  var scriptNode = {
    nodeType: NODE_SCRIPT,
    parentRef: state.currentNode,
    content: {}
  };
  state.currentNode.content.children.push(scriptNode);
  state.currentNode = scriptNode;
  state.currentContext = {
    type: SCRIPT_TAG_CONTEXT,
    parentRef: state.currentContext
  };
  return state;
}

function handleOpenTagStartStyle(state) {
  if (state.currentNode.content.children === undefined) {
    state.currentNode.content.children = [];
  }

  var styleNode = {
    nodeType: NODE_STYLE,
    parentRef: state.currentNode,
    content: {}
  };
  state.currentNode.content.children.push(styleNode);
  state.currentNode = styleNode;
  state.currentContext = {
    type: STYLE_TAG_CONTEXT,
    parentRef: state.currentContext
  };
  return state;
}

module.exports = function tagContent(token, state) {
  if (token.type === TOKEN_OPEN_TAG_START) {
    return handleOpenTagStart(state, token);
  }

  if (token.type === TOKEN_TEXT) {
    return handleText(state, token);
  }

  if (token.type === TOKEN_CLOSE_TAG) {
    return handleCloseTag(state, token);
  }

  if (token.type === TOKEN_COMMENT_START) {
    return handleCommentStart(state, token);
  }

  if (token.type === TOKEN_DOCTYPE_START) {
    return handleDoctypeStart(state, token);
  }

  if (token.type === TOKEN_OPEN_TAG_START_SCRIPT) {
    return handleOpenTagStartScript(state, token);
  }

  if (token.type === TOKEN_OPEN_TAG_START_STYLE) {
    return handleOpenTagStartStyle(state, token);
  }

  state.caretPosition++;
  return state;
};