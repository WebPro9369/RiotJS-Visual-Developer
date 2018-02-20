###
See http://www.greensock.com/draggable/ for details. 
This demo uses ThrowPropsPlugin which is a membership benefit of Club GreenSock, http://www.greensock.com/club/
###

$snap = $('#snap')
$liveSnap = $('#liveSnap')
$container = $('#container')
gridWidth = 196
gridHeight = 100
gridRows = 6
gridColumns = 5
i = undefined
x = undefined
y = undefined
#loop through and create the grid (a div for each cell). Feel free to tweak the variables above
#the update() function is what creates the Draggable according to the options selected (snapping).

update = ->
  snap = $snap.prop('checked')
  liveSnap = $liveSnap.prop('checked')
  Draggable.create '.box',
    bounds: $container
    edgeResistance: 0.65
    type: 'x,y'
    throwProps: true
    autoScroll: true
    liveSnap: liveSnap
    snap:
      x: (endValue) ->
        if snap or liveSnap then Math.round(endValue / gridWidth) * gridWidth else endValue
      y: (endValue) ->
        if snap or liveSnap then Math.round(endValue / gridHeight) * gridHeight else endValue
  return

applySnap = ->
  if $snap.prop('checked') or $liveSnap.prop('checked')
    $('.box').each (index, element) ->
      TweenLite.to element, 0.5,
        x: Math.round(element._gsTransform.x / gridWidth) * gridWidth
        y: Math.round(element._gsTransform.y / gridHeight) * gridHeight
        delay: 0.1
        ease: Power2.easeInOut
      return
  update()
  return

i = 0
while i < gridRows * gridColumns
  y = Math.floor(i / gridColumns) * gridHeight
  x = i * gridWidth % gridColumns * gridWidth
  $('<div/>').css(
    position: 'absolute'
    border: '1px solid #454545'
    width: gridWidth - 1
    height: gridHeight - 1
    top: y
    left: x).prependTo $container
  i++
#set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above
TweenLite.set $container,
  height: gridRows * gridHeight + 1
  width: gridColumns * gridWidth + 1
TweenLite.set '.box',
  width: gridWidth
  height: gridHeight
  lineHeight: gridHeight + 'px'
#when the user toggles one of the "snap" modes, make the necessary updates...
$snap.on 'change', applySnap
$liveSnap.on 'change', applySnap
update()

# ---
# generated by js2coffee 2.1.0