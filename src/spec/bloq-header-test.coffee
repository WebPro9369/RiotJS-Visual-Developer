describe 'bloq-header', ->

  tag = null
  model = null

  render = (showButtons, draggable, editMode, editableHeader) ->
    fixture.load 'bloq-header-test.html'
    model =
      bloq: "print"
      color: "#2962ff"
      showButtons: showButtons
      draggable: draggable
      editMode: editMode
      editableHeader: editableHeader

    tags = riot.mount "bloq-header", model
    tag = tags[0]
      

  afterEach ->
    fixture.cleanup()

  it 'should mount', ->
    render()
    element = $("bloq-header")
    
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

  it 'should have the correct title', ->
    render()
    name = jQuery(".bloq-title").text()
    expect(name).toBe "print"

  it 'should be able to hide all buttons', ->
    render 'false'
    expect($(".action-btn")).not.toBeVisible()

  it 'should have draggable class when draggable is true', ->
    render(true , true)
    expect($("bloq-header")).toHaveClass("dragg-handler")

  it 'should be able to turn draggable on and off', ->
    render()
    expect($("bloq-header")).toHaveClass("dragg-handler")
    tag.opts.draggable = false
    tag.update()
    expect($("bloq-header")).not.toHaveClass("dragg-handler")
    tag.opts.draggable = true
    tag.update()
    expect($("bloq-header")).toHaveClass("dragg-handler")

  it "should render out of edit mode, ", ->
    render true, true, false, true
    expect($(".bloq-title").attr "contenteditable").not.toBe "true"

  it "should render into edit mode", ->
    render true, true, true, true
    expect($(".bloq-title").attr "contenteditable").toBe "true"

  it "should update into edit mode", ->
    render(false)
    expect($(".bloq-title").attr "contenteditable").not.toBe "true"
    tag.opts.editMode = true
    tag.opts.editableHeader = true
    tag.update()
    expect($(".bloq-title").attr "contenteditable").toBe "true"

  it "should update out of edit mode", ->
    render(true,false,true,true)
    expect($(".bloq-title").attr "contenteditable").toBe "true"
    tag.opts.editMode = false
    tag.update()
    expect($(".bloq-title").attr "contenteditable").not.toBe "true"


