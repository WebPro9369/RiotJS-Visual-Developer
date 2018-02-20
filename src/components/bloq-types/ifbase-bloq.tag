ifbase-bloq(contenteditable="false")
  //- todo rename to stacker bloq
  bloq-header(bloq="{opts.model.bloq}"
    color="{opts.model.config.header}"
    ref="header"
    show-edit="{hasParameters()}"
    edit-mode="{opts.editMode}"
    draggable="{opts.draggable}")
  bloq-parameter-panel(style="background: {opts.model.config.background}"
    parameters="{opts.model.parameters}"
    edit-mode="{opts.editMode}"
    if="{hasParameters()}"
    ref="body"
    has-overlay="{opts.hasOverlay}")
  .if-body.background(style="background: {opts.model.config.background}" sbid="{opts.model.listid}")
    bloq.background(each="{bloq, index in opts.model.children}"
      remove="{parent.removeFunc(index)}"
      model="{bloq}")
  //bloq-list.background(style="background: {opts.model.config.background}" ref="bloqlist" sbid="{opts.listid}" if="{opts.hasChildren}" script="{opts.children}")
  //div(style="clear: both")
  .background(style="background: {opts.model.config.background}")
    span.bloq-adder
      a(onclick="{elseIfClick}") +else if
    span.bloq-adder(if="{!hasElse}")
      a(onclick="{elseClick}") +else
  //bloq-list(each="{this.hasChildren ? [1]: []}" script="{this.getChildren()}")

  style(type="text/stylus").
    @import '../mixins'
    @import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700")
  
    .bloq-adder
      margin-left 10px
      cursor pointer
    .dragged
      position absolute
      top 0
      opacity 0.8
      z-index 2000
      .command
        shadow-7dp()


    .if-body
      padding-left 10px
      width 100%
      height 100%
      display block
      float left

      
    .command-body
      clear both
    .command-body .vertical
      float left
    .command  , .static-command , .placeholder , .info-block
      float left
      display inline-block
      clear left

    .btn
      background #2962ff !important
      height 30px !important
      line-height 0px !important

    .ifbase-bloq 
      .background
        float left
        width 100%

    .draggable-element
      //position relative
      //z-index 3

  script(type="text/coffeescript").
    self = this
    @mixin mixins.eventBubbler
    @bubbleEvents()
    @hasElse = false

    @removeFunc = (index)=>
      =>
        bloq = scriptModel.removeBloq @opts.model.listid, index
        if bloq.bloq is "else"
          @hasElse = false
        @update()

    @getParameters = ->
      if self.refs.body?
        return self.refs.body.getParameters()

    @hasParameters = ->
      opts.model.parameters? and
        opts.model.parameters.length > 0

    @elseIfClick = ->
      bloq = scriptModel.newBloq "else if"
      if @hasElse
        scriptModel.insertBloq opts.model.listid, bloq, opts.model.children.length - 1
      else
        scriptModel.insertBloq opts.model.listid, bloq, opts.model.children.length
      undoManager.createUndo()
      newModel = scriptModel.lookup[opts.model.sbid]
      @update model: newModel

    @elseClick = ->
      @hasElse = true
      bloq = scriptModel.newBloq "else"
      scriptModel.insertBloq opts.model.listid, bloq, opts.model.children.length
      undoManager.createUndo()
      newModel = scriptModel.lookup[opts.model.sbid]
      @update model: newModel

    self.getChildren = ->
      if opts.hasChildren
        opts.children
      else
        []

    self.avoidPropagation = (e)->
      e.stopPropagation()

