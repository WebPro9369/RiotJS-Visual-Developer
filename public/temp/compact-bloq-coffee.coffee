

























































self = this


self.on 'mount', ->
  # Purpose of this code unclear ?
  $("a", this.root).mousedown (e) ->
    e.stopPropagation()

  self.refs.header.on 'edit', (e)->
    opts.editMode = true
    @update()
    self.refs.header.focusText()
    self.trigger "edit"

  self.refs.header.on 'ok', (e)=>
    @ok e

  self.refs.header.on 'cancel', (e)=>
    @cancel()

  self.refs.header.on 'delete', (e)=>
    @trigger "delete"

self.avoidPropagation = (e)->
  e.stopPropagation()

@keypress = (e) =>
  e.stopPropagation()
  if e.keyCode == 13
    e.preventDefault()
    @refs.header.ok(e)
  else if e.keyCode == 27
    @cancel(e)

@cancel = () =>
  temp = scriptModel.lookup[opts.model.sbid].name
  opts.model.name = ""
  @update()
  opts.model.name = temp
  @update()
  @trigger "editModeOff"

@ok = (e) =>
  model = scriptModel.changeStoredName(opts.model.sbid, e)
  self.update model: model
  eventManager.trigger "storeUpdated"
  @trigger "editModeOff"
