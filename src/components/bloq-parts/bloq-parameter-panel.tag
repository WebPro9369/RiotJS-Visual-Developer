bloq-parameter-panel.background(class!="{editing-tb : opts.hasOverlay}")
  parameter(each="{param in opts.parameters}" model="{param}"
    edit-mode="{parent.opts.editMode}" ref="parameter")
  div.edit-btn(if="{opts.editMode}")
    button(type='button' class='btn ok-button'
      onmousedown="{ this.avoidPropagation }"
      onclick='{ ok }')
      i.material-icons check
      | Ok
    button(type='button' class='btn cancel-button'
     onmousedown="{ this.avoidPropagation }"
     onclick='{ cancel }')
      i.material-icons do_not_disturb
      |Cancel

  style(type="text/stylus").

    .editing-tb
      z-index 3
      position relative

    bloq-parameter-panel
      display block
      margin 0px 0px 0px 0px
      padding 0px 10px 10px 10px
      color #fff
      font-family 'Inconsolata'
      float left
      clear both
      width 100%


    .edit-btn
       float right
       margin-top 20px

  script(type="text/coffeescript").
    @getParameters = =>
      parameters = []
      for param in @tags.parameter
        parameters.push param.getParameter()
      parameters

    @ok = (e)=>
      @avoidPropagation e
      @trigger "ok"

    @cancel = (e)=>
      @trigger "cancel"

    @avoidPropagation = (e)->
      e.preventUpdate = true
      e.stopPropagation()
