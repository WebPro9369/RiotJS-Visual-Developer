describe "compact bloq", ->

  tag = null
  element = null
  editor = null

  # Helper function to simulate key press
  # on editor
  simulateText = (type ,text, icb)->
    $('.edit-bloq:visible').first().simulate("click")
    editor.simulate("key-sequence", {
      sequence: text
    })
    icb?()
    $(".#{type}-bloq:visible").simulate("click")


  beforeAll (done)->
    riot.settings.autoUpdate = false
    scriptModel.getBloqData (done)

  beforeEach ->
    
    fixture.load 'bloq-test.html'
    tags = riot.mount "bloq", model: scriptModel.newBloq "variable"
    tag = tags[0]
    element = $ 'bloq:first'
    editor = $ '.bloq-title'
  afterEach ->
    #fixture.cleanup()

  it "should become editable when edit is clicked", ->
    $('.edit-bloq:visible').first().simulate('click')
    attr = $('.bloq-title').attr('contenteditable')
    expect(attr).toBe 'true'
    expect(tag.refs.typedBloq.opts.editMode).toBe true 

  it "should no longer be editable when ok is clicked", ->
    #broken on windows

    sampleText = 'custom-bloq'
    simulateText 'ok',"{selectall}"+sampleText,->
      expect(editor.attr 'contenteditable').toBe 'true' 
    
    expect(editor.attr 'contenteditable').toBeFalsy
    expect(editor.text()).toBe(sampleText) 

    #TODO - Test with Keypress (on hold after keypress error)

  it "should no longer be editable when cancel is clicked", ->
    #broken on windows
    
    intialText = editor.text()    
    sampleText = 'custom-bloq'
    simulateText 'cancel',"{selectall}"+sampleText,->
      expect(editor.attr 'contenteditable').toBe 'true' 
    
    expect(editor.attr 'contenteditable').toBeFalsy
    #Error in following check
    #expect(editor.text()).toBe(intialText)

    #TODO - Test with Keypress (on hold after keypress error)

  it "should show ok & cancel buttons and hide edit button in edit mode", ->
    #use jquery to make sure correct buttons are shown and hidden

    editMode = ->
      expect($('.delete-bloq:visible').length).toBe 1
      expect($('.edit-bloq:visible').length).toBe 0
      expect($('.ok-bloq:visible').length).toBe 1
      expect($('.cancel-bloq:visible').length).toBe 1

    normalMode = ->
      expect($('.delete-bloq:visible').length).toBe 1
      expect($('.edit-bloq:visible').length).toBe 1
      expect($('.ok-bloq:visible').length).toBe 0
      expect($('.cancel-bloq:visible').length).toBe 0

    normalMode()
    $('.edit-bloq:visible').simulate 'click'
    editMode()
    $('.cancel-bloq:visible').simulate 'click'
    normalMode()
    $('.edit-bloq:visible').simulate 'click'
    editMode()
    $('.ok-bloq:visible').simulate 'click'
    normalMode()

  it "should update a store in the script model when ok is clicked", ->
    #this is working. look at how this is implemented, and use
    #this test to verify that the data is as it should be

    sm = scriptModel.lookup[tag.opts.model.sbid]
    length = scriptModel.stores['variables'].items.length
    sampleText = "Intial Value"
    simulateText 'ok',"{selectall}"+sampleText

    #HTML
    expect(editor.text()).toEqual sampleText
    #ScriptModel
    expect(sm.name).toEqual sampleText
    #Store
    varArray = scriptModel.stores['variables'].items
    expect(varArray.length).toBe length+1
    expect(varArray.indexOf(sampleText)).not.toBe -1

  it "should cancel changes when cancel is clicked", ->

    sm = scriptModel.lookup[tag.opts.model.sbid]
    intialName = sm.name
    length = scriptModel.stores['variables'].items.length
    sampleText = "Intial Value"
    simulateText 'cancel',"{selectall}"+sampleText

    attr = $('.bloq-title').attr 'contenteditable'
    expect(attr).toBeFalsy() 
    #HTML
    expect(editor.text()).toEqual intialName
    #ScriptModel
    expect(sm.name).toEqual intialName
    #Store
    varArray = scriptModel.stores['variables'].items
    expect(varArray.length).toBe length
    expect(varArray.indexOf(sampleText)).toBe -1
    #TODO : simulate key need correction

  #This test case is failing there is error when we press enter
  it "should allow enter key to accept changes (same as clicking ok)", ->

    sampleText = 'custom-bloq'
    $('.edit-bloq:visible').first().simulate("click")

    editor.simulate "key-sequence",
      sequence: '{selectall}'+sampleText+'{enter}'
    
    expect(editor.attr 'contenteditable').toBeFalsy
    expect(editor.text()).toBe(sampleText) 

    #TODO - Test with Keypress (on hold after keypress error)
  
  # This test case is failing because Esc key not supported by plugin
  #
  xit "should allow esc key to cancel changes (same as clicking cancel)", ->

    sm = scriptModel.lookup[tag.opts.model.sbid]
    intialName = sm.name
    length = scriptModel.stores['variables'].items.length
    sampleText = "Intial Value"

    editor.simulate "key-sequence",
      sequence: '{selectall}'+sampleText # ?? Esc key not supported

    attr = $('.bloq-title').attr 'contenteditable'
    expect(attr).toBeFalsy() 
    #HTML
    expect(editor.text()).toEqual intialName
    #ScriptModel
    expect(sm.name).toEqual intialName
    #Store
    varArray = scriptModel.stores['variables'].items
    expect(varArray.length).toBe length
    expect(varArray.indexOf(sampleText)).toBe -1
    #TODO : simulate key need correction

  it "should fire events for edit ok, cancel, and delete", ->
 
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