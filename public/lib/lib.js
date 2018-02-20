/* ===================================================
 *  jquery-sortable.js v0.9.13
 *  http://johnny.github.com/jquery-sortable/
 * ===================================================
 *  Copyright (c) 2012 Jonas von Andrian
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ========================================================== */

!function ( $, window, pluginName, undefined){
  var containerDefaults = {
    // If true, items can be dragged from this container
    drag: true,
    // If true, items can be droped onto this container
    drop: true,
    // Exclude items from being draggable, if the
    // selector matches the item
    exclude: "",
    // If true, search for nested containers within an item.If you nest containers,
    // either the original selector with which you call the plugin must only match the top containers,
    // or you need to specify a group (see the bootstrap nav example)
    nested: true,
    // If true, the items are assumed to be arranged vertically
    vertical: true
  }, // end container defaults
  groupDefaults = {
    // This is executed after the placeholder has been moved.
    // $closestItemOrContainer contains the closest item, the placeholder
    // has been put at or the closest empty Container, the placeholder has
    // been appended to.
    afterMove: function ($placeholder, container, $closestItemOrContainer) {
    },
    // The exact css path between the container and its items, e.g. "> tbody"
    containerPath: "",
    // The css selector of the containers
    containerSelector: "ol, ul",
    // Distance the mouse has to travel to start dragging
    distance: 0,
    // Time in milliseconds after mousedown until dragging should start.
    // This option can be used to prevent unwanted drags when clicking on an element.
    delay: 0,
    // The css selector of the drag handle
    handle: "",
    // The exact css path between the item and its subcontainers.
    // It should only match the immediate items of a container.
    // No item of a subcontainer should be matched. E.g. for ol>div>li the itemPath is "> div"
    itemPath: "",
    // The css selector of the items
    itemSelector: "li",
    // The class given to "body" while an item is being dragged
    bodyClass: "dragging",
    // The class giving to an item while being dragged
    draggedClass: "dragged",
    // Check if the dragged item may be inside the container.
    // Use with care, since the search for a valid container entails a depth first search
    // and may be quite expensive.
    isValidTarget: function ($item, container) {
      return true
    },
    // Executed before onDrop if placeholder is detached.
    // This happens if pullPlaceholder is set to false and the drop occurs outside a container.
    onCancel: function ($item, container, _super, event) {
    },
    // Executed at the beginning of a mouse move event.
    // The Placeholder has not been moved yet.
    onDrag: function ($item, position, _super, event) {
      $item.css(position)
    },
    // Called after the drag has been started,
    // that is the mouse button is being held down and
    // the mouse is moving.
    // The container is the closest initialized container.
    // Therefore it might not be the container, that actually contains the item.
    onDragStart: function ($item, container, _super, event) {
      $item.css({
        height: $item.outerHeight(),
        width: $item.outerWidth()
      })
      $item.addClass(container.group.options.draggedClass)
      $("body").addClass(container.group.options.bodyClass)
    },
    // Called when the mouse button is being released
    onDrop: function ($item, container, _super, event) {
      $item.removeClass(container.group.options.draggedClass).removeAttr("style")
      $("body").removeClass(container.group.options.bodyClass)
    },
    // Called on mousedown. If falsy value is returned, the dragging will not start.
    // Ignore if element clicked is input, select or textarea
    onMousedown: function ($item, _super, event) {
      if (!event.target.nodeName.match(/^(input|select|textarea)$/i)) {
        event.preventDefault()
        return true
      }
    },
    // The class of the placeholder (must match placeholder option markup)
    placeholderClass: "placeholder",
    // Template for the placeholder. Can be any valid jQuery input
    // e.g. a string, a DOM element.
    // The placeholder must have the class "placeholder"
    placeholder: '<li class="placeholder"></li>',
    // If true, the position of the placeholder is calculated on every mousemove.
    // If false, it is only calculated when the mouse is above a container.
    pullPlaceholder: true,
    // Specifies serialization of the container group.
    // The pair $parent/$children is either container/items or item/subcontainers.
    serialize: function ($parent, $children, parentIsContainer) {
      var result = $.extend({}, $parent.data())

      if(parentIsContainer)
        return [$children]
      else if ($children[0]){
        result.children = $children
      }

      delete result.subContainers
      delete result.sortable

      return result
    },
    // Set tolerance while dragging. Positive values decrease sensitivity,
    // negative values increase it.
    tolerance: 0
  }, // end group defaults
  containerGroups = {},
  groupCounter = 0,
  emptyBox = {
    left: 0,
    top: 0,
    bottom: 0,
    right:0
  },
  eventNames = {
    start: "touchstart.sortable mousedown.sortable",
    drop: "touchend.sortable touchcancel.sortable mouseup.sortable",
    drag: "touchmove.sortable mousemove.sortable",
    scroll: "scroll.sortable"
  },
  subContainerKey = "subContainers"

  /*
   * a is Array [left, right, top, bottom]
   * b is array [left, top]
   */
  function d(a,b) {
    var x = Math.max(0, a[0] - b[0], b[0] - a[1]),
    y = Math.max(0, a[2] - b[1], b[1] - a[3])
    return x+y;
  }

  function setDimensions(array, dimensions, tolerance, useOffset) {
    var i = array.length,
    offsetMethod = useOffset ? "offset" : "position"
    tolerance = tolerance || 0

    while(i--){
      var el = array[i].el ? array[i].el : $(array[i]),
      // use fitting method
      pos = el[offsetMethod]()
      pos.left += parseInt(el.css('margin-left'), 10)
      pos.top += parseInt(el.css('margin-top'),10)
      //console.log(el)
      dimensions[i] = [
        //pos.left - tolerance,
        //pos.left + el.outerWidth() + tolerance,
        pos.left,
        pos.left + el.outerWidth(),
        pos.top - tolerance,
        pos.top + el.outerHeight() + tolerance
        //pos.top + el.outerHeight()
      ]

      if( 
            !el.hasClass('string-box')
         && !el.parent().hasClass('string-box')
         && el.closest('bloq').length 
         && el.closest('bloq').attr('haschildren')  == 'true'
      ){
        //console.log(el.parent())
        //console.log(el.parent())
        dimensions[i][2] -= -80;
      }    

    }
  }

  function getRelativePosition(pointer, element) {
    var offset = element.offset()
    return {
      left: pointer.left - offset.left,
      top: pointer.top - offset.top
    }
  }

  function sortByDistanceDesc(dimensions, pointer, lastPointer) {
    pointer = [pointer.left, pointer.top]
    lastPointer = lastPointer && [lastPointer.left, lastPointer.top]

    var dim,
    i = dimensions.length,
    distances = []

    while(i--){
      dim = dimensions[i]
      distances[i] = [i,d(dim,pointer), lastPointer && d(dim, lastPointer)]
    }
    distances = distances.sort(function  (a,b) {
      return b[1] - a[1] || b[2] - a[2] || b[0] - a[0]
    })

    // last entry is the closest
    return distances
  }

  function ContainerGroup(options) {
    this.options = $.extend({}, groupDefaults, options)
    this.containers = []

    if(!this.options.rootGroup){
      this.scrollProxy = $.proxy(this.scroll, this)
      this.dragProxy = $.proxy(this.drag, this)
      this.dropProxy = $.proxy(this.drop, this)
      this.placeholder = $(this.options.placeholder)

      if(!options.isValidTarget)
        this.options.isValidTarget = undefined
    }
  }

  ContainerGroup.get = function  (options) {
    if(!containerGroups[options.group]) {
      if(options.group === undefined)
        options.group = groupCounter ++

      containerGroups[options.group] = new ContainerGroup(options)
    }

    return containerGroups[options.group]
  }

  ContainerGroup.prototype = {
    dragInit: function  (e, itemContainer) {
      this.$document = $(itemContainer.el[0].ownerDocument)

      // get item to drag
      var closestItem = $(e.target).closest(this.options.itemSelector);
      // using the length of this item, prevents the plugin from being started if there is no handle being clicked on.
      // this may also be helpful in instantiating multidrag.
      if (closestItem.length) {
        this.item = closestItem;
        this.itemContainer = itemContainer;
        if (this.item.is(this.options.exclude) || !this.options.onMousedown(this.item, groupDefaults.onMousedown, e)) {
            return;
        }
        this.setPointer(e);
        this.toggleListeners('on');
        this.setupDelayTimer();
        this.dragInitDone = true;
      }
    },
    drag: function  (e) {
      if(!this.dragging){
        if(!this.distanceMet(e) || !this.delayMet)
          return
        //this.item = this.item.clone()
        this.item = this.options.onDragStart(this.item, this.itemContainer, groupDefaults.onDragStart, e)
        this.item.before(this.placeholder)
        //console.log "cloned"
        this.dragging = true
      }

      this.setPointer(e)
      // place item under the cursor
      this.options.onDrag(this.item,
                          getRelativePosition(this.pointer, this.item.offsetParent()),
                          groupDefaults.onDrag,
                          e)

      var p = this.getPointer(e),
      box = this.sameResultBox,
      t = this.options.tolerance

      //console.log(this.item)
      //console.log(this)

      //if(!box || box.top - t > p.top || box.bottom + t < p.top || box.left - t > p.left || box.right + t < p.left)
      if(!box || box.top - t > p.top || box.bottom + t < p.top || box.left > p.left || box.right < p.left)
        if(!this.searchValidTarget()){
          this.placeholder.detach()
          this.lastAppendedItem = undefined
        }
    },
    drop: function  (e) {
      this.toggleListeners('off')

      this.dragInitDone = false

      if(this.dragging){
        // processing Drop, check if placeholder is detached
        this.options.onDrop(this.item, this.getContainer(this.placeholder), groupDefaults.onDrop, e)
        if(this.placeholder.closest("html")[0]){
          //this.placeholder.before(this.item).detach()
          this.placeholder.detach()
          this.item.detach()
        } else {
          this.options.onCancel(this.item, this.itemContainer, groupDefaults.onCancel, e)
        }

        // cleanup
        this.clearDimensions()
        this.clearOffsetParent()
        this.lastAppendedItem = this.sameResultBox = undefined
        this.dragging = false
      }
    },
    searchValidTarget: function  (pointer, lastPointer) {
      if(!pointer){
        pointer = this.relativePointer || this.pointer
        lastPointer = this.lastRelativePointer || this.lastPointer
      }

      var distances = sortByDistanceDesc(this.getContainerDimensions(),
                                         pointer,
                                         lastPointer),
      i = distances.length

      while(i--){
        var index = distances[i][0],
        distance = distances[i][1]

        if(!distance || this.options.pullPlaceholder){
          var container = this.containers[index]
          if(!container.disabled){
            if(!this.$getOffsetParent()){
              var offsetParent = container.getItemOffsetParent()
              pointer = getRelativePosition(pointer, offsetParent)
              lastPointer = getRelativePosition(lastPointer, offsetParent)
            }
            if(container.searchValidTarget(pointer, lastPointer))
              return true
          }
        }
      }
      if(this.sameResultBox)
        this.sameResultBox = undefined
    },
    movePlaceholder: function  (container, item, method, sameResultBox) {
      var lastAppendedItem = this.lastAppendedItem
      if(!sameResultBox && lastAppendedItem && lastAppendedItem[0] === item[0])
        return;

      item[method](this.placeholder)
      this.lastAppendedItem = item
      this.sameResultBox = sameResultBox
      this.options.afterMove(this.placeholder, container, item)
    },
    getContainerDimensions: function  () {
      if(!this.containerDimensions)
        setDimensions(this.containers, this.containerDimensions = [], this.options.tolerance, !this.$getOffsetParent())
      return this.containerDimensions
    },
    getContainer: function  (element) {
      return element.closest(this.options.containerSelector).data(pluginName)
    },
    $getOffsetParent: function  () {
      if(this.offsetParent === undefined){
        var i = this.containers.length - 1,
        offsetParent = this.containers[i].getItemOffsetParent()

        if(!this.options.rootGroup){
          while(i--){
            if(offsetParent[0] != this.containers[i].getItemOffsetParent()[0]){
              // If every container has the same offset parent,
              // use position() which is relative to this parent,
              // otherwise use offset()
              // compare #setDimensions
              offsetParent = false
              break;
            }
          }
        }

        this.offsetParent = offsetParent
      }
      return this.offsetParent
    },
    setPointer: function (e) {
      var pointer = this.getPointer(e)

      if(this.$getOffsetParent()){
        var relativePointer = getRelativePosition(pointer, this.$getOffsetParent())
        this.lastRelativePointer = this.relativePointer
        this.relativePointer = relativePointer
      }

      this.lastPointer = this.pointer
      this.pointer = pointer
    },
    distanceMet: function (e) {
      var currentPointer = this.getPointer(e)
      return (Math.max(
        Math.abs(this.pointer.left - currentPointer.left),
        Math.abs(this.pointer.top - currentPointer.top)
      ) >= this.options.distance)
    },
    getPointer: function(e) {
      var o = e.originalEvent || e.originalEvent.touches && e.originalEvent.touches[0]
      return {
        left: e.pageX || o.pageX,
        top: e.pageY || o.pageY
      }
    },
    setupDelayTimer: function () {
      var that = this
      this.delayMet = !this.options.delay

      // init delay timer if needed
      if (!this.delayMet) {
        clearTimeout(this._mouseDelayTimer);
        this._mouseDelayTimer = setTimeout(function() {
          that.delayMet = true
        }, this.options.delay)
      }
    },
    scroll: function  (e) {
      this.clearDimensions()
      this.clearOffsetParent() // TODO is this needed?
    },
    toggleListeners: function (method) {
      var that = this,
      events = ['drag','drop','scroll']

      $.each(events,function  (i,event) {
        that.$document[method](eventNames[event], that[event + 'Proxy'])
      })
    },
    clearOffsetParent: function () {
      this.offsetParent = undefined
    },
    // Recursively clear container and item dimensions
    clearDimensions: function  () {
      this.traverse(function(object){
        object._clearDimensions()
      })
    },
    traverse: function(callback) {
      callback(this)
      var i = this.containers.length
      while(i--){
        this.containers[i].traverse(callback)
      }
    },
    _clearDimensions: function(){
      this.containerDimensions = undefined
    },
    _destroy: function () {
      containerGroups[this.options.group] = undefined
    }
  }

  function Container(element, options) {
    this.el = element
    this.options = $.extend( {}, containerDefaults, options)

    this.group = ContainerGroup.get(this.options)
    this.rootGroup = this.options.rootGroup || this.group
    this.handle = this.rootGroup.options.handle || this.rootGroup.options.itemSelector

    var itemPath = this.rootGroup.options.itemPath
    this.target = itemPath ? this.el.find(itemPath) : this.el

    this.target.on(eventNames.start, this.handle, $.proxy(this.dragInit, this))

    if(this.options.drop)
      this.group.containers.push(this)
  }

  Container.prototype = {
    dragInit: function  (e) {
      var rootGroup = this.rootGroup

      if( !this.disabled &&
          !rootGroup.dragInitDone &&
          this.options.drag &&
          this.isValidDrag(e)) {
        rootGroup.dragInit(e, this)
      }
    },
    isValidDrag: function(e) {
      return e.which == 1 ||
        e.type == "touchstart" && e.originalEvent.touches.length == 1
    },
    searchValidTarget: function  (pointer, lastPointer) {
      var distances = sortByDistanceDesc(this.getItemDimensions(),
                                         pointer,
                                         lastPointer),
      i = distances.length,
      rootGroup = this.rootGroup,
      validTarget = !rootGroup.options.isValidTarget ||
        rootGroup.options.isValidTarget(rootGroup.item, this)

      if(!i && validTarget){
        rootGroup.movePlaceholder(this, this.target, "append")
        return true
      } else
        while(i--){
          var index = distances[i][0],
          distance = distances[i][1]
          if(!distance && this.hasChildGroup(index)){
            var found = this.getContainerGroup(index).searchValidTarget(pointer, lastPointer)
            if(found)
              return true
          }
          else if(validTarget){
            this.movePlaceholder(index, pointer)
            return true
          }
        }
    },
    movePlaceholder: function  (index, pointer) {
      var item = $(this.items[index]),
      dim = this.itemDimensions[index],
      method = "after",
      width = item.outerWidth(),
      height = item.outerHeight(),
      offset = item.offset(),
      sameResultBox = {
        left: offset.left,
        right: offset.left + width,
        top: offset.top,
        bottom: offset.top + height
      }
      if(this.options.vertical){
        var yCenter = (dim[2] + dim[3]) / 2,
        inUpperHalf = pointer.top <= yCenter
        if(inUpperHalf){
          method = "before"
          sameResultBox.bottom -= height / 2
        } else
          sameResultBox.top += height / 2
      } else {
        var xCenter = (dim[0] + dim[1]) / 2,
        inLeftHalf = pointer.left <= xCenter
        if(inLeftHalf){
          method = "before"
          sameResultBox.right -= width / 2
        } else
          sameResultBox.left += width / 2
      }
      if(this.hasChildGroup(index))
        sameResultBox = emptyBox
      this.rootGroup.movePlaceholder(this, item, method, sameResultBox)
    },
    getItemDimensions: function  () {
      if(!this.itemDimensions){
        this.items = this.$getChildren(this.el, "item").filter(
          ":not(." + this.group.options.placeholderClass + ", ." + this.group.options.draggedClass + ")"
        ).get()
        setDimensions(this.items, this.itemDimensions = [], this.options.tolerance)
      }
      return this.itemDimensions
    },
    getItemOffsetParent: function  () {
      var offsetParent,
      el = this.el
      // Since el might be empty we have to check el itself and
      // can not do something like el.children().first().offsetParent()
      if(el.css("position") === "relative" || el.css("position") === "absolute"  || el.css("position") === "fixed")
        offsetParent = el
      else
        offsetParent = el.offsetParent()
      return offsetParent
    },
    hasChildGroup: function (index) {
      return this.options.nested && this.getContainerGroup(index)
    },
    getContainerGroup: function  (index) {
      var childGroup = $.data(this.items[index], subContainerKey)
      if( childGroup === undefined){
        var childContainers = this.$getChildren(this.items[index], "container")
        childGroup = false

        if(childContainers[0]){
          var options = $.extend({}, this.options, {
            rootGroup: this.rootGroup,
            group: groupCounter ++
          })
          childGroup = childContainers[pluginName](options).data(pluginName).group
        }
        $.data(this.items[index], subContainerKey, childGroup)
      }
      return childGroup
    },
    $getChildren: function (parent, type) {
      var options = this.rootGroup.options,
      path = options[type + "Path"],
      selector = options[type + "Selector"]

      parent = $(parent)
      if(path)
        parent = parent.find(path)

      return parent.children(selector)
    },
    _serialize: function (parent, isContainer) {
      var that = this,
      childType = isContainer ? "item" : "container",

      children = this.$getChildren(parent, childType).not(this.options.exclude).map(function () {
        return that._serialize($(this), !isContainer)
      }).get()

      return this.rootGroup.options.serialize(parent, children, isContainer)
    },
    traverse: function(callback) {
      $.each(this.items || [], function(item){
        var group = $.data(this, subContainerKey)
        if(group)
          group.traverse(callback)
      });

      callback(this)
    },
    _clearDimensions: function  () {
      this.itemDimensions = undefined
    },
    _destroy: function() {
      var that = this;

      this.target.off(eventNames.start, this.handle);
      this.el.removeData(pluginName)

      if(this.options.drop)
        this.group.containers = $.grep(this.group.containers, function(val){
          return val != that
        })

      $.each(this.items || [], function(){
        $.removeData(this, subContainerKey)
      })
    }
  }

  var API = {
    enable: function() {
      this.traverse(function(object){
        object.disabled = false
      })
    },
    disable: function (){
      this.traverse(function(object){
        object.disabled = true
      })
    },
    serialize: function () {
      return this._serialize(this.el, true)
    },
    refresh: function() {
      this.traverse(function(object){
        object._clearDimensions()
      })
    },
    destroy: function () {
      this.traverse(function(object){
        object._destroy();
      })
    }
  }

  $.extend(Container.prototype, API)

  /**
   * jQuery API
   *
   * Parameters are
   *   either options on init
   *   or a method name followed by arguments to pass to the method
   */
  $.fn[pluginName] = function(methodOrOptions) {
    var args = Array.prototype.slice.call(arguments, 1)

    return this.map(function(){
      var $t = $(this),
      object = $t.data(pluginName)

      if(object && API[methodOrOptions])
        return API[methodOrOptions].apply(object, args) || this
      else if(!object && (methodOrOptions === undefined ||
                          typeof methodOrOptions === "object"))
        $t.data(pluginName, new Container($t, methodOrOptions))

      return this
    });
  };

}(jQuery, window, 'sortable');
window.config = {
  editOnDrop: false
};

var eventManager;

eventManager = {
  o: $({}),
  trigger: function(event, tag) {
    return this.o.trigger.apply(this.o, arguments);
  },
  on: function(event, func) {
    return this.o.on.apply(this.o, arguments);
  },
  off: function(event, func) {
    return this.o.off.apply(this.o, arguments);
  }
};

var FlowModel;

FlowModel = (function() {
  function FlowModel(scriptModel) {
    var bloq, child, children, element, i, j, len, len1, letter, letters, match, re;
    this.model = [];
    this.bloqs = [];
    this.lookup = [];
    letters = scriptModel.value;
    letters = letters || '';
    letters = String(letters);
    children = [];
    re = /\{[0-9]+\}/;
    match = void 0;
    while (letters.match(re)) {
      letters = letters.replace(re, function(match, index) {
        var digit, number;
        digit = match.replace(/[\{\}]/g, "");
        number = parseInt(digit);
        children.push({
          number: number,
          index: index + children.length
        });
        return "";
      });
    }
    for (i = 0, len = letters.length; i < len; i++) {
      letter = letters[i];
      this.model.push({
        content: letter,
        type: "text"
      });
    }
    for (j = 0, len1 = children.length; j < len1; j++) {
      child = children[j];
      if (scriptModel.children[child.number] == null) {
        throw "parameter model does not have a child at index " + child.number;
      }
      bloq = scriptModel.children[child.number];
      this.lookup[bloq.sbid] = bloq;
      element = {
        type: "bloq",
        bloq: bloq
      };
      this.model.splice(child.index, 0, element);
    }
    this.model;
  }

  FlowModel.prototype.insert = function(index, bloq) {
    var element;
    element = {
      type: "bloq",
      bloq: bloq
    };
    this.model.splice(index, 0, element);
    this.bloqs.push(bloq);
    return this.lookup[bloq.sbid] = bloq;
  };

  FlowModel.prototype.createModelFromDom = function(domElement) {
    var bloq, children, domBloq, i, item, len, parameter, token, type, value;
    value = "";
    children = [];
    for (i = 0, len = domElement.length; i < len; i++) {
      item = domElement[i];
      if (item.nodeType === 3) {
        value += $(item).text();
      }
      type = $(item).attr("type");
      switch (type) {
        case "text":
          value += $(item).text();
          break;
        case "bloq":
          domBloq = $(item).children().first();
          bloq = this.lookup[domBloq.data("sbid")];
          token = "{" + children.length + "}";
          children.push(bloq);
          value += token;
      }
    }
    parameter = {
      value: value,
      children: children
    };
    return parameter;
  };


  /*
  maybe attach flow model to parameters in script model, so that 
  we only need to make a minor mod to scriptMode.insert to make 
  it insert direcly into a parameter's flow model.
   */

  return FlowModel;

})();

$(function() {
  return $("body").off("keypress").on("keypress", function(e) {
    if (e.ctrlKey) {
      if (e.keyCode === 26) {
        return undoManager.undo();
      } else if (e.keyCode === 25) {
        return undoManager.redo();
      }
    }
  });
});

window.mixins = {
  eventBubbler: {
    bubbleEvents: function() {
      return this.on('mount', function() {
        this.refs.header.on('edit', (function(_this) {
          return function(e) {
            return _this.trigger("edit");
          };
        })(this));
        this.refs.header.on('ok', (function(_this) {
          return function(e) {
            return _this.trigger("ok");
          };
        })(this));
        this.refs.header.on('cancel', (function(_this) {
          return function(e) {
            return _this.trigger("cancel");
          };
        })(this));
        this.refs.header.on('delete', (function(_this) {
          return function(e) {
            return _this.trigger("delete");
          };
        })(this));
        if (this.refs.body != null) {
          this.refs.body.on('ok', (function(_this) {
            return function(e) {
              return _this.trigger("ok");
            };
          })(this));
          return this.refs.body.on('cancel', (function(_this) {
            return function(e) {
              return _this.trigger("cancel");
            };
          })(this));
        }
      });
    }
  },
  removeFunc: {
    removeFunc: function(index) {
      return (function(_this) {
        return function() {
          scriptModel.removeBloq(_this.listid, index);
          return _this.update();
        };
      })(this);
    }
  }
};

window.scriptModel = {
  bloqConfig: {},
  reference: {},
  mainScript: [],
  toolbox: [],
  stores: [],
  categories: {},
  lookup: {},
  uidCount: 0,
  changeStoredName: function(uid, newName) {
    var bloq;
    bloq = this.lookup[uid];
    bloq.name = newName;
    return this.checkStoredName(newName, bloq);
  },
  checkStoredName: function(name, bloq) {
    var store;
    store = this.stores[bloq.store].items;
    if (store.indexOf(name) < 0) {
      store.push(name);
    }
    return bloq;
  },
  setParameter: function(uid, newValue, children) {
    var oldChildren, oldValue, parameter;
    parameter = this.lookup[uid];
    oldValue = parameter.value;
    oldChildren = parameter.children;
    undoManager.pushAction((function(_this) {
      return function() {
        return _this.setParameter(uid, oldValue, oldChildren);
      };
    })(this));
    parameter.value = newValue;
    return parameter.children = children;
  },
  insertBloq: function(listId, bloq, index) {
    var item;
    item = this.lookup[listId];
    if (item instanceof Array) {
      item.splice(index, 0, bloq);
      return undoManager.pushAction((function(_this) {
        return function() {
          return _this.removeBloq(listId, index);
        };
      })(this));
    } else if (item.flowModel != null) {
      return item.flowModel.insert(index, bloq);
    } else {
      throw "tried to insert into an invalid container";
    }
  },
  removeBloq: function(listId, index) {
    var bloq, list;
    list = this.lookup[listId];
    bloq = list[index];
    list.splice(index, 1);
    undoManager.pushAction((function(_this) {
      return function() {
        return _this.insertBloq(listId, bloq, index);
      };
    })(this));
    return bloq;
  },
  moveBloq: function(listId, index, newIndex, destId) {
    var bloq, list;
    list = this.lookup[listId];
    bloq = this.removeBloq(listId, index);
    destId = destId != null ? destId : listId;
    this.insertBloq(destId, bloq, newIndex);
    return bloq;
  },
  clearBloqs: function(listId) {
    var bloq, i, j, len, ref, results;
    ref = this.lookup[listId];
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      bloq = ref[i];
      results.push(scriptModel.removeBloq(0, i));
    }
    return results;
  },
  newBloq: function(name, parameters, storeName) {
    var bloq, bloqRef, bloqType, childBloq, j, len, ref;
    bloqRef = this.reference[name];
    if (bloqRef == null) {
      throw 'Bloq "' + name + '" does not exist in dictionary';
    }
    bloqType = bloqRef.bloqType || "command";
    bloq = {
      bloq: name,
      config: this.bloqConfig.bloqTypes[bloqType],
      bloqType: bloqType,
      store: bloqRef.store || null,
      title: bloqRef.title || name,
      hasChildren: bloqRef.hasChildren,
      parameters: [],
      sbid: this.uid()
    };
    if (bloqRef.store != null) {
      if (storeName != null) {
        bloq.name = storeName;
      } else {
        bloq.name = "new " + name;
      }
    }
    this.buildParams(bloq, parameters);
    if (bloq.hasChildren && (parameters == null)) {
      bloq.listid = this.uid();
      bloq.children = [];
      if (bloqRef.children != null) {
        ref = bloqRef.children;
        for (j = 0, len = ref.length; j < len; j++) {
          childBloq = ref[j];
          bloq.children.push(this.newBloq(childBloq.bloq));
        }
      }
      this.lookup[bloq.listid.toString()] = bloq.children;
    }
    this.lookup[bloq.sbid.toString()] = bloq;
    return bloq;
  },
  buildParams: function(bloq, setParams) {
    var children, j, len, param, parameter, parameters, ref, referenceBloq, value;
    referenceBloq = this.reference[bloq.bloq];
    parameters = [];
    if (referenceBloq.parameters != null) {
      ref = referenceBloq.parameters;
      for (j = 0, len = ref.length; j < len; j++) {
        param = ref[j];
        value = "";
        children = null;
        if (setParams == null) {
          value = param["default"] != null ? param["default"] : void 0;
        } else {
          if (setParams[param.name].children != null) {
            children = this.buildScriptV1(setParams[param.name].children);
            value = setParams[param.name].value;
          } else {
            value = setParams[param.name];
          }
        }
        if (typeof value === 'object') {
          if (value.children != null) {
            this.buildScriptV1(value.children);
          }
        }
        parameter = {
          name: param.name,
          editor: param.editor,
          label: param.label,
          value: value || "",
          config: this.bloqConfig.parameterEditors[param.editor],
          sbid: this.uid(),
          children: children
        };
        if (param.quotes != null) {
          parameter.quotes = param.quotes;
        }
        if (param.items != null) {
          parameter.items = param.items;
        }
        parameters.push(parameter);
        this.lookup[parameter.sbid] = parameter;
      }
    }
    return bloq.parameters = parameters;
  },
  buildScriptV1: function(script) {
    var bloq, j, len, newBloq, newScript;
    newScript = [];
    for (j = 0, len = script.length; j < len; j++) {
      bloq = script[j];
      newBloq = this.newBloq(bloq.bloq, bloq.parameters, bloq.name);
      if (newBloq.store != null) {
        this.checkStoredName(bloq.name, bloq);
      }
      if (newBloq.hasChildren) {
        newBloq.listid = this.uid();
        newBloq.children = this.buildScriptV1(bloq.children);
        this.lookup[newBloq.listid] = newBloq.children;
      }
      newScript.push(newBloq);
    }
    return newScript;
  },
  buildToolbox: function(data) {
    var buildChildren, buildStoreFunction, category, categoryExists, children, j, key, len, name, ref, ref1, toolbox, toolboxNode, value;
    toolbox = [];
    for (j = 0, len = data.length; j < len; j++) {
      category = data[j];
      toolboxNode = null;
      for (name in category) {
        children = category[name];
        toolboxNode = {
          name: name,
          children: children
        };
      }
      toolbox.push(toolboxNode);
    }
    buildChildren = (function(_this) {
      return function(ChildArr) {
        var bloq, k, len1;
        children = [];
        for (k = 0, len1 = ChildArr.length; k < len1; k++) {
          bloq = ChildArr[k];
          children.push(bloq.name);
        }
        return children;
      };
    })(this);
    categoryExists = (function(_this) {
      return function(needle) {
        var k, len1;
        for (k = 0, len1 = toolbox.length; k < len1; k++) {
          category = toolbox[k];
          if (category.name === needle) {
            return true;
          }
        }
        return false;
      };
    })(this);
    buildStoreFunction = (function(_this) {
      return function(storeName, bloqType) {
        var funcGetName, funcSetName, uBloqType;
        uBloqType = bloqType.charAt(0).toUpperCase() + bloqType.slice(1);
        funcGetName = "get" + uBloqType;
        funcSetName = "set" + uBloqType;
        _this[storeName] = {};
        _this[funcGetName] = function(name) {
          if (name == null) {
            throw "'" + name + "' stored value does not exist";
          }
          return this[storeName][name].value;
        };
        return _this[funcSetName] = function(name, value) {
          if (this[storeName][name] == null) {
            return this[storeName][name] = {
              bloqType: bloqType,
              store: storeName,
              name: name,
              value: value
            };
          } else {
            return this[storeName][name].value = value;
          }
        };
      };
    })(this);
    ref = this.reference;
    for (key in ref) {
      value = ref[key];
      if (value.store != null) {
        this.stores[value.store] = {
          bloqType: value.bloqType,
          items: []
        };
        buildStoreFunction(value.store, value.bloqType);
      }
      if (value.category != null) {
        category = value.category;
        if (this.categories[category] == null) {
          this.categories[category] = [];
        }
        value['name'] = key;
        if (!value.hidden) {
          this.categories[category].push(value);
        }
      }
    }
    ref1 = this.categories;
    for (key in ref1) {
      value = ref1[key];
      if (!categoryExists(key)) {
        children = buildChildren(value);
        toolbox.push({
          name: key,
          children: children
        });
      }
    }
    return toolbox;
  },
  loadScript: function(callback) {
    return YAML.load('http://localhost:3000/data/examplescript.yaml', (function(_this) {
      return function(result) {
        var script;
        script = _this.buildScriptV1(result);
        _this.mainScript = script;
        _this.lookup[0] = script;
        if (callback != null) {
          return callback();
        }
      };
    })(this));
  },
  initialize: function(callback) {
    this.lookup = {};
    this.mainScript = [];
    this.lookup[0] = this.mainScript;
    return YAML.load('http://localhost:3000/data/scriptbloqs-config.yaml', (function(_this) {
      return function(result) {
        _this.bloqConfig = result;
        return YAML.load('http://localhost:3000/data/scriptbloqs.yaml', function(result) {
          _this.reference = result;
          return YAML.load('http://localhost:3000/data/toolbox.yaml', function(result) {
            _this.toolbox = _this.buildToolbox(result);
            if (callback != null) {
              return callback();
            }
          });
        });
      };
    })(this));
  },
  getBloqData: function(callback) {
    this.lookup = {};
    return YAML.load('http://localhost:3000/data/scriptbloqs-config.yaml', (function(_this) {
      return function(result) {
        _this.bloqConfig = result;
        return YAML.load('http://localhost:3000/data/scriptbloqs.yaml', function(result) {
          _this.reference = result;
          return YAML.load('http://localhost:3000/data/toolbox.yaml', function(result) {
            _this.toolbox = _this.buildToolbox(result);
            return YAML.load('http://localhost:3000/data/examplescript.yaml', function(result) {
              var script;
              script = _this.buildScriptV1(result);
              _this.mainScript = script;
              _this.lookup[0] = script;
              if (callback != null) {
                return callback(script, _this.toolbox);
              }
            });
          });
        });
      };
    })(this));
  },
  uid: function() {
    this.uidCount += 1;
    return this.uidCount;
  }
};

var undoManager;

undoManager = {
  undos: [],
  redos: [],
  currentUndo: [],
  currentRedo: [],
  undoing: false,
  redoing: false,
  pushAction: function(func) {
    if (this.undoing) {
      this.currentRedo.push(func);
    } else {
      this.currentUndo.push(func);
    }
    if (!this.undoing && !this.redoing && this.redos.length > 0) {
      return this.redos = [];
    }
  },
  createUndo: function() {
    this.undos.push(this.currentUndo);
    return this.currentUndo = [];
  },
  createRedo: function() {
    this.redos.push(this.currentRedo);
    return this.currentRedo = [];
  },
  reset: function() {
    this.undos = [];
    this.redos = [];
    this.currentUndo = [];
    this.currentRedo = [];
    this.undoing = false;
    return this.redoing = false;
  },
  undo: function() {
    var action, undo;
    if (this.undos.length > 0) {
      undo = this.undos.pop();
      this.undoing = true;
      while (undo.length > 0) {
        action = undo.pop();
        action();
      }
      this.createRedo();
      this.undoing = false;
      return eventManager.trigger("stateChange");
    }
  },
  redo: function() {
    var action, redo;
    if (this.redos.length > 0) {
      redo = this.redos.pop();
      this.redoing = true;
      while (redo.length > 0) {
        action = redo.pop();
        action();
      }
      this.createUndo();
      this.redoing = false;
      return eventManager.trigger("stateChange");
    }
  }
};
