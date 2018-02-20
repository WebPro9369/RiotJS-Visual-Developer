describe 'parameter', ->
  tag = null
  model = null
  element = null

  render = (editable, bloqName="print")->
    fixture.load 'parameter-test.html'
    bloq = scriptModel.newBloq bloqName
    model = bloq.parameters[0]
    model.value = "hello"
    tags = riot.mount "parameter",
      model: model
      editMode: editable
    tag = tags[0]
    element = $("flow-document")
    
  beforeAll (done)->
    scriptModel.initialize done

  beforeEach ->
    render false
  afterEach ->
    fixture.cleanup()

  #todo should we get rid of the trim()s?
  it 'should mount', ->
    element = $("parameter")
    
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

  it 'should have the correct name and value', () ->
    name = jQuery("label").text()
    value = jQuery("flow-textbox").text()
    expect(name).toBe "text"
    expect(value.trim()).toBe "hello"

  it 'should get the current value', ->
    expect(tag.getParameter().value).toBe "hello"

  #todo it's not clear that we actually need to update parameters this way
  # it 'should update its value', ->
  #   value = jQuery("flow-textbox").text()
  #   expect(value.trim()).toBe "hello"
  #   expect(tag.getParameter().value).toBe "hello"
  #   id = tag.getParameter().id
  #   expect(id?).toBe true
  #   tag.opts.model.value = "works"
  #   tag.update()
    
  #   value = jQuery("flow-textbox").text()
  #   expect(value.trim()).toBe "works"
  #   expect(tag.getParameter().value).toBe "works"
  #   expect(tag.getParameter().id).toBe id


  it 'should render different parameter editors based on editor type', ->
    render false, "drop example"
    expect($(".dropdown-button").length).toBeGreaterThan(0)





  describe "edit mode", ->

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
      console.log "Verify this before Pushing"
      render(true)
      expect(element.attr "contenteditable").toBe "true"
      tag.opts.editMode = false
      window.tag = tag
      tag.update()
      console.log tag
      expect(element.attr "contenteditable").toBe "false"
