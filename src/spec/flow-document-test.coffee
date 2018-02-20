describe 'flow document', ->
  tag = null
  model = null
  element = null

  createModel = (words)->
    flowModel = new FlowModel(value: words)
    return flowModel.model

  beforeEach ->
    fixture.load 'flow-document-test.html'
    #TODO : Test for bloq type
    tags = riot.mount "flow-document", model: createModel('test one two three')
    tag = tags[0]
    element = $("flow-document")
    
 
  afterEach ->
    fixture.cleanup()

  it 'should mount', ->
    expect($('flow-document').length).toBeGreaterThan(0)
    expect($('flow-document').children().length).toBeGreaterThan(0)


  it 'should render text', ->
    expect(element.text().trim()).toBe 'test one two three'

  it 'should update text', ->
    
    #replace one -> works
    replaceParam = [5, 3].concat(createModel("works"))
    tag.opts.model.splice.apply tag.opts.model, replaceParam
    tag.update()

    expect(element.text().trim()).toBe 'test works two three'

describe "flow document, edit mode", ->
  tag = null
  model = null
  element = null

  beforeAll (done)->
    scriptModel.initialize done

  beforeEach (done)->
    scriptModel.loadScript done

  render = (editable)->
    fixture.load 'flow-document-test.html'

    # Seth, shouldn't we move this text case to flow
    # text editor or flow-textbox ?

    parameter = scriptModel.lookup[0][1].parameters[0]

    model = new FlowModel(parameter)
    paramModel = scriptModel.lookup[parameter.sbid]
    paramModel.flowModel = model

    tags = riot.mount "flow-document",
      editMode: editable,
      value: parameter.value,
      model: model.model,
      sbid: parameter.sbid

    window.tag = tag = tags[0]
    element = $("flow-document")
 
  afterEach ->
    fixture.cleanup()

  it "should render out of edit mode", ->
    render(false)
    expect(element.attr "contenteditable").toBe "false"

  it "should render into edit mode", ->
    render(true)
    expect(element.attr "contenteditable").toBe "true"

  it "should update into edit mode", ->
    render(false)
    expect(element.attr "contenteditable").toBe "false"
    tag.opts.editMode = true
    tag.update()
    expect(element.attr "contenteditable").toBe "true"

  it "should update out of edit mode", ->
    render(true)
    expect(element.attr "contenteditable").toBe "true"
    tag.opts.editMode = false
    tag.update()
    expect(element.attr "contenteditable").toBe "false"

  it "should remove bloqs when their delete button is clicked", ->
    render(true)
    bloq = element.find("> flow-element[type='bloq']")
    length = bloq.length
    sm = scriptModel.lookup[tag.opts.sbid].flowModel.model
    smLength = sm.length
    expect(length).toBeGreaterThan 0

    bloq.find("> bloq > bloq-header .delete-bloq").simulate("click")

    #HTML
    expect(element.find("> flow-element[type='bloq']").length).toBe length-1 
    #ScriptModel
    expect(sm.length).toBe smLength-1 

  it "should not remove bloqs when not in edit mode", ->
    render(false)
    bloq = element.find("> flow-element[type='bloq']")
    length = bloq.length
    sm = scriptModel.lookup[tag.opts.sbid].flowModel.model
    smLength = sm.length
    expect(length).toBeGreaterThan 0

    bloq.find("> bloq > bloq-header .delete-bloq").simulate("click")

    #HTML
    expect(element.find("> flow-element[type='bloq']").length).toBe length
    #ScriptModel
    expect(sm.length).toBe smLength

  it "should not show delete buttons when not in edit mode", ->
    #not implemented
    console.log "This is not implemented Now"
    expect(true).toBe false

  it "should show delete buttons when in edit mode", ->
    #not implemented
    console.log "This is not implemented Now"
    expect(true).toBe false

