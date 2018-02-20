describe 'bloq-list', ->
  #similar boilerplate to other tests
  #yaml  datashould include 3 different bloqs
  #todo-s Need to know about the 3rd bloq

  tag = null
  listId = 0

  forBloq = 2
  printBloq = 1
  bloqLength = 3
  bloqStructure = ["variable","print","for"]


  #beforeAll (done)->
  #  scriptModel.initialize done

  beforeEach (done)->
    fixture.load 'bloq-list-test.html'

    scriptModel.getBloqData (script, toolbox)->
      tags = riot.mount "bloq-list",
        script: script,
        root: "true",
        sbid: listId,
        class: "root",
        ref: "bloqlist"
      tag = tags[0]
      done()
    return

  afterEach ->
    fixture.cleanup()

  it 'should mount', ->
    element = $("bloq-list")
    expect(element.length).toBeGreaterThan(0)
    expect(element.children().length).toBeGreaterThan(0)

  it 'should list multiple script bloqs', ->
    #verify with jquery and .toCode()
    expect($("bloq-list bloq").length).toBeGreaterThan(0)



  ## I think this case is not required
  ## We need a 2 approach
  ## ScriptModel => UI & UI => ScriptModel

  it 'should insert new bloqs', ->
    index = 1
    intialBloq = $("bloq-list[sbid='#{listId}'] > bloq").length
    expect(intialBloq).toBe(bloqLength)
    bloq = scriptModel.newBloq("print")
    bloq.parameters[0].value = "test"
    scriptModel.insertBloq listId , bloq , index
    tag.update()
    expect(tag.opts.script[index].bloq).toBe "print"
    expect($("bloq-list[sbid='#{listId}'] > bloq").length).toBe bloqLength+1


  it 'should remove bloqs', ->
    index = 2
    expect($("bloq-list[sbid='#{listId}'] > bloq").length).toBe(bloqLength)
    expect(tag.opts.script.length).toBe bloqLength
    scriptModel.removeBloq listId ,index
    tag.update()
    expect(tag.opts.script[printBloq].bloq).toBe "print"
    expect(tag.opts.script.length).toBe bloqLength-1
    expect($("bloq-list[sbid='#{listId}'] > bloq").length).toBe(bloqLength-1)

    
  it 'should list multiple script bloqs second', ->
    #verify with jquery and .toCode()
    expect($("bloq-list bloq-list bloq").length).toBeGreaterThan(0)

  #Inter Bloq-list move
  it 'should move bloqs', ->
    #Inital Check
    expect(tag.opts.script[printBloq].bloq).toBe "print"
    expect($("bloq-list[sbid='#{listId}'] > bloq:eq(#{printBloq})")
      .find(" > bloq-header .bloq-title")
      .text()
    ).toBe "print"
    expect($("bloq-list[sbid='#{listId}'] > bloq:eq(#{forBloq})")
      .find(" > bloq-header .bloq-title")
      .text()
    ).toBe "for"
    
    
    #Updaing Model & Tag
    scriptModel.moveBloq listId, printBloq, forBloq
    tag.update()

    #Final Check
    #[forBloq, printBloq] = [printBloq, forBloq]
    newforBloq = printBloq
    newprintBloq = forBloq
    expect(tag.opts.script[newforBloq].bloq).toBe "for"
    expect(tag.opts.script[newprintBloq].bloq).toBe "print"
    expect($("bloq-list[sbid='#{listId}'] > bloq:eq(#{newforBloq})")
      .find(" > bloq-header .bloq-title")
      .text()
    ).toBe "for"
    expect($("bloq-list[sbid='#{listId}'] > bloq:eq(#{newprintBloq})")
      .find(" > bloq-header .bloq-title")
      .text()
    ).toBe "print"
    
  it 'should move bloqs between bloqlists', ->
    
    #Intial Check
    expect($('bloq-list bloq-list:eq(0)').length).toBeGreaterThan(0)
    innerLength = $('bloq-list bloq-list:eq(0) > bloq').length
    outerLength = $("bloq-list[sbid='#{listId}'] > bloq").length
    expect(innerLength).toBeGreaterThan(0)
    expect(outerLength).toBeGreaterThan(0)
    expect(tag.opts.script[printBloq].bloq).toBe "print"
    bloqText = tag.opts.script[printBloq].parameters[0].value

    #Parent List -> Child List
    #printBloq -> Inside For Bloq
    tag2 = $('bloq-list bloq-list:eq(0)')[0]._tag
    scriptModel.moveBloq listId, printBloq, 1 , tag2.opts.sbid
    tag.update()

    #for bloq index has changed
    forBloqIndex  = printBloq
    expect($('bloq-list bloq-list:eq(0) > bloq').length).toBe innerLength+1
    expect($("bloq-list[sbid='#{listId}'] > bloq").length).toBe outerLength-1
    expect(tag.opts.script[forBloqIndex].bloq).toBe "for"
    expect(tag2.opts.script[1].bloq).toBe "print"
    expect(tag2.opts.script[1].parameters[0].value).toBe bloqText

  
    #Child List -> Parent List
    bloqText = tag2.opts.script[0].parameters[0].value
    scriptModel.moveBloq tag2.opts.sbid, 0, 0, listId
    tag.update()
   
    expect($('bloq-list bloq-list:eq(0) > bloq').length).toBe innerLength
    expect($("bloq-list[sbid='#{listId}'] > bloq").length).toBe outerLength
    expect(tag.opts.script[0].bloq).toBe "print"
    expect(tag.opts.script[0].parameters[0].value).toBe bloqText


  it 'should have a button inside bloq to delete the bloq', ->

    intialBloqCount = $("bloq-list[sbid='#{listId}'] > bloq").length
    log "[c='color:red']Delete dont' work for compaq bloq [c]"
    #Removed First Element form
    expectedModel = JSON.stringify tag.opts.script.slice(0,tag.opts.script.length-1)
    intialSMlength = tag.opts.script.length

    #Click
    expect($("bloq-list[sbid='#{listId}'] ")
      .find("> bloq:last")
      .find("> bloq-header .delete-bloq").length).toBe 1

    $("bloq-list[sbid='#{listId}'] ")
      .find("> bloq:last ") 
      .find("> bloq-header .delete-bloq").simulate('click')

    ##Verification
    #jQuery
    expect( $("bloq-list[sbid='#{listId}'] > bloq").length).toBe intialBloqCount-1
    #ScriptModel
    expect(JSON.stringify(tag.opts.script)).toBe expectedModel
    