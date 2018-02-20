describe "normal bloq", ->

  tag = null
  element = null

  # Helper function to simulate key press
  # on editor
  simulateText = (type ,text, icb)->
    $('.edit-bloq').first().simulate("click")
    tag.update()
    editor = $("flow-document")
    editor.simulate("key-sequence", {
      sequence: text
    })
    icb?()
    $(".#{type}-button").simulate("click")
    if type == 'ok'
      tag.update() #ok not updating parent tag

  beforeAll (done)->
    scriptModel.initialize (done)

  beforeEach ->
    riot.settings.autoUpdate = false
    fixture.load 'bloq-test.html'
    tags = riot.mount "bloq", model: scriptModel.newBloq "print"
    tag = tags[0]
    element = $('bloq:first')

  afterEach ->
    fixture.cleanup()


  # Helper function to simulate key press
  # on editor
  simulateText = (type ,text, icb)->
    $('.edit-bloq:visible').first().simulate("click")
    tag.update()

    editor = $ "flow-document" 
    editor.simulate "key-sequence",
      sequence: text
    icb?()

    $(".#{type}-button").simulate "click" 
    if type == 'ok'
      tag.update()


  # Problem with key-sequence plugin
  it "should update script model when ok is clicked", ->

    # Intially Empty


    editor = $("flow-document")

    sampleText = "This is dummy text"
    sm = scriptModel.lookup[tag.opts.model.sbid].parameters[0]

    #Inital-Value
    intialText = sm.value
    expect(sm.value).toEqual editor.text()

    simulateText 'ok',sampleText


    #ScriptModel & HTML Verification
    expect(editor.text()).toEqual intialText+sampleText
    expect(sm.value).toEqual intialText+sampleText

    # Intially Have Some Value
    sm.value = "Intial Value"
    tag.update()
  
    #Inital-Value
    intialText = sm.value
    expect(sm.value).toEqual editor.text()

    simulateText 'ok',sampleText

    #ScriptModel & HTML Verification
    expect(editor.text()).toEqual intialText+sampleText
    expect(sm.value).toEqual intialText+sampleText

  # Problem with key-sequence plugin
  it "should cancel changes when cancel is clicked", ->
    #Still in progress
    #Test for Compaq bloq -- How can test for Compaq bloq here ??

    # Intially Empty
    editor = $("flow-document")

    sampleText = "This is dummy text"
    sm = scriptModel.lookup[tag.opts.model.sbid].parameters[0]

    #Inital-Value
    intialText = sm.value
    expect(sm.value).toEqual editor.text()

    simulateText 'cancel',sampleText

    #ScriptModel & HTML Verification
    expect(editor.text()).toEqual intialText
    expect(sm.value).toEqual intialText


    # Intially Have Some Value
    sm = scriptModel.lookup[tag.opts.model.sbid].parameters[0]
    sm.value = "Intial Value"
    tag.update()


    #Inital-Value
    intialText = sm.value
    expect(sm.value).toEqual editor.text()

    simulateText 'cancel',sampleText

    #ScriptModel & HTML Verification
    expect(editor.text()).toEqual intialText
    expect(sm.value).toEqual intialText


  it "should fire events for edit, ok, cancel, and delete", ->

    onTriggered = 0
    offTriggered = 0
    
    eventManager.on "editModeOn", ->
      onTriggered++

    eventManager.on "editModeOff", ->
      offTriggered++

    #Edit
    element.find(">bloq-header .edit-bloq:visible").simulate("click")
    tag.update()
    expect(onTriggered).toEqual 1
     
    #Cancel
    element.find(".cancel-button:visible").simulate("click")
    expect(offTriggered).toEqual 1

    #Edit
    element.find(">bloq-header .edit-bloq:visible").simulate("click")
    tag.update()
    expect(onTriggered).toEqual 2

    #Ok
    element.find(".ok-bloq:visible").simulate("click")
    expect(onTriggered).toEqual 2

    #Delete
    #element.find(">bloq-header .delete-bloq:visible").simulate("click")
    log("[c='color: red']Delete part is not emitting any event [c]")


  it 'should render parameters', ->
    expect($("flow-textbox").length).toBeGreaterThan(0)
  
  it "should not render parameters if there aren't any", ->
    expect($("block-parameter-panel")).not.toBeVisible()
    
    
  describe "with children", ->
    beforeEach (done)->
      fixture.load 'bloq-test.html'
      #todo we need a better way to represent data in tests
      scriptModel.loadScript ->
        tags = riot.mount "bloq", model: scriptModel.lookup[0][2]
        tag = tags[0]
        console.log tag
        tag.update()
        done()
      

    afterEach ->
      fixture.cleanup()

    it 'should render children', ->
      #todo unclear
      expect($("bloq > bloq-list > bloq")
        .find("flow-textbox").length
      ).toBeGreaterThan(0)
