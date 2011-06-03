if("undefined" == typeof(ajas))ajas={};
//namespace object for my http related functions
//The way I want to do "Ajax" 
//basically, I have the backend pass the data as a JS object, it's quicker than 
// generating then parsing XML... 
//apparently this caught on as JSON (JavaScript Ojbect Notation)
ajas.http=ajas.http?ajas.http:{};

//An array to hold pending XMLHttpRequest objects
ajas.http.aRequests=[];

//a simple object that contains the basic parts to fake a form.
ajas.http.oBlankForm={'method':'post','action':'',
    'enctype':'application/x-www-form-urlencoded','sData':''};

//add XMLHttpRequest object and parameters to queue
//keeping them in a queue simplifies the use of concurrent requests
//name of callback function can be passed, or taken from the querystring.
ajas.http.enqueue=function(oXML,aParams,sCallback){
    if(!sCallback)sCallback=aParams['callback']||'ajas.http.nullHandler';
    ajas.http.aRequests.push([oXML,
        new Function('oXML','aParams',sCallback+'(oXML,aParams);'),aParams]);
};

//get XMLHttpRequest object according to browser type
ajas.http.newRequest=function() {
    return window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP")
        :new XMLHttpRequest();
};

//this is the default, do nothing, response handler
//if you enqueue and aParams doesn't contain a 'callback' property it uses this
ajas.http.nullHandler=function(oXML, aParams) {
    //if (oXML.responseText=='')return;
    //eval('var aData='+oXML.responseText);
    // do something with the data
    //alert('ajas.http.nullHandler called');
};

//check each XMLRequest and handle the ready ones with their preset callback
ajas.http.queueHandler=function(){
    for(var key in ajas.http.aRequests){
        if (ajas.http.aRequests[key][0].readyState == 4){
            var oXML=ajas.http.aRequests[key][0];
            var oFunc=ajas.http.aRequests[key][1];
            var aParams=ajas.http.aRequests[key][2];
            delete ajas.http.aRequests[key];
            oFunc(oXML,aParams);
        }
    }
    return true;
};

//send a typical get request
//name of callback function can be passed, or taken from the querystring.
ajas.http.sendRequest=function(sUrl,sQueryString,sCallback){
    //if(arguments.length < 2) {
    if(!sQueryString) {
        var a=sUrl.split('?');
        sUrl=a[0];
        sQueryString=a[1];
    }
    var oXML=ajas.http.newRequest();
    oXML.open('GET',sUrl+'?'+sQueryString,true);//true=aSync
    oXML.onreadystatechange=ajas.http.queueHandler;
    oXML.setRequestHeader("Content-Type",'application/x-www-form-urlencoded');
    oXML.setRequestHeader("Connection", "close");
    oXML.send(null);

    var aParams=ajas.util.parseQueryString(sQueryString);
    ajas.http.enqueue(oXML,aParams,sCallback);
    return false; // so the form submit cancels
};

//take a form's data and send it in an XMLHttpRequest
ajas.http.submitForm=function(oForm,sCallback){
    var oXML=ajas.http.newRequest();
    var formData=oForm.sData||
        ajas.util.buildQueryString(ajas.form.getValues(oForm));
    oXML.open(oForm.method,oForm.action,true);//true=aSync
    oXML.onreadystatechange=ajas.http.queueHandler;
    oXML.setRequestHeader("Content-Type",oForm.enctype);
    oXML.setRequestHeader("Connection", "close");
    oXML.setRequestHeader("Content-length", formData.length);
    oXML.send(formData);

    var aParams;
    if(oForm.action.indexOf('?')==-1){
        aParams=[];
    } else {
        aParams=ajas.util.parseQueryString(
            oForm.action.substr(oForm.action.indexOf('?')+1));
    }

    //name of callback function can be passed, or taken from the querystring.
    ajas.http.enqueue(oXML,aParams,sCallback);
    return false; // so the form submit cancels
};

//builds and sends an http request with data encoded like an attached file.
ajas.http.uploadAsFile=function(sUrl,sFilename,sData,sCallback,iMaxLen) {
    if(arguments.length<5)var iMaxLen=false;
    if(arguments.length<4)var sCallback='ajas.http.nullHandler';
    if(arguments.length<3)return false;
    // prepare the MIME POST data
    var boundaryString='\\\\boundary\\\\';
    var boundary='--'+boundaryString;
    var requestbody=boundary+'\n'
    +'Content-Disposition: form-data; name="file"; filename="'+sFilename+'"\n'
    +'Content-Type: application/octet-stream\n\n'
    +ajas.util.escapePlus(sData)
    +'\n'+boundary;

    oForm={'method':'POST','action':sUrl+'?callback='+sCallback,
        'sData':requestbody,
        'enctype':'multipart/form-data; boundary="'+boundaryString+'"'};
    ajas.http.submitForm(oForm);
};

//Reads a local file into buffer and calls ajas.http.uploadAsFile()
ajas.http.uploadLocalFile=function(sUrl,sFilename,sCallback,iMaxLen) {
    if(arguments.length < 4)var iMaxLen=false;
    if(arguments.length < 3)var sCallback='ajas.http.nullHandler';
    // FireFox/Mozilla settings: Open about:config and check that
    //  [signed.applets.codebase_principal_support] is set to "true"
    // request local file read permission
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    // open the local file
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath( sFilename );
    stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
    stream.init(file, 0x01, 00004, null);
    var bstream =  Components.classes["@mozilla.org/network/buffered-input-stream;1"].getService();
    bstream.QueryInterface(Components.interfaces.nsIBufferedInputStream);
    bstream.init(stream, 1000);
    bstream.QueryInterface(Components.interfaces.nsIInputStream);
    var binary = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
    binary.setInputStream (stream);

    if (iMaxLen && binary.available() > iMaxLen) {
        throw new Error('File size exceeds expressed limit of '+iMaxLen+' Bytes.');
        return false;
    }
    sFilename=sFilename.substr(Math.max(sFilename.lastIndexOf('/'),sFilename.lastIndexOf('\\'))+1);
    ajas.http.uploadAsFile(sUrl,sFilename,binary.readBytes(binary.available()),sCallback,iMaxLen);
    binary.close();
    bstream.close();
    stream.close();
};


//This object is useful for 'fixing' the back/forward buttons
// in 'ajax' (navigation) based sites
ajas.http.HashHistory=function (fCallback,sIeEchoURL,iMillis) {
    var private={
        fCallback:fCallback,        //function to call on hash changes
        sCurrentHash:'',            //to maintain #hash of current state
        oPollTimer:null,            //timer to poll #hash state changes
        iPollTime:iMillis||500,     //poll time interval in ms, default
        sEchoURL:sIeEchoURL,        //URL that echos the querystring like this:
                                    //<?='#'.$_SERVER['QUERY_STRING'];?>
        iKey:0
    };

    if (ajas._bIE) { //if IE, use an iframe to keep history
        private.oIframeDiv=document.createElement('div');
        private.oIframeDiv.style.display='none';
        private.oIframeDiv.innerHTML='<iframe style="display:none;" '
            +'src="about:blank" name="ajas_http_History'+private.iKey+'">'
            +'</iframe>';
        private.oIframeName='ajas_http_History'+private.iKey;
        document.body.appendChild(private.oIframeDiv);
    }
    var public={
        //called from links, set the hashes that are polled to match link clicked
        addHash:function(sHash) {
            window.clearTimeout(private.oPollTimer);    //clear timer to avoid trigger during this function
            private.sCurrentHash=(sHash[0]=='#'?'':'#')+sHash;
            if (ajas._bIE) { //if IE
                //have to clear contents to deal with network latency
                try{window(private.oIframeName).document.body.innerText='';}catch(ex){}
                window(private.oIframeName).location=private.sEchoURL+'?'+private.sCurrentHash.substr(1);
            }
            window.location.hash=private.sCurrentHash;
            private.oPollTimer=window.setTimeout('ajas.util.store.get('+private.iKey+').pollHash();', private.iPollTime);
        },
        pollHash:function() {
            //Internet explorer needs special treatment.
            //don't forget to setup your echo URL described above
            if (ajas._bIE) {
                try{
                    if (window.frames(private.oIframeName).document.body.innerText != private.sCurrentHash
                        && window.frames(private.oIframeName).document.body.innerText != '') {
                        private.sCurrentHash = window.frames(private.oIframeName).document.body.innerText;
                        window.location.hash = private.sCurrentHash;
                        private.fCallback(private.sCurrentHash);
                    }
                } catch(e){    }
            }
            //this portion handles FF, and IE's initial check
            if (window.location.hash != private.sCurrentHash
                && window.location.hash != '') {
                private.sCurrentHash = window.location.hash;
                if (ajas._bIE) {
                    try{window[private.oIframeName].document.body.innerText='';}catch(e){}
                    window(private.oIframeName).location=private.sEchoURL+'?'+private.sCurrentHash.substr(1);
                }
                try{
                    private.fCallback(private.sCurrentHash);
                }catch(e){}
            }
            private.oPollTimer=window.setTimeout('ajas.util.store.get('+private.iKey+').pollHash();', private.iPollTime);
            return true;
        }
    };
    private.iKey=ajas.util.store.add(public);
    public.pollHash();
    return public;
};
