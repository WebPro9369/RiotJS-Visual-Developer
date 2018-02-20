










































































self = this
@mixin mixins.eventBubbler
@bubbleEvents()
@hasElse = false

@removeFunc = (index)=>
  =>
    bloq = scriptModel.removeBloq @opts.model.listid, index
    if bloq.bloq is "else"
      @hasElse = false
    @update()

@getParameters = ->
  if self.refs.body?
    return self.refs.body.getParameters()

@hasParameters = ->
  opts.model.parameters? and
    opts.model.parameters.length > 0

@elseIfClick = ->
  bloq = scriptModel.newBloq "else if"
  if @hasElse
    scriptModel.insertBloq opts.model.listid, bloq, opts.model.children.length - 1
  else
    scriptModel.insertBloq opts.model.listid, bloq, opts.model.children.length
  undoManager.createUndo()
  newModel = scriptModel.lookup[opts.model.sbid]
  @update model: newModel

@elseClick = ->
  @hasElse = true
  bloq = scriptModel.newBloq "else"
  scriptModel.insertBloq opts.model.listid, bloq, opts.model.children.length
  undoManager.createUndo()
  newModel = scriptModel.lookup[opts.model.sbid]
  @update model: newModel

self.getChildren = ->
  if opts.hasChildren
    opts.children
  else
    []

self.avoidPropagation = (e)->
  e.stopPropagation()

