describe 'toolbox', ->

  tag = null
  beforeEach (done)->
    fixture.load 'toolbox-test.html'
    scriptModel.getBloqData (script, toolbox)->
      tag = riot.mount "toolbox",
        script: script
        toolbox: toolbox
      done()
    return

  exactMatch = (text)->
    return $('bloq-toolbox bloq-header .bloq-title').filter ()->
      return $(this).text() == "#{text}"
    
  afterEach ->
    fixture.cleanup()

  it 'should render categories', ->
    expect($("li.single-category").length).toBeGreaterThan(5)


  it 'should render tool bloqs', ->
    expect($("bloq-toolbox").length).toBeGreaterThan(50)

  it 'should render new store item bloqs', ->
    # New Variables should be present in the Variables section
    bloqName = "new variable..."
    expect($("bloq-toolbox[bloq='#{bloqName}']").length).toBe 1


  it 'should render store bloqs', ->
    # Drag a varaiables (Update the Model)
    # Edit it , Update it
    # Variable should be shown in the toolbox , verify the name of the variable
    
    storeBloq = scriptModel.newBloq("variable")
    newVarName = "New Variable Name"
    scriptModel.changeStoredName(storeBloq.sbid, newVarName)
    tag[0].update()
    expect($("bloq-toolbox[bloq='#{newVarName}']").length).toBe 1



  it 'should give new store item bloqs the correct title', ->
  # Create a var... using model
  # Update toolbox
  # Verify the name is same as the one which was used in the model

  # Question : Difference not clear in this and above case and below case

    storeBloq = scriptModel.newBloq("variable")
    newVarName = "New Variable Name"
    initalStoreLength = scriptModel.stores["variables"].items.length
    scriptModel.changeStoredName(storeBloq.sbid, newVarName)
    tag[0].update()

    #HTML
    expect($("bloq-toolbox[bloq='#{newVarName}']").length).toBe 1
    expect(scriptModel
      .stores["variables"]
      .items[initalStoreLength]
    ).toBe newVarName
    expect($("bloq-toolbox[bloq='#{newVarName}'] .bloq-title")
      .text()
    ).toBe newVarName


  it 'should give store bloqs the correct title', ->
    # Name should be same both in bloqboard and toolbox
    #

    # Question : bloqboard ??? 
    items = scriptModel?.stores?['variables']?.items
    if items? and items.length
      for key, value of items
        expect($("bloq-toolbox[bloq-type='variable'][name='#{value}'] ")
          .find('.bloq-title')
          .text())
          .toBe(value)

  it 'should give normal function bloqs the correct title', ->
    #
    # Toolbox is rending the model correctly
    # Select any random toolbox Model (like replace bloq)
    # and then verify that this is present in the HTML
    toolbox = scriptModel.toolbox
    expect(toolbox.length).toBeGreaterThan 6
    firstBloq = toolbox[5].children[3]
    secondBloq = toolbox[2].children[2]
    thirdBloq = toolbox[3].children[2]


    expect($("bloq-toolbox[bloq='#{firstBloq}']").length).toBeGreaterThan 0
    expect($("bloq-toolbox[bloq='#{secondBloq}']").length).toBeGreaterThan 0
    expect($("bloq-toolbox[bloq='#{thirdBloq}']").length).toBeGreaterThan 0

    
    expect(exactMatch(firstBloq).length).toBeGreaterThan 0
    expect(exactMatch(secondBloq).length).toBeGreaterThan 0
    expect(exactMatch(thirdBloq).length).toBeGreaterThan 0


  it "should load variables from a loaded script", ->
    items = scriptModel?.stores?['variables']?.items
    if items? and items.length
      for key, value of items
        console.log $("bloq-toolbox[bloq-type='variable'][name='#{value}']")[0]
        expect($("bloq-toolbox[bloq-type='variable'][name='#{value}']").length).toBeGreaterThan 0


