function template(locals) {
var jade_debug = [ new jade.DebugItem( 1, "public/blocks//function.jade" ) ];
try {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (console) {
jade_debug.unshift(new jade.DebugItem( 0, "public/blocks//function.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "public/blocks//function.jade" ));
jade_mixins["function"] = jade_interp = function(func){
var block = (this && this.block), attributes = (this && this.attributes) || {};
jade_debug.unshift(new jade.DebugItem( 2, "public/blocks//function.jade" ));
jade_debug.unshift(new jade.DebugItem( 2, "public/blocks//function.jade" ));
buf.push("<li class=\"command\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 3, "public/blocks//function.jade" ));
console.log(func)
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 4, "public/blocks//function.jade" ));
buf.push("<span class=\"command-header\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 4, jade_debug[0].filename ));
buf.push("" + (jade.escape((jade_interp = func.block) == null ? '' : jade_interp)) + "");
jade_debug.shift();
jade_debug.shift();
buf.push("</span>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 5, "public/blocks//function.jade" ));
buf.push("<ol class=\"command-body\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 6, "public/blocks//function.jade" ));
// iterate func.parameters
;(function(){
  var $$obj = func.parameters;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var param = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 6, "public/blocks//function.jade" ));
jade_debug.unshift(new jade.DebugItem( 7, "public/blocks//function.jade" ));
jade_mixins["parameter"](param.editor, param.name);
jade_debug.shift();
jade_debug.shift();
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var param = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 6, "public/blocks//function.jade" ));
jade_debug.unshift(new jade.DebugItem( 7, "public/blocks//function.jade" ));
jade_mixins["parameter"](param.editor, param.name);
jade_debug.shift();
jade_debug.shift();
    }

  }
}).call(this);

jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 8, "public/blocks//function.jade" ));
if ( func.hasChildren)
{
jade_debug.unshift(new jade.DebugItem( 9, "public/blocks//function.jade" ));
jade_debug.unshift(new jade.DebugItem( 9, "public/blocks//function.jade" ));
// iterate func.children
;(function(){
  var $$obj = func.children;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var child = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 9, "public/blocks//function.jade" ));
jade_debug.unshift(new jade.DebugItem( 10, "public/blocks//function.jade" ));
jade_mixins["function"](child);
jade_debug.shift();
jade_debug.shift();
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var child = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 9, "public/blocks//function.jade" ));
jade_debug.unshift(new jade.DebugItem( 10, "public/blocks//function.jade" ));
jade_mixins["function"](child);
jade_debug.shift();
jade_debug.shift();
    }

  }
}).call(this);

jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 11, "public/blocks//function.jade" ));
jade_mixins["dragBlocksHere"]();
jade_debug.shift();
jade_debug.shift();
}
jade_debug.shift();
jade_debug.shift();
buf.push("</ol>");
jade_debug.shift();
jade_debug.shift();
buf.push("</li>");
jade_debug.shift();
jade_debug.shift();
};
jade_debug.shift();
jade_debug.shift();}.call(this,"console" in locals_for_with?locals_for_with.console:typeof console!=="undefined"?console:undefined));;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "﻿mixin function(func)\r\n  li.command\r\n    - console.log(func)\r\n    span.command-header #{func.block}\r\n    ol.command-body\r\n      each param in func.parameters\r\n        +parameter(param.editor, param.name)\r\n      if func.hasChildren\r\n        each child in func.children\r\n          +function(child)\r\n        +dragBlocksHere()\r\n");
}
}