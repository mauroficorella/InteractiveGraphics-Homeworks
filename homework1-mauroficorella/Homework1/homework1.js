"use strict";

var canvas;
var gl;
var numVertices = 120;
var numChecks = 24;
var program;
var near = 0.3;
var far = 3.0;
var radius = 2.0;
var theta = 0.0; 
var phi = 0.0;
var  fovy = 50.0;
var  aspect = 1.0;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var dirLightPosition = vec4(1.0, 1.0, 1.0, 0.0 ); //last parameter set to 0 make this a directional light
var dirLightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var dirLightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

var spotLightPosition = vec4( 0.0, 0.0, 0.0, 1.0);
var spotLightAmbient = vec4( 0.2, 0.2, 0.2, 1.0 );
var spotLightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var spotLightDirection = vec4( 0.0, 0.0, -1.0, 1.0 );
var lCutOff = 2.5 * Math.PI/180.0;
var spotExponent = 80.0;

//pearl material
var materialAmbient = vec4(0.25, 0.20725, 0.20725, 0.922);
var materialDiffuse = vec4(1.0, 0.829, 0.829, 0.922);
var materialShininess = 11.264;

var tFlag = true;
var sFlag = false;
var nMatrix, nMatrixLoc;
var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var texCoordsArray = [];
var texture;

var texCoord = [
    //squares
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
    //parallelogram of type 1
    vec2(0, 0.25),
    vec2(0, 1),
    vec2(0.5, 0.75),
    vec2(0.5, 0),
    //parallelogram of type 2
    vec2(0, 0),
    vec2(0, 0.75),
    vec2(0.5, 1),
    vec2(0.5, 0.25),
    //rectangles
    vec2(0, 0),
    vec2(0, 1),
    vec2(0.5, 1),
    vec2(0.5, 0)
];

var vertices = [
    vec4(-0.5,-0.45,0.15,1.0),
    vec4(-0.5,0.45,0.15,1.0),
    vec4(-0.2,0.45,0.15,1.0),
    vec4(-0.2,-0.45,0.15,1.0),
    vec4(-0.2,0.05,0.15,1.0),
    vec4(0.0,-0.15,0.15,1.0),
    vec4(0.2,0.05,0.15,1.0),
    vec4(0.2,-0.45,0.15,1.0),
    vec4(0.5,-0.45,0.15,1.0),
    vec4(0.5,0.45,0.15,1.0),
    vec4(0.2,0.45,0.15,1.0),
    vec4(0.0,0.25,0.15,1.0),
    vec4(-0.5,0.45,-0.15,1.0),
    vec4(-0.2,0.45,-0.15,1.0),
    vec4(0.0,0.25,-0.15,1.0),
    vec4(0.2,0.45,-0.15,1.0),
    vec4(0.5,0.45,-0.15,1.0),
    vec4(0.5,-0.45,-0.15,1.0),
    vec4(0.2,-0.45,-0.15,1.0),
    vec4(-0.2,0.05,-0.15,1.0),
    vec4(-0.5,-0.45,-0.15,1.0),
    vec4(-0.2,-0.45,-0.15,1.0),
    vec4(0.2,0.05,-0.15,1.0),
    vec4(0.0,-0.15,-0.15,1.0)
];

//light brown
var vertexColors = [
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 ),
    vec4( 0.4, 0.1, 0.0, 1.0 )
];

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "uTexMap"), 0);
}

function square(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);
}

function parallelogram1(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[4]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[5]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[6]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[4]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[6]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[7]);
}

function parallelogram2(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[8]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[9]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[10]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[8]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[10]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[11]);
}

function rectangle(a, b, c, d) {
    var t1 = subtract(vertices[b], vertices[a]); 
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[12]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[13]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[14]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[12]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[14]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[15]);
}

function colorM()
{
    rectangle(1,0,3,2);
    parallelogram1(11,2,4,5);
    parallelogram2(10,11,5,6);
    rectangle(10,7,8,9);
    rectangle(9,8,17,16);
    square(16,15,10,9);
    rectangle(16,17,18,15);
    rectangle(22,18,7,6);
    rectangle(4,3,21,19);
    square(19,23,5,4);
    square(2,11,14,13);
    square(15,14,11,10);
    square(6,5,23,22);
    square(20,21,3,0);
    square(1,2,13,12);
    rectangle(12,20,0,1);
    square(8,7,18,17);
    parallelogram2(13,14,23,19);
    parallelogram1(14,15,22,23);
    rectangle(13,21,20,12);
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );
    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspect =  canvas.width/canvas.height;
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    colorM();
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);
    var dirAmbientProduct = mult(dirLightAmbient, materialAmbient);
    var dirDiffuseProduct = mult(dirLightDiffuse, materialDiffuse);
    var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");
    var image = document.getElementById("texImage");
    configureTexture(image);

    document.getElementById("zFarSlider").oninput = function(event) {
        far = event.target.value;
    };
    document.getElementById("zNearSlider").oninput = function(event) {
        near = event.target.value;
    };
    document.getElementById("radiusSlider").oninput = function(event) {
       radius = event.target.value;
    };
    document.getElementById("thetaSlider").oninput = function(event) {
        theta = event.target.value* Math.PI/180.0;
    };
    document.getElementById("phiSlider").oninput = function(event) {
        phi = event.target.value* Math.PI/180.0;
    };
    document.getElementById("aspectSlider").oninput = function(event) {
        aspect = event.target.value;
    };
    document.getElementById("fovSlider").oninput = function(event) {
        fovy = event.target.value;
    };
    document.getElementById("sPositionSliderX").oninput = function(event) {
        spotLightPosition[0] = event.target.value;
        gl.uniform4fv( gl.getUniformLocation(program,
            "spotLightPosition"),flatten(spotLightPosition) );
    };
    document.getElementById("sPositionSliderY").oninput = function(event) {
        spotLightPosition[1] = event.target.value;
        gl.uniform4fv( gl.getUniformLocation(program,
            "spotLightPosition"),flatten(spotLightPosition) );
    };
    document.getElementById("sPositionSliderZ").oninput = function(event) {
        spotLightPosition[2] = event.target.value;
        gl.uniform4fv( gl.getUniformLocation(program,
            "spotLightPosition"),flatten(spotLightPosition) );
    };
    document.getElementById("sDirectionSliderX").oninput = function(event) {
        spotLightDirection[0] = event.target.value;
        gl.uniform4fv( gl.getUniformLocation(program,
            "spotLightDirection"),flatten(spotLightDirection) );
    };
    document.getElementById("sDirectionSliderY").oninput = function(event) {
        spotLightDirection[1] = event.target.value;
        gl.uniform4fv( gl.getUniformLocation(program,
            "spotLightDirection"),flatten(spotLightDirection) );
    };
    document.getElementById("sCutoff").oninput = function(event) {
        lCutOff = event.target.value * Math.PI/180.0;
        gl.uniform1f( gl.getUniformLocation(program,
            "lCutOff"),lCutOff );
    };
    document.getElementById("sExp").oninput = function(event) {
        spotExponent = event.target.value;
        gl.uniform1f( gl.getUniformLocation(program,
            "spotExponent"),spotExponent );
    };
	document.getElementById("enableTexture").onclick = function(){
        tFlag = true;
        gl.uniform1f(gl.getUniformLocation(program,
            "tFlag"), tFlag);
    };
    document.getElementById("disableTexture").onclick = function(){
        tFlag = false;
        gl.uniform1f(gl.getUniformLocation(program,
            "tFlag"), tFlag);
    };
    document.getElementById("spotButton").onclick = function(){
        sFlag = !sFlag;
        gl.uniform1f(gl.getUniformLocation(program,
            "sFlag"), sFlag);
    };
    gl.uniform4fv( gl.getUniformLocation(program,
        "dirAmbientProduct"),flatten(dirAmbientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "spotAmbientProduct"),flatten(spotAmbientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "dirDiffuseProduct"),flatten(dirDiffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "spotDiffuseProduct"),flatten(spotDiffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "dirLightPosition"),flatten(dirLightPosition) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "spotLightPosition"),flatten(spotLightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
        "shininess"),materialShininess );
    gl.uniform1f( gl.getUniformLocation(program,
        "lCutOff"),lCutOff );
    gl.uniform1f( gl.getUniformLocation(program,
        "spotExponent"),spotExponent );
    gl.uniform4fv( gl.getUniformLocation(program,
        "spotLightDirection"),spotLightDirection ); 
    gl.uniform4fv(gl.getUniformLocation(program, "AM"), materialAmbient);
    gl.uniform1f(gl.getUniformLocation(program, "tFlag"), tFlag);

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    nMatrix =normalMatrix(modelViewMatrix, true );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimationFrame(render);
}