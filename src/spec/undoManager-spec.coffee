describe "undoManager", ->
  script = null
  beforeAll (done)->
    scriptModel.initialize -> 
      undoManager.reset()
      script = window.scriptModel.mainScript
      done()



  it "it should undo insert", ->

    newBloq = scriptModel.newBloq "print"
    scriptModel.insertBloq 0, newBloq, 0
    undoManager.createUndo()
    expect(script.length).toBe 1
    undoManager.undo()
    expect(script.length).toBe 0

  it "it should undo remove", ->
    newBloq = scriptModel.newBloq "print"
    scriptModel.insertBloq 0, newBloq, 0
    undoManager.createUndo()
    scriptModel.removeBloq 0, 0
    undoManager.createUndo()
    expect(script.length).toBe 0
    undoManager.undo()
    expect(script.length).toBe 1
    undoManager.undo()
    expect(script.length).toBe 0


  it "it should undo set parameter", ->

    newBloq = scriptModel.newBloq "print"
    param = newBloq.parameters[0]
    id = param.sbid
    scriptModel.setParameter id, "hello"
    undoManager.createUndo()
    expect(param.value).toBe "hello"
    undoManager.undo()
    expect(param.value).toBe ""
    

  it "it should execute a single action undo", ->

    newBloq = scriptModel.newBloq "print"
    scriptModel.insertBloq 0, newBloq, 0
    undoManager.createUndo()
    expect(script.length).toBe 1
    undoManager.undo()
    expect(script.length).toBe 0

  it "it should execute a multi action undo", ->
    newBloq = scriptModel.newBloq "print"
    scriptModel.insertBloq 0, newBloq, 0
    undoManager.createUndo()
    newBloq = scriptModel.newBloq "for"
    scriptModel.insertBloq 0, newBloq, 0
    expect(script.length).toBe 2
    scriptModel.removeBloq 0, 0
    undoManager.createUndo()
    expect(script.length).toBe 1
    undoManager.undo()
    expect(script.length).toBe 1
    undoManager.undo()
    expect(script.length).toBe 0

