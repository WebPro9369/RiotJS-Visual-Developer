
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