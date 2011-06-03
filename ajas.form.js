if("undefined" == typeof(ajas))ajas={};
//for functions related to html forms
ajas.form=ajas.form?ajas.form:{};

//to hack around an IE quirk, I am making the gross assumption
// that no one would have a &#28; in their text
ajas.form.IE_hackPara=function(oTextarea) {
    if (!ajas._bIE)return;
    if (oTextarea.value.charCodeAt(oTextarea.value.length-1)==13
     || oTextarea.value.charCodeAt(oTextarea.value.length-1)==10) {
        oTextarea.value=oTextarea.value.replace(/\034/g,'')+String.fromCharCode(28);
        ajas.form.IE_setSelectionRange(oTextarea,oTextarea.value.length-2,oTextarea.value.length-2);
    }
};
ajas.form.IE_unHackPara=function(oTextarea) {
    if (!ajas._bIE)return;
    oTextarea.value=oTextarea.value.replace(/\034$/g,'');
};

ajas.form.IE_setSelectionRange=function(oTextarea, iStart, iEnd){
    if (!ajas._bIE)return;
    var oRng = oTextarea.createTextRange();
    oRng.collapse(true);
    oRng.moveStart("character", iStart);
    oRng.moveEnd("character", iEnd - iStart);
    oRng.select();
};

//take the values from a form, and return an array
ajas.form.getValues=function(oForm){
    var aVals=[];
    for(var i=0,j=oForm.elements[i];i<oForm.elements.length;i++,j=oForm.elements[i]) {
        if (j.disabled==false)
        switch(j.type) {
        case "reset":
            break;
        case "checkbox":
        case "radio":
            if (j.checked) {
                aVals[j.name]=j.value;
            }
            break;
        case "select-one":
            aVals[j.name]=j.options[j.selectedIndex].value;
            break;
        default:
            aVals[j.name]=j.value;
            break;
        }
    }
    return aVals;
};


// use this function for form feedback
ajas.form.magicCaps=function(event) {
    event=event||window.event;
    var oInput=event.target||event.srcElement;
    var sLabel = oInput.id + 'Msg';
    oInput.className = oInput.className.replace(/ajas_caps_error/g, '');
    if (ajas.event.testCapsLock(event)) {
        ajas._e(sLabel).innerHTML='Is Caps Lock on?';
        oInput.className += ' ajas_caps_error';
    } else {
        ajas._e(sLabel).innerHTML='&nbsp;';
    }
};

ajas.form.multiLineTab=function(oTextarea,event) {
    event=event||window.event;
    var sTab='\t';

    if (ajas._bIE) {
        //the below method almost worked, except that IE likes to
        //ignore trailing linebreaks, that's why I quietly add the
        //&#28; FIRST thing in this function...or on keyup
        var oRng = document.selection.createRange();
        var oRng2 = oRng.duplicate();
        oRng2.moveToElementText(oTextarea);
        oRng2.setEndPoint('StartToEnd', oRng);
        iEnd = oTextarea.value.length-oRng2.text.length;
        oRng2.setEndPoint('StartToStart', oRng);
        iStart = oTextarea.value.length-oRng2.text.length;

        //handle tabs IE
        if (9 == event.keyCode) {
            oTextarea.focus();
            var sNewText=sTab;

            var aText=oTextarea.value.substring(iStart,iEnd).split('\n');
            if (aText.length > 1) { //multi-line selection!
                iStart = oTextarea.value.lastIndexOf('\n',iStart+1);
                if (iStart == -1) iStart=0;
                if (oTextarea.value.charCodeAt(iEnd)==13)iEnd-=1;
                var sBefore=oTextarea.value.substring(0, iStart);
                var sOldText=oTextarea.value.substring(iStart,iEnd);
                var sAfter=oTextarea.value.substring(iEnd);
                aText=sOldText.split('\n');
                if (event.shiftKey) {
                    sNewText=sOldText.replace(new RegExp('\n'+sTab,'g'),'\n').replace(new RegExp('^'+sTab,''),'');
                } else {
                    sNewText=(iStart==0?sTab:'')+aText.join('\n'+sTab);
                }

                oTextarea.value = sBefore + sNewText + sAfter;
                ajas.form.IE_setSelectionRange(oTextarea, iStart-(sBefore.split('\n').length-1)
                    ,iStart+sNewText.length-((sBefore+sNewText).split('\n').length-1));
            } else {
                oRng.text=sTab;
                oRng.select();
            }
            return false;
        } else

        //handle returns IE
        if (13 == event.keyCode) {
            if (iStart==0) return true;
            if (oTextarea.value.substr(iStart-1,0).charCodeAt(0) == 13) return true;

            var iPrevLine = oTextarea.value.substring(0, iStart).lastIndexOf('\n');
            if (iPrevLine == -1) iPrevLine=0;

            var aBits=/^\n?([\t ]*)[^\t ]?/.exec(oTextarea.value.substring(iPrevLine, iStart));
            if (!aBits || aBits[1].length==0)return true;

            var sBefore=oTextarea.value.substring(0, iStart);
            oTextarea.value = sBefore
                +'\n'+aBits[1]
                +oTextarea.value.substring(iEnd);
            ajas.form.IE_setSelectionRange(oTextarea, (sBefore+aBits[1]).length+2-sBefore.split('\r').length
                ,(sBefore+aBits[1]).length+2-sBefore.split('\r').length);

            return false;
        }
    } else {
        var iStart = oTextarea.selectionStart;
        var iEnd   = oTextarea.selectionEnd;
        //handle tabs FF
        if (9 == event.which) {
            oTextarea.focus();
            var sNewText=sTab;

            var aText=oTextarea.value.substring(iStart,iEnd).split('\n');
            if (aText.length > 1) { //multi-line selection!
                iStart = oTextarea.value.lastIndexOf('\n',iStart+1);
                if (iStart == -1) iStart=0;
                if (oTextarea.value.charCodeAt(iEnd)==10)iEnd-=1;
                var sBefore=oTextarea.value.substring(0, iStart);
                var sOldText=oTextarea.value.substring(iStart,iEnd);
                var sAfter=oTextarea.value.substring(iEnd);
                aText=sOldText.split('\n');
                if (event.shiftKey) {
                    sNewText=sOldText.replace(new RegExp('\n'+sTab,'g'),'\n').replace(new RegExp('^'+sTab,''),'');
                } else {
                    sNewText=(iStart==0?sTab:'')+aText.join('\n'+sTab);
                }

                oTextarea.value = sBefore + sNewText + sAfter;
                oTextarea.setSelectionRange(iStart,iStart+sNewText.length);
            } else {
                oTextarea.value = oTextarea.value.substring(0, iStart)
                    +sTab
                    +oTextarea.value.substring(iEnd);
                oTextarea.setSelectionRange(iStart+sTab.length,iStart+sTab.length);
            }
            return false;
        } else

        //handle returns FF
        if (13 == event.which) {
            if (iStart==0) return true;

            var iPrevLine = oTextarea.value.substring(0, iStart).lastIndexOf('\n');
            if (iPrevLine == -1) iPrevLine=0;

            var aBits=/^\n?([\t ]*)[^\t ]?/.exec(oTextarea.value.substring(iPrevLine, iStart));
            if (!aBits || aBits[1].length==0)return true;

            oTextarea.value = oTextarea.value.substring(0, iStart)
                +'\n'+aBits[1]
                +oTextarea.value.substring(iEnd);
            oTextarea.setSelectionRange(iStart+aBits[1].length+1,iStart+aBits[1].length+1);

            return false;
        }
    }
};


ajas.form.simpleTab=function(oTextarea,event) {
    event=event||window.event;
    var sTab='\t';

    if (ajas._bIE) {
        //handle tabs IE
        if (9 == event.keyCode) {
            oTextarea.focus();
            var oRng = document.selection.createRange();
            oRng.text=sTab;
            oRng.select();
            return false;
        }
    } else {
        //handle tabs FF
        if (9 == event.which) {
            var iStart = oTextarea.selectionStart;
            var iEnd   = oTextarea.selectionEnd;
            oTextarea.focus();
            oTextarea.value = oTextarea.value.substring(0, iStart)
                +sTab
                +oTextarea.value.substring(iEnd);
            oTextarea.setSelectionRange(iStart+sTab.length,iStart+sTab.length);
            return false;
        }
    }
};
