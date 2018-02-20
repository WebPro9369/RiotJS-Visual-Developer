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
