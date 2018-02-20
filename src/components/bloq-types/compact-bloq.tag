compact-bloq
  //- this bloq is for things like lists and variables
  bloq-header(bloq="{opts.model.name}"
    color="{opts.model.config.header}"
    editable-header="true"
    ref="header"
    show-edit="{true}"
    edit-mode="{opts.editMode}"
    has-overlay="{opts.hasOverlay}")

  style(type="text/stylus").
    @import '../mixins'
    @import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700")
  
    .dragged
      position absolute
      top 0
      opacity 0.8
      z-index 2000
      .command
        shadow-7dp()

    .string-box //TODO this should go somewhere else, like in the editors
      command-bloq
        margin 0 7px
        &.placeholder
          &:before
            margin-left 0px



    .variable-header
      background #6b29ff none repeat scroll 0 0
      
    .list-header
      background #006f57 none repeat scroll 0 0
      


    .command-body
      clear both
    .command-body .vertical
      float left
    normal-bloq  , .static-command , .placeholder , .info-block
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


    self.on 'mount', ->
      # Purpose of this code unclear ?
      $("a", this.root).mousedown (e) ->
        e.stopPropagation()

      self.refs.header.on 'edit', (e)->
        opts.editMode = true
        @update()
        self.refs.header.focusText()
        self.trigger "edit"

      self.refs.header.on 'ok', (e)=>
        @ok e

      self.refs.header.on 'cancel', (e)=>
        @cancel()

      self.refs.header.on 'delete', (e)=>
        @trigger "delete"

    self.avoidPropagation = (e)->
      e.stopPropagation()

    @keypress = (e) =>
      e.stopPropagation()
      if e.keyCode == 13
        e.preventDefault()
        @refs.header.ok(e)
      else if e.keyCode == 27
        @cancel(e)

    @cancel = () =>
      temp = scriptModel.lookup[opts.model.sbid].name
      opts.model.name = ""
      @update()
      opts.model.name = temp
      @update()
      @trigger "editModeOff"

    @ok = (e) =>
      model = scriptModel.changeStoredName(opts.model.sbid, e)
      self.update model: model
      eventManager.trigger "storeUpdated"
      @trigger "editModeOff"
