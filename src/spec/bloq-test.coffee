describe 'bloq', ->
  tag = null

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
    #riot.settings.autoUpdate = false
    fixture.load 'bloq-test.html'
    tags = riot.mount "bloq", model: scriptModel.newBloq "print"
    tag = tags[0]


  afterEach ->
    #fixture.cleanup()

  it 'should mount', ->
    expect(tag?).toBe true
    element = $("bloq")
    
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

  it 'should have the correct header', ->
    header = $("bloq bloq-header[bloq='print'] .bloq-title").text()
    expect(header).toBe "print"

  it 'should render parameters', ->
    expect($("flow-textbox").length).toBeGreaterThan(0)
  
  #TODO commented out until feature is added
  # it 'should be closable', ->

  #todo broken
  it 'should switch into edit mode',->
    #click button via jquery
    #verify with jquery that there exists an editable div
    expect($('.edit-bloq').length).toBeGreaterThan(0)
    $('.edit-bloq').first().simulate("click")
    tag.update() #Click event don't update parent blog
    expect($("flow-document").first().attr("contenteditable")).toBe 'true'



  it 'should show edit button if it has parameters', ->
    sm = scriptModel.lookup[tag.opts.model.sbid]
    if typeof(sm.parameters) != 'undefined' && sm.parameters.length
      length = $('.edit-bloq:visible').length
      expect(length).not.toBeLessThan sm.parameters.length

  it 'should not show edit button if it does not have parameters', ->
    tag.opts.model = scriptModel.newBloq("new line")
    tag.update()
    sm = scriptModel.lookup[tag.opts.model.sbid]
    if typeof(sm.parameters) == 'undefined'|| !sm.parameters.length
      expect( $('.edit-bloq:visible').length).toBe 0
 
  it "should undo parameter changes", ->
    #
    # Intially Empty
    #
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

    undoManager.undo()
    tag.update()

    #ScriptModel & HTML Verification
    expect(editor.text()).toEqual intialText
    expect(sm.value).toEqual intialText

    #
    # Intially Have Some Value
    #
    sm.value = "Intial Value"
    tag.update()
  
    #Inital-Value
    intialText = sm.value
    expect(sm.value).toEqual editor.text()

    simulateText 'ok',sampleText

    #ScriptModel & HTML Verification
    expect(editor.text()).toEqual intialText+sampleText
    expect(sm.value).toEqual intialText+sampleText

    undoManager.undo()
    tag.update()

    #ScriptModel & HTML Verification
    expect(editor.text()).toEqual intialText
    expect(sm.value).toEqual intialText


  describe "in edit mode", ->
    it "should not update data before pressing 'ok'", ->
      #click edit button via jquery
      #type into parameter
      #check to make sure data hasn't changed by checking .toCode
      
      #$('.edit-bloq')[0].click()
      #element = $("flow-textbox")
      #since we no longer user toCode, check data in the model
      
      # initalCodeVal = tag[0].toCode()
      # sampleText = "newvalue"
      # element.simulate("key-sequence", {
      #   sequence: sampleText
      # })
      # afterTypeVal = tag[0].toCode()
      # expect(initalCodeVal).toBe afterTypeVal
      # expect(true).toBe false


      #
      # Intially Empty
      #
      editor = $("flow-document")

      sampleText = "This is dummy text"
      sm = scriptModel.lookup[tag.opts.model.sbid].parameters[0]

      #Inital-Value
      intialText = sm.value
      expect(sm.value).toEqual editor.text()

      simulateText 'cancel',sampleText,->
        expect(sm.value).toEqual intialText
        expect(editor.text()).toEqual intialText+sampleText

      #SM
      expect(sm.value).toEqual intialText
     
      #ScriptModel & HTML Verification
      expect(editor.text()).toEqual intialText
      expect(sm.value).toEqual intialText

      #
      # Intially Have Some Value
      #
      sm.value = "Intial Value"
      tag.update()
    
      #Inital-Value
      intialText = sm.value
      expect(sm.value).toEqual editor.text()

      simulateText 'cancel',sampleText,->
        expect(sm.value).toEqual intialText
        expect(editor.text()).toEqual intialText+sampleText

      #SM
      expect(sm.value).toEqual intialText

      #ScriptModel & HTML Verification
      expect(editor.text()).toEqual intialText
      expect(sm.value).toEqual intialText


      #TODO : Implement Bloq input also

    it "should update data after pressing 'ok'", ->

      #
      # Intially Empty
      #
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

      #
      # Intially Have Some Value
      #
      sm.value = "Intial Value"
      tag.update()
    
      #Inital-Value
      intialText = sm.value
      expect(sm.value).toEqual editor.text()

      simulateText 'ok',sampleText

      #ScriptModel & HTML Verification
      expect(editor.text()).toEqual intialText+sampleText
      expect(sm.value).toEqual intialText+sampleText
  
      #
      # TODO : Bloq Implementation
      #

    it "should revert to previous value after pressing 'cancel'", ->

      #
      # Intially Empty
      #
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

      #
      # Intially Have Some Value
      #
      sm.value = "Intial Value"
      tag.update()
    
      #Inital-Value
      intialText = sm.value
      expect(sm.value).toEqual editor.text()

      simulateText 'cancel',sampleText

      #ScriptModel & HTML Verification
      expect(editor.text()).toEqual intialText
      expect(sm.value).toEqual intialText


      #TODO : Implement Bloq input also

    it "should have the correct value after clicking ok when it starts blank", ->
      #this is in response to a specific bug.
      #create a new "replace" bloq, simulate type into it, 
      #click ok, check value
      expect(true).toBe false
      
  describe "with children", ->
    beforeEach ->
      fixture.load 'bloq-test.html'
      #todo we need a better way to represent data in tests
      model = scriptModel.newBloq "for"
      model.children.push(scriptModel.newBloq("print"))
      tags = riot.mount "bloq", model : model
      tag = tags[0]

    it 'should render children', ->
      expect($("bloq > bloq-list > bloq")
        .find("flow-textbox").length
      ).toBeGreaterThan(0)
