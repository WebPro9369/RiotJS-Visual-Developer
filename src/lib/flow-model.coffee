#todo rename file to FlowModel.coffee
class FlowModel
  constructor: (scriptModel) ->
    @model = []
    @bloqs = []
    @lookup = []
    letters = scriptModel.value
    letters = letters || ''
    letters = String(letters) #Typecasting value ot string
    children = []
    re = /\{[0-9]+\}/
    match = undefined
    while letters.match re
      letters = letters.replace re, (match, index)->
        digit = match.replace /[\{\}]/g, ""
        number = parseInt digit
        children.push
          number: number
          index: index + children.length
        return ""
    for letter in letters
      @model.push
        content: letter
        type: "text"
 
    for child in children
      if not scriptModel.children[child.number]?
        throw "parameter model does not have a child at index " + child.number
      bloq = scriptModel.children[child.number]
      @lookup[bloq.sbid] = bloq
      element =
        type: "bloq"
        bloq: bloq
      @model.splice child.index, 0, element

    @model
  

  insert: (index, bloq)->
    element =
      type: "bloq"
      bloq: bloq
    @model.splice index, 0, element
    @bloqs.push bloq
    @lookup[bloq.sbid] = bloq

  createModelFromDom: (domElement)->
    value = ""
    children = []
    for item in domElement
      if item.nodeType == 3
        value += $(item).text()
      type = $(item).attr("type")
      switch type
        when "text"
          value += $(item).text()
        when "bloq"
          domBloq = $(item).children().first()
          bloq = @lookup[domBloq.data("sbid")]
          token = "{" + (children.length) + "}"
          children.push bloq
          value += token
    parameter =
      value: value
      children: children
    parameter


  ###
  maybe attach flow model to parameters in script model, so that 
  we only need to make a minor mod to scriptMode.insert to make 
  it insert direcly into a parameter's flow model.
  ###