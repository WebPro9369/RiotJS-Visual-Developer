











































self = this
@setValue = (item)=>
  =>
    @refs.editor.setFlowValue(item)
self.getItems = ->
  if opts.model.config.store?
    stores = scriptModel.stores[opts.model.config.store]
    if stores?.items? then return stores.items
  else if typeof opts.model.items is "string"
    #return #the store items
    # added by Marcel
    # can we return array of string?
    return opts.model.items.split ' '
  else
    return opts.model.items

## ms
@getParameter = => @refs.editor.getParameter()
self.on "mount", () =>
  $(this.refs.btnDropDown).dropdown
    belowOrigin: true
    alignment: 'right'
