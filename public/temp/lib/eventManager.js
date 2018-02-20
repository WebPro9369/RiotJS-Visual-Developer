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
