function template(locals) {
var jade_debug = [ new jade.DebugItem( 1, "public/blocks//variable-parameter.jade" ) ];
try {
var buf = [];
var jade_mixins = {};
var jade_interp;

jade_debug.unshift(new jade.DebugItem( 0, "public/blocks//variable-parameter.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "public/blocks//variable-parameter.jade" ));
buf.push("<label>");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 1, jade_debug[0].filename ));
buf.push("Choose a variable");
jade_debug.shift();
jade_debug.shift();
buf.push("</label>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 2, "public/blocks//variable-parameter.jade" ));
buf.push("<div class=\"variable-box\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 2, jade_debug[0].filename ));
buf.push("Choose a variable");
jade_debug.shift();
jade_debug.shift();
buf.push("</div>");
jade_debug.shift();
jade_debug.shift();;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "﻿label Choose a variable\r\n.variable-box Choose a variable");
}
}