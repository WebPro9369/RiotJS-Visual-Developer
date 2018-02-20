bloqboard
  bloq-list.root(ref='bloqlist' script="{ opts.script }" root="true" sbid="0")
  .overlay(class="{ show: opts.showOverlay }")  
  drop-bloq
  style(type="text/stylus").
    bloqboard
      float right
      display block
      position relative  
      z-index 1
      width 80%
    .overlay
      position absolute
      width 100%
      height 100%
      background #000000
      opacity 0.4
      display none
      z-index 2
      top 0px
      left 0px
    .show
      display block
    :scoped
      -webkit-touch-callout none
      -webkit-user-select none
      -khtml-user-select none
      -moz-user-select none
      -ms-user-select none
      user-select none

  script(type="text/coffeescript").
    self = this

    #todo this should move
    self.on 'before-unmount',  ->
      $("bloqboard bloq-list.root").sortable 'destroy'
    
    

