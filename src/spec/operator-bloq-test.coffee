describe "operator bloq", ->

  tag = null

  beforeAll (done)->
    scriptModel.getBloqData (done)

  beforeEach ->
    riot.settings.autoUpdate = false
    fixture.load 'bloq-test.html'
    tags = riot.mount "bloq", model: scriptModel.newBloq "add"
    tag = tags[0]

  afterEach ->
    fixture.cleanup()

  #Missing other test Case -- see operatore-bloq test case
 
  it "should show edit and delete buttons when header is clicked", (done)->

    listRoot = $('ul[ref="listRoot"]')
    expect(listRoot.length).toBe 1
    editBtn = listRoot.find('li.outer-li a')
    delBtn = listRoot.find('li:last a')

    expect(editBtn.css('opacity')).toBe '0'
    expect(delBtn.css('opacity')).toBe '0'

    $('.bloq-operator').simulate('click')
    setTimeout ->
      #expect(editBtn.css('opacity')).toBe '1'
      #expect(delBtn.css('opacity')).toBe '1'
      expect(parseFloat(editBtn.css('opacity'))).toBeGreaterThan 0
      expect(parseFloat(delBtn.css('opacity'))).toBeGreaterThan 0
      done()
    ,500 # CSS transition : .3s

  it "should change to ok and cancel buttons when edit is clicked", (done)->

    listRoot = $('ul[ref="listRoot"]')
    expect(listRoot.length).toBe 1

    editBtn = listRoot.find('li:eq(0) a')
    okBtn = listRoot.find('li:eq(1) a')
    cancelBtn = listRoot.find('li:eq(2) a')

    expect(okBtn.css('opacity')).toBe '0'
    expect(cancelBtn.css('opacity')).toBe '0'

    $('.bloq-operator').simulate('click')
    setTimeout ->

      expect(okBtn.css('display')).toBe 'none'
      expect(cancelBtn.css('display')).toBe 'none'

      editBtn.simulate('click')
      setTimeout ->
        expect(editBtn.css('display')).toBe 'none'
        expect(okBtn.css('display')).not.toBe 'none' #inline-block
        expect(cancelBtn.css('display')).not.toBe 'none'
        done()
      ,500

    ,500 # CSS transition : .3s

  
  it "should fire events for edit ok, cancel, and delete", ->

    listRoot = $('ul[ref="listRoot"]')
    expect(listRoot.length).toBe 1

    editBtn = listRoot.find('li:eq(0) a')
    okBtn = listRoot.find('li:eq(1) a')
    cancelBtn = listRoot.find('li:eq(2) a')
    deleteBtn = listRoot.find('li:eq(3) a')

    onTriggered = 0
    offTriggered = 0
    
    eventManager.on "editModeOn", ->
      onTriggered++

    eventManager.on "editModeOff", ->
      offTriggered++

    #Edit
    editBtn.simulate("click")
    tag.update()
    expect(onTriggered).toEqual 1
     
    #Cancel
    cancelBtn.simulate("click")
    expect(offTriggered).toEqual 1

    #Edit
    editBtn.simulate("click")
    tag.update()
    expect(onTriggered).toEqual 2

    #Ok
    okBtn.simulate("click")
    expect(onTriggered).toEqual 2

    #Delete
    #element.find(">bloq-header .delete-bloq:visible").simulate("click")
    log("[c='color: red']Delete part is not emitting any event [c]")

  describe "in big mode", ->

    it "should show normal header buttons", ->

    it "should be vertically oriented", ->

      