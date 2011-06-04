/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 *                Functions for String manipulation
 *****************************************************************************/

if("undefined" == typeof(ajas))ajas={};
ajas.string=ajas.string?ajas.string:{};

//Phonetic Alphabet
ajas.string.aLpha={'A':'Alpha','B':'Bravo','C':'Charlie','D':'Delta',
    'E':'Echo','F':'Foxtrot','G':'Golf','H':'Hotel','I':'India','J':'Juliet',
    'K':'Kilo','L':'Lima','M':'Mike','N':'November','O':'Oscar','P':'Papa',
    'Q':'Quebec','R':'Romeo','S':'Sierra','T':'Tango','U':'Uniform',
    'V':'Victor','W':'Whiskey','X':'X-ray','Y':'Yankee','Z':'Zulu'};

//Return an array of counts for each letter in string, useful for pangram checking
ajas.string.alphaCount=function(ref) {
    var aCounts={'a':0,'b':0,'c':0,'d':0,'e':0,'f':0,'g':0,'h':0,'i':0,'j':0,'k':0,'l':0,'m':0,'n':0,'o':0,'p':0,'q':0,'r':0,'s':0,'t':0,'u':0,'v':0,'w':0,'x':0,'y':0,'z':0};
    var s=ref.value;
    for (var i=0;i<s.length;i++) {
        var j=s.charAt(i).toLowerCase();
        if(aCounts[j])aCounts[j]++;
    }
    return aCounts;
};

//convert an ascii string to to a binary string
ajas.string.ascii2binary=function(sA) {
    var a=sA.split('');
    for (i in a) {
        a[i]=ajas.string.padLeft(ajas.string.unparseNumber(
            a[i].charCodeAt(0),2),8,'0');
    }
    return a.join(' ');
};

//convert an ascii string to to a hex string
ajas.string.ascii2hex=function(sA) {
    var a=sA.split('');
    for (i in a) {
        a[i]=ajas.string.padLeft(ajas.string.unparseNumber(
            a[i].charCodeAt(0),16),2,'0');
    }
    return a.join(' ');
};

//convert a binary string to an ascii string
ajas.string.binary2ascii=function(sB) {
    var a=sB.split(' ');
    var sA='';
    for (i in a) {
        sA+=String.fromCharCode(ajas.string.parseNumber(a[i],2));
    }
    return sA;
};

//remove 'px' from the end of a string; for CSS; more useful in the prototype 
ajas.string.dpx=function(){return s.replace(/px$/,'');};

//convert a hex string to an ascii string
ajas.string.hex2ascii=function(sH) {
    var a=sH.split(' ');
    var sA='';
    for (i in a) {
        sA+=String.fromCharCode(ajas.string.parseNumber(a[i],16));
    }
    return sA;
};

//left trim
ajas.string.ltrim=function(s){return s.replace(/^\s\s*/, '');};

//array map for rot13
ajas.string.oROT13map={
    'a':'n','b':'o','c':'p','d':'q','e':'r','f':'s','g':'t','h':'u','i':'v','j':'w','k':'x','l':'y','m':'z',
    'n':'a','o':'b','p':'c','q':'d','r':'e','s':'f','t':'g','u':'h','v':'i','w':'j','x':'k','y':'l','z':'m',
    'A':'N','B':'O','C':'P','D':'Q','E':'R','F':'S','G':'T','H':'U','I':'V','J':'W','K':'X','L':'Y','M':'Z',
    'N':'A','O':'B','P':'C','Q':'D','R':'E','S':'F','T':'G','U':'H','V':'I','W':'J','X':'K','Y':'L','Z':'M'
    };

//pad a string to length
ajas.string.padLeft=function(s,l,p){
    if(arguments.length<3)p=' ';
    var q='',m=l-s.length;
    while(q.length<m)q+=p;
    return m>0?q.substr(0,m)+s:s;
};

//pad a string to length
ajas.string.padRight=function(s,l,p){
    if(arguments.length<3)p=' ';
    var q='',m=l-s.length;
    while(q.length<m)q+=p;
    return m>0?s+q.substr(0,m):s;
};

//parse string s to an int of radix r
ajas.string.parseNumber=function(s,r) {
    var a=0,m=1,t=0;
    for (var i=s.length-1;i>=0;i--) {
        t=ajas.string.sHex.indexOf(s.charAt(i));
        if(t>=r) return false;
        a+=m*t;
        m*=r;
    }
    return a;
};


ajas.string.reverse=function(){return s.split('').reverse().join('');};

//16.92 time score
//ROT13 aided by array based map; fastest, if you don't mind the map in memory
ajas.string.rot13=function(s){
    var c='';
    for(var i=0; i<s.length;i++){
        c+=ajas.string.aROT13map[s.charAt(i)]||s.charAt(i);
    }
    return c;
};

//21.23 time score
//ROT13 by traditional char value checking
ajas.string.rot13_if=function(s){
    var c='';
    var b;
    for(var i=0; i<s.length;i++){
        b=s.charCodeAt(i);
        if(((b>64)&&(b<78))||((b>96)&&(b<110))){
            b+=13;
        } else if (((b>77)&&(b<91))||((b>109)&&(b<123))) {
            b-=13;
        }
        c+=String.fromCharCode(b);
    }
    return c;
};

//40.86 time score
//ROT13 aided by regular expression replace; beautiful, but slow
ajas.string.rot13_re=function(s) {
    return s.replace(/[a-zA-Z]/g, function(c){
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};

//24.0 time score
//ROT13 aided by string based map; not bad, not great
ajas.string.rot13_sm=function(s){
    var a='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var b='nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM';
    var c='';
    for(var i=0;i<s.length;i++){
        c+=a.charAt(b.indexOf(s.charAt(i)))||s.charAt(i);
    }
    return c;
};

//right trim
ajas.string.rtrim=function(s){return s.replace(/\s\s*$/, '');};

//values used for Base32 encoding, in order of value from 0-31
ajas.string.sB32='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=';

//Characters used for Base64 encoding, in value order from 0-63
ajas.string.sB64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

//characters used for Hex numbers up to Base36 numbers
ajas.string.sHex='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';


ajas.string.trim=function(s){return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};

//create a string representation of int i in radix r
ajas.string.unparseNumber=function(i,r){
    var s='';
    while (i>0){
        s=ajas.string.sHex.charAt(i%r)+s;
        i=Math.floor(i/r);
    }
    return s;
};