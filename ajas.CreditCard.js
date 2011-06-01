/******************************************************************************
 * http://ajas.us/
 * The way I want to do CreditCards (Apr 27, 2007) rev. (May 14, 2007)
 * If you find an error, or improvement, let me know: dev at ajas dot us
 * This file is free for use
 *
 * ajas.CreditCard.magic()   - call this onblur, scrubs and validates
 * ajas.CreditCard.validate()- call for true/false validation
 * ajas.CreditCard.parse()   - don't call this
 * ajas.CreditCard.infer()   - just because I could, has ambiguity 
 * ajas.CreditCard.aCards    - details for each card type to check 
 * 
 * based on: http://www.braemoor.co.uk/software/creditcard.shtml
 *****************************************************************************/
ajas.CreditCard=ajas.CreditCard?ajas.CreditCard:{};

// use this function for form feedback
ajas.CreditCard.magic=function(oInput, sType, bStrict) {
    // Set preferred defaults here.
    // bStrict=false will remove invalid characters
    // bStrict=true will fail on invalid characters
    if(arguments.length < 3) var bStrict=true;

    var sLabel = oInput.id + 'Msg';
    oInput.className = oInput.className.replace(/ajas_credit_error/g, '');
    try {
        if (oInput.value == '') {
            ajas._e(sLabel).innerHTML = 'Enter Credit Card';
            return;
        }
        var sCC = ajas.CreditCard.parse(oInput.value, sType, bStrict);
        ajas._e(sLabel).innerHTML = oInput.value = sCC;
    } catch (e) {
        oInput.className += ' ajas_credit_error';
        var message = e.message;
        // Fix for IE6 bug
        if (message.indexOf('is null or not an object') > -1) {
            message = 'Invalid Phone string';
        }
        ajas._e(sLabel).innerHTML = message;
    }
};

// define known valid card types
ajas.CreditCard.aCards={
    "Visa"        :{bChkDig:true,len:"13|16"   ,prefixes:"4"},
    "MasterCard"  :{bChkDig:true,len:"16"      ,prefixes:"51|52|53|54|55"},
    "DinersClub"  :{bChkDig:true,len:"14|16"   ,prefixes:"300|301|302|303|304|305|36|38|55"},
    "CarteBlanche":{bChkDig:true,len:"14"      ,prefixes:"300|301|302|303|304|305|36|38"},
    "AmEx"        :{bChkDig:true,len:"15"      ,prefixes:"34|37"},
    "Discover"    :{bChkDig:true,len:"16"      ,prefixes:"6011|650"},
    "JCB"         :{bChkDig:true,len:"15|16"   ,prefixes:"3|1800|2131"},
    "enRoute"     :{bChkDig:true,len:"15"      ,prefixes:"2014|2149"},
    "Solo"        :{bChkDig:true,len:"16|18|19",prefixes:"6334|6767"},
    "Switch"      :{bChkDig:true,len:"16|18|19",prefixes:"4903|4905|4911|4936|564182|633110|6333|6759"},
    "Maestro"     :{bChkDig:true,len:"16"      ,prefixes:"5020|6"},
    "VisaElectron":{bChkDig:true,len:"16"      ,prefixes:"417500|4917|4913"}
};


ajas.CreditCard.infer=function(sCC) {
    //strip non-digits
    sCC=sCC.replace(/[^\d]/g,'');

    var aCandidates = new Array();
    var i=0;
    
    //Find which cards' prefixes match supplied card
    for(var s in ajas.CreditCard.aCards) {
        if (new RegExp('^'+ajas.CreditCard.aCards[s].prefixes).test(sCC)) {
            aCandidates[i++]=s;
        }
    }
    
    if (aCandidates.length==0) return '[No Prefix Match]';
    var aCandidates2 = new Array();
    i=0;
    
    //Find which cards' lengths match remaining candidates
    for(var j in aCandidates) {
        if (new RegExp('^'+ajas.CreditCard.aCards[aCandidates[j]].len).test(sCC.length)) {
            aCandidates2[i++]=aCandidates[j];
        }
    }

    if (aCandidates2.length==0) return '[No Length Match]';
    var aCandidates = new Array();
    var bChk = false;
    
    //verify check-digit
    var iSum=0;
    for(var i=sCC.length-1,j=true;i>=0;i--,j=!j) {
        l=0;
        if (j) {
            iSum+=parseInt(sCC.charAt(i));
        } else { // add the sum of the digits
            if ((k=parseInt(sCC.charAt(i))) > 4) {
                iSum+=2*k-9;
            } else {
                iSum+=2*k;
            }
        }
    }
    if (iSum%10==0) {
        bChk=true;
    }
    
    i=0;
    
    // if the checkdigit fails, remove candidates that require it
    if (!bChk) {
        for(var j in aCandidates2) {
            if (!ajas.CreditCard.aCards[j].bChkDig) {
                aCandidates[i++]=aCandidates2[j];
            }
        }
    } else {
        aCandidates=aCandidates2;
    }

    if (aCandidates.length==0) return '[No Parity Match]';

    return aCandidates.join(',');
};


ajas.CreditCard.parse=function(sCC, sType, bStrict) {
    if(arguments.length < 3) var bStrict=true;

    if (false==bStrict) {
        //strip non-digits
        sCC=sCC.replace(/[^\d]/g,'');
    } else {
        //strip only spaces and dashes
        sCC=sCC.replace(/[\s\-]/g,'');
        
        // verify number is actually numeric
        if (!/^\d*$/.exec(sCC)) {
            throw new Error("Invalid Credit Card #");
        }
    }
    
    if (sCC.length == 0) {
        throw new Error("Enter Credit Card #");
    }

    //verify specified type is known valide
    if (!ajas.CreditCard.aCards[sType]) {
        throw new Error("Unsupported Card Type");
    }
    
    //verify specified number matches card type prefix
    if (!new RegExp('^'+ajas.CreditCard.aCards[sType].prefixes).test(sCC)) {
        throw new Error("Invalid "+sType+" #");
    }
    
    //verify specified number is of valid length for type
    if (!new RegExp('^'+ajas.CreditCard.aCards[sType].len).test(sCC.length)) {
        throw new Error("Invalid Number Length");
    }

    //verify check-digit, if card type specifies
    if (ajas.CreditCard.aCards[sType].bChkDig) {
        var iSum=0;
        for(var i=sCC.length-1,j=true;i>=0;i--,j=!j) {
            l=0;
            if (j) {
                iSum+=parseInt(sCC.charAt(i));
            } else { // add the sum of the digits
                if ((k=parseInt(sCC.charAt(i))) > 4) {
                    iSum+=2*k-9;
                } else {
                    iSum+=2*k;
                }
            }
        }
        if (iSum%10!=0) {
            throw new Error("Invalid CC (checksum)"+iSum);
        }
    }
    return sCC;
};

//use this function to get a quiet true/false response
ajas.CreditCard.validate=function(sCC, sType) {
    try {
        ajas.CreditCard.parse(sCC, sType, true); //bStrict=true
    } catch (e) {
        return false;
    }
    return true;
};
