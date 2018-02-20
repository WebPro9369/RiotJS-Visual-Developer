
riot.tag2('bloq-header', '<span contenteditable="{isEditable()}" class="bloq-title">{opts.bloq}</span><span if="{opts.showButtons != \'false\'}"><span class="deleteIcon action-btn"><a show="{showDelete()}" onclick="{delete}" mousedown="{avoidPropagation}" class="btn-flat waves-effect waves-tea delete-bloq"><i class="material-icons">close </i></a></span><span class="editIcon action-btn"><a show="{showEdit()}" mousedown="{avoidPropagation}" onclick="{edit}" class="btn-flat waves-effect waves-tea edit-bloq"><i class="material-icons">edit</i></a></span><span class="cancelIcon action-btn"><a show="{opts.editMode}" mousedown="{avoidPropagation}" onclick="{cancel}" class="btn-flat waves-effect waves-tea cancel-bloq"><i class="material-icons">do_not_disturb</i></a></span><span class="okIcon action-btn"><a show="{opts.editMode}" mousedown="{avoidPropagation}" onclick="{ok}" class="btn-flat waves-effect waves-tea ok-bloq"><i class="material-icons">check</i></a></span></span>', 'bloq-header { padding: 5px; display: inline-block; padding: 2px 5px; width: 100%; } i.icon-move { cursor: pointer; } .bloq-title { margin-left: 5px; margin-right: 30px; } .bloq-icon { font-size: 1rem !important; color: #c3c3c3; line-height: 24px !important; height: 24px; } .action-btn { float: right; display: inline-block; } .action-btn a { color: #fff; padding: 0 0.7rem; line-height: 24px; height: 24px; } .action-btn a i { font-size: 0.7rem; } #editBtn { display: none; margin-top: 20px; float: right; } .edit-btn { float: right; margin-top: 20px; } .editing-tb { z-index: 3; position: relative; }', 'riot-style="background: {opts.color}" onkeydown="{keypress}" class="{getClasses()}"', function(opts) {
this.isEditable = function() {
  return (opts.editMode != null) && opts.editMode && (opts.editableHeader != null) && opts.editableHeader;
};

this.getClasses = (function(_this) {
  return function() {
    var classes;
    if (opts.draggable == null) {
      opts.draggable = true;
    }
    return classes = {
      "editing-tb": opts.hasOverlay,
      "dragg-handler": opts.draggable === true && !opts.editMode === true
    };
  };
})(this);

this.avoidPropagation = function(e) {
  return e.stopPropagation();
};

this.edit = (function(_this) {
  return function(e) {
    e.stopPropagation();
    return _this.trigger("edit");
  };
})(this);

this.showEdit = function() {
  return !opts.editMode && opts.showEdit;
};

this.showDelete = function() {
  if (opts.showDelete != null) {
    return opts.showDelete;
  } else {
    return true;
  }
};

this.focusText = function() {
  var $title;
  if (opts.editableHeader === "true") {
    $title = $(this.root).find(".bloq-title");
    return $title.focus();
  }
};

this["delete"] = (function(_this) {
  return function(e) {
    e.stopPropagation();
    return _this.trigger("delete");
  };
})(this);

this.ok = (function(_this) {
  return function(e) {
    e.stopPropagation();
    return _this.trigger("ok", $(_this.root).find(".bloq-title").text());
  };
})(this);

this.cancel = (function(_this) {
  return function(e) {
    e.stopPropagation();
    return _this.trigger("cancel");
  };
})(this);

this.keypress = (function(_this) {
  return function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      return _this.ok(e);
    } else if (e.keyCode === 27) {
      return _this.cancel(e);
    }
  };
})(this);
});