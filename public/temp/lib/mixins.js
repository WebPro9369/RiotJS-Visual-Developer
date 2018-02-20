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
