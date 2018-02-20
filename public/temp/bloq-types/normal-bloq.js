
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