


































































































































































self = this
@mixin mixins.eventBubbler
@bubbleEvents()
self.boundaryWidth = 300
self.isOverWide = false
self.posLeft = "left"
self.posRight = "right"
self.widthPaddings = 18
self.widthPlus = 17 # width of "+" symbol
@cachedSide = if (opts.model?.config?.side?) then opts.model.config.side else "not_set"

self.on 'mount', ->
  self.refs.header.on 'ok', (e)=>
    if @getTotalWidth() > self.boundaryWidth
      @applyVerticalModeEffect true
    else
      @applyVerticalModeEffect false
    @update()
    @closeButtons()  

@getParameters = =>
  parameters = []
  editors = @refs.editor
  if !editors then return parameters
  if !Array.isArray(editors)
    editors = Array(1).fill(editors)
  for editor in editors
    param =
      id: editor.opts.model.sbid
      value: editor.getParameter().value
    
    parameters.push param
  parameters

this.listClasses = ->
  classes =
    "operator-action-button-buttonlist": true 
    "editing": opts.editMode
    "three-button-list": opts.editMode
    "two-button-list": !opts.editMode
    "button-list-in-vertical-mode": self.isOverWide
    "no-visibility": self.isOverWide
  return classes
self.editable = opts.editable || true

self.avoidPropagation = (e)->
  e.stopPropagation()

@edit = (e)=>
  e.stopPropagation()
  self.trigger "edit"
  @update()
  @closeButtons true

@delete = (e) =>
  e.stopPropagation()
  @trigger 'delete'

@ok = (e) =>
  e.stopPropagation()
  @trigger 'ok'
  if @getTotalWidth() > self.boundaryWidth
    @applyVerticalModeEffect true
  else
    @applyVerticalModeEffect false
  @update()
  @closeButtons()

@cancel = (e) =>
  e.stopPropagation()
  @trigger 'cancel'
  @closeButtons()

@closeButtons = (reopen)=>
  targetDiv = $ @refs.buttonRoot
  if reopen
    targetUl = $ @refs.listRoot
    targetUl.hide()
  targetDiv.closeFAB()
  if reopen
    setTimeout ->
      targetUl.show()
      targetDiv.openFAB()
    , 150

@applyVerticalModeEffect = (bool) =>
  if bool
    self.posLeft = "both"
    self.posRight = "both"
  else
    self.posLeft = "left"
    self.posRight = "right"
  self.isOverWide = bool

@showSide = (side) =>
  return (@cachedSide == side) || (@cachedSide == "not_set")

@getParameter = (side) =>
  if !opts.model?.parameters? or !@showSide(side)
    return null      
  if side is "right"
    return opts.model.parameters[0]
  else if side is "left"
    return opts.model.parameters[opts.model.parameters.length - 1]
  else
    null

@getParameterValue = (side) =>
  if param = @getParameter(side)
    return param.value
  null

@hasParameters = () =>
  true
@getTotalWidth = () =>
  result = 0
  for param in @getParameters()
    result += $.fn.textWidth param.value
  result + self.widthPlus + self.widthPaddings
    
$.fn.textWidth = (text, font = '14px Inconsolata') ->
  if (!$.fn.textWidth.fakeEl)
    $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body)
  $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'))
  return $.fn.textWidth.fakeEl.width()
