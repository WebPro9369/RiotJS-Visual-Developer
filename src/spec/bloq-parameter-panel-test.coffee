describe 'bloq-parameter-panel', ->

  tag = null
  model = null
  element = null
  render = (editable)->
    fixture.load 'bloq-parameter-panel-test.html'
  
    bloq = scriptModel.newBloq "find index"
    model = bloq.parameters
    model[0].value = "hello"
    model[1].value = "what"
    tags = riot.mount "bloq-parameter-panel",
      parameters: model
      editMode: editable
    tag = tags[0]
    element = $("flow-document")
    
  beforeAll (done)->
    scriptModel.initialize done

  beforeEach ->
    render(false)


  afterEach ->
    fixture.cleanup()

  it 'should mount', ->
    element = $("bloq-parameter-panel")
    
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

  it 'should render parameters', ->
    expect($("flow-textbox").length).toBeGreaterThan(1)

  it 'should get the current value of parameters', ->
    parameters = tag.getParameters()
    expect(parameters[0].value).toBe "hello"
    expect(parameters[1].value).toBe "what"

  it 'should update parameter values', ->
    parameters = tag.getParameters()
    expect(parameters[0].value).toBe "hello"
    expect(parameters[1].value).toBe "what"

    tag.opts.parameters[0].value = "nope"
    tag.opts.parameters[1].value = "huh"
    tag.update()
    parameters = tag.getParameters()
    expect(parameters[0].value).toBe "nope"
    expect(parameters[1].value).toBe "huh"


  describe "edit mode", ->

    afterEach ->
      fixture.cleanup()

    it "should render out of edit mode", ->
      render(false)
      expect(element.attr "contenteditable").toBe "false"
      expect($(".ok-button")).not.toBeVisible()
      expect($(".cancel-button")).not.toBeVisible()


    it "should render into edit mode", ->
      render(true)
      expect(element.attr "contenteditable").toBe "true"
      expect($(".ok-button")).toBeVisible()
      expect($(".cancel-button")).toBeVisible()

    it "should update into edit mode", ->
      render(false)
      log("[c='color: red'] Error in this case is due to remounting 
      of flow-document elements .. editMode is not passed correctly
      see editMode value on update of these components
        [c]
      ")
      expect(element.attr "contenteditable").toBe "false"
      expect($(".ok-button")).not.toBeVisible()
      expect($(".cancel-button")).not.toBeVisible()

      tag.opts.editMode = true
      tag.update()
      expect(element.attr "contenteditable").toBe "true"
      expect($(".ok-button")).toBeVisible()
      expect($(".cancel-button")).toBeVisible()

    it "should update out of edit mode", ->
      render(true)
      expect(element.attr "contenteditable").toBe "true"
      expect($(".ok-button")).toBeVisible()
      expect($(".cancel-button")).toBeVisible()

      tag.opts.editMode = false
      tag.update()
      expect(element.attr "contenteditable").toBe "false"
      expect($(".ok-button")).not.toBeVisible()
      expect($(".cancel-button")).not.toBeVisible()

    it 'should trigger an event for ok button', (done)->
      render(true)
      tag.on "ok", ->
        expect(true).toBe true
        done()
      $(".ok-button").click()
      

    it 'should trigger an event for cancel button', (done)->
      render(true)
      tag.on "cancel", ->
        expect(true).toBe true
        done()
      $(".cancel-button").click()
