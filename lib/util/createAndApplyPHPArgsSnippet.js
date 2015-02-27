/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 *
 * @link http://git.io/bNdV
 * @param  {String[]} args
 * @param  {String}   word
 * @param  {Object}   editor
 * @param  {String[]} allowedScopes
 * @return {void}
 */
function createAndApplyPHPArgsSnippet(args, word, editor, allowedScopes) {
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
  snippet[allowedScopes.join(',')] = {
    'php:__snippet__': {
      prefix: word,
      body: word + body
    }
  };

  var snippetModule = atom.packages.getActivePackage('snippets').mainModule;

  snippetModule.add(word, snippet);
  snippetModule.expandSnippetsUnderCursors(editor);
};

module.exports = createAndApplyPHPArgsSnippet;
