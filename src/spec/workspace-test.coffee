describe "workspace", ->
  tag = null
  scriptbloqs = {}
  bloqObject = {}
  parentBloq = "repeat"
  singleBloq = "if"
  vseToolbox = null
  editBloq = "trim"
  bloqboard = null

  moveBloq = (from,to,callback) ->
    from.simulate "drag-n-drop",
      dragTarget:to
    callback()

  boardProp =  (obj)->
    JSON.stringify($.extend {},obj,{onBloqBoard:true})

  beforeAll (done)->
    riot.settings.autoUpdate = false
    fixture.load 'workspace-test.html'
    scriptModel.getBloqData (script, toolbox)->
      tags = riot.mount "workspace",
        script: script
        toolbox: toolbox
      tag = tags[0]
      done()
    bloqboard = $('bloqboard')

  beforeEach (done)->
    scriptModel.loadScript ->
      tag.opts.script = scriptModel.mainScript
      tag.opts.toolbox = scriptModel.toolbox
      tag.update()
      done()

  # beforeEach (done)->
  #   fixture.load 'workspace-test.html'
  #   scriptModel.getBloqData (script, toolbox)->
  #     tags = riot.mount "workspace",
  #       script: script
  #       toolbox: toolbox
  #     tag = tags[0]
  #     done()
  #   return
      
  afterEach ->
    maxCount = 3 #Avoid Infinite Loop
    while $('.editing-tb').length > 0 and maxCount > 0
      $('.editing-tb > .edit-btn .ok-button:visible').simulate 'click'
      maxCount -= 1
  afterAll ->
    eventManager.off()
    fixture.cleanup()
    
  #Tested
  it 'should mount', ->
    element = $("bloqboard")
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

    element = $("toolbox")
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

  it "should allow for multiple levels of nesting : Vertical", (done)->
    toBloq = $('bloqboard > bloq-list > bloq:first bloq-header')
    fromBloq = $("toolbox bloq-toolbox[bloq='#{parentBloq}'] .dragg-handler")
    fromBloq.simulate "drag-n-drop",
      dragTarget:toBloq
    setTimeout ->
      toBloq = $('bloqboard bloq:eq(0)')
      fromBloq = $("toolbox bloq-toolbox[bloq='#{singleBloq}'] .dragg-handler")
      expect(toBloq.find('bloq-list bloq').length).toBe(0)
      fromBloq.simulate "drag-n-drop",
        dragTarget:toBloq.find('drop-bloq')
      setTimeout ->
        expect(toBloq.find('bloq-list bloq').length).toBeGreaterThan(0)
        done()
      ,500
      return
      
    ,500 #animation time is 400
    return


  it 'should allow you to drag new nodes from the toolbox', ->
    #drag new node from toolbox, check structure with .tocode
    #nested level -- just Vertical one

    #Query : Isn't this same has nested vertical case ?
    toBloq = $('bloqboard > bloq-list > bloq:first bloq-header')
    fromBloq = $("toolbox bloq-toolbox[bloq='#{parentBloq}'] .dragg-handler")
    length = $('bloqboard > bloq-list > bloq').length
    sm = scriptModel.lookup[0]
    expect(sm.length).toBe(length)

    moveBloq fromBloq,toBloq,->
      expect($('bloqboard > bloq-list > bloq').length).toBe(length+1)
      expect(scriptModel.lookup[0].length).toBe(length+1)
      expect(sm[0].bloq).toBe parentBloq
      bloqType = $("bloqboard > bloq-list > bloq:first bloq-header").attr("bloq")
      expect(bloqType).toBe parentBloq

  #Tested
  it "should allow for multiple levels of nesting : Horizontal", (done)->
    #Horizontal Nesting
    toBloq = $('bloqboard parameter:first').closest('bloq')
    toBloq.find('> bloq-header .edit-bloq').simulate("click")
    fromBloq = $("toolbox bloq-toolbox[bloq='#{editBloq}'] .dragg-handler")
    intialCount = toBloq.find('.editing > flow-element').length
    stringBox = toBloq.find('.editing')
    moveBloq fromBloq, stringBox.find("> flow-element:first"), ->
      expect(stringBox.attr('contentEditable')).toBe 'true'
      expect(stringBox.find('>flow-element').length).toBe intialCount+1
      bloqType = stringBox
        .find(">flow-element[type='bloq'] > bloq:first bloq-header")
        .attr("bloq")
      expect(bloqType).toBe editBloq
      #toBloq.find('.ok-bloq:visible').simulate('click')

      #2nd Drag
      console.log "Horizontal : Mulitple levels of nesting not implemented"
      return done()

      #TODO : Not working
      moveBloq fromBloq, stringBox.find("> flow-element:first"), ->
        expect(stringBox.attr('contentEditable')).toBe 'true'
        expect(stringBox.find('>flow-element').length).toBe intialCount+1
        bloqType = stringBox
          .find(">flow-element[type='bloq'] > bloq:first bloq-header")
          .attr("bloq")
        expect(bloqType).toBe editBloq
        done()

  #Tested
  it 'should allow bloqs to be dragged into editable parameters', (done)->

    toBloq = $('bloqboard parameter:first').closest('bloq')
    toIndex = toBloq.index()
    expect(toBloq.length).toBe 1

    toBloq.find('> bloq-header .edit-bloq').simulate("click")
    fromBloq = $("toolbox bloq-toolbox[bloq='#{singleBloq}'] .dragg-handler")
    intialCount = toBloq.find('.editing > flow-element').length
    initalSMLength = scriptModel.lookup[0][toIndex].parameters[0].children.length

    stringBox = toBloq.find('.editing')
    moveBloq fromBloq, toBloq.find('.editing > flow-element:first'), ->
      
      ##HTML
      expect(stringBox.find('>flow-element').length).toBe intialCount+1
      bloqType = stringBox
        .find(">flow-element[type='bloq'] > bloq:first bloq-header")
        .attr("bloq")
      expect(bloqType).toBe singleBloq
      $('.editing-tb > .edit-btn .ok-button:visible').simulate 'click'
      ##Script Model Verfiication
      sm = scriptModel.lookup[0][toIndex].parameters[0].children
      expect(sm[0].bloqType).toBe singleBloq
      expect(sm.length).toBe initalSMLength+1

      ##TODO "Horizontal Test Case Script Model Verification Pending"
      done()
    return
 
  #Tested
  it 'should allow you to drag new bloqs from the toolbox', (done)->

    #drag new node from toolbox, check structure with .tocode
    toBloq = $('bloqboard bloq:first bloq-header')
    fromBloq = $("toolbox bloq-toolbox[bloq='#{singleBloq}']:first")
      .find(".dragg-handler")

    initalBloqCount = $('bloqboard > bloq-list > bloq').length
    moveBloq fromBloq, toBloq ,->
      expect($('bloqboard > bloq-list > bloq').length).toBe initalBloqCount+1
      done()
    return
 
  #Tested
  it 'should allow you to drag new store item bloqs from the toolbox',(done) ->
    #drag "new variable..."
    #make sure it says "new variable"
    bloqName = "new variable..."
    toBloq = $('bloqboard bloq:first bloq-header')
    fromBloq = $("toolbox bloq-toolbox[bloq='#{bloqName}']:first")
      .find(".dragg-handler")

    initalBloqCount = $('bloqboard > bloq-list > bloq').length

    moveBloq fromBloq,toBloq,->
      expect($('bloqboard > bloq-list > bloq').length).toBe initalBloqCount+1
      expect($('bloqboard > bloq-list > bloq:first .bloq-title')
        .text()
      ).toBe "new variable"
      done()

  #Tested
  it 'should allow you to drag store bloqs from the toolbox', (done)->
    #create "something" variable
    #drag "something"
    #make sure it says "something"
    bloqName = "new variable..."
    newVar = "New Test Variable"

    expect( $("toolbox bloq-toolbox[bloq='#{newVar}']").length).toBe 0
    #toBloq = $('bloqboard bloq:first bloq-header')
    toBloq = $('bloqboard parameter:first').closest('bloq')
    toIndex = toBloq.index()
    fromBloq = $("toolbox bloq-toolbox[bloq='#{bloqName}']:first")
      .find(".dragg-handler")
    initalBloqCount = $('bloqboard > bloq-list > bloq').length

    moveBloq fromBloq,toBloq.find('bloq-header'),->
      expect($('bloqboard > bloq-list > bloq').length).toBe initalBloqCount+1
      operatorBloq = $("bloqboard > bloq-list > bloq:eq(#{toIndex})").first()
      expect(operatorBloq.find('.bloq-title').text()).toBe "new variable"

      #Update Dragged Variable
      operatorBloq.find('.edit-bloq:visible').simulate("click")
      operatorBloq.find('.bloq-title').simulate("key-sequence", {
        sequence: "{selectall}#{newVar}"
      })

      operatorBloq.find('.ok-bloq:visible').simulate("click")
      expect( $("toolbox bloq-toolbox[bloq='#{newVar}']").length).toBe 1

      #toBloq = $('bloqboard bloq:first bloq-header')
      toBloq = $('bloqboard parameter:first').closest('bloq')
      toIndex = toBloq.index()

      fromBloq = $("toolbox bloq-toolbox[bloq='#{newVar}']").find(".dragg-handler")

      initalBloqCount = $('bloqboard > bloq-list > bloq').length

      #Move newly created Variable
      moveBloq fromBloq,toBloq.find('bloq-header'),->
        expect($('bloqboard > bloq-list > bloq').length).toBe initalBloqCount+1
        expect($("bloqboard > bloq-list > bloq:eq(#{toIndex}) .bloq-title")
          .text()
        ).toBe "#{newVar}"
        done()


  #Tested
  it 'should allow you to drag bloqs into a if-inner bloq', (done)->

    ## Drag
    toBloq = $('bloqboard bloq:first bloq-header')
    fromBloq = $("toolbox bloq-toolbox[bloq='#{singleBloq}']:first")
      .find(".dragg-handler")

    initalBloqCount = $('bloqboard > bloq-list > bloq').length

    moveBloq fromBloq, toBloq, ()->
      expect($('bloqboard >  bloq-list > bloq').length).toBe initalBloqCount+1

      #Dropping Into if-inner
      toBloq = $('bloqboard bloq:first bloq-header[bloq="then"]')
      expect($('bloqboard bloq:first drop-bloq').length).toBe 1
    
      fromBloq = $("toolbox bloq-toolbox[bloq='#{singleBloq}']:first")
        .find(".dragg-handler")

      intialThenCount = $('bloqboard >  bloq-list > bloq:first')
        .find('bloq-header[bloq="then"]')
        .length

      moveBloq fromBloq, toBloq, ()->
        finalThenCount = $('bloqboard >  bloq-list > bloq:first')
          .find('bloq-header[bloq="then"]')
          .length
        expect($('bloqboard >  bloq-list > bloq:first')
          .find('bloq-header[bloq="then"]')
          .length
        ).toBe intialThenCount+1
        done()

  #Recent Error
  it 'should allow you to move operator bloq', (done)->
    #currently broken
    #Drag any Math test case
    #Drag it further between list's
    bloqName = "add"
    toBloq = $('bloqboard bloq:first bloq-header')
    fromBloq = $("toolbox bloq-toolbox[bloq='#{bloqName}']:first")
      .find(".dragg-handler")
    initalBloqCount = $('bloqboard > bloq-list > bloq').length
    initalSMLength = scriptModel.lookup[0].length
   
    #Move to Index 0
    moveBloq fromBloq, toBloq, ->
      #HTML Verification
      bloq = $('bloqboard > bloq-list > bloq')
      expect(bloq.length).toBe initalBloqCount+1
      expect(bloq.first().find('.operator-inner').attr('bloq')).toBe bloqName
      #Script Model Verification

      updatedSMLength = scriptModel.lookup[0].length


      expect(updatedSMLength).toBe initalSMLength+1
      expect(scriptModel.lookup[0][0]['bloqType']).toBe "operator"
      expect(scriptModel.lookup[0][0]['bloq']).toBe bloqName

      log("[c='color: red']Second Opertor bloq move -- not implemented[c]
      Bug : [c='color: green'] .dragg-handler class missing from operator bloq[c]
      ")
      return done()

      #Move from Index 0->1
      fromBloq = $('bloqboard bloq:first .dragg-handler')
      toBloq = $('bloqboard bloq:eq(1)')
      moveBloq fromBloq, toBloq, ->
        #HTML Verification
        bloq = $('bloqboard > bloq-list > bloq')
        expect(bloq.length).toBe initalBloqCount+1
        expect(bloq.eq(1).find('.operator-bloq').attr('bloq')).toBe bloqName
        #Script Model Verification
        expect(scriptModel.lookup[0].length).toBe updatedSMLength
        expect(scriptModel.lookup[0][1]['bloqType']).toBe "operator"
        expect(scriptModel.lookup[0][1]['bloq']).toBe bloqName
        done()
    return

  it 'should not allow you to move if-inner bloqs', ->
    log('Buddy this is pending still now')
    expect(true).toBe false
    #currently broken
    #drag if bloq
    #then shouldn't be allowed be dragged
    #shouldn't be allowed to drag blogs between if & then - Different Test Case

  it 'should receive a event from event manager
  when an edit button ok and Cancel is clicked ,', ->
    #currently broken
    #try this with operator bloq, compact bloq (variables),
    #if bloq, and normal bloq
    #leave the operator bloq

    #Query : Seth shouldn't this code be inside component like 
    # we did for if-bloq ? 

    onTriggered = 0
    offTriggered = 0

    eventManager.on "editModeOn", ->
      console.log "Edit Mode On"
      onTriggered++

    eventManager.on "editModeOff", ->
      console.log "Edit Mode Off"
      offTriggered++
   
    log('[c="color:red"] Event are not emitted by Compaq bloq [c]')

    #Add else if Bloq

    #element = $('bloqboard > bloq-list > bloq:first')
    element = $('bloqboard parameter:first').closest('bloq')
    expect(element.length).toBe 1

    #Edit
    console.log element.find(">bloq-header .edit-bloq:visible")[0]
  
    element.find(">bloq-header .edit-bloq:visible").simulate("click")
    tag.update()
    expect(onTriggered).toEqual 1
     
    #Cancel
    # todo whats going on here?
    return
    element.find(".cancel-button:visible").simulate("click")
    expect(offTriggered).toEqual 1
    
    #Edit
    element.find(">bloq-header .edit-bloq:visible").simulate("click")
    tag.update()
    expect(onTriggered).toEqual 2

    #Ok
    element.find(".ok-bloq:visible").simulate("click")
    expect(onTriggered).toEqual 2


  it 'should receive a event from event manager
  when an ok button is clicked', ->
    expect(true).toBe false
    #currently broken
    #try this with operator bloq, compact bloq, if bloq, and normal bloq
    #leave the operator bloq

    # Seth, I have covered this in above case , just remove this if the above 
    # case full fills the need of this case

  #Tested
  it 'should allow you to move bloqboard bloq', (done)->
    #drag to change order of bloqs. verify with .toCode

    #Selecting a test Bloq
    testBloq = $('bloqboard bloq:first')
    expect(testBloq.length).toBeGreaterThan 0

    testBloqHtml = testBloq.html()
    #intialModel = JSON.stringify scriptModel.lookup[0][0]
    intialModel = boardProp scriptModel.lookup[0][0]


    #More then one bloq is present
    totalBloq = $('bloqboard bloq')
    expect(totalBloq.length).toBeGreaterThan 1
    intialPosition = testBloq.index()

    #Move Bloq
    toBloq = $('bloqboard > drop-bloq')
    fromBloq = testBloq.find('.dragg-handler')

    moveBloq fromBloq,toBloq,->
      #HTML
      moveBloqHtml = $('bloqboard > bloq-list > bloq:last').html()
      expect(testBloqHtml == moveBloqHtml).toBe true

      length = scriptModel.lookup[0].length
      #Script Model
      finalModel = JSON.stringify scriptModel.lookup[0][length-1]
      expect(intialModel).toBe finalModel

      done()

  #Tested
  it 'should allow you to move script bloq between levels', (done)->

    testBloq = $("toolbox bloq-toolbox[bloq='#{parentBloq}']")
    expect(testBloq.length).toBeGreaterThan 0

    #More then one Nested bloq is present
    expect($('bloqboard bloq bloq-list:first').length).toBeGreaterThan 0
    initalBloqCount = $('bloqboard bloq').length
    fromBloq = testBloq.find('.dragg-handler')

    #Toolbox -> bloqboard drop
    moveBloq fromBloq,$('bloqboard > drop-bloq'),->      
      expect($('bloqboard bloq').length).toBe initalBloqCount+1
      #Moving Bloq to next level
      toBloq = $('bloqboard bloq bloq-list:first')
      toBloqCount = $('bloqboard bloq bloq-list bloq').length
      fromBloq = $('bloqboard bloq:last').find('.dragg-handler')

      moveBloq fromBloq,toBloq.parent().children('drop-bloq'),->
        expect($('bloqboard bloq bloq-list bloq').length).toBe toBloqCount+1
        done()
 
  it "should allow you to drag a bloq in a parameter in edit mode to a new location", (done)->
    #toBloq = $('bloqboard > bloq-list > bloq:first')
    toBloq = $('bloqboard parameter:first').closest('bloq')
    toIndex = toBloq.index()
    expect(toBloq.length).toBe 1
    toBloq.find(' > bloq-header .edit-bloq').simulate("click")
    fromBloq = $("toolbox bloq-toolbox[bloq='#{singleBloq}'] .dragg-handler")
    intialCount = toBloq.find('.editing > flow-element').length
    initalSMLength = scriptModel.lookup[0][toIndex].parameters[0].children.length

    stringBox = toBloq.find('.editing:first')
    moveBloq fromBloq, toBloq.find('.editing > flow-element:first'), ->
      
      ##HTML
      expect(stringBox.find('>flow-element').length).toBe intialCount+1
      newBloq = stringBox.find(">flow-element[type='bloq'] > bloq:first bloq-header")
        
      expect(newBloq.attr("bloq")).toBe singleBloq

      newBloqHtml = newBloq.html()

      #intialCount = toBloq.find('.editing > flow-element').length
      #intialModel = scriptModel.lookup[toBloq[0]._tag.sbid]

      console.log "Implement SM validation"

      stringBox = toBloq.find('.editing')
      moveBloq newBloq, toBloq.find('.editing > flow-element:last'), ->

        ##HTML
        expect(stringBox.find('>flow-element').length).toBe intialCount+1
        finalBloq = stringBox.find(">flow-element[type='bloq'] > bloq:last bloq-header")
        expect(finalBloq.attr("bloq")).toBe singleBloq  
        expect(newBloqHtml).toBe finalBloq.html()
        $('.editing-tb > .edit-btn .ok-button:visible').simulate 'click'

        # Suggestion : older children should be removed form the scriptModel
        finalSM = scriptModel.lookup[0][toIndex].parameters[0].children
        length = finalSM.length
        expect(finalSM[length-1].bloqType).toBe singleBloq
        expect(length).toBe initalSMLength+1

        done()
    

  it "should undo drags from bloqboard", (done)->

    toBloq = $('bloqboard > drop-bloq')
    fromBloq = $('bloqboard > bloq-list > bloq:first > bloq-header')
    length = $('bloqboard > bloq-list > bloq').length
    expect(scriptModel.lookup[0].length).toBe(length)
    initalModel = boardProp(scriptModel.lookup[0][0])



    moveBloq fromBloq, toBloq ,->

      expect($('bloqboard > bloq-list > bloq').length).toBe(length)
      expect(scriptModel.lookup[0].length).toBe(length)
      expect(initalModel).toBe JSON.stringify scriptModel.lookup[0][length-1]

      undoManager.undo()

      expect($('bloqboard > bloq-list > bloq').length).toBe(length)
      expect(scriptModel.lookup[0].length).toBe(length)
      expect(initalModel).toBe JSON.stringify scriptModel.lookup[0][0]

      undoManager.redo()
      
      expect($('bloqboard > bloq-list > bloq').length).toBe(length)
      expect(scriptModel.lookup[0].length).toBe(length)
      expect(initalModel).toBe boardProp(scriptModel.lookup[0][length-1])

      done()

  it "should undo drags from toolbox", (done)->

    #toBloq = $('bloqboard bloq:first bloq-header')
    #toBloq = $('bloqboard parameter:first').closest('bloq')
    toBloq = $('bloqboard > drop-bloq')
    #toIndex = toBloq.index()
    fromBloq = $("toolbox bloq-toolbox[bloq='#{parentBloq}'] .dragg-handler")
    length = $('bloqboard > bloq-list > bloq').length
    expect(scriptModel.lookup[0].length).toBe(length)
    sm = scriptModel.lookup[0]

    moveBloq fromBloq, toBloq ,->

      expect($('bloqboard > bloq-list > bloq').length).toBe(length+1)
      expect(sm.length).toBe(length+1)
      expect(sm[length].bloq).toBe parentBloq
      undoManager.undo()

      expect($('bloqboard > bloq-list > bloq').length).toBe(length)
      expect(sm.length).toBe(length)

      undoManager.redo()

      expect($('bloqboard > bloq-list > bloq').length).toBe(length+1)
      expect(sm.length).toBe(length+1)
      expect(sm[length].bloq).toBe parentBloq

      done()

  it 'should show an overlay when edit is clicked', ->
    toBloq = $('bloqboard parameter:first').closest('bloq')
    toBloq.find('> bloq-header .edit-bloq').simulate("click")
    expect($('.overlay').hasClass('overlay')).toBe true