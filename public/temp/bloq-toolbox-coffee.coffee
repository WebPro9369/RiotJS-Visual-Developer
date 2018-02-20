














































self = this
self.model = this.opts

@holdItem = (e)=>
  storeName = null
  if opts.name?
    storeName = opts.name
  newBloq = scriptModel.newBloq(opts.bloqType, undefined, storeName)
  newBloq.fromToolbox = true
  eventManager.trigger "holdItem",
    bloq: newBloq
    from: "toolbox"


@releaseItem = (e)=>
  eventManager.trigger "releaseItem"

#todo update to new architecture
@getColor = ->
  # return "2962ff"
  bloq = scriptModel.newBloq opts.bloqType
  return bloq.config.header

self.getModel =  ()->
  return self.model

  