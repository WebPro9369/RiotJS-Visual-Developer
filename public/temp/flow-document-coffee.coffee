




























self = this
self.model = []
self.editing = false
self.on 'mount', ->
  self.model = opts.model
  self.update() 
@preventUpdates = (e)->
  e.preventUpdate = true
  e.stopPropagation()


@isEditable = =>
  return if opts.editMode then "true" else "false"

@removeFunc = (index)=>
  =>
    if opts.editMode
      paramModel = scriptModel.lookup[opts.sbid]
      paramModel.flowModel.model.splice index, 1
      @update()

