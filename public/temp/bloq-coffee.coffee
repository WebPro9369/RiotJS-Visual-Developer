

























self = this
@hasOverlay = false
self.editMode = false
if opts.model.fromToolbox and config.editOnDrop
  @editMode = true
  
@on 'mount', =>
  if @editMode and opts.model.onBloqBoard and config.editOnDrop
    eventManager.trigger "editModeOn", self

  self.refs.typedBloq.on 'edit', ->
    self.edit()

  self.refs.typedBloq.on 'cancel', ->
    self.cancel()

  self.refs.typedBloq.on 'ok', ->
    self.ok()

  self.refs.typedBloq.on 'editModeOff', ->
    self.turnOffEditMode()

  self.refs.typedBloq.on 'delete', ->
    #self.editMode = false
    if self.editMode then self.turnOffEditMode()
    opts.remove()
    undoManager.createUndo()

@keypress = (e)=>
  e.stopPropagation()
  if e.keyCode == 13
    @ok()
  else if e.keyCode == 27
    @cancel()

@clearParameters = =>
  for param in opts.model.parameters
    param.value = ""
  @update()
@resetParameters = =>
  params = {}
  #$.extend params, scriptModel.lookup[opts.model.sbid]
  @update()

@holdItem = (e)=>
  eventManager.trigger "holdItem",
    bloq: self.opts.model
    from: "bloqboard"
    tag: self


@releaseItem = (e)=>
  eventManager.trigger "releaseItem"


#
# Edit Functions
#

self.edit = ()->
  self.editMode = true
  eventManager.trigger "editModeOn", self

self.cancel = ()->
  @turnOffEditMode()
  #@clearParameters()

  @resetParameters()

self.ok = ()->
  if self.refs.typedBloq?
    params = self.refs.typedBloq.getParameters()
    for param in params
      scriptModel.setParameter param.id,
        param.value,
        param.children
    undoManager.createUndo()
    @resetParameters()
  @turnOffEditMode()

@turnOffEditMode = =>
  self.editMode = false
  scriptModel.lookup[opts.model.sbid].fromToolbox = false
  eventManager.trigger "editModeOff", self


