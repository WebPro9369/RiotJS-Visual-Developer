bloq-header(class="{ getClasses() }"
  style="background: {opts.color}"
  onkeydown="{keypress}")
  //-i.material-icons.bloq-icon cached
  span.bloq-title(contenteditable="{ isEditable() }") {opts.bloq}
  span(if="{opts.showButtons != 'false'}")
    span.deleteIcon.action-btn
      a.btn-flat.waves-effect.waves-tea.delete-bloq(show="{showDelete()}" onclick='{ delete }'
        mousedown="{avoidPropagation}")
        i.material-icons close 
    span.editIcon.action-btn
      a.btn-flat.waves-effect.waves-tea.edit-bloq(show="{showEdit()}"
        mousedown="{avoidPropagation}"
        onclick='{ edit }')
        i.material-icons edit
    span.cancelIcon.action-btn
      a.btn-flat.waves-effect.waves-tea.cancel-bloq(show="{opts.editMode}"
        mousedown="{avoidPropagation}"
        onclick='{ cancel }')
        i.material-icons do_not_disturb
    span.okIcon.action-btn
      a.btn-flat.waves-effect.waves-tea.ok-bloq(show="{opts.editMode}"
        mousedown="{avoidPropagation}"
        onclick='{ ok }')
        i.material-icons check

  style(type="text/stylus").

    bloq-header
      padding 5px
      display inline-block
      padding 2px 5px
      width 100%
    i
      &.icon-move
        cursor pointer

    .bloq-title
      margin-left 5px
      margin-right 30px
      
    .bloq-icon
      font-size 1rem !important
      color rgb(195, 195, 195)
      line-height 24px !important
      height 24px

    .action-btn // edit span  containing icon
      float right
      display inline-block
      a
        color #fff
        padding 0 0.7rem
        line-height 24px
        height 24px
        i
          font-size 0.7rem
    #editBtn
       display none 
       margin-top 20px
       float right
    .edit-btn
       float right
       margin-top 20px
    .editing-tb
      z-index 3
      position relative

  script(type="text/coffeescript").
    @isEditable = ->
      return opts.editMode? and opts.editMode and opts.editableHeader? and opts.editableHeader

    #todo capture keyboard enter and make it do ok
    # also esc for cancel
    @getClasses = =>
      if not opts.draggable?
        opts.draggable = true
      #I have no idea why == true is necessary. but it is.
      #if opts.draggable == true and not opts.editMode == true then "dragg-handler " else ""
      classes = 
        "editing-tb": opts.hasOverlay
        "dragg-handler": opts.draggable == true and not opts.editMode == true
    @avoidPropagation = (e)->
      e.stopPropagation()
      
    @edit = (e)=>
      e.stopPropagation()
      @trigger "edit"
    @showEdit = -> not opts.editMode and opts.showEdit
    @showDelete = ->
      if opts.showDelete?
        opts.showDelete
      else
        true
    @focusText = ->
      if opts.editableHeader == "true"
        $title = $(@root).find(".bloq-title")
        #todo make it focus at the end of the text
        $title.focus()

      
    @delete = (e)=>
      e.stopPropagation()
      @trigger "delete"

    @ok = (e)=>
      e.stopPropagation()
      @trigger "ok", $(@root).find(".bloq-title").text()
      
    @cancel = (e)=>
      e.stopPropagation()
      @trigger "cancel"

    @keypress = (e) =>
      if e.keyCode == 13
        e.preventDefault()
        @ok(e)
      else if e.keyCode == 27
        @cancel(e)
