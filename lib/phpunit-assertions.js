/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */

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

    var prefix = options.prefix;
    var editor = this.editor;

    return fuzzaldrin.filter(assertions, prefix, {
        key: 'name'
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
                _createAndApplyArgsSnippet(
                    this,
                    editor
                );
            }
        };
    }.bind(this));
};

module.exports = PHPUnitAssertionsProvider;
