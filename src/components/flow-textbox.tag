flow-textbox
  flow-document(
    ref="doc" edit-mode="{opts.editMode}"
    model='{ model.model }'
    onkeydown="{keypress}"
    onmousedown="{stopPropagation}"
    sbid="{opts.sbid}"
    children="{opts.children}")
      
  style(type="text/stylus").
    .editing-tb
      z-index 3
      position relative
    

  script(type="text/coffeescript").
    self = this
    @editedValue = opts.value
    @clearing = false
    @updateModel = (value=undefined, children=[])=>
      newModel = null
      if value?
        newModel = 
          value: value
          children: children
      else
        newModel = opts.model
      @model = new FlowModel(newModel)
      paramModel = scriptModel.lookup[opts.model.sbid]
      paramModel.flowModel = @model

    eventManager.on 'holdItem', (e, item)=>
      if opts.editMode
        parameter = @getParameter()
        @updateModel parameter.value, parameter.children
        ## 
        ## added by Marcel
        if item.from is "toolbox"
          self.update()

    @keypress = (e)=>
      if e.keyCode == 13
        e.preventDefault()
      else if e.keyCode == 8
        ##
        ## Code lines below are just to fix bug #39(Flow-Document : empty text node , sometime flow-document UI not getting updated)
        ## But this is a little hacky solution, as it took a way to process specific key event, rather than common riot way
        param = @getParameter()
        if param.value == ""
          e.preventDefault()
          param = @getParameter()
          @updateModel param.value, param.children
          @removeStaticText()
          @update()

    @on "update", =>
      if not opts.editMode
        @updateModel()
        @removeStaticText()

    @updateModel()

    @setFlowValue = (value)=>
      @updateModel value
      @update()

    @stopPropagation = (e)->
      e.stopPropagation()

    @getParameter = =>
      tag = this.tags["flow-document"]
      @model.createModelFromDom tag.root.childNodes

    @removeStaticText = =>
      tag = this.tags["flow-document"]
      chNodes = tag.root.childNodes
      for item in chNodes
        type = $(item).attr("type")
        switch type
          when undefined
            item.data = ""