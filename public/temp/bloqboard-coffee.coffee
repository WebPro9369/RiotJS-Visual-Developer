































self = this

#todo this should move
self.on 'before-unmount',  ->
  $("bloqboard bloq-list.root").sortable 'destroy'



