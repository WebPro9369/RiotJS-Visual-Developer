function template(locals) {
var jade_debug = [ new jade.DebugItem( 1, "public/blocks//text-parameter.jade" ) ];
try {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (paramName) {
jade_debug.unshift(new jade.DebugItem( 0, "public/blocks//text-parameter.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "public/blocks//text-parameter.jade" ));
buf.push("<label>");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 1, jade_debug[0].filename ));
buf.push("" + (jade.escape((jade_interp = paramName) == null ? '' : jade_interp)) + "");
jade_debug.shift();
jade_debug.shift();
buf.push("</label>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 2, "public/blocks//text-parameter.jade" ));
buf.push("<div contenteditable=\"true\" class=\"string-box\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 2, jade_debug[0].filename ));
buf.push("sdfsdf");
jade_debug.shift();
jade_debug.shift();
buf.push("</div>");
jade_debug.shift();
jade_debug.shift();}.call(this,"paramName" in locals_for_with?locals_for_with.paramName:typeof paramName!=="undefined"?paramName:undefined));;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "﻿label #{paramName}\r\n.string-box(contenteditable=\"true\") sdfsdf");
}
}