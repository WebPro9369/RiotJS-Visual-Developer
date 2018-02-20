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
