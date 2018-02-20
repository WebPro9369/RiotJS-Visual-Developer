
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