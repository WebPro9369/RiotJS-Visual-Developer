undoManager =
  undos: []
  redos: []
  currentUndo: []
  currentRedo: []
  undoing: false
  redoing: false
  pushAction: (func)->
    if @undoing
      @currentRedo.push func
    else
      @currentUndo.push func
    if not @undoing and not @redoing and @redos.length > 0
      @redos = []

  createUndo: ->
    @undos.push @currentUndo
    @currentUndo = []
  createRedo: ->
    @redos.push @currentRedo
    @currentRedo = []

  reset: ->
    @undos =[]
    @redos =[]
    @currentUndo =[]
    @currentRedo =[]
    @undoing= false
    @redoing= false

  undo: ->
    if @undos.length > 0
      undo = @undos.pop()
      @undoing = true
      while undo.length > 0
        action = undo.pop()
        action()
      @createRedo()
      @undoing = false
      eventManager.trigger "stateChange"

  redo: ->
    if @redos.length > 0
      redo = @redos.pop()
      @redoing = true
      while redo.length > 0
        action = redo.pop()
        action()
      @createUndo()
      @redoing = false
      eventManager.trigger "stateChange"