describe "scriptModel", ->
  script = null
  toolbox = null
  forBloq = 2
  printBloq = 1
  bloqLength = 3
  bloqStructure = ["variable","print","for"]

  beforeEach (done)->
    window.scriptModel.getBloqData (s, t)->
      script = s
      toolbox = t
      done()
  afterEach ->
    script = null
    toolbox = null

  it 'should use correct ids for lookup array', ->
    allMatch = true
    for item, i in scriptModel.lookup
      match = item.id == i or item.sbid == i or item.listid == i
      allMatch = allMatch and match
    expect(allMatch).toBe true
  it 'should return data for the script', ->
    expect(script.length).toBeGreaterThan 0
    #make sure we replaced the parameters correctly
    expect(script[0].parameters[0].editor?).toBe true
    expect(toolbox.length).toBeGreaterThan 0
    expect(Object.keys(scriptModel.reference).length).toBeGreaterThan 0

  it 'should load children for parameters', ->
    expect(script[printBloq].parameters[0].children.length).toBeGreaterThan 0

  it 'should generate new bloqs', ->
    bloq = scriptModel.newBloq "for"
    expect(bloq?).toBe(true)
    expect(bloq.bloq).toBe "for"
    expect(bloq.hasChildren).toBe true
    expect(bloq.parameters.length).toBe 2

    #make sure we replaced the parameters correctly
    expect(bloq.parameters[0].editor?).toBe true

  it 'should give unique ids', ->
    id1 = scriptModel.uid()
    id2 = scriptModel.uid()
    expect(id1).not.toBe id2

  it 'should separate bloqs into categories', ->
    expect(scriptModel.categories?).toBe true
    expect(scriptModel.categories["Data"].length).toBeGreaterThan 0
    expect(scriptModel.categories["Math Functions"].length).toBeGreaterThan 0

  it 'should create stores', ->
    expect(scriptModel.variables?).toBe true
    expect(Object.keys(scriptModel.stores).length).toBeGreaterThan(0)

  it 'should create store getter and setter functions', ->
    scriptModel.setVariable "myVar", "hello {0} what's up"
    result = scriptModel.getVariable "myVar"
    expect(result).toBe "hello {0} what's up"
    
  it 'should give every bloq a uid', ->
    for key, value of script
      expect(value.sbid).toBeGreaterThan(0) 
      for key,innerValue of value.children
        expect(innerValue.sbid).toBeGreaterThan(0) 

    #expect(script[0].sbid).toBeGreaterThan(0)
    #expect(script[1].sbid).toBeGreaterThan(0)
    #expect(script[nestedIndex].children[0].sbid).toBeGreaterThan(0)

  it 'should give bloqs with children a bloqid', ->
    expect(script[forBloq].listid).toBeGreaterThan(0)

  it 'should give every parameter a uid', ->
    for key, value of script
      expect(value.sbid).toBeGreaterThan(0)
      for key,innerValue of value.parameters
        expect(innerValue.sbid).toBeGreaterThan(0)  
    #expect(script[0].parameters[0].sbid).toBeGreaterThan(0)
    #expect(script[1].parameters[0].sbid).toBeGreaterThan(0)
    #expect(script[1].parameters[1].sbid).toBeGreaterThan(0)
    #expect(script[1].children[0].parameters[0].sbid).toBeGreaterThan(0)

  it 'should lookup objects from their uid', ->
    for key, value of script
      expect(value).toBe scriptModel.lookup[value.sbid]
      #console.log value
      #console.log value.sbid
      for key,param of value.parameters
        expect(param).toBe scriptModel.lookup[param.sbid]
        #console.log param
        #console.log param.sbid
        for key,child of value.children
          expect(child).toBe  scriptModel.lookup[child.sbid]
          #console.log child
          #console.log child.sbid 

    #param = script[1].children[0].parameters[0]
    #foundObject = scriptModel.lookup[param.sbid]
    #expect(param).toBe foundObject

    #bloq = script[1]
    #foundObject = scriptModel.lookup[bloq.sbid]
    #expect(bloq).toBe foundObject

    #bloq = script[1]
    #foundObject = scriptModel.lookup[bloq.listid]
    #expect(bloq.children).toBe foundObject

  it "should set parameter values", ->
    param = script[forBloq].children[0].parameters[0]
    expect(param.value).toBe "2 text spaced text"
    scriptModel.setParameter(param.sbid, "test")
    expect(param.value).toBe "test"
    

  it 'should insert new bloqs', ->
    count = script.length
    expect(count).toBe(bloqLength)

    bloq = scriptModel.newBloq("print")
    bloq.parameters[0].value = "test"

    scriptModel.insertBloq(0, bloq, 1)
    
    count = script.length
    expect(count).toBe(bloqLength+1)
    expect(script[1].parameters[0].value).toBe "test"

  it 'should insert new nested bloqs', ->
    list = script[forBloq].children
    count = list.length
    expect(count).toBe(1)

    bloq = scriptModel.newBloq("print")
    bloq.parameters[0].value = "test"
    
    scriptModel.insertBloq(script[forBloq].listid, bloq, 0)
    
    count = list.length
    expect(count).toBe(2)
    expect(list[0].parameters[0].value).toBe "test"

  it 'should remove bloqs', ->
    count = script.length
    expect(count).toBe(bloqLength)

    scriptModel.removeBloq(0, 0)
    
    count = script.length
    expect(count).toBe(bloqLength-1)
    expect(script[0].bloq).toBe "print"

  it 'should remove nested bloqs', ->
    list = script[forBloq].children
    count = list.length
    expect(count).toBe(1)

    scriptModel.removeBloq(script[forBloq].listid, 0)
    
    count = list.length
    expect(count).toBe(0)

  it 'should move bloqs', ->
    count = script.length
    expect(count).toBe(bloqLength)
    expect(script[0].bloq).toBe bloqStructure[0]
    expect(script[1].bloq).toBe bloqStructure[1]
    
    scriptModel.moveBloq(0, 0, 1)
    count = script.length
    expect(count).toBe(bloqLength)
    expect(script[0].bloq).toBe bloqStructure[1]
    expect(script[1].bloq).toBe bloqStructure[0]
    
    scriptModel.moveBloq(0, 0, 1)

    expect(script[0].bloq).toBe bloqStructure[0]
    expect(script[1].bloq).toBe bloqStructure[1]
    
    

  it 'should move bloqs between bloqlists', ->


    list1count = script.length
    list2count = script[forBloq].children.length

    expect(list1count).toBe(bloqLength)
    expect(list2count).toBe(1)
    expect(script[printBloq].bloq).toBe bloqStructure[1]
    expect(script[forBloq].bloq).toBe bloqStructure[2]
    expect(script[forBloq].children[0].bloq).toBe "print"

    # lower to higher
    scriptModel.moveBloq(0, 1, 2, script[forBloq].listid)
    newForIndex = printBloq
    list1count = script.length
    list2count = script[newForIndex].children.length

    expect(list1count).toBe(bloqLength-1)
    expect(list2count).toBe(2)
    
    expect(script[newForIndex].bloq).toBe "for"
    expect(script[newForIndex].children[0].parameters[0].value).toBe "2 text spaced text"
    expect(script[newForIndex].children[1].parameters[0].value).toBe "hello {0} what's up"
    
    # higher to lower
    scriptModel.moveBloq(script[newForIndex].listid, 0, bloqLength-1, 0)

    list1count = script.length
    list2count = script[newForIndex].children.length

    expect(list1count).toBe(bloqLength)
    expect(list2count).toBe(1)
    expect(script[newForIndex].bloq).toBe "for"
    expect(script[bloqLength-1].bloq).toBe "print"
    expect(script[newForIndex].children[0].parameters[0].value).toBe "hello {0} what's up"
    expect(script[bloqLength-1].parameters[0].value).toBe "2 text spaced text"

    ###
    list1count = script.length
    list2count = script[1].children.length

    expect(list1count).toBe(2)
    expect(list2count).toBe(1)
    expect(script[0].bloq).toBe "print"
    expect(script[1].bloq).toBe "for"
    expect(script[1].children[0].bloq).toBe "print"
    # lower to higher
    scriptModel.moveBloq(0, 0, 1, script[1].listid)

    list1count = script.length
    list2count = script[0].children.length

    expect(list1count).toBe(1)
    expect(list2count).toBe(2)
    expect(script[0].bloq).toBe "for"
    expect(script[0].children[0].parameters[0].value).toBe "2 text spaced text"
    expect(script[0].children[1].parameters[0].value).toBe "hello {0} what's up"
    # higher to lower
    scriptModel.moveBloq(script[0].listid, 0, 1, 0)

    list1count = script.length
    list2count = script[0].children.length

    expect(list1count).toBe(2)
    expect(list2count).toBe(1)
    expect(script[0].bloq).toBe "for"
    expect(script[1].bloq).toBe "print"
    expect(script[0].children[0].parameters[0].value).toBe "hello {0} what's up"
    expect(script[1].parameters[0].value).toBe "2 text spaced text"
    ###


  it "should load variables into store from a loaded script", ->

    intersection = (a, b) ->
      [a, b] = [b, a] if a.length > b.length
      value for value in a when value in b
    
    name = []
    for key, value of script
      if value.bloq == 'variable'
        name.push value.name
    variables = scriptModel.stores['variables'].items
    expect(intersection(variables, name).length).toBe name.length
