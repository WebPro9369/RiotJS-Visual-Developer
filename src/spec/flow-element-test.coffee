describe 'flow element', ->
  tag = null
  model = null
  element = null

  render = (hasBloq, done)->
    fixture.load 'flow-element-test.html'
    scriptModel.initialize(done)
    model =
      content: "test"
    if hasBloq
      model.type = "bloq"
      model.bloq = scriptModel.newBloq "print"
    else
      model.type = "text"
    tags = riot.mount "flow-element", model
    tag = tags[0]
    element = $("flow-element")
    
  describe "with text", ->

    beforeEach (done)->
      render(false, done)
    afterEach ->
      fixture.cleanup()

    it 'should mount', ->
      expect(element.length).toBeGreaterThan(0)

    it 'should render text', ->
      expect(element.text().trim()).toBe 'test'

    it 'should update text', ->
      tag.opts.content = "works"
      tag.update()
      expect(element.text().trim()).toBe 'works'

  it 'should render bloqs', (done)->
    render(true, done)
    expect(element.find("bloq").length).toBeGreaterThan 0


