/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 *                Functions for Vector Math
 *****************************************************************************/

if("undefined" == typeof(ajas))ajas={"vector":{}};
ajas.vector=ajas.vector?ajas.vector:{};

ajas.vector.add=function(v,w){
    return [v[0]+w[0],v[1]+w[1],v[2]+w[2],1];
};


ajas.vector.copy=function(v){
    return [v[0],v[1],v[2],v[3]];
};


ajas.vector.cross=function(v,w){
    return [(v[1]*w[2])-(v[2]*w[1]),
            (v[2]*w[0])-(v[0]*w[2]),
            (v[0]*w[1])-(v[1]*w[0]),
            1];
};


ajas.vector.dot=function(v,w){
    return v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
};


ajas.vector.getLength=function(v){
    return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
};


ajas.vector=ajas.vector?ajas.vector:{};


ajas.vector.reflect=function(v,vNorm){
    var vRes=ajas.vector.copy(vNorm);
    vRes=ajas.vector.setLength(vRes,2.0*ajas.vector.dot(v,vNorm));
    return ajas.vector.sub(vRes,v);
};

//Rotate on X
ajas.vector.rotateX=function(v,a){
    var c=Math.cos(a);
    var s=Math.sin(a);
    return [
        v[0],
        v[1]*c-v[2]*s,
        v[2]*c+v[1]*s,
        v[3]
    ];
};

//Rotate on Y
ajas.vector.rotateY=function(v,a){
    var c=Math.cos(a);
    var s=Math.sin(a);
    return [
        v[0]*c+v[2]*s,
        v[1],
        v[2]*c-v[0]*s,
        v[3]
    ];
};

//Rotate on Z
ajas.vector.rotateZ=function(v,a){
    var c=Math.cos(a);
    var s=Math.sin(a);
    return [
        v[0]*c-v[1]*s,
        v[1]*c+v[0]*s,
        v[2],
        v[3]
    ];
};


ajas.vector.scale=function(v,d){
    return [v[0]*d,v[1]*d,v[2]*d,1];
};


ajas.vector.setLength=function(v,fLen){
    var l=ajas.vector.getLength(v);
    if (0==fLen||0==l){
        return [0,0,0,1];
    } else {
        var fac=fLen/l;
        return [v[0]*fac,v[1]*fac,v[2]*fac,1];
    }
};


ajas.vector.str=function(v,d){
    if(arguments.length<2)return '['+v[0]+','+v[1]+','+v[2]+','+v[3]+']';
    return '['+ajas.math.round(v[0],d)+','+ajas.math.round(v[1],d)+','
        +ajas.math.round(v[2],d)+','+ajas.math.round(v[3],d)+']';
};


ajas.vector.sub=function(v,w){
    return [v[0]-w[0],v[1]-w[1],v[2]-w[2],1];
};
