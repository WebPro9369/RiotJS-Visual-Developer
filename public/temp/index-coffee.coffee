




























































































  oldIndex = []
  $("visual-script-editor bloq-list.root").sortable
    itemSelector: 'bloq , .draggable-element , bloq-toolbox'
    handle: '.dragg-handler , .draggable-element'
    group : 'nav'
    exclude: '.not-draggable-element ,.dragged'
    #tolerance : -80
    containerSelector:'bloq-list , .sortable-item'
    placeholder: '<bloq class="placeholder"></bloq>'
    onDragStart: ($item, container, _super) ->
      #Duplicate items of the no drop area
      dragContainer = container.el[0].tagName
      if(!container.options.drop)
        $item.clone().insertAfter($item)
      _super $item, container
    onDrop: ($item, container, _super) ->
      $clonedItem = $('<bloq/>').css(height: 0)
      #https://github.com/riot/riot/issues/934
      $item.before $clonedItem
      $clonedItem.animate 'height': $item.height()
      topManipulation = 0
      console.log container.el[0]
      if($item.prop('tagName') == 'BLOQ-TOOLBOX')
        hOffset =  window.pageYOffset || document.documentElement.scrollTop
        itemTop =  parseFloat($item.css('top'))
        topManipulation = hOffset + itemTop
        poistionleft = $('visual-script-editor')
                        .position()
                        .left
        left = parseFloat($item.css('left')) - poistionleft
        if($(container.el[0]).hasClass('string-box'))
          parentPosition = $(container.el[0])
                            .closest('.draggable-element')
                            .offset()
          topManipulation -= parentPosition.top
          left -= $(container.el[0])
                    .closest '.draggable-element'
                    .position()
                    .left
        $item.css 'top' , topManipulation
        $item.css 'left', left
      $item.animate $clonedItem.position() , ->
        $clonedItem.detach()
        replacedBloq = $item
        if($item.prop('tagName') == 'BLOQ-TOOLBOX')
          oldIndex.shift()
        _super replacedBloq , container
        #if placedBloq
          #placedBloq[0].trigger("edit",true)
        return
      return
  $("toolbox").sortable
    drop  : false
    group : 'nav'