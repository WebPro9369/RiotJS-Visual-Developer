ifinner-bloq(contenteditable="false")
  //- rename to stacker inner bloq
  bloq-header(bloq="{opts.model.bloq}"
    color="{opts.model.config.header}"
    show-edit="{hasParameters()}"
    show-delete="{opts.model.config.showDelete}"
    ref="header"
    edit-mode="{opts.editMode}"
    draggable="{opts.draggable}")
  bloq-parameter-panel(style="background: {opts.model.config.background}"
    parameters="{opts.model.parameters}"
    edit-mode="{opts.editMode}"
    if="{hasParameters()}"
    ref="body"
    has-overlay="{opts.hasOverlay}")
  bloq-list(style="background: {opts.model.config.background}"
    ref="bloqlist"
    sbid="{opts.model.listid}"
    if="{opts.model.hasChildren}"
    script="{opts.model.children}")

  //bloq-list(each="{this.hasChildren ? [1]: []}" script="{this.getChildren()}")
  drop-bloq.background(if="{opts.model.hasChildren}")

  style(type="text/stylus").
    @import '../mixins'
    @import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700")
  
    .command  , .static-command , .placeholder , .info-block
      float left
      display inline-block
      clear left

    .btn
      background #2962ff !important
      height 30px !important
      line-height 0px !important

    .draggable-element
      //position relative
      //z-index 3

  script(type="text/coffeescript").
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

