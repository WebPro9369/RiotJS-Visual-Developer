





@getStyle = =>
  if opts.pos?
    if opts.pos == "both"
      return "border-radius: 11px;"
    return "border-top-" + opts.pos + "-radius: 11px; border-bottom-" + opts.pos + "-radius: 11px;"

  else
    return ""
@getParameter = => @refs.editor.getParameter()