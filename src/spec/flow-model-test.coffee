describe "flow model", ->
  model = null
  beforeEach ->
    scriptModel =
      value: "hello {0}"
      children: [
          bloq: "world"
          sbid: 1
      ]
    model = new FlowModel(scriptModel)

  afterEach ->
    flowModel = null

  it "should create new flow models", ->
    expect(model).toExist()
    
  it "should create bloq nodes", ->
    found = false
    for node in model.model
      if node.type = "bloq" then found = true
    expect(found).toBe true
    expect(model.lookup[1]).toExist()

  it "should insert new bloqs", ->
    newBloq =
      bloq: "print"
      sbid: 2
    model.insert 3, newBloq
    expect(model.model[3].type).toBe("bloq")
    expect(model.lookup[2]).toExist()

  it "should generate a parameter model based on the dom", ->
    html = """
      <flow-element ref="elements" content="h" type="text"><span ref="content">h</span></flow-element><flow-element ref="elements" content="e" type="text"><span ref="content">e</span></flow-element><flow-element ref="elements" content="l" type="text"><span ref="content">l</span></flow-element><flow-element ref="elements" content="l" type="text"><span ref="content">l</span></flow-element><flow-element ref="elements" content="o" type="text"><span ref="content">o</span></flow-element><flow-element ref="elements" content=" " type="text"><span ref="content"> </span></flow-element><flow-element ref="elements" type="bloq"><bloq ref="bloq" draggable="false" contenteditable="false" data-sbid="2" class="normal-bloq"><bloq-header ref="header" bloq="new line" color="#2962ff" draggable="false" style="background: #2962ff"><span class="bloq-title">new line</span><span><span class="deleteIcon action-btn"><a class="btn-flat waves-effect waves-tea delete-bloq"><i class="material-icons">close </i></a></span><span class="editIcon action-btn"><a class="btn-flat waves-effect waves-tea edit-bloq"><i class="material-icons">edit</i></a></span><span class="cancelIcon action-btn"><a class="btn-flat waves-effect waves-tea cancel-bloq" hidden="" style="display: none;"><i class="material-icons">do_not_disturb</i></a></span><span class="okIcon action-btn"><a class="btn-flat waves-effect waves-tea ok-bloq" hidden="" style="display: none;"><i class="material-icons">check</i></a></span></span></bloq-header></bloq></flow-element><flow-element ref="elements" content=" " type="text"><span ref="content"> </span></flow-element><flow-element ref="elements" content="w" type="text"><span ref="content">w</span></flow-element><flow-element ref="elements" content="h" type="text"><span ref="content">h</span></flow-element><flow-element ref="elements" content="a" type="text"><span ref="content">a</span></flow-element><flow-element ref="elements" content="t" type="text"><span ref="content">t</span></flow-element><flow-element ref="elements" content="'" type="text"><span ref="content">'</span></flow-element><flow-element ref="elements" content="s" type="text"><span ref="content">s</span></flow-element><flow-element ref="elements" content=" " type="text"><span ref="content"> </span></flow-element><flow-element ref="elements" content="u" type="text"><span ref="content">u</span></flow-element><flow-element ref="elements" content="p" type="text"><span ref="content">p</span></flow-element>
    """
    element = $ html
    model.lookup[2] =
      bloq: "new line"
      sbid: 2
    parameter = model.createModelFromDom(element)
    expect(parameter.value).toBe "hello {0} what's up"
    expect(parameter.children[0].bloq).toBe "new line"

