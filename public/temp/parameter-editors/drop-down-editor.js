
riot.tag2('drop-down-editor', '<div class="input-field"><flow-textbox value="{opts.value}" model="{opts.model}" edit-mode="{opts.editMode}" ref="editor"></flow-textbox><a href="#" data-activates="dropdown{_riot_id}" ref="btnDropDown" show="{opts.editMode}" class="dropdown-button btn-flat"><i class="material-icons">arrow_drop_down </i></a><ul id="dropdown{_riot_id}" show="{opts.editMode}" class="dropdown-content"><li each="{item in getItems()}"><a href="#!" onclick="{parent.setValue(item)}">{item}</a></li></ul></div>', 'parameter .input-field { margin-top: 0px; display: flex; justify-content: center; align-items: stretch; } parameter .input-field flow-textbox { width: 100%; } parameter .input-field a.dropdown-button.btn-flat { width: 20px; padding: 0px; color: #000; background-color: #ef9a9a !important; line-height: 1.5rem !important; height: auto !important; } parameter .input-field a.dropdown-button.btn-flat i.material-icons { vertical-align: text-top; } parameter .input-field ul.dropdown-content.active { width: 100% !important; left: 0px !important; } parameter .input-field ul.dropdown-content.active li i.material-icons { float: left; margin-right: 16px; }', '', function(opts) {
var self;

self = this;

this.setValue = (function(_this) {
  return function(item) {
    return function() {
      return _this.refs.editor.setFlowValue(item);
    };
  };
})(this);

self.getItems = function() {
  var stores;
  if (opts.model.config.store != null) {
    stores = scriptModel.stores[opts.model.config.store];
    if ((stores != null ? stores.items : void 0) != null) {
      return stores.items;
    }
  } else if (typeof opts.model.items === "string") {
    return opts.model.items.split(' ');
  } else {
    return opts.model.items;
  }
};

this.getParameter = (function(_this) {
  return function() {
    return _this.refs.editor.getParameter();
  };
})(this);

self.on("mount", (function(_this) {
  return function() {
    return $(_this.refs.btnDropDown).dropdown({
      belowOrigin: true,
      alignment: 'right'
    });
  };
})(this));
});