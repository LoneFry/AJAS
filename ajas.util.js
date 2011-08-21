/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 *                Functions of utility
 *****************************************************************************/

if("undefined" == typeof(ajas))ajas={"util":{}};
ajas.util=ajas.util?ajas.util:{};

ajas.util.addLoadHandler=function(f){
    var o=window.onload;
    if(typeof window.onload!='function'){
        window.onload=f;
    }else{
        window.onload=function(){if(o)o();f();}
    }
};

//takes an array and gens some printable text, better put output in <pre>
ajas.util.arrayDump=function(aRef, sPre) {
    if(arguments.length<2) sPre='\n';
    var sTEXT = 'Array {';
    var sPreN = sPre+'  ';
    for(var i in aRef){
        if (typeof(aRef[i]) == 'object' && typeof(aRef[i]) != 'string') {
            sTEXT += ''+sPreN+i+" => "+ajas.util.arrayDump(aRef[i],sPreN);
        } else {
            sTEXT += ''+sPreN+i+" => "+aRef[i];
        }
    }
    return sTEXT+''+sPre+'}';
};

/* Returns an array of items judged 'true' by the passed in test function */
ajas.util.arrayFilter=function(aHaystack, fTest) {
    var aMatches = [];
    for(var key in aHaystack) {
        if (fTest(aHaystack[key])) {
            aMatches.push(aHaystack[key]);
        }
    }
    return aMatches;
};

/* Finds THE INDEX of the first occurrence of item in the array, or false if not found */
ajas.util.arraySearch=function(aHaystack, needle) {
    for(var key in aHaystack) {
        if (aHaystack[key] == needle) {
            return key;
        }
    }
    return false;
};

//takes an array and gens a PHP definition
ajas.util.arrayToPhp=function(aRef) {
    var a=[];
    for(var i in aRef){
        if (typeof(aRef[i]) == 'object' && typeof(aRef[i]) != 'string') {
            a.push("'"+i+"' => "+ajas.util.arrayToPhp(aRef[i]));
        } else {
            a.push("'"+i+"' => '"+aRef[i]+"'");
        }
    }
    return 'array('+a.join(',')+')';
};

//takes an array and gens some crude tables
ajas.util.arrayToTable=function(aRef) {
    var sTEXT = '<table>';
    for(var i in aRef){
        if (typeof(aRef[i]) == 'object' && typeof(aRef[i]) != 'string') {
            sTEXT += '<tr><td>'+i+'</td><td>'+ajas.util.arrayToTable(aRef[i])+'</td></tr>';
        } else {
            sTEXT += '<tr><td>'+i+'</td><td>'+aRef[i]+'</td></tr>';
        }
    }
    return sTEXT+'</table>';
};


ajas.util.buffer=function(){
    var private={
        oldWrite:document.write,        //to store the original document.write
        stack:[],                       //to store our stacked buffers
        sBuff:null,                     //the current buffer
        write:function(s){              //what will replace document.write
            private.sBuff+=s;
        }
    };
    var public={
        //start a new buffer, replace document.write
        start:function(){
            private.stack.push(private.sBuff);
            private.sBuff='';
            document.write=private.write;
        },
        
        //get current buffer, optionally clear it
        get:function(bClear){//get current buffer
            if(!bClear)return private.sBuff;
            var s=private.sBuff;
            private.sBuff='';
            return s;
        },
        
        //end top buffer, return the string
        end:function(bFlush){
            if(0==private.stack.length){//we're not buffering
                return false;
            }
            var s=private.sBuff;
            private.sBuff=private.stack.pop();
            if(0==private.stack.length){//we pop'd the last
                document.write=private.oldWrite;
            }
            if(!bFlush)return s;
            document.write(s);
            return s;
        },
        
        //end all buffers, return the stack
        endAll:function(){
            var a=private.stack;
            a.push(private.sBuff);
            delete a[0];
            private.stack=[];
            document.write=private.oldWrite;
            return a;
        }
    };
    return public;
}();

//takes an associative array and returns  a basic ?key=val&key2=val2 string
ajas.util.buildQueryString=function(aParams) {
    var a=[];
    for(var i in aParams) {
        a.push(ajas.util.escapePlus(i)+'='+ajas.util.escapePlus(aParams[i]));
    }
    return a.join('&');
};


ajas.util.compare=function(a,b) {
    return (a<b?-1:(a>b?1:0));
};

//set the clipboard
//still trying to get this to work without the swf
ajas.util.copy=function(s){
    try{
        clipboardData.setData("Text", s);
    }catch(e){
        //credit for FF solution to http://www.jeffothy.com/weblog/clipboard-copy/
        var f='flashcopier';
        if(!ajas._e(f)) {
            var o=document.createElement('div');
            o.id=f;
    //        o.style.display='none';
            document.body.appendChild(o);
//            o.innerHTML = '<input type="text"><iframe src="data:text/html;charset=utf-8;base64,'
//                +btoa('<embed src="data:application/x-shockwave-flash;base64,Q1dTB3kAAAB4nKtgYI1nYOBfwMDAw8jgzPT%2F%2F3975lAGBoYOdQYWhuSczIKk%2FMSiFIac1Lz0kgyG4MriktRchuLUEme41DQmBg4GGRDJ6Cc0l4lBAibCzsDOCDSJgwksyRwkzuAA5AIAd7oY%2Fw%3D%3D" FlashVars="code='+encodeURIComponent(s)+'"></embed>')+'"></iframe>';
        }
//        ajas._e(f).innerHTML = '<embed src="data:application/x-shockwave-flash;base64,Q1dTB3kAAAB4nKtgYI1nYOBfwMDAw8jgzPT//3975lAGBoYOdQYWhuSczIKk/MSiFIac1Lz0kgyG4MriktRchuLUEme41DQmBg4GGRDJ6Cc0l4lBAibCzsDOCDSJgwksyRwkzuAA5AIAd7oY/w==" FlashVars="clipboard='+encodeURIComponent(s)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
        ajas._e(f).innerHTML = '<embed src="http://www.woktiny.net/wheel/_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(s)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
//        ajas._e(f).innerHTML = '<embed src="Q1dTB3kAAAB4nKtgYI1nYOBfwMDAw8jgzPT%2F%2F3975lAGBoYOdQYWhuSczIKk%2FMSiFIac1Lz0kgyG4MriktRchuLUEme41DQmBg4GGRDJ6Cc0l4lBAibCzsDOCDSJgwksyRwkzuAA5AIAd7oY%2Fw%3D%3D" FlashVars="clipboard='+encodeURIComponent(s)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
//        ajas._e(f).contentWindow.document.body.innerHTML = '<input type="text"><embed src="data:application/x-shockwave-flash;base64,Q1dTB3kAAAB4nKtgYI1nYOBfwMDAw8jgzPT%2F%2F3975lAGBoYOdQYWhuSczIKk%2FMSiFIac1Lz0kgyG4MriktRchuLUEme41DQmBg4GGRDJ6Cc0l4lBAibCzsDOCDSJgwksyRwkzuAA5AIAd7oY%2Fw%3D%3D" FlashVars="code='+encodeURIComponent(s)+'"></embed>';
//Q1dTB3kAAAB4nKtgYI1nYOBfwMDAw8jgzPT%2F%2F3975lAGBoYOdQYWhuSczIKk%2FMSiFIac1Lz0kgyG4MriktRchuLUEme41DQmBg4GGRDJ6Cc0l4lBAibCzsDOCDSJgwksyRwkzuAA5AIAd7oY%2Fw%3D%3D
//TinyURL.com/2yh44h
    }
};


//JS escape that also handles + -> %2b
ajas.util.escapePlus=function(s){
    return escape(s).replace(/\053/g,'%2b');
};



//takes a basic ?key=val&key2=val2 string and returns an associative array
ajas.util.parseQueryString=function(sQueryString) {
    sQueryString = sQueryString.replace(/^\?/, '');//toss leading ?
    if (sQueryString.length == 0) return;
    aParams=[];
    sQueryString = sQueryString.replace(/\+/g, ' ');//interpret '+' as space
    var aPairs = sQueryString.split('&');
    for(var i in aPairs) {
        var pair = aPairs[i].split('=',2);
        aParams[unescape(pair[0])]=pair.length==2?unescape(pair[1]):'';
    }
    return aParams;
};

// simple object for storing immutable (self)references
ajas.util.store=function(){
    var private={
        list:{},
        i:0
    };
    var public={
        add:function(o){
            private.list[private.i]=o;
            return private.i++;
        },
        get:function(i){
            return private.list[i];
        }
    };
    return public;
}();

//this seems abnormally slow in Chrome
ajas.util.tableSort=function(tbody_id, col, t){
    if (t != "str" && t != "date" && t != "year/month" && t != "num" && t != "last") return;
    if(undefined==ajas.util.tableSort.sortCol)ajas.util.tableSort.sortCol=-1;
    if(!ajas.util.tableSort.sortDir)ajas.util.tableSort.sortDir=1;
    if (ajas.util.tableSort.sortCol == col) {
        ajas.util.tableSort.sortDir *= -1;
    }
    ajas.util.tableSort.sortCol=col;
    ajas.util.tableSort.sortType=t;
    var rows=[],
    tbody=ajas._e(tbody_id);
    len=tbody.rows.length;
    for(i=0;i<len;i++){
        rows[i]=tbody.rows[i];
    }
    rows.sort(ajas.util.tableSort.compareRow);
    
    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
    for (i=0;i<rows.length;i++) {
        tbody.appendChild(rows[i]);
    }
};

ajas.util.tableSort.compareRow=function(a,b) {
	var col=ajas.util.tableSort.sortCol;
	if ("input"==ajas.util.tableSort.sortType) {
		return ts_stringComparator(a.cells[col].childNodes[0].value, 
			b.cells[col].childNodes[0].value);
	}
	var typ=ajas.util.tableSort.sortType,
		dir=ajas.util.tableSort.sortDir;
	var valA,valB;
	if(a.cells[col].childNodes[0] && typeof(a.cells[col].childNodes[0])=='object' && typeof(a.cells[col].childNodes[0].selectedIndex) != 'undefined' && typ!='last'){
		valA=a.cells[col].childNodes[0].options[a.cells[col].childNodes[0].selectedIndex].value;
	}else if(a.cells[col].childNodes[0] && typeof(a.cells[col].childNodes[0])=='object' && typeof(a.cells[col].childNodes[0].value) != 'undefined' && typ!='last'){
		valA=a.cells[col].childNodes[0].value;
	}else{
		valA=a.cells[col].innerHTML;
	}
	if(b.cells[col].childNodes[0] && typeof(b.cells[col].childNodes[0])=='object' && typeof(b.cells[col].childNodes[0].selectedIndex) != 'undefined' && typ!='last'){
		valB=b.cells[col].childNodes[0].options[b.cells[col].childNodes[0].selectedIndex].value;
	}else if(b.cells[col].childNodes[0] && typeof(b.cells[col].childNodes[0])=='object' && typeof(b.cells[col].childNodes[0].value) != 'undefined' && typ!='last'){
		valB=b.cells[col].childNodes[0].value;
	}else{
		valB=b.cells[col].innerHTML;
	}
	if (typ == "str") {
		return dir*ajas.util.compare(valA.toLowerCase(), valB.toLowerCase());
	} else if (typ == "date") {
		return dir*ajas.util.compare(new Date(valA), new Date(valB));
	} else if (typ == "year/month") {
		var re=/([\d]{4}), ([\w]+)/;
		return dir*ajas.util.compare(new Date(valA.replace(re,"$2 1, $1")),
			new Date(valB.replace(re,"$2 1, $1")));
	} else if (typ == "num") {
		re=/\$|%|,/g;
		return dir*ajas.util.compare(new Number(valA.replace(re,"")),
			new Number(valB.replace(re,"")));
	} else if (typ == "last") {
		return dir*ajas.util.compare(valA.split(' ').pop().toLowerCase(),
			valB.split(' ').pop().toLowerCase());
	} else {
		return 0;
	}
};

