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
