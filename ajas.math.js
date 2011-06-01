ajas.math=ajas.math?ajas.math:{};

ajas.math.degToRad=function(deg){
    return Math.PI*deg/180.0;
};

ajas.math.radToDeg=function(rad){
    return 180.0*rad/Math.PI;
};

//add variable precision to the Math.round() method
//the substring call was needed to correct for 3/2=1.49999 style errors
ajas.math.round=function(i,d){ 
    if(!d){
        i=Math.round(i);
        if((''+i).indexOf('.')<0)return i;
        return (''+i).substring(0,(''+i).indexOf('.'));
    }
    i=Math.round(i*Math.pow(10,d))*Math.pow(10,0-d);
    if((''+i).indexOf('.')<0)return i;
    return (''+i).substring(0,(''+i).indexOf('.')+d+1);
};
