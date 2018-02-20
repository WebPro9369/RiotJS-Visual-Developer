








self = this
window.workspace = this
@showOverlay = false
@sortStack = []
@overlayStack = []
@overlayFocus = null
@sortFocus = null
@heldItem = null

eventManager.on "stateChange", (e)=>
  opts.script = scriptModel.mainScript
  @update()

@addSortFocus = (container)=>
  if @sortFocus == null
    throw "root focus not set"
  @sortStack.push @sortFocus
  @sortFocus.sortable 'destroy'
  container.sortable
    group    : 'nav'
    vertical : false
  @sortFocus = container

@removeSortFocus = =>
  if @sortStack.length < 1
    throw "removed root sortable"

  @sortFocus.sortable 'destroy'
  @sortFocus = @sortStack.pop()
  #todo the drag location is wrong at first.
  @sortFocus.each -> $(this).sortable
    group    : 'nav'
    #vertical : false

@addOverlayFocus = (bloq)=>

  @showOverlay = true
  
  if @overlayFocus != null
    @overlayFocus.hasOverlay = false
    @overlayStack.push @overlayFocus
  @overlayFocus = bloq
  bloq.hasOverlay = true
  @update()

@removeOverlayFocus = =>
  @overlayFocus.hasOverlay = false
  if @overlayStack.length < 1
    @overlayFocus = null
    @showOverlay = false
  else
    @overlayFocus = @overlayStack.pop()
    @overlayFocus.hasOverlay = true
  @update()


self.on 'mount',  =>
  editor = self.refs.editor


  # eventManager.on 'releaseItem', (e, bloq)=>
  #   @heldItem = null

  eventManager.on 'holdItem', (e, item)=>
    if @heldItem == null
      @heldItem = item

  eventManager.on 'editModeOn', (e, bloq)=>
    @addOverlayFocus bloq
    @addSortFocus $(bloq.root).find('.editing')
            
  eventManager.on 'editModeOff', (bloq) =>
    @removeSortFocus()
    @removeOverlayFocus()
  
  oldIndex = []
  trackBloq = []
  $root = $("bloqboard bloq-list.root")
  @sortFocus = $root
  $root.sortable
    itemSelector: 'bloq , .draggable-element , bloq-toolbox'
    handle: '.dragg-handler , .draggable-element'
    group : 'nav'
    exclude: '.not-draggable-element ,.dragged'
    containerSelector:'bloq-list, .if-body, .editing'
    placeholder: '<bloq class="placeholder"></bloq>'

    isValidTarget: ($item, container)->
      if(container.el.is(".if-body"))
        return false
      else
        return true
        
    onDragStart: ($item, container, _super) ->

      adorner = $("<bloq></bloq>")
      adorner.appendTo('.root')
      if self.heldItem.from == "bloqboard"
        self.heldItem.tag.opts.remove()
      riot.mount adorner, 'bloq' , model: self.heldItem.bloq
      _super adorner, container
      return adorner
        
    onCancel: ($item, container, _super) ->
      self.heldItem = null

    onDrop: ($item, container, _super) ->
      itemIndex = $(".placeholder").index()
      containerId = container.el.attr("sbid")
      tagRef = scriptModel.lookup[containerId]          
      scriptModel.insertBloq(containerId, self.heldItem.bloq, itemIndex)
      self.heldItem.bloq.onBloqBoard = true
      self.update script: scriptModel.mainScript
      undoManager.createUndo()
      self.heldItem = null

      # $clonedItem = $('<bloq/>')
      #   .css
      #     width: 0
      #     height: 0
      #   .addClass('temp-placeholder')
      # $item.before $clonedItem
      # topManipulation = 0
      # if $(container.el[0]).hasClass('sortable-item')
      #   $clonedItem.animate 'width': $item.width()
      # else
      #   $clonedItem.animate 'height': $item.height()
      # if($item.prop('tagName') == 'BLOQ-TOOLBOX')
      #   hOffset =  window.pageYOffset || document.documentElement.scrollTop
      #   itemTop =  parseFloat($item.css('top'))
      #   topManipulation = hOffset + itemTop
      #   poistionleft = $('bloqboard').position().left
      #   left = parseFloat($item.css('left')) - poistionleft
      #   $item.css 'top' , topManipulation
      #   $item.css 'left', left

      # $item.animate $clonedItem.position() , ->
      # $clonedItem.detach()
      # switch $item.prop('tagName')
      #   when 'BLOQ-TOOLBOX'
      #     bloqType = $item.find('bloq')[0]._tag.opts.model.bloq
      #     bloqName = $item.find('bloq')[0]._tag.opts.model.name
      #     $item.find('bloq')[0]._tag.unmount()
      #     $item.remove()
      #     oldIndex.shift()
      #     newbloq = scriptModel.newBloq(bloqType)
      #     if bloqName?
      #      newbloq.name = bloqName             
      #     if $(container.el[0]).hasClass('sortable-item')
      #       container.el[0]._tag.addNewElement(newbloq , itemIndex)
      #     else
      #       scriptModel.insertBloq tagRef.sbid, newbloq, itemIndex
      #       tagRef.update scriptModel: scriptModel.lookup[tagRef.sbid]      
      #   when 'BLOQ'
      # $item.remove()

      # trackBloq.shift()
      # else 
