










































self = this
@mixin mixins.eventBubbler
@bubbleEvents()
@getParameters = ->
  if self.refs.body?
    return self.refs.body.getParameters()

@hasParameters = ->
  opts.model.parameters? and
    opts.model.parameters.length > 0

self.getChildren = ->
  if opts.hasChildren
    opts.children
  else
    []

self.avoidPropagation = (e)->
  e.stopPropagation()

