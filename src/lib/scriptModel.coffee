window.scriptModel =
  bloqConfig: {}
  reference: {}
  mainScript: []
  toolbox: []
  #todo stores should be an object
  stores: []
  categories: {}
  lookup: {}
  uidCount: 0

  changeStoredName: (uid, newName)->
    bloq = @lookup[uid]
    bloq.name = newName
    @checkStoredName newName, bloq

  checkStoredName: (name, bloq)->
    store = @stores[bloq.store].items
    if store.indexOf(name) < 0
      store.push name
    return bloq

  setParameter: (uid, newValue, children)->
    parameter = @lookup[uid]
    oldValue = parameter.value
    oldChildren = parameter.children
    undoManager.pushAction => @setParameter uid, oldValue, oldChildren
    parameter.value = newValue
    parameter.children = children

  insertBloq: (listId, bloq, index)->

    item = @lookup[listId]
    if item instanceof Array
      item.splice index, 0, bloq
      undoManager.pushAction => @removeBloq listId, index
    else if item.flowModel? #its a parameter
      item.flowModel.insert index, bloq
    else
      throw "tried to insert into an invalid container"


  removeBloq: (listId, index)->
    list = @lookup[listId]
    bloq = list[index]
    list.splice index, 1
    undoManager.pushAction => @insertBloq listId, bloq, index
    bloq

  moveBloq: (listId, index, newIndex, destId)->
    list = @lookup[listId]
    bloq = @removeBloq(listId, index)
    destId = if destId? then destId else listId
    @insertBloq(destId, bloq, newIndex)
    bloq

  clearBloqs: (listId)->
    for bloq, i in @lookup[listId]
      scriptModel.removeBloq 0, i

  newBloq: (name, parameters,  storeName)->
    bloqRef = @reference[name]
    if not bloqRef? 
      throw 'Bloq "' + name + '" does not exist in dictionary'

    bloqType = bloqRef.bloqType or "command"
    bloq = 
      bloq: name
      config: @bloqConfig.bloqTypes[bloqType]
      bloqType: bloqType
      store: bloqRef.store or null
      title: bloqRef.title or name
      hasChildren: bloqRef.hasChildren
      parameters: []
      sbid: @uid()

    if bloqRef.store?
      if storeName?
        bloq.name = storeName
      else
        bloq.name =  "new " + name
    @buildParams bloq, parameters
    if bloq.hasChildren and not parameters?
      bloq.listid = @uid()
      bloq.children = []
      if bloqRef.children?
        for childBloq in bloqRef.children
          bloq.children.push @newBloq childBloq.bloq
      @lookup[bloq.listid.toString()] = bloq.children
    @lookup[bloq.sbid.toString()] = bloq
    bloq

  buildParams: (bloq, setParams)->
    referenceBloq = @reference[bloq.bloq]
    parameters = []
    if referenceBloq.parameters?
      for param in referenceBloq.parameters
        value = ""
        children = null
        unless setParams?
          value = if param.default? then param.default
        else
          if setParams[param.name].children?
            children = @buildScriptV1 setParams[param.name].children
            value = setParams[param.name].value
          else
            value = setParams[param.name]

        if typeof value is 'object'
          if value.children?
            @buildScriptV1 value.children
        parameter =
          name: param.name
          editor: param.editor
          label: param.label
          value: value || ""
          config: @bloqConfig.parameterEditors[param.editor]
          sbid: @uid()
          children: children
        # this makes something in the compiler work.  
        if param.quotes? then parameter.quotes = param.quotes
        # added by Marcel
        # This is needed to use Items in Drop-Down-Editor
        if param.items? then parameter.items = param.items
        
        parameters.push parameter
        @lookup[parameter.sbid] = parameter

    bloq.parameters = parameters



  buildScriptV1: (script) ->
    newScript = []
    for bloq in script
      newBloq = @newBloq bloq.bloq, bloq.parameters, bloq.name
      if newBloq.store?
        @checkStoredName bloq.name, bloq

      if newBloq.hasChildren
        newBloq.listid = @uid()
        newBloq.children = @buildScriptV1(bloq.children)
        @lookup[newBloq.listid] = newBloq.children
      newScript.push newBloq
    newScript

  # loadScript: (code)->
  #   lookup = {}
  #   data = YAML.parse code
  #   script = @buildScriptV1(data)
  #   @mainScript = script
  #   @lookup[0] = script
  #   script

  buildToolbox: (data)->
    toolbox = []
    #clean data
    for category in data
      toolboxNode = null
      for name, children of category
        toolboxNode =
          name: name
          children: children
      toolbox.push toolboxNode
    
    buildChildren = (ChildArr)=>
      children = []
      for bloq in ChildArr
        children.push bloq.name
      children
    categoryExists = (needle)=>
      for category in toolbox
        if category.name == needle
          return true
      return false


    #todo this might be unnecessary
    buildStoreFunction = (storeName, bloqType)=>
      #capitalize store name
      uBloqType = bloqType.charAt(0).toUpperCase() + bloqType.slice(1);
      funcGetName = "get#{uBloqType}"
      funcSetName = "set#{uBloqType}"
      this[storeName] = {}
      this[funcGetName] = (name)->
        if not name?
          throw "'#{name}' stored value does not exist"
        return this[storeName][name].value
      this[funcSetName] = (name, value)->
       if not this[storeName][name]?
          this[storeName][name] =
            bloqType: bloqType
            store: storeName
            name: name
            value: value
        else
          this[storeName][name].value = value

    #build categories and store functions
    for key, value of @reference
      if value.store?
        @stores[value.store] =
          bloqType: value.bloqType
          items: []
        buildStoreFunction value.store, value.bloqType
      if value.category?
        category = value.category
        unless @categories[category]?
          @categories[category] = []
        value['name'] = key
        if not value.hidden
          @categories[category].push value

    for key, value of @categories
      if not categoryExists(key)
        children = buildChildren(value)
        toolbox.push
          name: key
          children: children
    toolbox

  loadScript: (callback)->          
    YAML.load 'http://localhost:3000/data/examplescript.yaml', (result) =>
      script = @buildScriptV1(result)
      @mainScript = script
      @lookup[0] = script
      if callback?
        callback()

  initialize: (callback)->
    @lookup = {}
    @mainScript = []
    @lookup[0] = @mainScript
    YAML.load 'http://localhost:3000/data/scriptbloqs-config.yaml', (result) =>
      @bloqConfig = result
      YAML.load 'http://localhost:3000/data/scriptbloqs.yaml', (result) =>
        @reference = result

        YAML.load 'http://localhost:3000/data/toolbox.yaml', (result) =>
          @toolbox = @buildToolbox(result)
          if callback?
            callback()

  getBloqData: (callback) ->
    @lookup = {}
          
    YAML.load 'http://localhost:3000/data/scriptbloqs-config.yaml', (result) =>
      @bloqConfig = result
      YAML.load 'http://localhost:3000/data/scriptbloqs.yaml', (result) =>
        @reference = result

        YAML.load 'http://localhost:3000/data/toolbox.yaml', (result) =>
          @toolbox = @buildToolbox(result)
          
          YAML.load 'http://localhost:3000/data/examplescript.yaml', (result) =>
            script = @buildScriptV1(result)
            @mainScript = script
            @lookup[0] = script
            if callback?
              callback(script, @toolbox)

  uid: ->
    @uidCount += 1
    @uidCount


