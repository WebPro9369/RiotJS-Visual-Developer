flow-document.sortable-item(contenteditable="{ isEditable() }" 
  class!='{ "editing": opts.editMode }')
  flow-element(
    each='{element, index in opts.model}' 
    edit-mode="{parent.opts.editMode}"
    ref="elements"
    content='{element.content}' 
    type="{element.type}" 
    bloq="{element.bloq}"
    remove="{parent.removeFunc(index)}")
  style(type="text/stylus"). 
    flow-document
      display block
      float none
      min-height 1.5em
      &.sortable-item
        .placeholder
        .temp-placeholder
          float none
          clear none
          display inline-block
        /* 
        .placeholder
          &:before
            top 3px
            left -5px
        */

  script(type="text/coffeescript").
    self = this
    self.model = []
    self.editing = false
    self.on 'mount', ->
      self.model = opts.model
      self.update() 
    @preventUpdates = (e)->
      e.preventUpdate = true
      e.stopPropagation()
    
    
    @isEditable = =>
      return if opts.editMode then "true" else "false"

    @removeFunc = (index)=>
      =>
        if opts.editMode
          paramModel = scriptModel.lookup[opts.sbid]
          paramModel.flowModel.model.splice index, 1
          @update()

