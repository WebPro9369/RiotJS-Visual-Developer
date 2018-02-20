




































































@isEditable = ->
  return opts.editMode? and opts.editMode and opts.editableHeader? and opts.editableHeader

#todo capture keyboard enter and make it do ok
# also esc for cancel
@getClasses = =>
  if not opts.draggable?
    opts.draggable = true
  #I have no idea why == true is necessary. but it is.
  #if opts.draggable == true and not opts.editMode == true then "dragg-handler " else ""
  classes = 
    "editing-tb": opts.hasOverlay
    "dragg-handler": opts.draggable == true and not opts.editMode == true
@avoidPropagation = (e)->
  e.stopPropagation()
  
@edit = (e)=>
  e.stopPropagation()
  @trigger "edit"
@showEdit = -> not opts.editMode and opts.showEdit
@showDelete = ->
  if opts.showDelete?
    opts.showDelete
  else
    true
@focusText = ->
  if opts.editableHeader == "true"
    $title = $(@root).find(".bloq-title")
    #todo make it focus at the end of the text
    $title.focus()

  
@delete = (e)=>
  e.stopPropagation()
  @trigger "delete"

@ok = (e)=>
  e.stopPropagation()
  @trigger "ok", $(@root).find(".bloq-title").text()
  
@cancel = (e)=>
  e.stopPropagation()
  @trigger "cancel"

@keypress = (e) =>
  if e.keyCode == 13
    e.preventDefault()
    @ok(e)
  else if e.keyCode == 27
    @cancel(e)
