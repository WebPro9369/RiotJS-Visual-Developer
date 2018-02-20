bloq-toolbox(mousedown="{holdItem}" mouseup="{releaseItem}")
  // todo rename to tool-bloq
  bloq-header(bloq="{opts.bloq}"
    color="{getColor()}"
    ref="header"
    show-buttons="false")

  style(type="text/stylus").
    @import 'mixins'
    bloq-toolbox
      
      display block
      margin 5px 0px 5px 0px
      padding 0px
      color #fff
      font-family 'Inconsolata'
      background #e8eaf6 none repeat scroll 0 0
      float none

      bloq-header
        padding 5px
        background #2962ff none repeat scroll 0 0
        display inline-block
        padding 2px 5px
        width 100%
    .command-header
      background #2962ff
    .function-header
      background #ff62ff

    bloq-toolbox
      &.dragged
        background transparent
        box-shadow none
        position absolute
        top 0
        opacity 0.8
        z-index 2000
        display inline-block
        .command
          shadow-7dp()
      blog
        margin 0px



  script(type="text/coffeescript").
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

  