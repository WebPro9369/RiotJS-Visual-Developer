describe "if bloq", ->

  tag = null
  model = null
  element = null

  getBloq = (type)->
    return element.find('span.bloq-adder a').filter ()->
      return $(this).text() == "+#{type}"

  beforeAll (done)->
    scriptModel.initialize done

  beforeEach ->

    fixture.load 'bloq-test.html'
    tags = riot.mount "bloq", model: scriptModel.newBloq "if"
    tag = tags[0]
    element = $("bloq:first")
    
 
  afterEach ->
    fixture.cleanup()



  it "should fire events for edit, ok, cancel, and delete", ->
   
    #Query : There is no event triggered on delete
    # There is no difference in cancel & ok
    # Both emit the same event
    
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
    log("[c='color: red']Move Delete part to bloq-list [c]")

  it "should have a 'then' bloq when it mounts", ->
    #check both the tag's data model and jquery to see that the html is there
    expect(element.find('bloq-header[bloq="then"]').length).toBeGreaterThan 0
    expect(tag.opts.model.children.length).toBeGreaterThan 0
    expect(tag.opts.model.children[0].bloq).toBe "then"

  it "should add an else bloq when +else is clicked", ->
    #check both the tag's data model and jquery to see that the html is there

    
    bloq = 'else'

    expect(getBloq(bloq).length).toBeGreaterThan 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    intialLength = tag.opts.model.children.length
    
    getBloq(bloq).simulate('click')
   
    finalModel = tag.opts.model.children
    expect(finalModel.length).toBe intialLength+1
    expect(finalModel[intialLength].bloq).toBe bloq
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 1
     

  it "should add an else if bloq when +else if is clicked", ->
    #check both the tag's data model and jquery to see that the html is there

    bloq = 'else if'
    expect(getBloq(bloq).length).toBeGreaterThan 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    intialLength = tag.opts.model.children.length
    
    getBloq(bloq).simulate('click')
   
    finalModel = tag.opts.model.children
    expect(finalModel.length).toBe intialLength+1
    expect(finalModel[intialLength].bloq).toBe bloq
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 1



  #TODO : Fix this for now
  it "should add an else if bloq when +else if is clicked,
  even if an else block already exists", ->
    #check both the tag's data model and jquery to see that the html is there

    #Add else bloq
    bloq = 'else'
    expect(getBloq(bloq).length).toBeGreaterThan 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    intialLength = tag.opts.model.children.length
    getBloq(bloq).simulate('click')
    finalModel = tag.opts.model.children
    expect(finalModel.length).toBe intialLength+1
    expect(finalModel[intialLength].bloq).toBe bloq
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 1

    #This is failing for now
    #Add else if bloq
    bloq = 'else if'
    expect(getBloq(bloq).length).toBeGreaterThan 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    intialLength = tag.opts.model.children.length
    getBloq(bloq).simulate('click')
    finalModel = tag.opts.model.children
    expect(finalModel.length).toBe intialLength+1
    expect(finalModel[intialLength-1].bloq).toBe bloq
    expect(finalModel[intialLength].bloq).toBe 'else'
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 1

  it 'should remove the +else once it is clicked', ->
   
    bloq = 'else'
    expect(getBloq(bloq).length).toBeGreaterThan 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    getBloq(bloq).simulate("click")
    expect(getBloq(bloq).length).toBe 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBeGreaterThan 0

  describe "if inner bloqs", ->
    beforeEach ->
      fixture.load 'bloq-test.html'
      #todo we need a better way to represent data in tests
      model = scriptModel.newBloq "if"
      model.children[0].children.push(scriptModel.newBloq("print"))
      tags = riot.mount "bloq", model : model
      tag = tags[0]
    afterEach ->
      fixture.cleanup()

    it 'should render children', ->
      # todo this is confusing
      expect($("bloq > bloq-list > bloq")
        .find("flow-textbox").length
      ).toBeGreaterThan(0)

  it "should fire events for edit, ok, cancel, and delete", ->

    onTriggered = 0
    offTriggered = 0

    eventManager.on "editModeOn", ->
      onTriggered++

    eventManager.on "editModeOff", ->
      offTriggered++

    #Add else if Bloq

    bloq = 'else if'
    getBloq(bloq).simulate("click")

    element = element.find("bloq-header[bloq='else if']").closest('bloq')
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
    log("[c='color: red']Move Delete part to bloq-list [c]")

  it "should undo adding an else", ->

    bloq = 'else'

    expect(getBloq(bloq).length).toBeGreaterThan 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    intialLength = tag.opts.model.children.length
    
    getBloq(bloq).simulate('click')
   
    finalModel = tag.opts.model.children
    expect(finalModel.length).toBe intialLength+1
    expect(finalModel[intialLength].bloq).toBe bloq
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 1

    undoManager.undo()

    log("[c='color:red'] Why do I need to update , when I am not updating
    in workspace test case [c]")
    tag.update()

    expect(tag.opts.model.children.length).toBe intialLength
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0

  it "should undo adding an else if", ->

    bloq = 'else if'

    expect(getBloq(bloq).length).toBeGreaterThan 0
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    intialLength = tag.opts.model.children.length
    
    getBloq(bloq).simulate('click')
   
    finalModel = tag.opts.model.children
    expect(finalModel.length).toBe intialLength+1
    expect(finalModel[intialLength].bloq).toBe bloq
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 1

    undoManager.undo()

    log("[c='color:red'] Why do I need to update , when I am not updating
    in workspace test case [c]")
    tag.update()

    expect(tag.opts.model.children.length).toBe intialLength
    expect(element.find("bloq-header[bloq='#{bloq}']").length).toBe 0
    


  describe "else bloq", ->
    it 'should have a delete button but not an edit button', ->
      bloq = 'else'
      getBloq(bloq).simulate("click")
      expect(element
        .find("bloq-header[bloq='#{bloq}'] .edit-bloq:visible").length
      ).toBe 0
      expect(element
        .find("bloq-header[bloq='#{bloq}'] .delete-bloq:visible").length
      ).toBe 1

      
    
  describe "else if bloq", ->
    it 'should have a delete button and an edit button', ->
      bloq = 'else if'
      getBloq(bloq).simulate("click")
      expect(element
        .find("bloq-header[bloq='#{bloq}'] .edit-bloq:visible").length
      ).toBe 1
      expect(
        element.find("bloq-header[bloq='#{bloq}'] .delete-bloq:visible").length
      ).toBe 1