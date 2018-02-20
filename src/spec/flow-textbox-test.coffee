describe 'flow textbox', ->
  #todo add bloqs
  tag = null
  model = null
  element = null
  beforeEach ->
    fixture.load 'flow-textbox-test.html'
    model =
      value: "test one two three"
      sbid: 1
    scriptModel.lookup[1] = model

    tags = riot.mount "flow-textbox",
      model: model
      value: model.value
      sbid: model.sbid

    tag = tags[0]
    element = $("flow-textbox")

  afterEach ->
    fixture.cleanup()

  it 'should mount', ->
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

  it 'should show the assigned value', ->
    expect($(tag.root).text().trim()).toBe 'test one two three'

  it 'should process assigned value', ->
    fe = element.find("flow-element")
    expect(fe.length).toBeGreaterThan(0)

  it 'should get the correct parameter model', ->
    param = tag.getParameter()
    expect(param.value).toBe "test one two three"

  it 'should get the correct value after typing', ->
    # todo same as above but type into it first
    expect(true).toBe false
  
  describe 'with nested bloq', ->
    beforeEach (done)->
      fixture.load 'flow-textbox-test.html'
      scriptModel.initialize ->
        #todo adapt this to have parameters
        bloq = scriptModel.newBloq "print"
        model =
          value: "test {0} two three"
          sbid: 1
          children: [bloq]
        scriptModel.lookup[1] = model
        tags = riot.mount "flow-textbox",
          model: model
          value: model.value
          sbid: model.sbid
     
        tag = tags[0]
        element = $("flow-textbox")
        done()
    afterEach ->
      fixture.cleanup()

    it 'should contain a bloq', ->
      expect(element.find("bloq").length).toBeGreaterThan 0

    it 'should render the bloq correctly', ->
      bloq = element.find("bloq")
      header = bloq.find("bloq-header")
      param = bloq.find("parameter")
      expect(header.text()).toContain "print"
      #todo add an expect to check the parameter

    it 'should get the assigned bloq and text value', ->
      param = tag.getParameter()
      expect(param.value).toBe "test {0} two three"
      expect(param.children[0].bloq).toBe "print"

    it 'should delete inner bloqs when user backspaces them', ->
      ###
        todo using jquery simulate, backspace the dragged bloq.
        expect model to be correct
      ###
      expect(true).toBe false
