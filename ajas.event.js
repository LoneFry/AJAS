//namespace for JS event related code.
ajas.event=ajas.event?ajas.event:{};

//tested 2008-10-27
// stop an event from propagating up
ajas.event.cancelBubble=function(event) {
    event=event||window.event;
    if (event) {
    	event.returnValue = false;
    	event.cancelBubble = true;
    	if(event.preventDefault)event.preventDefault();
    	if(event.stopPropagation)event.stopPropagation();
    }
    return false;
};

//tested 2008-10-27
//call to block return-key events
ajas.event.catchReturn=function(event) {
    event=event||window.event;
    var key = event.keyCode?event.keyCode:event.which;
    if (key==13){
        (event.target||event.srcElement).blur();
    	ajas.event.cancelBubble(event);
    	return false;
    }
    return true;
};

//tested 2008-10-27
//get coordinates of a mouse event
ajas.event.mouseCoords=function(event){
    event=event||window.event;
    if(event.pageX || event.pageY){
    	return {x:event.pageX, y:event.pageY};
    }
    return {x:event.clientX+document.body.scrollLeft-document.body.clientLeft,
    	y:event.clientY+document.body.scrollTop-document.body.clientTop};
};

//tested on 2008-11-05
//get target/srcElement of event
ajas.event.o=function(event){
    event=event||window.event;
    return event.target||event.srcElement;
};

//tested on 2008-11-05
//MUST USE onkeypress
//test keycode and shift key to determine whether CAPS LOCK is active
ajas.event.testCapsLock=function(event) {
    event=event||window.event;
    var key=event.which?event.which:(event.keyCode?event.keyCode:
    	(event.charCode?event.charCode:0));
    var bShift=event.shiftKey||(event.modifiers&&(event.modifiers&4)); 
    return (key>=65&&key<=90&&!bShift)||(key>=97&&key<=122&&bShift);
};
