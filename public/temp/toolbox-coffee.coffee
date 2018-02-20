














































self = this
this.categories = scriptModel.toolbox
@on 'mount', ->
  eventManager.on "storeUpdated", ->
    self.update()
@isStore = (category)->
  if scriptModel.stores[category.name]?
    return true
  else
    return false
@storeType = (category)->
  return scriptModel.stores[category.name].bloqType

@getStore = (category)->
  return scriptModel.stores[category.name].items

@getVariables = ->
  Object.keys(scriptModel.variables)

self.on 'mount', ->
  $('.collapsible').collapsible()
  $("toolbox").sortable
    drop  : false
    group : 'nav'
