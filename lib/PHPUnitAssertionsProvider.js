/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var fuzzaldrin = require('fuzzaldrin');
var prefixOfSelection = require('./util/prefixOfSelection');
var createAndApplyPHPArgsSnippet = require('./util/createAndApplyPHPArgsSnippet');
var phpunitAssertions = require(__dirname + '/../data/assertions.json');

function PHPUnitAssertionsProvider() {
  this.id        = 'autocomplete-phpunit-assertionsprovider';
  this.selector  = '.source.php';

  // @link {http://stackoverflow.com/a/19563063/2895842}
  this.wordRegex = /(?:\$(?:[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*))->\w*[a-zA-Z_-]+\w*\b/g;
}

PHPUnitAssertionsProvider.prototype = {
  /**
   * @param  {Object} opts
   * @return {Object[]}
   */
  requestHandler: function(opts) {
    var selector  = this.selector;
    var editor    = opts.editor;
    var selection = editor.getSelection();
    var prefix    = prefixOfSelection(this.wordRegex, selection, editor);

    if (!~prefix.indexOf('->')) {
      return [];
    }

    prefix = prefix.substring(prefix.lastIndexOf('->') + 2);

    return fuzzaldrin.filter(phpunitAssertions, prefix, {
      key: 'name',
      maxResults: 7
    }).map(function(assertion) {
      /* @var String[] args */
      var args = assertion.args;

      return {
        word: assertion.name,
        prefix: prefix,
        label: '(' + args.join(', ') + ')',
        onDidConfirm: function() {
          createAndApplyPHPArgsSnippet(
            args,
            this.word,
            editor,
            selector.split(',')
          );
        }
      };
    });
  }
};

module.exports = PHPUnitAssertionsProvider;
