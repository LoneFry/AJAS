
//add a trim function to JS Strings
//String.prototype.trim=function(){return this.replace(/^ +| +$/g,'');};
//trim: more aggressive, takes more forms of whitespace
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'');};

//add a reverse function to JS Strings
String.prototype.reverse=function(){return this.split('').reverse().join('');};

//add a function to JS Strings to remove the px from style values
String.prototype.dpx=function(){return this.replace(/px$/,'');}

//root object for the AJAS namespace.
//stuff that lends itself to having such short names that they ought not be in
//the depths of a namespace, are kept shallow, here, with underscored names
if("undefined" == typeof(ajas))ajas={};

//a flag to cache whether we are in an IE browser.
//set by conditional comments...
ajas._bIE=false;
document.write('<!--[if IE]><script type="text/javascript">ajas._bIE=true;'
// uncomment this if you want to class your body, and include ajas.util.js
//    +'ajas.util.addLoadHandler(function(){document.body.className+=" bIE";});'
    +'</scr'+'ipt><![endif]-->');


//shortname alias for the document.getElementById() function.
ajas._e=function(s){return document.getElementById(s);};
