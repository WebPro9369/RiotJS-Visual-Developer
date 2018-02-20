




































@getParameters = =>
  parameters = []
  for param in @tags.parameter
    parameters.push param.getParameter()
  parameters

@ok = (e)=>
  @avoidPropagation e
  @trigger "ok"

@cancel = (e)=>
  @trigger "cancel"

@avoidPropagation = (e)->
  e.preventUpdate = true
  e.stopPropagation()
