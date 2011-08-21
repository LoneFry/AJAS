/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 *                Functions for Time validation
 *****************************************************************************/

if("undefined" == typeof(ajas))ajas={"Time":{}};
ajas.Time=ajas.Time?ajas.Time:{};

// use this function for form feedback
ajas.Time.magic=function(oInput, b24) {
    // Set preferred defaults here.
    // b24 sets whether to use 24 hour clock
    if(arguments.length < 2) var b24=false;
    
    var sLabel = oInput.id + 'Msg';
    oInput.className = oInput.className.replace(/ajas_time_error/g, '');
    try {
        if (oInput.value == '') {
            ajas._e(sLabel).innerHTML = b24?'HH:mm:ss':'hh:mm:ss am/pm';
            return;
        }
        var oDate = ajas.Time.parse(oInput.value,b24);
        var iHour=oDate.getHours();
        if(!b24)iHour%=12;
        if(!b24 && iHour == 0)iHour=12;
        var s='';
        if(iHour<10)s+='0';
        s+=iHour+':';
        if(oDate.getMinutes()<10)s+='0';
        s+=oDate.getMinutes()+':';
        if(oDate.getSeconds()<10)s+='0';
        s+=oDate.getSeconds();
        if(!b24)s+=oDate.getHours()>11?'pm':'am';
        
        oInput.value = s;
        // Human readable time
        ajas._e(sLabel).innerHTML = s;
    } catch (e) {
        oInput.className += ' ajas_time_error';
        var message = e.message;
        // Fix for IE6 bug
        if (message.indexOf('is null or not an object') > -1) {
            message = 'Invalid time string';
        }
        ajas._e(sLabel).innerHTML = message;
    }

};


ajas.Time.magic_keyup=function(event,b24) {
    if(arguments.length < 2) var b24=false;

    event=event||window.event;
    var oInput=event.target||event.srcElement;
    if (false && "" == oInput.value){
        var oDate = new Date();
        oInput.value = oDate.getFullYear() + '-' + (oDate.getMonth() + 1) + '-' + oDate.getDate();
    } else {
        key = event.keyCode?event.keyCode:event.which;
        
        switch(key) {
        case 13: // enter
            oInput.blur();
            ajas.event.cancelBubble(event);
            return false;
            break;
        case 38: // up
            if (oInput.value == '') oInput.value='now';
            var oDate = ajas.Time.parse(oInput.value,b24);
            oDate.setHours(oDate.getHours() + 1);
            break;
        case 40: // down
            if (oInput.value == '') oInput.value='now';
            var oDate = ajas.Time.parse(oInput.value,b24);
            oDate.setHours(oDate.getHours() - 1);
            break;
        case 39: // right
            if (oInput.value != '') break;
            var oDate = new Date();
            break;
        default:
            return true;
        }
        if (oDate){
            var iHour=oDate.getHours();
            if(!b24)iHour%=12;
            if(!b24 && iHour == 0)iHour=12;
            var s='';
            if(iHour<10)s+='0';
            s+=iHour+':';
            if(oDate.getMinutes()<10)s+='0';
            s+=oDate.getMinutes()+':';
            if(oDate.getSeconds()<10)s+='0';
            s+=oDate.getSeconds();
            if(!b24)s+=oDate.getHours()>11?'pm':'am';
            
            oInput.value = s;
            // Human readable time
            ajas._e(oInput.id+'Msg').innerHTML = s;
        }
    }
    return true;
};



ajas.Time.parse=function(sDate, b24) {
    if(arguments.length < 2) var b24=false;
    var aBits;
    var oDate = new Date();
    
    // Now
    if (aBits = /^now/i.exec(sDate)) {
        return oDate;
    }
    
    // Noon
    if (aBits = /^(12(00)?n|noon?|midd(ay?)?)/i.exec(sDate)) {
        oDate.setSeconds(0);
        oDate.setMinutes(0);
        oDate.setHours(12);
        return oDate;
    }
    // Midnight
    if (aBits = new RegExp('^'+sDate,'i').test('midnight')) {
        oDate.setSeconds(0);
        oDate.setMinutes(0);
        oDate.setHours(0);
        return oDate;
    }

    // 0530
    if (aBits = /^(\d{1,2})(\d{2})?(\d{2})?\s*(am?|pm?)?$/i.exec(sDate)) {
        var iHour=parseInt(aBits[1], 10);
        if (iHour > 23 || (iHour > 12 && !b24)){
            throw new Error("Invalid Hour");
        }
        var iMinute=parseInt(aBits[2], 10);
        if (iMinute > 59){
            throw new Error("Invalid Minute");
        }
        var iSecond=parseInt(aBits[3], 10);
        if (iSecond > 59){
            throw new Error("Invalid Second");
        }
        var iPM=0;
        if(aBits[4]){
            var iPM=aBits[4].toLowerCase().indexOf('p')>-1?12:0;
            if(iHour > 12){
                throw new Error("AM/PM on a 24-Hour clock?");
            }
            if(iHour == 12){
                iHour=0;
            }
        }
        if(!b24)iHour%=12;
        oDate.setSeconds(iSecond||0);
        oDate.setMinutes(iMinute||0);
        oDate.setHours(iHour+iPM);
        return oDate;
    }


    // hh:mm:ss
    if (aBits = /^(\d{1,2}):(\d{1,2})(:(\d{1,2}))?\s*(am?|pm?)?$/i.exec(sDate)) {
        var iHour=parseInt(aBits[1], 10);
        if (iHour > 23 || (iHour > 12 && !b24)){
            throw new Error("Invalid Hour");
        }
        var iMinute=parseInt(aBits[2], 10);
        if (iMinute > 59){
            throw new Error("Invalid Minute");
        }
        var iSecond=parseInt(aBits[4], 10);
        if (iSecond > 59){
            throw new Error("Invalid Second");
        }
        var iPM=0;
        if(aBits[5]){
            var iPM=aBits[5].toLowerCase().indexOf('p')>-1?12:0;
            if(iHour > 12){
                throw new Error("AM/PM on a 24-Hour clock?");
            }
            if(iHour == 12){
                iHour=0;
            }
        }
        if(!b24)iHour%=12;
        oDate.setSeconds(iSecond||0);
        oDate.setMinutes(iMinute||0);
        oDate.setHours(iHour+iPM);
        return oDate;
    }

    // now that I've checked what and how I want to check, let the JS API try what's left.
    if (milli = Date.parse(sDate)) { // is there a better way to do this?
        oDate.setSeconds(0);
        oDate.setMinutes(0);
        oDate.setHours(0);
        oDate.setDate(1);
        oDate.setFullYear(1970);
        oDate.setMonth(0); // Because months indexed from 0
        oDate.setMilliseconds(milli);
        return oDate;
    }
    
    // no date
    throw new Error("Enter a Valid Time.");
};
