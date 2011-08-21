/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 * The way I want to do dates (Dec 7, 2006) rev. (May 14, 2007)
 * If you find an error, or improvement, let me know: dev at ajas dot us
 *
 * I have not tested every date, but it seems to work for all the dates tested
 *
 * ajas.Date.magic()        - call this onblur, scrubs and validates
 * ajas.Date.parseMonth()   - returns which single monthname a string represents
 * ajas.Date.parseWeekday() - returns which single dayname a string represents
 * ajas.Date.parse()        - don't call this
 * ajas.Date.magic_keyup()  - call this on keyup, handles special keys
 * ajas.Date.aMonthNames
 * ajas.Date.aWeekdayNames
 *
 * The function cancelBubble() is found in ajas.event.js
 * The function arraySearch()  is found in ajas.util.js
 * The function arrayFilter()  is found in ajas.util.js
 *
 * based on:
 *  'Magic' date parsing, by Simon Willison (6th October 2003)
 *  http://simon.incutio.com/archive/2003/10/06/betterDateInput
 *****************************************************************************/
if("undefined" == typeof(ajas))ajas={"Date":{}};
ajas.Date=ajas.Date?ajas.Date:{};


ajas.Date.aMonthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
ajas.Date.aWeekdayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


// use this function for form feedback
ajas.Date.magic=function(oInput, bStrict, bAmerican) {
    // Set preferred defaults here.
    // bStrict=false will convert Jan 32 to Feb 1
    if(arguments.length < 2) var bStrict=true;
    // bAmerican=false will expect European date forms, where applicable
    if(arguments.length < 3) var bAmerican=true;
    
    var sLabel = oInput.id + 'Msg';
    oInput.className = oInput.className.replace(/ajas_date_error/g, '');
    try {
        if (oInput.value == '') {
            ajas._e(sLabel).innerHTML = bAmerican?'mm/dd/yyyy':'dd/mm/yyyy';
            return;
        }
        var oDate = ajas.Date.parse(oInput.value,bStrict,bAmerican);
        oInput.value = ajas.util.dateFormat(oDate,bAmerican?ajas.util.dateFormat.USA:ajas.util.dateFormat.EUR);
        // Human readable date
        ajas._e(sLabel).innerHTML = oDate.toDateString();
    } catch (e) {
        oInput.className += ' ajas_date_error';
        var message = e.message;
        // Fix for IE6 bug
        if (message.indexOf('is null or not an object') > -1) {
            message = 'Invalid date string';
        }
        ajas._e(sLabel).innerHTML = message;
    }
};

ajas.util.dateFormat=function(oDate,iForm){
    if(arguments.length < 2) var iForm = 0;
    if(arguments.length < 1) var oDate = new Date();
    
    switch(iForm){
        case ajas.util.dateFormat.ISO: //ISO
            return oDate.getFullYear() + '-' + (oDate.getMonth() + 1) + '-' + oDate.getDate();
        case ajas.util.dateFormat.USA: //USA
            return (oDate.getMonth() + 1) + '/' + oDate.getDate() + '/' + oDate.getFullYear();
        case ajas.util.dateFormat.EUR: //EUR
            return oDate.getDate() + '/' + (oDate.getMonth() + 1) + '/' + oDate.getFullYear();
        case ajas.util.dateFormat.STR: //STR
            return oDate.toString();
        default:
            return 'Invalid Format {0:ISO,1:USA,2:EUR,4:STR}';
    }
};
ajas.util.dateFormat.ISO=0;
ajas.util.dateFormat.USA=1;
ajas.util.dateFormat.EUR=2;
ajas.util.dateFormat.STR=4;


ajas.Date.magic_keyup=function(event, bStrict, bAmerican) {
    // Set preferred defaults here.
    // bStrict=false will convert Jan 32 to Feb 1
    if(arguments.length < 2) var bStrict=true;
    // bAmerican=false will expect European date forms, where applicable
    if(arguments.length < 3) var bAmerican=true;

    event=event||window.event;
    var oInput=event.target||event.srcElement;
    if (false && "" == oInput.value){
        oInput.value = ajas.util.dateFormat(new Date(),bAmerican?ajas.util.dateFormat.USA:ajas.util.dateFormat.EUR);
    } else {
        key = event.keyCode?event.keyCode:event.which;
        
        switch(key) {
        case 13: // enter
            oInput.blur();
            ajas.event.cancelBubble(event);
            return false;
            break;
        case 38: // up
            if (oInput.value == '') oInput.value='today';
            var oDate = ajas.Date.parse(oInput.value, bStrict, bAmerican);
            oDate.setDate(oDate.getDate() + 1);
            oInput.value = ajas.util.dateFormat(oDate,bAmerican?ajas.util.dateFormat.USA:ajas.util.dateFormat.EUR);

            break;
        case 40: // down
            if (oInput.value == '') oInput.value='today';
            var oDate = ajas.Date.parse(oInput.value, bStrict, bAmerican);
            oDate.setDate(oDate.getDate() - 1);
            oInput.value = ajas.util.dateFormat(oDate,bAmerican?ajas.util.dateFormat.USA:ajas.util.dateFormat.EUR);
            break;
        case 39: // right
            if (oInput.value != '') break;
            oInput.value='today'; 
            var oDate = ajas.Date.parse(oInput.value, bStrict, bAmerican);
            oInput.value = ajas.util.dateFormat(oDate,bAmerican?ajas.util.dateFormat.USA:ajas.util.dateFormat.EUR);
            break;
        }
    }
    return true;
};



ajas.Date.parse=function(sDate, bStrict, bAmerican) {
    if(arguments.length < 2) var bStrict=true;
    if(arguments.length < 3) var bAmerican=true;
    var aBits;
    var oDate = new Date();
    
    // Now
    if (aBits = /^now/i.exec(sDate)) {
        return oDate;
    }
    
    // Today
    if (aBits = /^tod(ay?)?$/i.exec(sDate)) {
        return oDate;
    }
    
    // Tomorrow
    if (aBits = new RegExp('^'+sDate,'i').test('tomorrow')) {
        oDate.setDate(oDate.getDate() + 1); 
        return oDate;
    }
    
    // Yesterday
    if (aBits = new RegExp('^'+sDate,'i').test('yesterday')) {
        oDate.setDate(oDate.getDate() - 1); 
        return oDate;
    }
    
    // nth
    if (aBits = /^(\d{1,2})(st|nd|rd|th)?$/i.exec(sDate)) {
        iMonth=oDate.getMonth();
        oDate.setDate(parseInt(aBits[1], 10));
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[1]+") days.");
        }
        return oDate;
    }

    // nth Month
    if (aBits = /^(\d{1,2})(?:st|nd|rd|th)? (\w+)$/i.exec(sDate)) {
        oDate.setDate(1);
        oDate.setMonth(iMonth=ajas.Date.parseMonth(aBits[2]));
        oDate.setDate(parseInt(aBits[1], 10));
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[1]+") days.");
        }
        return oDate;
    }

    // nth Month YYYY
    if (aBits = /^(\d{1,2})(?:st|nd|rd|th)? (\w+),? (\d{2,4})$/i.exec(sDate)) {
        oDate.setDate(1);
        var iYear=parseInt(aBits[3], 10);
        iYear = iYear < 70 ? iYear + 2000 : (iYear < 100 ? iYear + 1900 : ( iYear < 1000 ? iYear + 1000 : iYear) );
        oDate.setFullYear(iYear);
        oDate.setMonth(iMonth=ajas.Date.parseMonth(aBits[2]));
        oDate.setDate(parseInt(aBits[1], 10));
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[1]+") days.");
        }
        return oDate;
    }

    // Month nth
    if (aBits = /^(\w+) (\d{1,2})(?:st|nd|rd|th)?$/i.exec(sDate)) {
        oDate.setDate(1);
        oDate.setMonth(iMonth=ajas.Date.parseMonth(aBits[1]));
        oDate.setDate(parseInt(aBits[2], 10));
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[2]+") days.");
        }
        return oDate;
    }

    // Month nth YYYY
    if (aBits = /^(\w+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{2,4})$/i.exec(sDate)) {
        oDate.setDate(1);
        var iYear=parseInt(aBits[3], 10);
        iYear = iYear < 70 ? iYear + 2000 : (iYear < 100 ? iYear + 1900 : ( iYear < 1000 ? iYear + 1000 : iYear) );
        oDate.setFullYear(iYear);
        oDate.setMonth(iMonth=ajas.Date.parseMonth(aBits[1]));
        oDate.setDate(parseInt(aBits[2], 10));
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[2]+") days.");
        }
        return oDate;
    }

    // Tuesday - this is suspect due to varying expectations about implied next/last day
    if (aBits = /^(\w+)$/i.exec(sDate)) {
        var day = oDate.getDay();
        var newDay = ajas.Date.parseWeekday(aBits[1]);
        var addDays = newDay - day;
        oDate.setDate(oDate.getDate() + addDays);
        return oDate;
    }

    // Tuesday week - Australian way of saying a week from this coming Tuesday
    if (aBits = /^(\w+) week$/i.exec(sDate)) {
        var day = oDate.getDay();
        var newDay = ajas.Date.parseWeekday(aBits[1]);
        var addDays = newDay - day;
        if (newDay <= day) { // for coming [specified]day
            addDays += 7;
        }
        addDays += 7; // for the week after
        oDate.setDate(oDate.getDate() + addDays);
        return oDate;
    }

    // next Tuesday - this is suspect due to sometimes ambiguous meaning of "next"
    if (aBits = /^next? (\w+)$/i.exec(sDate)) {
        var day = oDate.getDay();
        var newDay = ajas.Date.parseWeekday(aBits[1]);
        var addDays = newDay - day;
        if (newDay <= day) {
            addDays += 7;
        }
        oDate.setDate(oDate.getDate() + addDays);
        return oDate;
    }

    // last Tuesday - this is suspect due to sometimes ambiguous meaning of "last"
    if (aBits = /^last? (\w+)$/i.exec(sDate)) {
        var day = oDate.getDay();
        var newDay = ajas.Date.parseWeekday(aBits[1]);
        var addDays = newDay - day;
        if (newDay >= day) {
            addDays -= 7;
        }
        oDate.setDate(oDate.getDate() + addDays);
        return oDate;
    }

    // mm/dd(/(cc)yy) (American style)
    // dd/mm(/(cc)yy) (European style) depends on bAmerican flag set to false
    if (aBits = /^(\d{1,2})[\/-](\d{1,2})([\/-](\d{2,4}))?$/.exec(sDate)) {
//        alert(ajas.util.arrayDump(aBits));
        if (!bAmerican) {
            var tmp=aBits[1];
            aBits[1]=aBits[2];
            aBits[2]=tmp;
        }
        oDate.setDate(1);
        if (aBits[4]) {
            var iYear=parseInt(aBits[4], 10);
            iYear = iYear < 70 ? iYear + 2000 : (iYear < 100 ? iYear + 1900 : ( iYear < 1000 ? iYear + 1000 : iYear) );
            oDate.setFullYear(iYear);
        }
        oDate.setMonth(iMonth=parseInt(aBits[1], 10) - 1); // Because months indexed from 0
        oDate.setDate(parseInt(aBits[2], 10));
        if (bStrict && iMonth >= 12) {
            throw new Error("Invalid month ("+(iMonth+1)+").");
        }
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[2]+") days.");
        }
        return oDate;
    }

    // yyyy-mm-dd (ISO style)
    if (aBits = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(sDate)) {
        oDate.setDate(1);
        var iYear=parseInt(aBits[1], 10);
        oDate.setFullYear(iYear);
        oDate.setMonth(iMonth=parseInt(aBits[2], 10) - 1); // Because months indexed from 0
        oDate.setDate(parseInt(aBits[3], 10));
        if (bStrict && iMonth >= 12) {
            throw new Error("Invalid month ("+(iMonth+1)+").");
        }
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[3]+") days.");
        }
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
//    throw new Error(oDate);
        return oDate;
    }
    
    
    // no date
    throw new Error("Enter a Valid Date.");
};

/* Takes a string, returns the index of the month matching that string, throws
   an error if 0 or more than 1 matches
*/
ajas.Date.parseMonth=function(sMonth) {
    var aMatches = ajas.util.arrayFilter(ajas.Date.aMonthNames, function(item) { 
        return new RegExp("^" + sMonth, "i").test(item);
    });
    if (aMatches.length == 0) {
        throw new Error("Invalid month string");
    }
    if (aMatches.length > 1) {
        throw new Error("Ambiguous month");
    }
    return ajas.util.arraySearch(ajas.Date.aMonthNames, aMatches[0]);
};

/* Same as parseMonth but for days of the week */
ajas.Date.parseWeekday=function(sWeekday) {
    var aMatches = ajas.util.arrayFilter(ajas.Date.aWeekdayNames, function(item) {
        return new RegExp("^" + sWeekday, "i").test(item);
    });
    if (aMatches.length == 0) {
        throw new Error("Invalid day string");
    }
    if (aMatches.length > 1) {
        throw new Error("Ambiguous weekday");
    }
    return ajas.util.arraySearch(ajas.Date.aWeekdayNames, aMatches[0]);
};



/*
    // mm/dd (American style) omitted year
    // dd/mm (European style) omitted year depends on bAmerican flag set to false
    if (aBits = /(\d{1,2})\/(\d{1,2})/.exec(sDate)) {
        if (!bAmerican) {
            var tmp=aBits[1];
            aBits[1]=aBits[2];
            aBits[2]=tmp;
        }
        oDate.setDate(1);
        oDate.setMonth(iMonth=parseInt(aBits[1], 10) - 1); // Because months indexed from 0
        oDate.setDate(parseInt(aBits[2], 10));
        if (bStrict && iMonth >= 12) {
            throw new Error("Invalid month ("+(iMonth+1)+").");
        }
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[2]+") days.");
        }
        return oDate;
    }
    // mm-dd-(cc)yy (American style) with dashes
    // dd-mm-(cc)yy (European style) with dashes depends on bAmerican flag set to false
    if (aBits = /(\d{1,2})-(\d{1,2})-(\d{2,4})/.exec(sDate)) {
        if (!bAmerican) {
            var tmp=aBits[1];
            aBits[1]=aBits[2];
            aBits[2]=tmp;
        }
        oDate.setDate(1);
        var iYear=parseInt(aBits[3], 10);
        iYear = iYear < 70 ? iYear + 2000 : (iYear < 100 ? iYear + 1900 : ( iYear < 1000 ? iYear + 1000 : iYear) );
        oDate.setFullYear(iYear);
        oDate.setMonth(iMonth=parseInt(aBits[1], 10) - 1); // Because months indexed from 0
        oDate.setDate(parseInt(aBits[2], 10));
        if (bStrict && iMonth >= 12) {
            throw new Error("Invalid month ("+(iMonth+1)+").");
        }
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[2]+") days.");
        }
        return oDate;
    }

    // mm-dd (American style) with dashes, omitted year
    // dd-mm (European style) with dashes, omitted year depends on bAmerican flag set to false
    if (aBits = /(\d{1,2})-(\d{1,2})/.exec(sDate)) {
        if (!bAmerican) {
            var tmp=aBits[1];
            aBits[1]=aBits[2];
            aBits[2]=tmp;
        }
        oDate.setDate(1);
        oDate.setMonth(iMonth=parseInt(aBits[1], 10) - 1); // Because months indexed from 0
        oDate.setDate(parseInt(aBits[2], 10));
        if (bStrict && iMonth >= 12) {
            throw new Error("Invalid month ("+(iMonth+1)+").");
        }
        if (bStrict && iMonth != oDate.getMonth()) {
            throw new Error("Too many ("+aBits[2]+") days.");
        }
        return oDate;
    }

*/