
riot.tag2('bloq-list', '<bloq each="{bloq, index in opts.script}" model="{bloq}" ref="bloq" remove="{parent.removeFunc(index)}"></bloq>', 'bloq > bloq-list { width: 100%; float: left; } bloq > bloq-list > bloq { width: 100%; } bloq-list.root { float: left; display: block; } bloq-list { display: block; padding: 0 10px 50px 10px; clear: both; } bloq-list.vertical { min-height: 10px; } bloq.placeholder { position: relative; margin: 0; padding: 0; border: none; } bloq.placeholder:before { position: absolute; content: ""; width: 0; height: 0; margin-top: -5px; left: -5px; top: -4px; border: 5px solid transparent; border-left-color: #c62828; border-right: none; } body { padding-left: 20px; }', '', function(opts) {
this.removeFunc = (function(_this) {
  return function(index) {
    return function() {
      scriptModel.removeBloq(_this.opts.sbid, index);
      return _this.update();
    };
  };
})(this);
});

riot.tag2('bloq-toolbox', '<bloq-header bloq="{opts.bloq}" color="{getColor()}" ref="header" show-buttons="false"></bloq-header>', 'bloq-toolbox { display: block; margin: 5px 0px 5px 0px; padding: 0px; color: #fff; font-family: \'Inconsolata\'; background: #e8eaf6 none repeat scroll 0 0; float: none; } bloq-toolbox bloq-header { padding: 5px; background: #2962ff none repeat scroll 0 0; display: inline-block; padding: 2px 5px; width: 100%; } .command-header { background: #2962ff; } .function-header { background: #ff62ff; } bloq-toolbox.dragged { background: transparent; box-shadow: none; position: absolute; top: 0; opacity: 0.8; z-index: 2000; display: inline-block; } bloq-toolbox.dragged .command { box-shadow: 0px 4px 5px -2px rgba(0,0,0,0.4), 0px 7px 10px 1px rgba(0,0,0,0.28), 0px 2px 16px 1px rgba(0,0,0,0.24) !important; } bloq-toolbox blog { margin: 0px; }', 'mousedown="{holdItem}" mouseup="{releaseItem}"', function(opts) {
var self;

self = this;

self.model = this.opts;

this.holdItem = (function(_this) {
  return function(e) {
    var newBloq, storeName;
    storeName = null;
    if (opts.name != null) {
      storeName = opts.name;
    }
    newBloq = scriptModel.newBloq(opts.bloqType, void 0, storeName);
    newBloq.fromToolbox = true;
    return eventManager.trigger("holdItem", {
      bloq: newBloq,
      from: "toolbox"
    });
  };
})(this);

this.releaseItem = (function(_this) {
  return function(e) {
    return eventManager.trigger("releaseItem");
  };
})(this);

this.getColor = function() {
  var bloq;
  bloq = scriptModel.newBloq(opts.bloqType);
  return bloq.config.header;
};

self.getModel = function() {
  return self.model;
};
});

riot.tag2('bloq-word', '<bloq-letter each="{singleLetter in opts.value.split(\' +\')}">{singleLetter}</bloq-letter>', '', '', function(opts) {
});

riot.tag2('bloq', '<virtual ref="typedBloq" data-is="{opts.model.config.bloqType}" model="{opts.model}" edit-mode="{editMode}" has-overlay="{hasOverlay}" draggable="{opts.draggable}"></virtual>', 'bloq-list >bloq { float: left; clear: left; box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12); margin: 5px 0px 5px 0px; padding: 0px; color: #fff; font-family: \'Inconsolata\'; } bloq.ifinner-bloq { float: left; width: 100%; }', 'mousedown="{holdItem}" mouseup="{releaseItem}" onkeyup="{keypress}" contenteditable="false" class="{opts.model.config.bloqType}"', function(opts) {
var self;

self = this;

this.hasOverlay = false;

self.editMode = false;

if (opts.model.fromToolbox && config.editOnDrop) {
  this.editMode = true;
}

this.on('mount', (function(_this) {
  return function() {
    if (_this.editMode && opts.model.onBloqBoard && config.editOnDrop) {
      eventManager.trigger("editModeOn", self);
    }
    self.refs.typedBloq.on('edit', function() {
      return self.edit();
    });
    self.refs.typedBloq.on('cancel', function() {
      return self.cancel();
    });
    self.refs.typedBloq.on('ok', function() {
      return self.ok();
    });
    self.refs.typedBloq.on('editModeOff', function() {
      return self.turnOffEditMode();
    });
    return self.refs.typedBloq.on('delete', function() {
      if (self.editMode) {
        self.turnOffEditMode();
      }
      opts.remove();
      return undoManager.createUndo();
    });
  };
})(this));

this.keypress = (function(_this) {
  return function(e) {
    e.stopPropagation();
    if (e.keyCode === 13) {
      return _this.ok();
    } else if (e.keyCode === 27) {
      return _this.cancel();
    }
  };
})(this);

this.clearParameters = (function(_this) {
  return function() {
    var i, len, param, ref;
    ref = opts.model.parameters;
    for (i = 0, len = ref.length; i < len; i++) {
      param = ref[i];
      param.value = "";
    }
    return _this.update();
  };
})(this);

this.resetParameters = (function(_this) {
  return function() {
    var params;
    params = {};
    return _this.update();
  };
})(this);

this.holdItem = (function(_this) {
  return function(e) {
    return eventManager.trigger("holdItem", {
      bloq: self.opts.model,
      from: "bloqboard",
      tag: self
    });
  };
})(this);

this.releaseItem = (function(_this) {
  return function(e) {
    return eventManager.trigger("releaseItem");
  };
})(this);

self.edit = function() {
  self.editMode = true;
  return eventManager.trigger("editModeOn", self);
};

self.cancel = function() {
  this.turnOffEditMode();
  return this.resetParameters();
};

self.ok = function() {
  var i, len, param, params;
  if (self.refs.typedBloq != null) {
    params = self.refs.typedBloq.getParameters();
    for (i = 0, len = params.length; i < len; i++) {
      param = params[i];
      scriptModel.setParameter(param.id, param.value, param.children);
    }
    undoManager.createUndo();
    this.resetParameters();
  }
  return this.turnOffEditMode();
};

this.turnOffEditMode = (function(_this) {
  return function() {
    self.editMode = false;
    scriptModel.lookup[opts.model.sbid].fromToolbox = false;
    return eventManager.trigger("editModeOff", self);
  };
})(this);
});

riot.tag2('bloqboard', '<bloq-list ref="bloqlist" script="{opts.script}" root="true" sbid="0" class="root"></bloq-list><div class="overlay {show: opts.showOverlay}"></div><drop-bloq></drop-bloq>', 'bloqboard { float: right; display: block; position: relative; z-index: 1; width: 80%; } .overlay { position: absolute; width: 100%; height: 100%; background: #000; opacity: 0.4; display: none; z-index: 2; top: 0px; left: 0px; } .show { display: block; } :scoped { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }', '', function(opts) {
var self;

self = this;

self.on('before-unmount', function() {
  return $("bloqboard bloq-list.root").sortable('destroy');
});
});


riot.tag2('drop-bloq', '<div class="drop-bloq">drop bloqs here</div>', 'drop-bloq { display: block; float: left; clear: both; position: relative; top: -40px; margin-bottom: -40px; left: 10px; } .drop-bloq { color: rgba(0,0,0,0.34); font-family: \'Inconsolata\'; font-size: 0.8rem; font-weight: bold; border-radius: 5px; border: 2px dashed #c5cae9; display: inline-block; padding: 4px 9px; }', '', function(opts) {
});

riot.tag2('flow-document', '<flow-element each="{element, index in opts.model}" edit-mode="{parent.opts.editMode}" ref="elements" content="{element.content}" type="{element.type}" bloq="{element.bloq}" remove="{parent.removeFunc(index)}"></flow-element>', 'flow-document { display: block; float: none; min-height: 1.5em; } flow-document.sortable-item .placeholder, flow-document.sortable-item .temp-placeholder { float: none; clear: none; display: inline-block; }', 'contenteditable="{isEditable()}" class="sortable-item {⁗editing⁗: opts.editMode}"', function(opts) {
var self;

self = this;

self.model = [];

self.editing = false;

self.on('mount', function() {
  self.model = opts.model;
  return self.update();
});

this.preventUpdates = function(e) {
  e.preventUpdate = true;
  return e.stopPropagation();
};

this.isEditable = (function(_this) {
  return function() {
    if (opts.editMode) {
      return "true";
    } else {
      return "false";
    }
  };
})(this);

this.removeFunc = (function(_this) {
  return function(index) {
    return function() {
      var paramModel;
      if (opts.editMode) {
        paramModel = scriptModel.lookup[opts.sbid];
        paramModel.flowModel.model.splice(index, 1);
        return _this.update();
      }
    };
  };
})(this);
});

riot.tag2('flow-element', '<span ref="content" if="{opts.type==\'text\'}" onclick="{preventUpdates}" mousedown="{preventUpdates}">{opts.content}</span><bloq ref="bloq" if="{opts.type==\'bloq\'}" data-sbid="{opts.bloq.sbid}" model="{opts.bloq}" draggable="false" remove="{opts.remove}"></bloq>', 'flow-element { float: none; } flow-element > bloq { display: inline-block; } flow-element > bloq .command { float: none; margin-top: 0px; }', 'class="{⁗draggable-element⁗: opts.editMode}"', function(opts) {
var self;

self = this;

self.editing = opts.editing || false;

self.preventUpdates = function(e) {
  e.preventUpdate = true;
  return e.stopPropagation();
};
});

riot.tag2('flow-textbox', '<flow-document ref="doc" edit-mode="{opts.editMode}" model="{model.model}" onkeydown="{keypress}" onmousedown="{stopPropagation}" sbid="{opts.sbid}" children="{opts.children}"></flow-document>', '.editing-tb { z-index: 3; position: relative; }', '', function(opts) {
var self;

self = this;

this.editedValue = opts.value;

this.clearing = false;

this.updateModel = (function(_this) {
  return function(value, children) {
    var newModel, paramModel;
    if (value == null) {
      value = void 0;
    }
    if (children == null) {
      children = [];
    }
    newModel = null;
    if (value != null) {
      newModel = {
        value: value,
        children: children
      };
    } else {
      newModel = opts.model;
    }
    _this.model = new FlowModel(newModel);
    paramModel = scriptModel.lookup[opts.model.sbid];
    return paramModel.flowModel = _this.model;
  };
})(this);

eventManager.on('holdItem', (function(_this) {
  return function(e, item) {
    var parameter;
    if (opts.editMode) {
      parameter = _this.getParameter();
      _this.updateModel(parameter.value, parameter.children);
      if (item.from === "toolbox") {
        return self.update();
      }
    }
  };
})(this));

this.keypress = (function(_this) {
  return function(e) {
    var param;
    if (e.keyCode === 13) {
      return e.preventDefault();
    } else if (e.keyCode === 8) {
      param = _this.getParameter();
      if (param.value === "") {
        e.preventDefault();
        param = _this.getParameter();
        _this.updateModel(param.value, param.children);
        _this.removeStaticText();
        return _this.update();
      }
    }
  };
})(this);

this.on("update", (function(_this) {
  return function() {
    if (!opts.editMode) {
      _this.updateModel();
      return _this.removeStaticText();
    }
  };
})(this));

this.updateModel();

this.setFlowValue = (function(_this) {
  return function(value) {
    _this.updateModel(value);
    return _this.update();
  };
})(this);

this.stopPropagation = function(e) {
  return e.stopPropagation();
};

this.getParameter = (function(_this) {
  return function() {
    var tag;
    tag = _this.tags["flow-document"];
    return _this.model.createModelFromDom(tag.root.childNodes);
  };
})(this);

this.removeStaticText = (function(_this) {
  return function() {
    var chNodes, i, item, len, results, tag, type;
    tag = _this.tags["flow-document"];
    chNodes = tag.root.childNodes;
    results = [];
    for (i = 0, len = chNodes.length; i < len; i++) {
      item = chNodes[i];
      type = $(item).attr("type");
      switch (type) {
        case void 0:
          results.push(item.data = "");
          break;
        default:
          results.push(void 0);
      }
    }
    return results;
  };
})(this);
});

riot.tag2('parameter', '<label>{opts.model.label}</label><virtual ref="typedEditor" data-is="{opts.model.config.editor}" model="{opts.model}" edit-mode="{opts.editMode}" value="{opts.model.value}"></virtual>', 'flow-textbox { color: #000; background-color: #ef9a9a; min-width: 30px; padding: 3px; -webkit-user-select: text; -khtml-user-drag: text; -khtml-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; display: block; } .content-editable-div .command, .content-editable-div .static-command, .content-editable-div .placeholder, .content-editable-div .info-bloq { float: none; } .sortable-item .placeholder { float: none; } .sortable-item .placeholder::before { content: ""; position: absolute; width: 0; height: 0; border: 5px solid transparent; border-top-color: #f00; top: -12px; border-bottom: none; } label { font-size: 0.8rem; color: rgba(0,0,0,0.67); }', '', function(opts) {
var self;

self = this;

this.getParameter = (function(_this) {
  return function() {
    var result;
    result = _this.refs.typedEditor.getParameter();
    result.id = opts.model.sbid;
    return result;
  };
})(this);
});

riot.tag2('toolbox', '<ul data-collapsible="expandable" class="collapsible"><li each="{category in categories}" class="single-category"><div class="collapsible-header"> {category.name} </div><div if="{isStore(category)}" class="collapsible-body"><bloq-toolbox bloq="new {storeType(category)}..." bloq-type="{storeType(category)}" data-bloq="{storeType(category)}"></bloq-toolbox><bloq-toolbox each="{item in getStore(category)}" name="{item}" bloq="{item}" bloq-type="{parent.storeType(parent.category)}" data-bloq="{parent.storeType(parent.category)}"></bloq-toolbox></div><div if="{!isStore(category)}" class="collapsible-body"><bloq-toolbox each="{name ,i in category.children}" bloq="{name}" bloq-type="{name}" data-bloq="{name}"></bloq-toolbox></div></li></ul>', 'toolbox { position: fixed; left: 0; top: 0; z-index: 2; float: left; width: 20%; box-sizing: border-box; padding: 0 20px; height: 100%; overflow-y: scroll; } .collapsible-header { background: #636363 !important; color: #fff; } .collapsible-body { padding: 0 5px; } :scoped { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }', '', function(opts) {
var self;

self = this;

this.categories = scriptModel.toolbox;

this.on('mount', function() {
  return eventManager.on("storeUpdated", function() {
    return self.update();
  });
});

this.isStore = function(category) {
  if (scriptModel.stores[category.name] != null) {
    return true;
  } else {
    return false;
  }
};

this.storeType = function(category) {
  return scriptModel.stores[category.name].bloqType;
};

this.getStore = function(category) {
  return scriptModel.stores[category.name].items;
};

this.getVariables = function() {
  return Object.keys(scriptModel.variables);
};

self.on('mount', function() {
  $('.collapsible').collapsible();
  return $("toolbox").sortable({
    drop: false,
    group: 'nav'
  });
});
});

riot.tag2('workspace', '<toolbox ref="toolbox" script="{opts.toolbox}"></toolbox><bloqboard ref="editor" script="{opts.script}" show-overlay="{showOverlay}"></bloqboard>', 'body { background-color: #252525; }', 'onkeypress="{keypress}"', function(opts) {
var self;

self = this;

window.workspace = this;

this.showOverlay = false;

this.sortStack = [];

this.overlayStack = [];

this.overlayFocus = null;

this.sortFocus = null;

this.heldItem = null;

eventManager.on("stateChange", (function(_this) {
  return function(e) {
    opts.script = scriptModel.mainScript;
    return _this.update();
  };
})(this));

this.addSortFocus = (function(_this) {
  return function(container) {
    if (_this.sortFocus === null) {
      throw "root focus not set";
    }
    _this.sortStack.push(_this.sortFocus);
    _this.sortFocus.sortable('destroy');
    container.sortable({
      group: 'nav',
      vertical: false
    });
    return _this.sortFocus = container;
  };
})(this);

this.removeSortFocus = (function(_this) {
  return function() {
    if (_this.sortStack.length < 1) {
      throw "removed root sortable";
    }
    _this.sortFocus.sortable('destroy');
    _this.sortFocus = _this.sortStack.pop();
    return _this.sortFocus.each(function() {
      return $(this).sortable({
        group: 'nav'
      });
    });
  };
})(this);

this.addOverlayFocus = (function(_this) {
  return function(bloq) {
    _this.showOverlay = true;
    if (_this.overlayFocus !== null) {
      _this.overlayFocus.hasOverlay = false;
      _this.overlayStack.push(_this.overlayFocus);
    }
    _this.overlayFocus = bloq;
    bloq.hasOverlay = true;
    return _this.update();
  };
})(this);

this.removeOverlayFocus = (function(_this) {
  return function() {
    _this.overlayFocus.hasOverlay = false;
    if (_this.overlayStack.length < 1) {
      _this.overlayFocus = null;
      _this.showOverlay = false;
    } else {
      _this.overlayFocus = _this.overlayStack.pop();
      _this.overlayFocus.hasOverlay = true;
    }
    return _this.update();
  };
})(this);

self.on('mount', (function(_this) {
  return function() {
    var $root, editor, oldIndex, trackBloq;
    editor = self.refs.editor;
    eventManager.on('holdItem', function(e, item) {
      if (_this.heldItem === null) {
        return _this.heldItem = item;
      }
    });
    eventManager.on('editModeOn', function(e, bloq) {
      _this.addOverlayFocus(bloq);
      return _this.addSortFocus($(bloq.root).find('.editing'));
    });
    eventManager.on('editModeOff', function(bloq) {
      _this.removeSortFocus();
      return _this.removeOverlayFocus();
    });
    oldIndex = [];
    trackBloq = [];
    $root = $("bloqboard bloq-list.root");
    _this.sortFocus = $root;
    return $root.sortable({
      itemSelector: 'bloq , .draggable-element , bloq-toolbox',
      handle: '.dragg-handler , .draggable-element',
      group: 'nav',
      exclude: '.not-draggable-element ,.dragged',
      containerSelector: 'bloq-list, .if-body, .editing',
      placeholder: '<bloq class="placeholder"></bloq>',
      isValidTarget: function($item, container) {
        if (container.el.is(".if-body")) {
          return false;
        } else {
          return true;
        }
      },
      onDragStart: function($item, container, _super) {
        var adorner;
        adorner = $("<bloq></bloq>");
        adorner.appendTo('.root');
        if (self.heldItem.from === "bloqboard") {
          self.heldItem.tag.opts.remove();
        }
        riot.mount(adorner, 'bloq', {
          model: self.heldItem.bloq
        });
        _super(adorner, container);
        return adorner;
      },
      onCancel: function($item, container, _super) {
        return self.heldItem = null;
      },
      onDrop: function($item, container, _super) {
        var containerId, itemIndex, tagRef;
        itemIndex = $(".placeholder").index();
        containerId = container.el.attr("sbid");
        tagRef = scriptModel.lookup[containerId];
        scriptModel.insertBloq(containerId, self.heldItem.bloq, itemIndex);
        self.heldItem.bloq.onBloqBoard = true;
        self.update({
          script: scriptModel.mainScript
        });
        undoManager.createUndo();
        return self.heldItem = null;
      }
    });
  };
})(this));
});

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

riot.tag2('bloq-parameter-panel', '<parameter each="{param in opts.parameters}" model="{param}" edit-mode="{parent.opts.editMode}" ref="parameter"></parameter><div if="{opts.editMode}" class="edit-btn"><button type="button" onmousedown="{this.avoidPropagation}" onclick="{ok}" class="btn ok-button"><i class="material-icons">check</i>Ok</button><button type="button" onmousedown="{this.avoidPropagation}" onclick="{cancel}" class="btn cancel-button"><i class="material-icons">do_not_disturb</i>Cancel</button></div>', '.editing-tb { z-index: 3; position: relative; } bloq-parameter-panel { display: block; margin: 0px 0px 0px 0px; padding: 0px 10px 10px 10px; color: #fff; font-family: \'Inconsolata\'; float: left; clear: both; width: 100%; } .edit-btn { float: right; margin-top: 20px; }', 'class="background {editing-tb : opts.hasOverlay}"', function(opts) {
this.getParameters = (function(_this) {
  return function() {
    var i, len, param, parameters, ref;
    parameters = [];
    ref = _this.tags.parameter;
    for (i = 0, len = ref.length; i < len; i++) {
      param = ref[i];
      parameters.push(param.getParameter());
    }
    return parameters;
  };
})(this);

this.ok = (function(_this) {
  return function(e) {
    _this.avoidPropagation(e);
    return _this.trigger("ok");
  };
})(this);

this.cancel = (function(_this) {
  return function(e) {
    return _this.trigger("cancel");
  };
})(this);

this.avoidPropagation = function(e) {
  e.preventUpdate = true;
  return e.stopPropagation();
};
});

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

riot.tag2('ifbase-bloq', '<bloq-header bloq="{opts.model.bloq}" color="{opts.model.config.header}" ref="header" show-edit="{hasParameters()}" edit-mode="{opts.editMode}" draggable="{opts.draggable}"></bloq-header><bloq-parameter-panel riot-style="background: {opts.model.config.background}" parameters="{opts.model.parameters}" edit-mode="{opts.editMode}" if="{hasParameters()}" ref="body" has-overlay="{opts.hasOverlay}"></bloq-parameter-panel><div riot-style="background: {opts.model.config.background}" sbid="{opts.model.listid}" class="if-body background"><bloq each="{bloq, index in opts.model.children}" remove="{parent.removeFunc(index)}" model="{bloq}" class="background"></bloq></div><div riot-style="background: {opts.model.config.background}" class="background"><span class="bloq-adder"><a onclick="{elseIfClick}">+else if</a></span><span if="{!hasElse}" class="bloq-adder"><a onclick="{elseClick}">+else</a></span></div>', '@import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700"); .bloq-adder { margin-left: 10px; cursor: pointer; } .dragged { position: absolute; top: 0; opacity: 0.8; z-index: 2000; } .dragged .command { box-shadow: 0px 4px 5px -2px rgba(0,0,0,0.4), 0px 7px 10px 1px rgba(0,0,0,0.28), 0px 2px 16px 1px rgba(0,0,0,0.24) !important; } .if-body { padding-left: 10px; width: 100%; height: 100%; display: block; float: left; } .command-body { clear: both; } .command-body .vertical { float: left; } .command, .static-command, .placeholder, .info-block { float: left; display: inline-block; clear: left; } .btn { background: #2962ff !important; height: 30px !important; line-height: 0px !important; } .ifbase-bloq .background { float: left; width: 100%; }', 'contenteditable="false"', function(opts) {
var self;

self = this;

this.mixin(mixins.eventBubbler);

this.bubbleEvents();

this.hasElse = false;

this.removeFunc = (function(_this) {
  return function(index) {
    return function() {
      var bloq;
      bloq = scriptModel.removeBloq(_this.opts.model.listid, index);
      if (bloq.bloq === "else") {
        _this.hasElse = false;
      }
      return _this.update();
    };
  };
})(this);

this.getParameters = function() {
  if (self.refs.body != null) {
    return self.refs.body.getParameters();
  }
};

this.hasParameters = function() {
  return (opts.model.parameters != null) && opts.model.parameters.length > 0;
};

this.elseIfClick = function() {
  var bloq, newModel;
  bloq = scriptModel.newBloq("else if");
  if (this.hasElse) {
    scriptModel.insertBloq(opts.model.listid, bloq, opts.model.children.length - 1);
  } else {
    scriptModel.insertBloq(opts.model.listid, bloq, opts.model.children.length);
  }
  undoManager.createUndo();
  newModel = scriptModel.lookup[opts.model.sbid];
  return this.update({
    model: newModel
  });
};

this.elseClick = function() {
  var bloq, newModel;
  this.hasElse = true;
  bloq = scriptModel.newBloq("else");
  scriptModel.insertBloq(opts.model.listid, bloq, opts.model.children.length);
  undoManager.createUndo();
  newModel = scriptModel.lookup[opts.model.sbid];
  return this.update({
    model: newModel
  });
};

self.getChildren = function() {
  if (opts.hasChildren) {
    return opts.children;
  } else {
    return [];
  }
};

self.avoidPropagation = function(e) {
  return e.stopPropagation();
};
});

riot.tag2('ifinner-bloq', '<bloq-header bloq="{opts.model.bloq}" color="{opts.model.config.header}" show-edit="{hasParameters()}" show-delete="{opts.model.config.showDelete}" ref="header" edit-mode="{opts.editMode}" draggable="{opts.draggable}"></bloq-header><bloq-parameter-panel riot-style="background: {opts.model.config.background}" parameters="{opts.model.parameters}" edit-mode="{opts.editMode}" if="{hasParameters()}" ref="body" has-overlay="{opts.hasOverlay}"></bloq-parameter-panel><bloq-list riot-style="background: {opts.model.config.background}" ref="bloqlist" sbid="{opts.model.listid}" if="{opts.model.hasChildren}" script="{opts.model.children}"></bloq-list><drop-bloq if="{opts.model.hasChildren}" class="background"></drop-bloq>', '@import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700"); .command, .static-command, .placeholder, .info-block { float: left; display: inline-block; clear: left; } .btn { background: #2962ff !important; height: 30px !important; line-height: 0px !important; }', 'contenteditable="false"', function(opts) {
var self;

self = this;

this.mixin(mixins.eventBubbler);

this.bubbleEvents();

this.getParameters = function() {
  if (self.refs.body != null) {
    return self.refs.body.getParameters();
  }
};

this.hasParameters = function() {
  return (opts.model.parameters != null) && opts.model.parameters.length > 0;
};

self.getChildren = function() {
  if (opts.hasChildren) {
    return opts.children;
  } else {
    return [];
  }
};

self.avoidPropagation = function(e) {
  return e.stopPropagation();
};
});

riot.tag2('normal-bloq', '<bloq-header bloq="{opts.model.bloq}" color="{opts.model.config.header}" ref="header" show-edit="{hasParameters()}" edit-mode="{opts.editMode}" draggable="{opts.draggable}"></bloq-header><bloq-parameter-panel riot-style="background: {opts.model.config.background}" parameters="{opts.model.parameters}" edit-mode="{opts.editMode}" if="{hasParameters()}" ref="body" has-overlay="{opts.hasOverlay}"></bloq-parameter-panel><bloq-list riot-style="background: {opts.model.config.background}" ref="bloqlist" sbid="{opts.model.listid}" if="{opts.model.hasChildren}" script="{opts.model.children}"></bloq-list><drop-bloq if="{opts.model.hasChildren}" class="background"></drop-bloq>', '@import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700"); .dragged { position: absolute; top: 0; opacity: 0.8; z-index: 2000; } .dragged .command { box-shadow: 0px 4px 5px -2px rgba(0,0,0,0.4), 0px 7px 10px 1px rgba(0,0,0,0.28), 0px 2px 16px 1px rgba(0,0,0,0.24) !important; } normal-bloq, .static-command, .placeholder, .info-block { float: left; display: inline-block; clear: left; box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12); margin: 5px 0px 5px 0px; padding: 0px; color: #fff; } .btn { background: #2962ff !important; height: 30px !important; line-height: 0px !important; }', 'contenteditable="false"', function(opts) {
var self;

self = this;

this.mixin(mixins.eventBubbler);

this.bubbleEvents();

this.getParameters = function() {
  if (self.refs.body != null) {
    return self.refs.body.getParameters();
  }
};

this.hasParameters = function() {
  return (opts.model.parameters != null) && opts.model.parameters.length > 0;
};

self.getChildren = function() {
  if (opts.hasChildren) {
    return opts.children;
  } else {
    return [];
  }
};

self.avoidPropagation = function(e) {
  return e.stopPropagation();
};
});

riot.tag2('operator-bloq', '<div bloq="{opts.model.bloq}" riot-style="background: {opts.model.config.header}" ref="opBloq" class="operator-inner {editing-tb : opts.hasOverlay, flex-vertical: isOverWide}"><text-editor ref="editor" value="{getParameterValue(\'right\')}" pos="{posLeft}" edit-mode="{opts.editMode}" model="{getParameter(\'right\')}" if="{showSide(\'right\')}" class="inline"></text-editor><div ref="buttonRoot" class="operator-action-button fixed-action-btn click-to-toggle"><a hide="{isOverWide}" class="btn-floating operator-action-button-element {default-cursor: isOverWide}"><span class="bloq-operator">{opts.model.title}</span></a><bloq-header bloq="{opts.model.title}" color="{opts.model.config.header}" ref="header" show-edit="{hasParameters()}" edit-mode="{opts.editMode}" show="{isOverWide}"></bloq-header><ul ref="listRoot" hide="{isOverWide}" class="{listClasses()}"><li class="outer-li"><a hide="{opts.editMode}" onclick="{edit}" class="btn-floating blue"><i class="material-icons">create</i></a></li><li class="middle-li"><a show="{opts.editMode}" onclick="{ok}" class="btn-floating blue"><i class="material-icons">check</i></a></li><li class="outer-li"><a show="{opts.editMode}" onclick="{cancel}" class="btn-floating blue"><i class="material-icons">do_not_disturb</i></a></li><li class="right-li"><a onclick="{delete}" class="btn-floating blue"><i class="material-icons">clear</i></a></li></ul></div><text-editor ref="editor" value="{getParameterValue(\'left\')}" pos="{posRight}" edit-mode="{opts.editMode}" model="{getParameter(\'left\')}" if="{showSide(\'left\')}" class="inline"></text-editor></div>', '@import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700"); .operator-inner { border-radius: 13px; padding: 1px 3px 1px 3px; display: flex; justify-content: center; align-items: stretch; margin: 0 0 0 0; } .operator-inner text-editor.inline { width: 100%; } .operator-bloq { width: initial !important; border-radius: 13px; } .inline { display: inline-block; border-radius: 5px; } .bloq-operator { font-size: 14pt; padding: 0 4px; background-color: #2faaf6; } .dragged { position: absolute; top: 0; opacity: 0.8; z-index: 2000; } .dragged .command { box-shadow: 0px 4px 5px -2px rgba(0,0,0,0.4), 0px 7px 10px 1px rgba(0,0,0,0.28), 0px 2px 16px 1px rgba(0,0,0,0.24) !important; } .outer-li { float: left; } .middle-li { margin-right: 16px; float: left; } .right-li { float: right; } .btn { background: #2962ff !important; height: 30px !important; line-height: 0px !important; } .flex-vertical { flex-direction: column; } div.operator-action-button { position: relative; margin: 0; padding: 0; right: 0; bottom: 0; left: 0; top: 0; z-index: 1; } div.operator-action-button a.operator-action-button-element { height: auto; width: auto; border-radius: 13px; line-height: initial; box-shadow: none; } div.operator-action-button a.operator-action-button-element.default-cursor { cursor: default; } div.operator-action-button ul.operator-action-button-buttonlist { width: 60px; position: absolute; top: -120%; text-align: center; left: 50% !important; transform: translate(-50%, -50%); } div.operator-action-button ul.operator-action-button-buttonlist li a { width: 17.5px; height: 17.5px; line-height: 17.5px; } div.operator-action-button ul.operator-action-button-buttonlist li a i { font-size: 0.7rem; line-height: 17.5px; } .two-button-list { width: 60px !important; } .three-button-list { width: 85px !important; } .button-list-in-vertical-mode { top: 0 !important; } .no-visibility { visibility: hidden !important; }', 'contenteditable="false"', function(opts) {
var ref, ref1, self;

self = this;

this.mixin(mixins.eventBubbler);

this.bubbleEvents();

self.boundaryWidth = 300;

self.isOverWide = false;

self.posLeft = "left";

self.posRight = "right";

self.widthPaddings = 18;

self.widthPlus = 17;

this.cachedSide = (((ref = opts.model) != null ? (ref1 = ref.config) != null ? ref1.side : void 0 : void 0) != null) ? opts.model.config.side : "not_set";

self.on('mount', function() {
  return self.refs.header.on('ok', (function(_this) {
    return function(e) {
      if (_this.getTotalWidth() > self.boundaryWidth) {
        _this.applyVerticalModeEffect(true);
      } else {
        _this.applyVerticalModeEffect(false);
      }
      _this.update();
      return _this.closeButtons();
    };
  })(this));
});

this.getParameters = (function(_this) {
  return function() {
    var editor, editors, i, len, param, parameters;
    parameters = [];
    editors = _this.refs.editor;
    if (!editors) {
      return parameters;
    }
    if (!Array.isArray(editors)) {
      editors = Array(1).fill(editors);
    }
    for (i = 0, len = editors.length; i < len; i++) {
      editor = editors[i];
      param = {
        id: editor.opts.model.sbid,
        value: editor.getParameter().value
      };
      parameters.push(param);
    }
    return parameters;
  };
})(this);

this.listClasses = function() {
  var classes;
  classes = {
    "operator-action-button-buttonlist": true,
    "editing": opts.editMode,
    "three-button-list": opts.editMode,
    "two-button-list": !opts.editMode,
    "button-list-in-vertical-mode": self.isOverWide,
    "no-visibility": self.isOverWide
  };
  return classes;
};

self.editable = opts.editable || true;

self.avoidPropagation = function(e) {
  return e.stopPropagation();
};

this.edit = (function(_this) {
  return function(e) {
    e.stopPropagation();
    self.trigger("edit");
    _this.update();
    return _this.closeButtons(true);
  };
})(this);

this["delete"] = (function(_this) {
  return function(e) {
    e.stopPropagation();
    return _this.trigger('delete');
  };
})(this);

this.ok = (function(_this) {
  return function(e) {
    e.stopPropagation();
    _this.trigger('ok');
    if (_this.getTotalWidth() > self.boundaryWidth) {
      _this.applyVerticalModeEffect(true);
    } else {
      _this.applyVerticalModeEffect(false);
    }
    _this.update();
    return _this.closeButtons();
  };
})(this);

this.cancel = (function(_this) {
  return function(e) {
    e.stopPropagation();
    _this.trigger('cancel');
    return _this.closeButtons();
  };
})(this);

this.closeButtons = (function(_this) {
  return function(reopen) {
    var targetDiv, targetUl;
    targetDiv = $(_this.refs.buttonRoot);
    if (reopen) {
      targetUl = $(_this.refs.listRoot);
      targetUl.hide();
    }
    targetDiv.closeFAB();
    if (reopen) {
      return setTimeout(function() {
        targetUl.show();
        return targetDiv.openFAB();
      }, 150);
    }
  };
})(this);

this.applyVerticalModeEffect = (function(_this) {
  return function(bool) {
    if (bool) {
      self.posLeft = "both";
      self.posRight = "both";
    } else {
      self.posLeft = "left";
      self.posRight = "right";
    }
    return self.isOverWide = bool;
  };
})(this);

this.showSide = (function(_this) {
  return function(side) {
    return (_this.cachedSide === side) || (_this.cachedSide === "not_set");
  };
})(this);

this.getParameter = (function(_this) {
  return function(side) {
    var ref2;
    if ((((ref2 = opts.model) != null ? ref2.parameters : void 0) == null) || !_this.showSide(side)) {
      return null;
    }
    if (side === "right") {
      return opts.model.parameters[0];
    } else if (side === "left") {
      return opts.model.parameters[opts.model.parameters.length - 1];
    } else {
      return null;
    }
  };
})(this);

this.getParameterValue = (function(_this) {
  return function(side) {
    var param;
    if (param = _this.getParameter(side)) {
      return param.value;
    }
    return null;
  };
})(this);

this.hasParameters = (function(_this) {
  return function() {
    return true;
  };
})(this);

this.getTotalWidth = (function(_this) {
  return function() {
    var i, len, param, ref2, result;
    result = 0;
    ref2 = _this.getParameters();
    for (i = 0, len = ref2.length; i < len; i++) {
      param = ref2[i];
      result += $.fn.textWidth(param.value);
    }
    return result + self.widthPlus + self.widthPaddings;
  };
})(this);

$.fn.textWidth = function(text, font) {
  if (font == null) {
    font = '14px Inconsolata';
  }
  if (!$.fn.textWidth.fakeEl) {
    $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
  }
  $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
  return $.fn.textWidth.fakeEl.width();
};
});
window.config = {
  editOnDrop: false
};

var eventManager;

eventManager = {
  o: $({}),
  trigger: function(event, tag) {
    return this.o.trigger.apply(this.o, arguments);
  },
  on: function(event, func) {
    return this.o.on.apply(this.o, arguments);
  },
  off: function(event, func) {
    return this.o.off.apply(this.o, arguments);
  }
};

var FlowModel;

FlowModel = (function() {
  function FlowModel(scriptModel) {
    var bloq, child, children, element, i, j, len, len1, letter, letters, match, re;
    this.model = [];
    this.bloqs = [];
    this.lookup = [];
    letters = scriptModel.value;
    letters = letters || '';
    letters = String(letters);
    children = [];
    re = /\{[0-9]+\}/;
    match = void 0;
    while (letters.match(re)) {
      letters = letters.replace(re, function(match, index) {
        var digit, number;
        digit = match.replace(/[\{\}]/g, "");
        number = parseInt(digit);
        children.push({
          number: number,
          index: index + children.length
        });
        return "";
      });
    }
    for (i = 0, len = letters.length; i < len; i++) {
      letter = letters[i];
      this.model.push({
        content: letter,
        type: "text"
      });
    }
    for (j = 0, len1 = children.length; j < len1; j++) {
      child = children[j];
      if (scriptModel.children[child.number] == null) {
        throw "parameter model does not have a child at index " + child.number;
      }
      bloq = scriptModel.children[child.number];
      this.lookup[bloq.sbid] = bloq;
      element = {
        type: "bloq",
        bloq: bloq
      };
      this.model.splice(child.index, 0, element);
    }
    this.model;
  }

  FlowModel.prototype.insert = function(index, bloq) {
    var element;
    element = {
      type: "bloq",
      bloq: bloq
    };
    this.model.splice(index, 0, element);
    this.bloqs.push(bloq);
    return this.lookup[bloq.sbid] = bloq;
  };

  FlowModel.prototype.createModelFromDom = function(domElement) {
    var bloq, children, domBloq, i, item, len, parameter, token, type, value;
    value = "";
    children = [];
    for (i = 0, len = domElement.length; i < len; i++) {
      item = domElement[i];
      if (item.nodeType === 3) {
        value += $(item).text();
      }
      type = $(item).attr("type");
      switch (type) {
        case "text":
          value += $(item).text();
          break;
        case "bloq":
          domBloq = $(item).children().first();
          bloq = this.lookup[domBloq.data("sbid")];
          token = "{" + children.length + "}";
          children.push(bloq);
          value += token;
      }
    }
    parameter = {
      value: value,
      children: children
    };
    return parameter;
  };


  /*
  maybe attach flow model to parameters in script model, so that 
  we only need to make a minor mod to scriptMode.insert to make 
  it insert direcly into a parameter's flow model.
   */

  return FlowModel;

})();

$(function() {
  return $("body").off("keypress").on("keypress", function(e) {
    if (e.ctrlKey) {
      if (e.keyCode === 26) {
        return undoManager.undo();
      } else if (e.keyCode === 25) {
        return undoManager.redo();
      }
    }
  });
});

window.mixins = {
  eventBubbler: {
    bubbleEvents: function() {
      return this.on('mount', function() {
        this.refs.header.on('edit', (function(_this) {
          return function(e) {
            return _this.trigger("edit");
          };
        })(this));
        this.refs.header.on('ok', (function(_this) {
          return function(e) {
            return _this.trigger("ok");
          };
        })(this));
        this.refs.header.on('cancel', (function(_this) {
          return function(e) {
            return _this.trigger("cancel");
          };
        })(this));
        this.refs.header.on('delete', (function(_this) {
          return function(e) {
            return _this.trigger("delete");
          };
        })(this));
        if (this.refs.body != null) {
          this.refs.body.on('ok', (function(_this) {
            return function(e) {
              return _this.trigger("ok");
            };
          })(this));
          return this.refs.body.on('cancel', (function(_this) {
            return function(e) {
              return _this.trigger("cancel");
            };
          })(this));
        }
      });
    }
  },
  removeFunc: {
    removeFunc: function(index) {
      return (function(_this) {
        return function() {
          scriptModel.removeBloq(_this.listid, index);
          return _this.update();
        };
      })(this);
    }
  }
};

window.scriptModel = {
  bloqConfig: {},
  reference: {},
  mainScript: [],
  toolbox: [],
  stores: [],
  categories: {},
  lookup: {},
  uidCount: 0,
  changeStoredName: function(uid, newName) {
    var bloq;
    bloq = this.lookup[uid];
    bloq.name = newName;
    return this.checkStoredName(newName, bloq);
  },
  checkStoredName: function(name, bloq) {
    var store;
    store = this.stores[bloq.store].items;
    if (store.indexOf(name) < 0) {
      store.push(name);
    }
    return bloq;
  },
  setParameter: function(uid, newValue, children) {
    var oldChildren, oldValue, parameter;
    parameter = this.lookup[uid];
    oldValue = parameter.value;
    oldChildren = parameter.children;
    undoManager.pushAction((function(_this) {
      return function() {
        return _this.setParameter(uid, oldValue, oldChildren);
      };
    })(this));
    parameter.value = newValue;
    return parameter.children = children;
  },
  insertBloq: function(listId, bloq, index) {
    var item;
    item = this.lookup[listId];
    if (item instanceof Array) {
      item.splice(index, 0, bloq);
      return undoManager.pushAction((function(_this) {
        return function() {
          return _this.removeBloq(listId, index);
        };
      })(this));
    } else if (item.flowModel != null) {
      return item.flowModel.insert(index, bloq);
    } else {
      throw "tried to insert into an invalid container";
    }
  },
  removeBloq: function(listId, index) {
    var bloq, list;
    list = this.lookup[listId];
    bloq = list[index];
    list.splice(index, 1);
    undoManager.pushAction((function(_this) {
      return function() {
        return _this.insertBloq(listId, bloq, index);
      };
    })(this));
    return bloq;
  },
  moveBloq: function(listId, index, newIndex, destId) {
    var bloq, list;
    list = this.lookup[listId];
    bloq = this.removeBloq(listId, index);
    destId = destId != null ? destId : listId;
    this.insertBloq(destId, bloq, newIndex);
    return bloq;
  },
  clearBloqs: function(listId) {
    var bloq, i, j, len, ref, results;
    ref = this.lookup[listId];
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      bloq = ref[i];
      results.push(scriptModel.removeBloq(0, i));
    }
    return results;
  },
  newBloq: function(name, parameters, storeName) {
    var bloq, bloqRef, bloqType, childBloq, j, len, ref;
    bloqRef = this.reference[name];
    if (bloqRef == null) {
      throw 'Bloq "' + name + '" does not exist in dictionary';
    }
    bloqType = bloqRef.bloqType || "command";
    bloq = {
      bloq: name,
      config: this.bloqConfig.bloqTypes[bloqType],
      bloqType: bloqType,
      store: bloqRef.store || null,
      title: bloqRef.title || name,
      hasChildren: bloqRef.hasChildren,
      parameters: [],
      sbid: this.uid()
    };
    if (bloqRef.store != null) {
      if (storeName != null) {
        bloq.name = storeName;
      } else {
        bloq.name = "new " + name;
      }
    }
    this.buildParams(bloq, parameters);
    if (bloq.hasChildren && (parameters == null)) {
      bloq.listid = this.uid();
      bloq.children = [];
      if (bloqRef.children != null) {
        ref = bloqRef.children;
        for (j = 0, len = ref.length; j < len; j++) {
          childBloq = ref[j];
          bloq.children.push(this.newBloq(childBloq.bloq));
        }
      }
      this.lookup[bloq.listid.toString()] = bloq.children;
    }
    this.lookup[bloq.sbid.toString()] = bloq;
    return bloq;
  },
  buildParams: function(bloq, setParams) {
    var children, j, len, param, parameter, parameters, ref, referenceBloq, value;
    referenceBloq = this.reference[bloq.bloq];
    parameters = [];
    if (referenceBloq.parameters != null) {
      ref = referenceBloq.parameters;
      for (j = 0, len = ref.length; j < len; j++) {
        param = ref[j];
        value = "";
        children = null;
        if (setParams == null) {
          value = param["default"] != null ? param["default"] : void 0;
        } else {
          if (setParams[param.name].children != null) {
            children = this.buildScriptV1(setParams[param.name].children);
            value = setParams[param.name].value;
          } else {
            value = setParams[param.name];
          }
        }
        if (typeof value === 'object') {
          if (value.children != null) {
            this.buildScriptV1(value.children);
          }
        }
        parameter = {
          name: param.name,
          editor: param.editor,
          label: param.label,
          value: value || "",
          config: this.bloqConfig.parameterEditors[param.editor],
          sbid: this.uid(),
          children: children
        };
        if (param.quotes != null) {
          parameter.quotes = param.quotes;
        }
        if (param.items != null) {
          parameter.items = param.items;
        }
        parameters.push(parameter);
        this.lookup[parameter.sbid] = parameter;
      }
    }
    return bloq.parameters = parameters;
  },
  buildScriptV1: function(script) {
    var bloq, j, len, newBloq, newScript;
    newScript = [];
    for (j = 0, len = script.length; j < len; j++) {
      bloq = script[j];
      newBloq = this.newBloq(bloq.bloq, bloq.parameters, bloq.name);
      if (newBloq.store != null) {
        this.checkStoredName(bloq.name, bloq);
      }
      if (newBloq.hasChildren) {
        newBloq.listid = this.uid();
        newBloq.children = this.buildScriptV1(bloq.children);
        this.lookup[newBloq.listid] = newBloq.children;
      }
      newScript.push(newBloq);
    }
    return newScript;
  },
  buildToolbox: function(data) {
    var buildChildren, buildStoreFunction, category, categoryExists, children, j, key, len, name, ref, ref1, toolbox, toolboxNode, value;
    toolbox = [];
    for (j = 0, len = data.length; j < len; j++) {
      category = data[j];
      toolboxNode = null;
      for (name in category) {
        children = category[name];
        toolboxNode = {
          name: name,
          children: children
        };
      }
      toolbox.push(toolboxNode);
    }
    buildChildren = (function(_this) {
      return function(ChildArr) {
        var bloq, k, len1;
        children = [];
        for (k = 0, len1 = ChildArr.length; k < len1; k++) {
          bloq = ChildArr[k];
          children.push(bloq.name);
        }
        return children;
      };
    })(this);
    categoryExists = (function(_this) {
      return function(needle) {
        var k, len1;
        for (k = 0, len1 = toolbox.length; k < len1; k++) {
          category = toolbox[k];
          if (category.name === needle) {
            return true;
          }
        }
        return false;
      };
    })(this);
    buildStoreFunction = (function(_this) {
      return function(storeName, bloqType) {
        var funcGetName, funcSetName, uBloqType;
        uBloqType = bloqType.charAt(0).toUpperCase() + bloqType.slice(1);
        funcGetName = "get" + uBloqType;
        funcSetName = "set" + uBloqType;
        _this[storeName] = {};
        _this[funcGetName] = function(name) {
          if (name == null) {
            throw "'" + name + "' stored value does not exist";
          }
          return this[storeName][name].value;
        };
        return _this[funcSetName] = function(name, value) {
          if (this[storeName][name] == null) {
            return this[storeName][name] = {
              bloqType: bloqType,
              store: storeName,
              name: name,
              value: value
            };
          } else {
            return this[storeName][name].value = value;
          }
        };
      };
    })(this);
    ref = this.reference;
    for (key in ref) {
      value = ref[key];
      if (value.store != null) {
        this.stores[value.store] = {
          bloqType: value.bloqType,
          items: []
        };
        buildStoreFunction(value.store, value.bloqType);
      }
      if (value.category != null) {
        category = value.category;
        if (this.categories[category] == null) {
          this.categories[category] = [];
        }
        value['name'] = key;
        if (!value.hidden) {
          this.categories[category].push(value);
        }
      }
    }
    ref1 = this.categories;
    for (key in ref1) {
      value = ref1[key];
      if (!categoryExists(key)) {
        children = buildChildren(value);
        toolbox.push({
          name: key,
          children: children
        });
      }
    }
    return toolbox;
  },
  loadScript: function(callback) {
    return YAML.load('http://localhost:3000/data/examplescript.yaml', (function(_this) {
      return function(result) {
        var script;
        script = _this.buildScriptV1(result);
        _this.mainScript = script;
        _this.lookup[0] = script;
        if (callback != null) {
          return callback();
        }
      };
    })(this));
  },
  initialize: function(callback) {
    this.lookup = {};
    this.mainScript = [];
    this.lookup[0] = this.mainScript;
    return YAML.load('http://localhost:3000/data/scriptbloqs-config.yaml', (function(_this) {
      return function(result) {
        _this.bloqConfig = result;
        return YAML.load('http://localhost:3000/data/scriptbloqs.yaml', function(result) {
          _this.reference = result;
          return YAML.load('http://localhost:3000/data/toolbox.yaml', function(result) {
            _this.toolbox = _this.buildToolbox(result);
            if (callback != null) {
              return callback();
            }
          });
        });
      };
    })(this));
  },
  getBloqData: function(callback) {
    this.lookup = {};
    return YAML.load('http://localhost:3000/data/scriptbloqs-config.yaml', (function(_this) {
      return function(result) {
        _this.bloqConfig = result;
        return YAML.load('http://localhost:3000/data/scriptbloqs.yaml', function(result) {
          _this.reference = result;
          return YAML.load('http://localhost:3000/data/toolbox.yaml', function(result) {
            _this.toolbox = _this.buildToolbox(result);
            return YAML.load('http://localhost:3000/data/examplescript.yaml', function(result) {
              var script;
              script = _this.buildScriptV1(result);
              _this.mainScript = script;
              _this.lookup[0] = script;
              if (callback != null) {
                return callback(script, _this.toolbox);
              }
            });
          });
        });
      };
    })(this));
  },
  uid: function() {
    this.uidCount += 1;
    return this.uidCount;
  }
};

var undoManager;

undoManager = {
  undos: [],
  redos: [],
  currentUndo: [],
  currentRedo: [],
  undoing: false,
  redoing: false,
  pushAction: function(func) {
    if (this.undoing) {
      this.currentRedo.push(func);
    } else {
      this.currentUndo.push(func);
    }
    if (!this.undoing && !this.redoing && this.redos.length > 0) {
      return this.redos = [];
    }
  },
  createUndo: function() {
    this.undos.push(this.currentUndo);
    return this.currentUndo = [];
  },
  createRedo: function() {
    this.redos.push(this.currentRedo);
    return this.currentRedo = [];
  },
  reset: function() {
    this.undos = [];
    this.redos = [];
    this.currentUndo = [];
    this.currentRedo = [];
    this.undoing = false;
    return this.redoing = false;
  },
  undo: function() {
    var action, undo;
    if (this.undos.length > 0) {
      undo = this.undos.pop();
      this.undoing = true;
      while (undo.length > 0) {
        action = undo.pop();
        action();
      }
      this.createRedo();
      this.undoing = false;
      return eventManager.trigger("stateChange");
    }
  },
  redo: function() {
    var action, redo;
    if (this.redos.length > 0) {
      redo = this.redos.pop();
      this.redoing = true;
      while (redo.length > 0) {
        action = redo.pop();
        action();
      }
      this.createUndo();
      this.redoing = false;
      return eventManager.trigger("stateChange");
    }
  }
};


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
