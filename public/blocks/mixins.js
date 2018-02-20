function template(locals) {
var jade_debug = [ new jade.DebugItem( 1, "public/blocks//mixins.jade" ) ];
try {
var buf = [];
var jade_mixins = {};
var jade_interp;

jade_debug.unshift(new jade.DebugItem( 0, "public/blocks//mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 2, "public/blocks//mixins.jade" ));



























































jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 9, "public/blocks//mixins.jade" ));














jade_debug.shift();
jade_debug.shift();;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "﻿\r\nmixin parameter(paramType, paramName)\r\n  case paramType\r\n    when \"text\"\r\n      include text-parameter\r\n    when \"variable\"\r\n      include variable-parameter\r\n\r\nmixin dragBlocksHere()\r\n  li.info-block Drag Items Here\r\n\r\n");
}
}