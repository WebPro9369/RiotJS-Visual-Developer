
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