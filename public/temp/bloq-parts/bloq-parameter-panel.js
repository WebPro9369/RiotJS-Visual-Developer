
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