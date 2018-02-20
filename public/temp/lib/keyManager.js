$(function() {
  return $("body").off("keypress").on("keypress", function(e) {
    if (e.ctrlKey) {
      if (e.keyCode === 26) {
        return undoManager.undo();
      } else if (e.keyCode === 25) {
        return undoManager.redo();
      }
    }
  });
});
