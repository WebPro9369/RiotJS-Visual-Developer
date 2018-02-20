
riot.tag2('text-editor', '<flow-textbox value="{opts.value}" riot-style="{getStyle()}" edit-mode="{opts.editMode}" sbid="{opts.model.sbid}" ref="editor" model="{opts.model}"></flow-textbox>', '', '', function(opts) {
this.getStyle = (function(_this) {
  return function() {
    if (opts.pos != null) {
      if (opts.pos === "both") {
        return "border-radius: 11px;";
      }
      return "border-top-" + opts.pos + "-radius: 11px; border-bottom-" + opts.pos + "-radius: 11px;";
    } else {
      return "";
    }
  };
})(this);

this.getParameter = (function(_this) {
  return function() {
    return _this.refs.editor.getParameter();
  };
})(this);
});