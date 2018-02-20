flow-element(class!='{ "draggable-element": opts.editMode }')
  span(ref="content" if="{opts.type=='text'}"
    onclick="{preventUpdates}"
    mousedown="{preventUpdates}") {opts.content}
  bloq(ref="bloq"
    if="{opts.type=='bloq'}"
    data-sbid="{opts.bloq.sbid}"
    model="{opts.bloq}" draggable="false"
    remove="{opts.remove}")
  style(type="text/stylus").
    flow-element
      float none
      > bloq
        display inline-block
        .command
          float none
          margin-top 0px
 


  script(type="text/coffeescript").
    #todo add haschildren, children, and output it bloq as they are needed
    self = this
    self.editing = opts.editing || false
    self.preventUpdates = (e)->
      e.preventUpdate = true
      e.stopPropagation()
