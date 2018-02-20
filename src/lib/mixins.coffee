window.mixins =
  eventBubbler:
    bubbleEvents: ->
      @on 'mount', ->
        @refs.header.on 'edit', (e)=>
          @trigger "edit"

        @refs.header.on 'ok', (e)=>
          @trigger "ok"

        @refs.header.on 'cancel', (e)=>
          @trigger "cancel"

        @refs.header.on 'delete', (e)=>
          @trigger "delete"

        if @refs.body?
          @refs.body.on 'ok', (e)=>
            @trigger "ok"

          @refs.body.on 'cancel', (e)=>
            @trigger "cancel"
  removeFunc:
    removeFunc: (index)->
      =>
        scriptModel.removeBloq @listid, index
        @update()