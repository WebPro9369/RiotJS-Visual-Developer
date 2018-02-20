operator-bloq( contenteditable="false")
  .operator-inner(
    class!="{editing-tb : opts.hasOverlay, flex-vertical: isOverWide}"
    bloq="{opts.model.bloq}"
    style="background: {opts.model.config.header}"
    ref="opBloq")

    text-editor.inline(
      ref="editor"
      value="{getParameterValue('right')}"
      pos="{ posLeft }"
      edit-mode="{opts.editMode}"
      model="{getParameter('right')}"
      if="{showSide('right')}")
    div(
      ref="buttonRoot"
      class="operator-action-button fixed-action-btn click-to-toggle")
      a.btn-floating.operator-action-button-element(
        class="{default-cursor: isOverWide }"
        hide="{isOverWide}")
        span.bloq-operator {opts.model.title}
      bloq-header(bloq="{opts.model.title}"
        color="{opts.model.config.header}"
        ref="header"
        show-edit="{hasParameters()}"
        edit-mode="{opts.editMode}"
        show="{isOverWide}")
      ul(ref="listRoot"
        class!='{listClasses()}'
        hide="{ isOverWide }")
        li.outer-li
          a.btn-floating.blue(
            hide="{opts.editMode}"
            onclick='{ edit }')
            i.material-icons create
        li.middle-li
          a.btn-floating.blue(
            show="{opts.editMode}"
            onclick='{ ok }')
            i.material-icons check
        li.outer-li
          a.btn-floating.blue(
            show="{opts.editMode}"
            onclick='{ cancel }')
            i.material-icons do_not_disturb
        li.right-li
          a.btn-floating.blue(
            onclick='{ delete }')
            i.material-icons clear

    text-editor.inline(
      ref="editor"
      value="{getParameterValue('left')}"
      pos="{ posRight }"
      edit-mode="{opts.editMode}"
      model="{getParameter('left')}"
      if="{showSide('left')}")

  style(type="text/stylus").
    @import '../mixins'
    @import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700")
    .operator-inner
      border-radius 13px
      padding 1px 3px 1px 3px
      display: flex
      justify-content: center
      align-items: stretch
      margin 0 0 0 0
      
      text-editor.inline
        width 100%

    .operator-bloq
      width: initial !important
      border-radius 13px
      
    .inline
      display inline-block
      border-radius 5px
    .bloq-operator
      font-size 14pt
      padding 0 4px
      background-color #2faaf6
    .dragged
      position absolute
      top 0
      opacity 0.8
      z-index 2000
      .command
        shadow-7dp()

    .outer-li
      float left

    .middle-li
      margin-right: 16px
      float left
    
    .right-li
      float right

    .btn
      background #2962ff !important
      height 30px !important
      line-height 0px !important

    .draggable-element
      //position relative
      //z-index 3

    .flex-vertical
      flex-direction column

    div.operator-action-button
      position relative
      margin: 0
      padding: 0
      right: 0
      bottom: 0
      left: 0 
      top: 0
      z-index: 1

    div.operator-action-button a.operator-action-button-element
      height: auto
      width: auto
      border-radius: 13px
      line-height: initial
      box-shadow: none

    div.operator-action-button a.operator-action-button-element.default-cursor
      cursor default

    div.operator-action-button ul.operator-action-button-buttonlist
      width: 60px;
      position: absolute
      top: -120%
      text-align: center
      left 50% !important
      transform: translate(-50%, -50%)

    div.operator-action-button ul.operator-action-button-buttonlist li a
      width: 17.5px
      height: 17.5px
      line-height: 17.5px

    div.operator-action-button ul.operator-action-button-buttonlist li a i
      font-size: 0.7rem
      line-height 17.5px

    .two-button-list
      width 60px !important
      //left -18px !important

    .three-button-list
      width 85px !important
      //left -27px !important
    .button-list-in-vertical-mode
      top 0 !important
    .no-visibility
      visibility hidden !important

  script(type="text/coffeescript").
    self = this
    @mixin mixins.eventBubbler
    @bubbleEvents()
    self.boundaryWidth = 300
    self.isOverWide = false
    self.posLeft = "left"
    self.posRight = "right"
    self.widthPaddings = 18
    self.widthPlus = 17 # width of "+" symbol
    @cachedSide = if (opts.model?.config?.side?) then opts.model.config.side else "not_set"

    self.on 'mount', ->
      self.refs.header.on 'ok', (e)=>
        if @getTotalWidth() > self.boundaryWidth
          @applyVerticalModeEffect true
        else
          @applyVerticalModeEffect false
        @update()
        @closeButtons()  

    @getParameters = =>
      parameters = []
      editors = @refs.editor
      if !editors then return parameters
      if !Array.isArray(editors)
        editors = Array(1).fill(editors)
      for editor in editors
        param =
          id: editor.opts.model.sbid
          value: editor.getParameter().value
        
        parameters.push param
      parameters

    this.listClasses = ->
      classes =
        "operator-action-button-buttonlist": true 
        "editing": opts.editMode
        "three-button-list": opts.editMode
        "two-button-list": !opts.editMode
        "button-list-in-vertical-mode": self.isOverWide
        "no-visibility": self.isOverWide
      return classes
    self.editable = opts.editable || true

    self.avoidPropagation = (e)->
      e.stopPropagation()

    @edit = (e)=>
      e.stopPropagation()
      self.trigger "edit"
      @update()
      @closeButtons true

    @delete = (e) =>
      e.stopPropagation()
      @trigger 'delete'

    @ok = (e) =>
      e.stopPropagation()
      @trigger 'ok'
      if @getTotalWidth() > self.boundaryWidth
        @applyVerticalModeEffect true
      else
        @applyVerticalModeEffect false
      @update()
      @closeButtons()

    @cancel = (e) =>
      e.stopPropagation()
      @trigger 'cancel'
      @closeButtons()

    @closeButtons = (reopen)=>
      targetDiv = $ @refs.buttonRoot
      if reopen
        targetUl = $ @refs.listRoot
        targetUl.hide()
      targetDiv.closeFAB()
      if reopen
        setTimeout ->
          targetUl.show()
          targetDiv.openFAB()
        , 150

    @applyVerticalModeEffect = (bool) =>
      if bool
        self.posLeft = "both"
        self.posRight = "both"
      else
        self.posLeft = "left"
        self.posRight = "right"
      self.isOverWide = bool

    @showSide = (side) =>
      return (@cachedSide == side) || (@cachedSide == "not_set")

    @getParameter = (side) =>
      if !opts.model?.parameters? or !@showSide(side)
        return null      
      if side is "right"
        return opts.model.parameters[0]
      else if side is "left"
        return opts.model.parameters[opts.model.parameters.length - 1]
      else
        null

    @getParameterValue = (side) =>
      if param = @getParameter(side)
        return param.value
      null

    @hasParameters = () =>
      true
    @getTotalWidth = () =>
      result = 0
      for param in @getParameters()
        result += $.fn.textWidth param.value
      result + self.widthPlus + self.widthPaddings
        
    $.fn.textWidth = (text, font = '14px Inconsolata') ->
      if (!$.fn.textWidth.fakeEl)
        $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body)
      $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'))
      return $.fn.textWidth.fakeEl.width()
