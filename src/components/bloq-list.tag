bloq-list
  bloq(each="{bloq, index in opts.script}"
    model="{bloq}"
    ref="bloq"
    remove="{parent.removeFunc(index)}")
   
  style(type="text/stylus").
    bloq 
      > bloq-list
        width 100%
        float left
        > bloq
          width 100%
    bloq-list.root
      float left
      display block
    bloq-list
      display block
      padding  0 10px 50px 10px
      clear both
      &.vertical
        //margin 0 0 9px 0
        min-height 10px

    bloq.placeholder
      position relative
      margin 0
      padding 0
      border none
      &:before
        position absolute
        content ""
        width 0
        height 0
        margin-top -5px
        left -5px
        top -4px
        border 5px solid transparent
        border-left-color #c62828
        border-right none      

    body
      padding-left 20px

  script(type="text/coffeescript").
    @removeFunc = (index)=>
      =>
        scriptModel.removeBloq @opts.sbid, index
        @update()
