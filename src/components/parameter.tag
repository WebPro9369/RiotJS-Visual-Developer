parameter
  label {opts.model.label}
  virtual(ref="typedEditor" data-is="{opts.model.config.editor}"
    model="{opts.model}" edit-mode="{opts.editMode}"
    value='{opts.model.value}')

  style(type="text/stylus").

    user-select(select)
      -webkit-user-select select
      -khtml-user-drag select
      -khtml-user-select select
      -moz-user-select select
      if select == none
        -moz-user-select -moz-none
      -ms-user-select select
      user-select select

    flow-textbox
      color #000
      background-color #ef9a9a
      min-width 30px
      padding 3px
      //position relative
      user-select text
      display:block
      span
        //padding 0 4px

    .content-editable-div
      .command
      .static-command
      .placeholder
      .info-bloq
        float none

    .sortable-item 
      .placeholder
        float none
        &::before
          content ""
          position absolute;
          width 0
          height 0
          border 5px solid transparent
          border-top-color red
          top -12px
          //margin-left -5px
          border-bottom none

    label
      font-size 0.8rem
      color rgba(0,0,0,0.67)

  script(type="text/coffeescript").
    self = this

    @getParameter = =>
      result = @refs.typedEditor.getParameter()
      result.id = opts.model.sbid
      return result
      


