toolbox
  ul.collapsible(data-collapsible='expandable')
 
    li.single-category(each="{category in categories}")
      .collapsible-header
        //i.material-icons filter_drama
        | {category.name}
      .collapsible-body(if="{isStore(category)}")
        bloq-toolbox(bloq="new {storeType(category)}..." 
          bloq-type="{storeType(category)}"
          data-bloq="{storeType(category)}")
        bloq-toolbox(each="{item in getStore(category)}" 
          name="{item}" 
          bloq="{item}" 
          bloq-type="{parent.storeType(parent.category)}" 
          data-bloq="{parent.storeType(parent.category)}")

      .collapsible-body(if="{!isStore(category)}")
        bloq-toolbox(each="{name ,i in category.children}"
          bloq="{name}" bloq-type="{name}" data-bloq="{name}")

  style(type="text/stylus"). 
    toolbox
      position fixed
      left 0
      top 0
      z-index 2
      float left
      width 20%
      box-sizing border-box
      padding 0 20px
      height 100%
      overflow-y scroll
    .collapsible-header
      background #636363 !important
      color white
    .collapsible-body
      padding 0 5px
    :scoped
      -webkit-touch-callout none
      -webkit-user-select none
      -khtml-user-select none
      -moz-user-select none
      -ms-user-select none
      user-select none

  script(type="text/coffeescript").
    self = this
    this.categories = scriptModel.toolbox
    @on 'mount', ->
      eventManager.on "storeUpdated", ->
        self.update()
    @isStore = (category)->
      if scriptModel.stores[category.name]?
        return true
      else
        return false
    @storeType = (category)->
      return scriptModel.stores[category.name].bloqType

    @getStore = (category)->
      return scriptModel.stores[category.name].items

    @getVariables = ->
      Object.keys(scriptModel.variables)

    self.on 'mount', ->
      $('.collapsible').collapsible()
      $("toolbox").sortable
        drop  : false
        group : 'nav'
