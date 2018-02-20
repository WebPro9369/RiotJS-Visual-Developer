text-editor
  flow-textbox(value="{opts.value}" style="{getStyle()}"
    edit-mode="{opts.editMode}" sbid="{opts.model.sbid}"
    ref="editor" model="{opts.model}")

  script(type="text/coffeescript").
    @getStyle = =>
      if opts.pos?
        if opts.pos == "both"
          return "border-radius: 11px;"
        return "border-top-" + opts.pos + "-radius: 11px; border-bottom-" + opts.pos + "-radius: 11px;"

      else
        return ""
    @getParameter = => @refs.editor.getParameter()