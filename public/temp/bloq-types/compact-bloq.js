
riot.tag2('compact-bloq', '<bloq-header bloq="{opts.model.name}" color="{opts.model.config.header}" editable-header="true" ref="header" show-edit="{true}" edit-mode="{opts.editMode}" has-overlay="{opts.hasOverlay}"></bloq-header>', '@import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700"); .dragged { position: absolute; top: 0; opacity: 0.8; z-index: 2000; } .dragged .command { box-shadow: 0px 4px 5px -2px rgba(0,0,0,0.4), 0px 7px 10px 1px rgba(0,0,0,0.28), 0px 2px 16px 1px rgba(0,0,0,0.24) !important; } .string-box command-bloq { margin: 0 7px; } .string-box command-bloq.placeholder:before { margin-left: 0px; } .variable-header { background: #6b29ff none repeat scroll 0 0; } .list-header { background: #006f57 none repeat scroll 0 0; } .command-body { clear: both; } .command-body .vertical { float: left; } normal-bloq, .static-command, .placeholder, .info-block { float: left; display: inline-block; clear: left; } .btn { background: #2962ff !important; height: 30px !important; line-height: 0px !important; }', '', function(opts) {
var self;

self = this;

self.on('mount', function() {
  $("a", this.root).mousedown(function(e) {
    return e.stopPropagation();
  });
  self.refs.header.on('edit', function(e) {
    opts.editMode = true;
    this.update();
    self.refs.header.focusText();
    return self.trigger("edit");
  });
  self.refs.header.on('ok', (function(_this) {
    return function(e) {
      return _this.ok(e);
    };
  })(this));
  self.refs.header.on('cancel', (function(_this) {
    return function(e) {
      return _this.cancel();
    };
  })(this));
  return self.refs.header.on('delete', (function(_this) {
    return function(e) {
      return _this.trigger("delete");
    };
  })(this));
});

self.avoidPropagation = function(e) {
  return e.stopPropagation();
};

this.keypress = (function(_this) {
  return function(e) {
    e.stopPropagation();
    if (e.keyCode === 13) {
      e.preventDefault();
      return _this.refs.header.ok(e);
    } else if (e.keyCode === 27) {
      return _this.cancel(e);
    }
  };
})(this);

this.cancel = (function(_this) {
  return function() {
    var temp;
    temp = scriptModel.lookup[opts.model.sbid].name;
    opts.model.name = "";
    _this.update();
    opts.model.name = temp;
    _this.update();
    return _this.trigger("editModeOff");
  };
})(this);

this.ok = (function(_this) {
  return function(e) {
    var model;
    model = scriptModel.changeStoredName(opts.model.sbid, e);
    self.update({
      model: model
    });
    eventManager.trigger("storeUpdated");
    return _this.trigger("editModeOff");
  };
})(this);
});