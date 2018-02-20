drop-down-editor
  .input-field
    flow-textbox(value="{opts.value}"
    model="{opts.model}"
    edit-mode="{opts.editMode}"
    ref="editor")

    a.dropdown-button.btn-flat(href='#'
      data-activates='dropdown{ _riot_id }'
      ref='btnDropDown'
      show="{opts.editMode}")
      i.material-icons arrow_drop_down 
    // Dropdown Structure
    ul.dropdown-content(id='dropdown{ _riot_id }' show="{opts.editMode}")
      li(each="{ item in getItems() }")
        a(href='#!' onclick="{parent.setValue(item)}") {item}

  style(type="text/stylus").
    parameter .input-field
      margin-top 0px
      display flex
      justify-content center
      align-items stretch
      flow-textbox
        width 100%
      a.dropdown-button.btn-flat
        width 20px
        padding 0px
        color black
        background-color #ef9a9a !important
        line-height 1.5rem !important
        height auto !important

        i.material-icons
          vertical-align text-top

      ul.dropdown-content.active 
        width 100% !important
        left 0px !important

        li i.material-icons
          float left
          margin-right  16px
  script(type="text/coffeescript").
    self = this
    @setValue = (item)=>
      =>
        @refs.editor.setFlowValue(item)
    self.getItems = ->
      if opts.model.config.store?
        stores = scriptModel.stores[opts.model.config.store]
        if stores?.items? then return stores.items
      else if typeof opts.model.items is "string"
        #return #the store items
        # added by Marcel
        # can we return array of string?
        return opts.model.items.split ' '
      else
        return opts.model.items

    ## ms
    @getParameter = => @refs.editor.getParameter()
    self.on "mount", () =>
      $(this.refs.btnDropDown).dropdown
        belowOrigin: true
        alignment: 'right'
