/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 *
 * This is a clean-room of deprecated autocomplete-plus `prefixOfSelection`.
 *
 * @param  {RegExp}    wordRegex
 * @param  {Selection} selection
 * @param  {Editor}    editor
 * @return {String}
 */
function prefixOfSelection(wordRegex, selection, editor) {
  var prefix          = '';
  var selectionRange = selection.getBufferRange();

  /* @var Number[][] lineRange */
  var lineRange = [
    [
      selectionRange.start.row,
      0
    ], [
      selectionRange.end.row,
      editor.lineLengthForBufferRow(selectionRange.end.row)
    ]
  ];

  editor.getBuffer().scanInRange(wordRegex, lineRange, function(matches) {
    var stop  = matches.stop;
    var range = matches.range;

    if (range.start.isGreaterThan(selectionRange.end)) {
      stop();
    }

    if (range.intersectsWith(selectionRange)) {
      var prefixOffset = (
        selectionRange.start.column - range.start.column
      );

      if (range.start.isLessThan(selectionRange.start)) {
        prefix = matches.match[0].slice(
          0,
          prefixOffset
        );
      }
    }
  });

  return prefix;
}

module.exports = prefixOfSelection;
