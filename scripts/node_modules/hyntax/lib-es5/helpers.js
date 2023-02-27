"use strict";

var OPEN_TAG_NAME_PATTERN = /^<(\S+)/;
var CLOSE_TAG_NAME_PATTERN = /^<\/((?:.|\n)*)>$/;

function prettyJSON(obj) {
  return JSON.stringify(obj, null, 2);
}
/**
 * Clear tree of nodes from everything
 * "parentRef" properties so the tree
 * can be easily stringified into JSON.
 */


function clearAst(ast) {
  var cleanAst = ast;
  delete cleanAst.parentRef;

  if (Array.isArray(ast.content.children)) {
    cleanAst.content.children = ast.content.children.map(function (node) {
      return clearAst(node);
    });
  }

  return cleanAst;
}

function parseOpenTagName(openTagStartTokenContent) {
  var match = openTagStartTokenContent.match(OPEN_TAG_NAME_PATTERN);

  if (match === null) {
    throw new Error('Unable to parse open tag name.\n' + "".concat(openTagStartTokenContent, " does not match pattern of opening tag."));
  }

  return match[1].toLowerCase();
}

function parseCloseTagName(closeTagTokenContent) {
  var match = closeTagTokenContent.match(CLOSE_TAG_NAME_PATTERN);

  if (match === null) {
    throw new Error('Unable to parse close tag name.\n' + "".concat(closeTagTokenContent, " does not match pattern of closing tag."));
  }

  return match[1].trim().toLowerCase();
}

function calculateTokenCharactersRange(state, _ref) {
  var keepBuffer = _ref.keepBuffer;

  if (keepBuffer === undefined) {
    throw new Error('Unable to calculate characters range for token.\n' + '"keepBuffer" parameter is not specified to decide if ' + 'the decision buffer is a part of characters range.');
  }

  var startPosition = state.caretPosition - (state.accumulatedContent.length - 1) - state.decisionBuffer.length;
  var endPosition;

  if (!keepBuffer) {
    endPosition = state.caretPosition - state.decisionBuffer.length;
  } else {
    endPosition = state.caretPosition;
  }

  return {
    startPosition: startPosition,
    endPosition: endPosition
  };
}

function isWhitespace(_char) {
  return _char === ' ' || _char === '\n' || _char === '\t';
}

module.exports = {
  prettyJSON: prettyJSON,
  clearAst: clearAst,
  parseOpenTagName: parseOpenTagName,
  parseCloseTagName: parseCloseTagName,
  calculateTokenCharactersRange: calculateTokenCharactersRange,
  isWhitespace: isWhitespace
};