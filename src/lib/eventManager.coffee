eventManager =

  o: $({})

  trigger: (event, tag)->
    @o.trigger.apply @o, arguments

  on: (event, func)->
    @o.on.apply @o, arguments

  off: (event, func)->
    @o.off.apply @o, arguments

