/******************************************************************************
 * Project     : AJAS
 *                Asynchronus Javascript And Stuff
 * Created By  : LoneFry
 * License     : CC BY-NC-SA
 *                Creative Commons Attribution-NonCommercial-ShareAlike
 *                http://creativecommons.org/licenses/by-nc-sa/3.0/
 * Latest Ver  : https://github.com/LoneFry/AJAS
 *
 *                Functions for Matrix Math
 *****************************************************************************/

if("undefined" == typeof(ajas))ajas={};
ajas.matrix=ajas.matrix?ajas.matrix:{};

//returns the sum of two 4x4 matrices
ajas.matrix.add=function(m,n){
    return [
        m[0] +n[0], m[1] +n[1], m[2] +n[2] ,m[3] +n[3],
        m[4] +n[4], m[5] +n[5], m[6] +n[6] ,m[7] +n[7],
        m[8] +n[8], m[9] +n[9], m[10]+n[10],m[11]+n[11],
        m[12]+n[12],m[13]+n[13],m[14]+n[14],m[15]+n[15]
    ];
};


ajas.matrix.flip=function(m){
    return [m[0],m[4],m[8],m[12], m[1],m[5],m[9],m[13], 
        m[2],m[6],m[10],m[14], m[3],m[7],m[11],m[15]];
};

//returns the hadamard product of two 4x4 matrices
ajas.matrix.hadamard=function(m,n){
    return [
        m[0] *n[0], m[1] *n[1], m[2] *n[2] ,m[3] *n[3],
        m[4] *n[4], m[5] *n[5], m[6] *n[6] ,m[7] *n[7],
        m[8] *n[8], m[9] *n[9], m[10]*n[10],m[11]*n[11],
        m[12]*n[12],m[13]*n[13],m[14]*n[14],m[15]*n[15]
    ];
};


ajas.matrix.identity=function(){
    return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
};



//returns the product of two 4x4 matrices
/*
    M[1,1]=m[1,1]*n[1,1]+m[1,2]*n[2,1]+m[1,3]*n[3,1]+m[1,4]*n[4,1]
    M[1,2]=m[1,1]*n[1,2]+m[1,2]*n[2,2]+m[1,3]*n[3,2]+m[1,4]*n[4,2]
    M[1,3]=m[1,1]*n[1,3]+m[1,2]*n[2,3]+m[1,3]*n[3,3]+m[1,4]*n[4,3]
    M[1,4]=m[1,1]*n[1,4]+m[1,2]*n[2,4]+m[1,3]*n[3,4]+m[1,4]*n[4,4]

    M[2,1]=m[2,1]*n[1,1]+m[2,2]*n[2,1]+m[2,3]*n[3,1]+m[2,4]*n[4,1]
    M[2,2]=m[2,1]*n[1,2]+m[2,2]*n[2,2]+m[2,3]*n[3,2]+m[2,4]*n[4,2]
    M[2,3]=m[2,1]*n[1,3]+m[2,2]*n[2,3]+m[2,3]*n[3,3]+m[2,4]*n[4,3]
    M[2,4]=m[2,1]*n[1,4]+m[2,2]*n[2,4]+m[2,3]*n[3,4]+m[2,4]*n[4,4]

    M[3,1]=m[3,1]*n[1,1]+m[3,2]*n[2,1]+m[3,3]*n[3,1]+m[3,4]*n[4,1]
    M[3,2]=m[3,1]*n[1,2]+m[3,2]*n[2,2]+m[3,3]*n[3,2]+m[3,4]*n[4,2]
    M[3,3]=m[3,1]*n[1,3]+m[3,2]*n[2,3]+m[3,3]*n[3,3]+m[3,4]*n[4,3]
    M[3,4]=m[3,1]*n[1,4]+m[3,2]*n[2,4]+m[3,3]*n[3,4]+m[3,4]*n[4,4]

    M[4,1]=m[4,1]*n[1,1]+m[4,2]*n[2,1]+m[4,3]*n[3,1]+m[4,4]*n[4,1]
    M[4,2]=m[4,1]*n[1,2]+m[4,2]*n[2,2]+m[4,3]*n[3,2]+m[4,4]*n[4,2]
    M[4,3]=m[4,1]*n[1,3]+m[4,2]*n[2,3]+m[4,3]*n[3,3]+m[4,4]*n[4,3]
    M[4,4]=m[4,1]*n[1,4]+m[4,2]*n[2,4]+m[4,3]*n[3,4]+m[4,4]*n[4,4]
*/
ajas.matrix.multiply=function(m,n){
    return [
        m[0]*n[0]+m[4]*n[1]+m[8]*n[2]+m[12]*n[3],
        m[1]*n[0]+m[5]*n[1]+m[9]*n[2]+m[13]*n[3],
        m[2]*n[0]+m[6]*n[1]+m[10]*n[2]+m[14]*n[3],
        m[3]*n[0]+m[7]*n[1]+m[11]*n[2]+m[15]*n[3],
        m[0]*n[4]+m[4]*n[5]+m[8]*n[6]+m[12]*n[7],
        m[1]*n[4]+m[5]*n[5]+m[9]*n[6]+m[13]*n[7],
        m[2]*n[4]+m[6]*n[5]+m[10]*n[6]+m[14]*n[7],
        m[3]*n[4]+m[7]*n[5]+m[11]*n[6]+m[15]*n[7],
        m[0]*n[8]+m[4]*n[9]+m[8]*n[10]+m[12]*n[11],
        m[1]*n[8]+m[5]*n[9]+m[9]*n[10]+m[13]*n[11],
        m[2]*n[8]+m[6]*n[9]+m[10]*n[10]+m[14]*n[11],
        m[3]*n[8]+m[7]*n[9]+m[11]*n[10]+m[15]*n[11],
        m[0]*n[12]+m[4]*n[13]+m[8]*n[14]+m[12]*n[15],
        m[1]*n[12]+m[5]*n[13]+m[9]*n[14]+m[13]*n[15],
        m[2]*n[12]+m[6]*n[13]+m[10]*n[14]+m[14]*n[15],
        m[3]*n[12]+m[7]*n[13]+m[11]*n[14]+m[15]*n[15],
    ];
};

//basic orthogonal projection matrix
ajas.matrix.ortho=function(){
    return [1,0,0,0, 0,1,0,0, 0,0,0,0, 0,0,0,1];
};

//still trying to relearn this... function incomplete
ajas.matrix.perspective=function(fov, r, zNear, zFar) {
    var m=ajas.matrix.identity();
    var xLeft,xRight,yTop,yBottom;
    var t=Math.tan(ajas.math.degToRad(fov/2));
    
    xLeft=r*t*zNear;
    xRight=-xLeft;
    yBottom=t*zNear;
    yTop=-yBottom;
    
    m[0]=(-2*zNear)/(xRight-xLeft);
    m[5]=(-2*zNear)/(yTop-yBottom);
    //m[8]=(xRight+xLeft)/(xRight-xLeft);
    //m[9]=(yTop+yBottom)/(yTop-yBottom);
    m[10]=(zNear+zFar)/(zNear-zFar);
    m[11]=-1;
    m[14]=(-2*zNear*zFar)/(zNear-zFar);
    m[15]=0;
    
    return m;
};

//untested
ajas.matrix.project=function (p, m) {
    var np = new Array(4);

    var oow = 1 / p[3];
    np[0] = m[0] * p[0] * oow + m[12];
    np[1] = m[5] * p[1] * oow + m[13];
    np[2] = m[10] * p[2] * oow + m[14];
    np[3] = oow;
    
    return np;
};

//returns the product of one 4x4 matrix and a scalar
ajas.matrix.scale=function(m,s){
    return [
        m[0] *s,m[1] *s,m[2] *s,m[3] *s,m[4] *s,m[5] *s,m[6] *s,m[7] *s,
        m[8] *s,m[9] *s,m[10]*s,m[11]*s,m[12]*s,m[13]*s,m[14]*s,m[15]*s
    ];
};

//return a string representation of the matrix, optionally rounded
ajas.matrix.str=function(m,d){
    if(arguments.length<2) // no rounding requested
        return '['+m[0]+','+m[1]+','+m[2]+','+m[3]+', '
            +m[4]+','+m[5]+','+m[6]+','+m[7]+', '
            +m[8]+','+m[9]+','+m[10]+','+m[11]+', '
            +m[12]+','+m[13]+','+m[14]+','+m[15]+']';
    //if we're still here, let's round every number to requested precision
    var r=ajas.math.round;
    return '['+r(m[0],d)+','+r(m[1],d)+','+r(m[2],d)+','+r(m[3],d)+', '
        +r(m[4],d)+','+r(m[5],d)+','+r(m[6],d)+','+r(m[7],d)+', '
        +r(m[8],d)+','+r(m[9],d)+','+r(m[10],d)+','+r(m[11],d)+', '
        +r(m[12],d)+','+r(m[13],d)+','+r(m[14],d)+','+r(m[15],d)+']';
};


ajas.matrix.transform=function(v,m){
    return [
        m[0]*v[0]+m[4]*v[1]+m[8] *v[2]+m[12]*v[3],
        m[1]*v[0]+m[5]*v[1]+m[9] *v[2]+m[13]*v[3],
        m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]*v[3],
        m[3]*v[0]+m[7]*v[1]+m[11]*v[2]+m[15]*v[3]
    ];
};

//generates a view matrix for the given params
ajas.matrix.view=function(x, y, w, h) {
    return [w/2.0,0,0,0, 0,h/2.0,0,0, 0,0,0.5,0, w/2.0+x,h/2.0+y,0.5,1];
};
