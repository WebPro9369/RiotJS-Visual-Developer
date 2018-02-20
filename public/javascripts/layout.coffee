toggleLiveResizing = ->
  $.each $.layout.config.borderPanes, (i, pane) ->
    o = myLayout.options[pane]
    o.livePaneResizing = !o.livePaneResizing
    return
  return

toggleStateManagement = (skipAlert, mode) ->
  if !$.layout.plugins.stateManagement
    return
  options = myLayout.options.stateManagement
  enabled = options.enabled
  if $.type(mode) == 'boolean'
    if enabled == mode
      return
    # already correct
    enabled = options.enabled = mode
  else
    enabled = options.enabled = !enabled
  # toggle option
  if !enabled
    # if disabling state management...
    myLayout.deleteCookie()
    # ...clear cookie so will NOT be found on next refresh
    if !skipAlert
      alert 'This layout will reload as the options specify \\nwhen the page is refreshed.'
  else if !skipAlert
    alert 'This layout will save & restore its last state \\nwhen the page is refreshed.'
  # update text on button
  $Btn = $('#btnToggleState')
  text = $Btn.html()
  if enabled
    $Btn.html text.replace(/Enable/i, 'Disable')
  else
    $Btn.html text.replace(/Disable/i, 'Enable')
  return

# set EVERY 'state' here so will undo ALL layout changes
# used by the 'Reset State' button: myLayout.loadState( stateResetSettings )
stateResetSettings = 
  north__size: 'auto'
  north__initClosed: false
  north__initHidden: false
  south__size: 'auto'
  south__initClosed: false
  south__initHidden: false
  west__size: 200
  west__initClosed: false
  west__initHidden: false
  east__size: 300
  east__initClosed: false
  east__initHidden: false
myLayout = undefined
$(document).ready ->
  # this layout could be created with NO OPTIONS - but showing some here just as a sample...
  # myLayout = $('body').layout(); -- syntax with No Options
  myLayout = $('body').layout(
    closable: true
    resizable: true
    slidable: true
    livePaneResizing: true
    north__slidable: false
    north__togglerLength_closed: '100%'
    north__spacing_closed: 20
    south__resizable: false
    south__spacing_open: 0
    south__spacing_closed: 20
    west__minSize: 100
    east__size: 300
    east__minSize: 200
    east__maxSize: .5
    center__minWidth: 100
    west__animatePaneSizing: false
    west__fxSpeed_size: 'fast'
    west__fxSpeed_open: 1000
    west__fxSettings_open: easing: 'easeOutBounce'
    west__fxName_close: 'none'
    west__showOverflowOnHover: true
    stateManagement__enabled: true
    showDebugMessages: true)
  # if there is no state-cookie, then DISABLE state management initially
  cookieExists = !$.isEmptyObject(myLayout.readCookie())
  if !cookieExists
    toggleStateManagement true, false
  myLayout.bindButton('#btnCloseEast', 'close', 'east').bindButton('.south-toggler', 'toggle', 'south').bindButton('#openAllPanes', 'open', 'north').bindButton('#openAllPanes', 'open', 'south').bindButton('#openAllPanes', 'open', 'west').bindButton('#openAllPanes', 'open', 'east').bindButton('#closeAllPanes', 'close', 'north').bindButton('#closeAllPanes', 'close', 'south').bindButton('#closeAllPanes', 'close', 'west').bindButton('#closeAllPanes', 'close', 'east').bindButton('#toggleAllPanes', 'toggle', 'north').bindButton('#toggleAllPanes', 'toggle', 'south').bindButton('#toggleAllPanes', 'toggle', 'west').bindButton '#toggleAllPanes', 'toggle', 'east'

  ###
  *	DISABLE TEXT-SELECTION WHEN DRAGGING (or even _trying_ to drag!)
  *	this functionality will be included in RC30.80
  ###

  $.layout.disableTextSelection = ->
    $d = $(document)
    s = 'textSelectionDisabled'
    x = 'textSelectionInitialized'
    if $.fn.disableSelection
      if !$d.data(x)
        $d.on('mouseup', $.layout.enableTextSelection).data x, true
      if !$d.data(s)
        $d.disableSelection().data s, true
    #console.log('$.layout.disableTextSelection');
    return

  $.layout.enableTextSelection = ->
    $d = $(document)
    s = 'textSelectionDisabled'
    if $.fn.enableSelection and $d.data(s)
      $d.enableSelection().data s, false
    #console.log('$.layout.enableTextSelection');
    return

  $('.ui-layout-resizer').disableSelection().on 'mousedown', $.layout.disableTextSelection
  # affects entire document
  return