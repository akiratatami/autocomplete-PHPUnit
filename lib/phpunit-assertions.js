/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
'use strict';

var AutocompleteProvider = require('autocomplete-plus').Provider;
var fuzzaldrin = require('fuzzaldrin');

// `$ php -f generate-assertions.php`
var assertions = require('../data/assertions.json');

/* @var {String[]} allowedScopes */
var allowedScopes = ['source.php'];

var PHPUnitAssertionsProvider = function() {
  AutocompleteProvider.call(this);
};

PHPUnitAssertionsProvider.prototype = new AutocompleteProvider();
// PHPUnitAssertionsProvider.prototype.wordRegex = /->\w*[a-zA-Z_-]+\w*\b/g;
PHPUnitAssertionsProvider.prototype.wordRegex = /(?:\$(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*))->\w*[a-zA-Z_-]+\w*\b/g;

/**
 * @link http://git.io/bNdV
 * @param  {Object} suggestion
 * @param  {Object} editor
 * @return {void}
 */
function _createAndApplyArgsSnippet (suggestion, editor) {
  var args  = suggestion.data.args;
  var parts = [];

  args.forEach(function (arg, index) {
    parts.push('${'.concat(
      (index + 1),
      ':',
      arg,
      '}'
    ));
  });

  var body = '(' + parts.join(', ')  +')$0';

  var snippet = {};
  snippet['.' + allowedScopes.join(', .')] = {
    'phpunit:assertion:snippet': {
      prefix: suggestion.word,
      body: suggestion.word + body
    }
  };

  var snippetModule = atom.packages.getActivePackage('snippets').mainModule;
  snippetModule.add(suggestion.word, snippet);
  snippetModule.expandSnippetsUnderCursors(editor);
};

/**
 * @param  {Object}   options
 * @return {Object[]}
 */
PHPUnitAssertionsProvider.prototype.buildSuggestions = function (options) {
  if (!options.cursor && !options.prefix.length) {
    return [];
  }

  for (var allowedScopeIndex in allowedScopes) {
    if (!~options.scope.scopes.indexOf(allowedScopes[allowedScopeIndex])) {
      return [];
    }
  }

  var editor    = this.editor;
  var selection = this.editor.getSelection();
  var prefix    = this.prefixOfSelection(options.editor.getSelection());

  if (!~prefix.indexOf('->')) {
    return [];
  }

  prefix = prefix.substring(prefix.lastIndexOf('->') + 2);

  return fuzzaldrin.filter(assertions, prefix, {
    key: 'name',
    maxResults: 7
  }).map(function (assertion) {
    var args = assertion.args;

    return {
      word: assertion.name,
      prefix: prefix,
      label: '(' + args.join(', ') + ')',
      data: {
          args: args
      },
      onDidConfirm: function() {
        _createAndApplyArgsSnippet(this, editor);
      }
    };
  }.bind(this));
};

module.exports = PHPUnitAssertionsProvider;
