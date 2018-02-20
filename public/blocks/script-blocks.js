function template(locals) {
var jade_debug = [ new jade.DebugItem( 1, "public/blocks//script-blocks.jade" ) ];
try {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (console, script, undefined) {
jade_debug.unshift(new jade.DebugItem( 0, "public/blocks//script-blocks.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "public\\blocks\\mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 2, "public\\blocks\\mixins.jade" ));
jade_mixins["parameter"] = jade_interp = function(paramType, paramName){
var block = (this && this.block), attributes = (this && this.attributes) || {};
jade_debug.unshift(new jade.DebugItem( 3, "public\\blocks\\mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 3, "public\\blocks\\mixins.jade" ));
switch (paramType){
case "text":
jade_debug.unshift(new jade.DebugItem( 5, "public\\blocks\\mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 0, "public\\blocks\\mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "public\\blocks\\text-parameter.jade" ));
buf.push("<label>");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 1, jade_debug[0].filename ));
buf.push("" + (jade.escape((jade_interp = paramName) == null ? '' : jade_interp)) + "");
jade_debug.shift();
jade_debug.shift();
buf.push("</label>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 2, "public\\blocks\\text-parameter.jade" ));
buf.push("<div contenteditable=\"true\" class=\"string-box\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 2, jade_debug[0].filename ));
buf.push("sdfsdf");
jade_debug.shift();
jade_debug.shift();
buf.push("</div>");
jade_debug.shift();
jade_debug.shift();
jade_debug.shift();
  break;
case "variable":
jade_debug.unshift(new jade.DebugItem( 7, "public\\blocks\\mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 0, "public\\blocks\\mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "public\\blocks\\variable-parameter.jade" ));
buf.push("<label>");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 1, jade_debug[0].filename ));
buf.push("Choose a variable");
jade_debug.shift();
jade_debug.shift();
buf.push("</label>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 2, "public\\blocks\\variable-parameter.jade" ));
buf.push("<div class=\"variable-box\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 2, jade_debug[0].filename ));
buf.push("Choose a variable");
jade_debug.shift();
jade_debug.shift();
buf.push("</div>");
jade_debug.shift();
jade_debug.shift();
jade_debug.shift();
  break;
jade_debug.shift();
jade_debug.shift();
}
jade_debug.shift();
jade_debug.shift();
};
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 9, "public\\blocks\\mixins.jade" ));
jade_mixins["dragBlocksHere"] = jade_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
jade_debug.unshift(new jade.DebugItem( 10, "public\\blocks\\mixins.jade" ));
jade_debug.unshift(new jade.DebugItem( 10, "public\\blocks\\mixins.jade" ));
buf.push("<li class=\"info-block\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 10, jade_debug[0].filename ));
buf.push("Drag Items Here");
jade_debug.shift();
jade_debug.shift();
buf.push("</li>");
jade_debug.shift();
jade_debug.shift();
};
jade_debug.shift();
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 2, "public\\blocks\\function.jade" ));
jade_debug.unshift(new jade.DebugItem( 1, "public\\blocks\\function.jade" ));
jade_mixins["function"] = jade_interp = function(func){
var block = (this && this.block), attributes = (this && this.attributes) || {};
jade_debug.unshift(new jade.DebugItem( 2, "public\\blocks\\function.jade" ));
jade_debug.unshift(new jade.DebugItem( 2, "public\\blocks\\function.jade" ));
buf.push("<li class=\"command\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 3, "public\\blocks\\function.jade" ));
console.log(func)
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 4, "public\\blocks\\function.jade" ));
buf.push("<span class=\"command-header\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 4, jade_debug[0].filename ));
buf.push("" + (jade.escape((jade_interp = func.block) == null ? '' : jade_interp)) + "");
jade_debug.shift();
jade_debug.shift();
buf.push("</span>");
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 5, "public\\blocks\\function.jade" ));
buf.push("<ol class=\"command-body\">");
jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
jade_debug.unshift(new jade.DebugItem( 6, "public\\blocks\\function.jade" ));
// iterate func.parameters
;(function(){
  var $$obj = func.parameters;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var param = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 6, "public\\blocks\\function.jade" ));
jade_debug.unshift(new jade.DebugItem( 7, "public\\blocks\\function.jade" ));
jade_mixins["parameter"](param.editor, param.name);
jade_debug.shift();
jade_debug.shift();
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var param = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 6, "public\\blocks\\function.jade" ));
jade_debug.unshift(new jade.DebugItem( 7, "public\\blocks\\function.jade" ));
jade_mixins["parameter"](param.editor, param.name);
jade_debug.shift();
jade_debug.shift();
    }

  }
}).call(this);

jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 8, "public\\blocks\\function.jade" ));
if ( func.hasChildren)
{
jade_debug.unshift(new jade.DebugItem( 9, "public\\blocks\\function.jade" ));
jade_debug.unshift(new jade.DebugItem( 9, "public\\blocks\\function.jade" ));
// iterate func.children
;(function(){
  var $$obj = func.children;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var child = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 9, "public\\blocks\\function.jade" ));
jade_debug.unshift(new jade.DebugItem( 10, "public\\blocks\\function.jade" ));
jade_mixins["function"](child);
jade_debug.shift();
jade_debug.shift();
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var child = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 9, "public\\blocks\\function.jade" ));
jade_debug.unshift(new jade.DebugItem( 10, "public\\blocks\\function.jade" ));
jade_mixins["function"](child);
jade_debug.shift();
jade_debug.shift();
    }

  }
}).call(this);

jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 11, "public\\blocks\\function.jade" ));
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
jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 4, "public/blocks//script-blocks.jade" ));
// iterate script
;(function(){
  var $$obj = script;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var func = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 4, "public/blocks//script-blocks.jade" ));
jade_debug.unshift(new jade.DebugItem( 5, "public/blocks//script-blocks.jade" ));
jade_mixins["function"](func);
jade_debug.shift();
jade_debug.shift();
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var func = $$obj[$index];

jade_debug.unshift(new jade.DebugItem( 4, "public/blocks//script-blocks.jade" ));
jade_debug.unshift(new jade.DebugItem( 5, "public/blocks//script-blocks.jade" ));
jade_mixins["function"](func);
jade_debug.shift();
jade_debug.shift();
    }

  }
}).call(this);

jade_debug.shift();
jade_debug.unshift(new jade.DebugItem( 6, "public/blocks//script-blocks.jade" ));
jade_mixins["dragBlocksHere"]();
jade_debug.shift();
jade_debug.shift();}.call(this,"console" in locals_for_with?locals_for_with.console:typeof console!=="undefined"?console:undefined,"script" in locals_for_with?locals_for_with.script:typeof script!=="undefined"?script:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "﻿include mixins\r\ninclude function\r\n\r\neach func in script\r\n  +function(func)\r\n+dragBlocksHere()\r\n");
}
}