$ ->
  $("body").off("keypress").on "keypress", (e)->
    if e.ctrlKey
      if e.keyCode == 26
        undoManager.undo()
      else if e.keyCode == 25
        undoManager.redo()