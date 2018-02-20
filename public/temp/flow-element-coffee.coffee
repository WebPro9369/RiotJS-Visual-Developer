




















#todo add haschildren, children, and output it bloq as they are needed
self = this
self.editing = opts.editing || false
self.preventUpdates = (e)->
  e.preventUpdate = true
  e.stopPropagation()
