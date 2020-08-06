"use strict";

var canvas;
var gl;
var program;
var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;
var texCoordsArray = []; //texture array regarding all the other components on the screen
var arrayHeadTextureCoordinates = []; //texture array regarding the head (with and without eyes)
var arrayNoseTextureCoordinates = []; //texture array regarding the muzzle (with and without nose)
var texture0;
var texture1;
var texture2;
var texture3;
var texture4;
var texture5;
var flagTexGrizzly = true;
var flagTexFace = true;
var flagTexTree = true;
var flagTexLog = true;
var flagTexNose = true;
var flagTexMeadow = true;
var count = 0;
var flagAnimazione = false;
var flagAndata = true;
var walkFlag = true;
var upFlag = true;
var downFlag = false;
var flagRotazioneOrizzontale = true;
var flagGoBack = false;
var flagArrivato = false;
var legFlag = true;
var startScratch = false;
var incremento_altezza = 0.1;
var incremento_gamba = 5;
var ascesa0 = true;
var discesa0 = false;
var ascesa1 = true;
var discesa1 = false;
var ascesa2 = true;
var discesa2 = false;
var ascesa3 = true;
var discesa3 = false;
var step = -20; //grizzly's starting position

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [ //this color is used only in the html's else, into the fragment shader
    vec4( 0.5, 0.3, 0.2, 1.0 ),
    vec4( 0.5, 0.3, 0.2, 1.0 ),
    vec4( 0.5, 0.3, 0.2, 1.0 ),
    vec4( 0.5, 0.3, 0.2, 1.0 ),
    vec4( 0.5, 0.3, 0.2, 1.0 ),
    vec4( 0.5, 0.3, 0.2, 1.0 ),
    vec4( 0.5, 0.3, 0.2, 1.0 ),
    vec4( 0.5, 0.3, 0.2, 1.0 )
];

var texCoord = [
    //texture coordinates regarding all the other components of grizzly and tree
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),

    //texture coordinates regarding head's face containing eyes
    vec2(0, 0),
    vec2(0, 0.5),
    vec2(1, 0.5),
    vec2(1, 0),

    //texture coordinates regarding head's faces without eyes
    vec2(0, 0.5),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0.5),

    //texture coordinates regarding muzzle's face containing nose
    vec2(0, 0),
    vec2(0, 0.5),
    vec2(1, 0.5),
    vec2(1, 0),

    //texture coordinates regarding muzzle's faces without nose
    vec2(0, 0.5),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0.5)
];

//TEXTURE CONFIGURATIONS
function configureTexture0 (i0) { //grizzly's fur texture
    texture0 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i0);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
}
function configureTexture1 (i1)  { //tree's foliage texture
    texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i1);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
}
function configureTexture2 (i2)  { //tree's log texture
    texture2 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i2);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
}
function configureTexture3 (i3)  { //grizzly's head texture (containing eyes)
    texture3 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i3);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture3"), 0);
}
function configureTexture4 (i4)  { //grizzly's muzzle texture (containing nose)
    texture4 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i4);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture4"), 0);
}
function configureTexture5 (i5)  { //ground's grass (meadow) texture
    texture5 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture5);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i5);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture5"), 0);
}

//GRIZZLY BEAR NODES
var torsoId = 0;
var torso1Id = 17; //this torso1Id has been added in order to make grizzly's torso rotating along another axis respect to torsoId
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var backLeftUpperLegId = 2;
var backLeftLowerLegId = 3;
var frontLeftUpperLegId = 4;
var frontLeftLowerLegId = 5;
var backRightUpperLegId = 6;
var backRightLowerLegId = 7;
var frontRightUpperLegId = 8;
var frontRightLowerLegId = 9;
var tailId = 11;
var ear1Id = 12;
var ear2Id = 13;
var faceId = 14; //this is muzzle's id
//TREE NODES
var logId = 15;
var foliageId = 16;
var meadowId = 18; //this is ground grass's id

//GRIZZLY BEAR NODES' DIMENSIONS
var torsoHeight = 9.75;
var torsoWidth = 19.5;
var backUpperLegHeight = 1.95;
var backLowerLegHeight = 1.95;
var backUpperLegWidth = 3.25;
var backLowerLegWidth = 3.25;
var frontUpperLegHeight = 1.95;
var frontLowerLegHeight = 1.95;
var frontUpperLegWidth = 3.25;
var frontLowerLegWidth = 3.25;
var headHeight = 5.525;
var headWidth = 5.525;
var tailHeight = 2.75;
var tailWidth = 1.75;
var earHeight = 1.95;
var earWidth = 1.95;
var faceWidth = 3.5;
var faceHeight = 3.5;
var altezzaTorso = frontUpperLegHeight+frontLowerLegHeight; 
var altezzaGambePosteriori = -(torsoWidth-frontLowerLegWidth)/2;
var incremento_altezza_gamba = 0.1;
//TREE NODES' DIMENSIONS
var logHeight = 35.75;
var logWidth = 5.2;
var foliageHeight = 20.5;
var foliageWidth = 35.5;
var meadowHeight = 10;
var meadowWidth = 120;

var numNodes = 19;
var numAngles = 19;
var angle = 0;

//GRIZZLY'S AND TREE'S ANGLES VALUES
var theta = [
    -90,                        // torso
    0,                          // head, head1 
    180,                        // back left upper leg
    0,                          // back left lower leg
    180,                        // front left upper leg
    0,                          // front left lower leg
    180,                        // back right upper leg
    0,                          // back right lower leg
    180,                        // front right upper leg
    0,                          // front right lower leg
    0,                          // head2
    0,                          // tail
    0,                          // ear1
    0,                          // ear2
    0,                          // faceId (muzzle)
    0,                          // log
    0,                          // foliage
    0,                          // torso1
    0                           // meadow (ground grass)
];

var numVertices = 24;
var stack = [];
var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
var colorsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4(); //grizzly's model matrix
    var t = mat4(); //tree's model matrix

    switch(Id) {

    //GRIZZLY'S NODES CASES
    case torsoId:
    case torso1Id:
        m = translate(step, altezzaTorso, 0.0);
        m = mult(m, rotate(theta[torsoId], vec3(0, 1, 0) ));
        m = mult(m, rotate(theta[torso1Id], vec3(1, 0, 0) )); //there is torso's rotation axis change
        figure[torsoId] = createNode( m, torsoFunc, null, headId );
        break;
    case headId:
    case head1Id:
    case head2Id:
        m = translate(0.0, torsoHeight/2, (torsoWidth+headWidth)/2);
	    m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)));
	    m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
        m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
        figure[headId] = createNode( m, headFunc, frontLeftUpperLegId, ear1Id);
        break;
    case ear1Id:
        m = translate((headWidth-earWidth)/2, headHeight, 0.0);
        m = mult(m, rotate(theta[ear1Id], vec3(1, 0, 0)));
        figure[ear1Id] = createNode(m, ear1Func, ear2Id, null); 
        break;
    case ear2Id:
        m = translate(-(headWidth-earWidth)/2, headHeight, 0.0);
        m = mult(m, rotate(theta[ear2Id], vec3(1, 0, 0)));
        figure[ear2Id] = createNode(m, ear2Func, faceId, null); 
        break;
    case faceId:
        m = translate(0.0, (headHeight-faceHeight-earHeight)*5, headWidth-faceWidth);
        m = mult(m, rotate(theta[faceId], vec3(1, 0, 0)));
        figure[faceId] = createNode(m, faceFunc, null, null);
    case frontLeftUpperLegId:
        m = translate((torsoWidth-frontLowerLegWidth)/2, 0.0, (torsoWidth-frontLowerLegWidth)/2);
        m = mult(m, rotate(theta[frontLeftUpperLegId], vec3(1, 0, 0)));
        figure[frontLeftUpperLegId] = createNode( m, frontLeftUpperLegFunc, frontRightUpperLegId , frontLeftLowerLegId );
        break;
    case frontRightUpperLegId:
        m = translate(-(torsoWidth-frontLowerLegWidth)/2, 0.0 , (torsoWidth-frontLowerLegWidth)/2);
        m = mult(m, rotate(theta[frontRightUpperLegId], vec3(1, 0, 0)));
        figure[frontRightUpperLegId] = createNode( m, frontRightUpperLegFunc, backLeftUpperLegId, frontRightLowerLegId );
        break; 
    case backLeftUpperLegId:
        m = translate((torsoWidth-frontLowerLegWidth)/2, 0.0 , altezzaGambePosteriori);
	    m = mult(m, rotate(theta[backLeftUpperLegId], vec3(1, 0, 0)));
        figure[backLeftUpperLegId] = createNode( m, backLeftUpperLegFunc, backRightUpperLegId, backLeftLowerLegId );
        break;
    case backRightUpperLegId:
        m = translate(-(torsoWidth-frontLowerLegWidth)/2, 0.0 , altezzaGambePosteriori);
        m = mult(m , rotate(theta[backRightUpperLegId], vec3(1, 0, 0)));
        figure[backRightUpperLegId] = createNode( m, backRightUpperLegFunc, tailId, backRightLowerLegId );
        break;
    case tailId:
        m = translate(0.0, torsoHeight/2, -(torsoWidth+tailWidth)/2);
        m = mult(m, rotate(theta[tailId], vec3(1, 0, 0)));
        figure[tailId] = createNode(m, tailFunc, null, null); 
        break;
    case backLeftLowerLegId:
        m = translate(0.0, backUpperLegHeight, 0.0);
	    m = mult(m, rotate(theta[backLeftLowerLegId], vec3(1, 0, 0)));
        figure[backLeftLowerLegId] = createNode( m, backLeftLowerLegFunc, null, null );
        break;
    case frontLeftLowerLegId:
        m = translate(0.0, frontUpperLegHeight, 0.0);
        m = mult(m, rotate(theta[frontLeftLowerLegId], vec3(1, 0, 0)));
        figure[frontLeftLowerLegId] = createNode( m, frontLeftLowerLegFunc, null, null );
        break;
    case backRightLowerLegId:
        m = translate(0.0, backUpperLegHeight, 0.0);
        m = mult(m, rotate(theta[backRightLowerLegId],vec3(1, 0, 0)));
        figure[backRightLowerLegId] = createNode( m, backRightLowerLegFunc, null, null );
        break;
    case frontRightLowerLegId:
        m = translate(0.0, frontUpperLegHeight, 0.0);
        m = mult(m, rotate(theta[frontRightLowerLegId], vec3(1, 0, 0)));
        figure[frontRightLowerLegId] = createNode( m, frontRightLowerLegFunc, null, null );
        break;

    //TREE'S NODES CASES
    case foliageId:
        t = translate(40.0, logHeight, 0.0);
        t = mult(t, rotate(theta[foliageId] , vec3(1,0,0)));
        figure[foliageId] = createNode(t, foliageFunc, null, logId);
        break;
    case logId:
        t = translate(0.0, -logHeight, 0.0);
        t = mult(t, rotate(theta[logId] , vec3(1,0,0)));
        figure[logId] = createNode(t, logFunc, meadowId, null);
        break;
    case meadowId:
        t = translate(-logWidth*2, -(logHeight+meadowHeight), 0.0);
        t = mult(t, rotate(theta[meadowId] , vec3(1,0,0)));
        figure[meadowId] = createNode(t, meadowFunc, null, null);
        break;
    }
}

function traverse(Id) {
   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
   modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

//GRIZZLY'S NODES FUNCTIONS
function torsoFunc() {
    var image0 = document.getElementById("texImage0"); //here i load only texture0, then i set the other flags to false in order to apply only that texture0 in html
    configureTexture0(image0);
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    flagTexTree = false; //all these flags set to false are needed only here because this is the father of all the other grizzly's nodes
    gl.uniform1f(gl.getUniformLocation(program, "flagTexTree"), flagTexTree);
    flagTexLog = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexLog"), flagTexLog);
    flagTexFace = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexFace"), flagTexFace);
    flagTexNose = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexNose"), flagTexNose);
    flagTexMeadow = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexMeadow"), flagTexMeadow);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function headFunc() {
    var image3 = document.getElementById("texImage3"); //here i load grizzly's head texture containing eyes
    configureTexture3(image3);
    flagTexGrizzly = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    flagTexFace = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexFace"), flagTexFace);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function backLeftUpperLegFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * backUpperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(backUpperLegWidth, backUpperLegHeight, backUpperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function backLeftLowerLegFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * backLowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(backLowerLegWidth, backLowerLegHeight, backLowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function frontLeftUpperLegFunc() {
    var image0 = document.getElementById("texImage0"); //this is the first brother of head in grizzly's hierarchy, so i need to reinitialize texture0 here in order to change it here and in the other brothers in order to have the correct texture shown
    configureTexture0(image0);
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * frontUpperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(frontUpperLegWidth, frontUpperLegHeight, frontUpperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function frontLeftLowerLegFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * frontLowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(frontLowerLegWidth, frontLowerLegHeight, frontLowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function  backRightUpperLegFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * backUpperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(backUpperLegWidth, backUpperLegHeight, backUpperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function backRightLowerLegFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * backLowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(backLowerLegWidth , backLowerLegHeight, backLowerLegWidth ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function frontRightUpperLegFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * frontUpperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(frontUpperLegWidth, frontUpperLegHeight, frontUpperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function frontRightLowerLegFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * frontLowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(frontLowerLegWidth , frontLowerLegHeight, frontLowerLegWidth ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function tailFunc() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function ear1Func() {
    var image0 = document.getElementById("texImage0"); //here i reload grizzly's fur texture because ear1 is the first son of head so i need to change texture in order to not show head's texture here
    configureTexture0(image0);
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * earHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(earWidth, earHeight, earWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function ear2Func() {
    flagTexGrizzly = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * earHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(earWidth, earHeight, earWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function faceFunc() { //muzzle function
    var image4 = document.getElementById("texImage4"); //here i load muzzle's texture containing nose
    configureTexture4(image4);
    flagTexNose = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexNose"), flagTexNose);
    flagTexGrizzly = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * faceHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(faceWidth, faceHeight, faceWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//TREE'S FUNCTIONS
function logFunc()  {
    var image2 = document.getElementById("texImage2"); //here i load tree's log texture in order to change it from father's (foliage) texture
    configureTexture2(image2);
    flagTexLog = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexLog"), flagTexLog);
    flagTexTree = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexTree"), flagTexTree);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * logHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(logWidth, logHeight, logWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function foliageFunc()  {
    var image1 = document.getElementById("texImage1"); //this is the father in tree's model, here i load tree's foliage texture setting it's flag to true and setting the other flags to false
    configureTexture1(image1);
    flagTexGrizzly = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexGrizzly"), flagTexGrizzly);
    flagTexFace = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexFace"), flagTexFace);
    flagTexNose = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexNose"), flagTexNose);
    flagTexTree = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexTree"), flagTexTree);
    flagTexLog = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexLog"), flagTexLog);
    flagTexMeadow = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexMeadow"), flagTexMeadow);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * foliageHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(foliageWidth, foliageHeight, foliageWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function meadowFunc()  { //this is log's brother, so i need to reload the new texture in order to change from log's texture
    var image5 = document.getElementById("texImage5"); 
    configureTexture5(image5);
    flagTexLog = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexLog"), flagTexLog);
    flagTexTree = false;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexTree"), flagTexTree);
    flagTexMeadow = true;
    gl.uniform1f(gl.getUniformLocation(program, "flagTexMeadow"), flagTexMeadow);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * meadowHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(meadowWidth, meadowHeight, meadowWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) { //all other figures' parts function
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]);
}
function eyeFunction(a, b, c, d) { //head's front part function (containing eyes)
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[4]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[5]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[6]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[7]);
}
function faceFunction(a, b, c, d) { //head's lateral parts function (without eyes)
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[8]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[9]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[10]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    arrayHeadTextureCoordinates.push(texCoord[11]);
}
function frontNoseFunction(a, b, c, d) { //muzzle's front part function (containing nose)
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[12]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[13]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[14]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[15]);
}
function sideNoseFunction(a, b, c, d) { //muzzle's lateral parts function (without nose)
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[16]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[17]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[18]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    arrayNoseTextureCoordinates.push(texCoord[19]);
}

function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    eyeFunction( 1, 0, 3, 2 ); //part of the head with eyes
    faceFunction( 2, 3, 7, 6 ); //part of the head without eyes
    faceFunction( 3, 0, 4, 7 ); //part of the head without eyes
    faceFunction( 6, 5, 1, 2 ); //part of the head without eyes
    faceFunction( 4, 5, 6, 7 ); //part of the head without eyes
    faceFunction( 5, 4, 0, 1 ); //part of the head without eyes

    frontNoseFunction( 1, 0, 3, 2 ); //part of the muzzle with nose
    sideNoseFunction( 2, 3, 7, 6 ); //part of the muzzle without nose
    sideNoseFunction( 3, 0, 4, 7 ); //part of the muzzle without nose
    sideNoseFunction( 6, 5, 1, 2 ); //part of the muzzle without nose
    sideNoseFunction( 4, 5, 6, 7 ); //part of the muzzle without nose
    sideNoseFunction( 5, 4, 0, 1 ); //part of the muzzle without nose
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST); //this is needed in order to show objects' depth
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program);
    instanceMatrix = mat4();
    projectionMatrix = ortho(-60.0, 60.0, -60.0, 60.0, -60.0, 60.0);
    modelViewMatrix = mat4();
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var tBuffer = gl.createBuffer(); //buffer for all the other textures
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    var headTextureBuffer = gl.createBuffer(); //grizzly's head texture buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, headTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayHeadTextureCoordinates), gl.STATIC_DRAW);
    var headTextureCoordLoc = gl.getAttribLocation(program, "hTexCoord");
    gl.vertexAttribPointer(headTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(headTextureCoordLoc);

    var noseTextureBuffer = gl.createBuffer(); //grizzly's muzzle texture buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, noseTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayNoseTextureCoordinates), gl.STATIC_DRAW);
    var noseTextureCoordLoc = gl.getAttribLocation(program, "nTexCoord");
    gl.vertexAttribPointer(noseTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(noseTextureCoordLoc);

    for(i=0; i<numNodes; i++) initNodes(i);

    document.getElementById("enableAnimation").onclick = function (event) { //when i click on this button on the screen, i set this flagAnimazione to true/false in order to start/stop animation
        flagAnimazione = !flagAnimazione;
    }

    render();
}

//ANIMAZIONE
function walkFunction() { //in this function i increase/decrease leg's thetas in order to make them moving in a realistic way
    //GRIZZLY'S WALK
    //ASCENT PHASE
    if (ascesa0) {
        theta[backLeftUpperLegId] += incremento_gamba;
        theta[backLeftLowerLegId] += incremento_gamba/4; //i increase/decrease lower legs' theta angle by a smaller value than upper legs' in order to make grizzly's knees bending
        if (theta[backLeftUpperLegId] == 220)  {
            ascesa0 = false; //i've used these flags in order to start/stop ascent and descent phases in a synchronized way
            discesa0 = true;
        }
    }
    if (ascesa1)    {
        theta[frontLeftUpperLegId] += incremento_gamba;
        theta[frontLeftLowerLegId] += incremento_gamba/4;
        if (theta[frontLeftUpperLegId] == 220)  {
            ascesa1 = false;
            discesa1 = true;
        }
    }
    if (ascesa2)    {
        theta[backRightUpperLegId] -= incremento_gamba;
        theta[backRightLowerLegId] -= incremento_gamba/4;
        if (theta[backRightUpperLegId] == 120)  {
            ascesa2 = false;
            discesa2 = true;
        }
    }
    if (ascesa3)    {
        theta[frontRightUpperLegId] -= incremento_gamba;
        theta[frontRightLowerLegId] -= incremento_gamba/4;
        if (theta[frontRightUpperLegId] == 120) {
            ascesa3 = false;
            discesa3 = true;
        }
    }

    //DESCENT PHASE
    if (discesa0)    {
        theta[backLeftUpperLegId] -= incremento_gamba;
        theta[backLeftLowerLegId] -= incremento_gamba/4;
        if (theta[backLeftUpperLegId] == 120)  {
            ascesa0 = true;
            discesa0 = false;
        }
    }
    if (discesa1)   {
        theta[frontLeftUpperLegId] -= incremento_gamba;
        theta[frontLeftLowerLegId] -= incremento_gamba/4;
        if (theta[frontLeftUpperLegId] == 120)  {
            ascesa1 = true;
            discesa1 = false;
        }
    }
    if (discesa2)   {
        theta[backRightUpperLegId] += incremento_gamba;
        theta[backRightLowerLegId] += incremento_gamba/4;
        if (theta[backRightUpperLegId] == 220)  {
            ascesa2 = true;
            discesa2 = false;
        }
    }
    if (discesa3)   {
        theta[frontRightUpperLegId] += incremento_gamba;
        theta[frontRightLowerLegId] += incremento_gamba/4;
        if (theta[frontRightUpperLegId] == 220)    {
            ascesa3 = true;
            discesa3 = false;
        }
    }

    //GRIZZLY'S TORSO ROTATION
    if (theta[torsoId] < 90 && step > 8 && flagRotazioneOrizzontale)    { //i've used this "&&" to let grizzly start rotating only when step > 10 and only when that flag is true
        theta[torsoId] += 5;
    }

    if (theta[torsoId] == 90 && flagAndata)   { //i used this flagAndata in order to not repeat this "if" when i reinvoke this function into the return phase
        flagRotazioneOrizzontale = false;
        theta[backRightUpperLegId] = 180;
        theta[backLeftUpperLegId] = 180;
    }

    for (i = 0; i < numNodes; i++) initNodes(i);

    return
}

function posizioneArrivoFunction() { //function that starts when grizzly arrives near tree's log and starts standing up to scratch against it
    //more precisely, here i make grizzly's legs angulation vary coherently with the fact that it stands on its rear legs
    if (theta[backLeftUpperLegId] > 90)   {
        theta[backLeftUpperLegId] -= 5;
    }
    if (theta[backRightUpperLegId] > 90)   {
        theta[backRightUpperLegId] -= 5;
    }
    if (theta[torso1Id] < 90)   { //here i let grizzly's torso stand up until it reaches 90 degrees, modifying torso1Id's angle
        theta[torso1Id] += 5;
        if (altezzaTorso < 11.5)    { //here i increase torso's height in order to make it show in a coherent way with the stand up phase
            altezzaTorso += 0.6;
        }
        console.log(altezzaTorso);
        if (theta[head1Id] > -30)   { //here i increase head's angle in order to make grizzly's head moving, coherently to the fact that it has started to stand up
            theta[head1Id] -= 1;
        }
    }

    theta[backLeftLowerLegId] = 0;
    
    theta[backRightLowerLegId] = 0;

    theta[frontLeftUpperLegId] = 180;
    theta[frontRightUpperLegId] = 180;

    if (step < 27.5)    { //here i increase step value in order to let grizzly go near the trunk during the stand up phase
        step += 0.35;
    }

    if (theta[backLeftUpperLegId] == 90 && theta[backRightUpperLegId] == 90 && theta[torso1Id] == 90)    { //after rear legs' angle and torso's angle reaches 90 value, i set legFlag to false and startScratch to true in order to stop legs' animation and start scratching phase
        legFlag = false;
        startScratch = true;
    }

    for (i = 0; i < numNodes; i++) initNodes(i);

    return
}

function posizioneFinaleRitornoFunction()   { //function that starts when grizzly returns to its starting position
    //more deeply, here, when grizzly arrives to its starting position, i let its legs return to them starting angulation
    if (theta[backLeftUpperLegId] > 180)   {
        theta[backLeftUpperLegId] -= incremento_gamba;
    }
    if (theta[backRightUpperLegId] < 180)   {
        theta[backRightUpperLegId] += incremento_gamba;
    }
    theta[backLeftLowerLegId] = 0;
    theta[backRightLowerLegId] = 0;
    if (theta[frontLeftUpperLegId] > 180)   {
        theta[frontLeftUpperLegId] -= incremento_gamba;
    }
    if (theta[frontRightUpperLegId] < 180)  {
        theta[frontRightUpperLegId] += incremento_gamba;
    }
    theta[frontLeftLowerLegId] = 0;
    theta[frontRightLowerLegId] = 0;

    for (i = 0; i < numNodes; i++) initNodes(i);

    if (theta[backLeftUpperLegId] == 180 && theta[backRightUpperLegId] == 180 && theta[frontLeftUpperLegId] == 180 && theta[frontRightUpperLegId] == 180)   { //here i set flagArrivato to false in order to stop legs' animation
        flagArrivato = false;
    }

    return
}

function scratchFunction() { //function that lets the grizzly start scratching against the tree
    //here, until count is equal to 10, i let the bear start scratching against the tree by increasing/decreasing grizzly's torso height
    if (count <= 10) {
        if (upFlag) {
            altezzaTorso += incremento_altezza; 
            altezzaGambePosteriori -= incremento_altezza_gamba; //i also decrease/increase grizzly's legs height in order to let them stay in a coherent position during the scratching phase  
            if (altezzaTorso > 12.9)   {
                downFlag = true; //i've used these flags in order to synchronize scratching ascent and descent phases
                upFlag = false;
                count += 1;
            }
        }
        if (downFlag)   {
            altezzaTorso -= incremento_altezza; 
            altezzaGambePosteriori += incremento_altezza_gamba;
            if (altezzaTorso < 11.9)   {
                upFlag = true;
                downFlag = false;
                count += 1;
            }
        }
    }

    //finally i bring the grizzly down to its ground position (four-legged) by decreasing torso1Id's angle until it reaches 0 value
    else   {
        upFlag = false;
        downFlag = false;
        altezzaGambePosteriori = -(torsoWidth-frontLowerLegWidth)/2;
        if (theta[head1Id] < 0) { //here i decrease head's angle in order to make grizzly's head return to its original position because now the grizzly is on its original ground position
            theta[head1Id] += 1;
        }
        if (theta[torso1Id] > 0) {
            theta[torso1Id] -= 5;
            altezzaTorso -= 0.5;
            if (theta[backLeftUpperLegId] < 180)   { //here i reset back legs' angulation because now the bear doesn't stand up anymore
                theta[backLeftUpperLegId] += 10;
            }
            if (theta[backRightUpperLegId] < 180)   {
                theta[backRightUpperLegId] += 10;
            }
            if (step > 24.5)  {
                step -= 0.35;
            }
        }
        if (theta[torso1Id] == 0)   {
            flagGoBack = true; //here, when the grizzly returned to its ground position (torso1's angle = 0), i set this flag to true so it can start the return phase to its starting position 
            startScratch = false; //i set this flag to false in order to stop definitively scratching phase
        }
    }

    for (i = 0; i < numNodes; i++) initNodes(i);

    return
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    traverse(torsoId);
    traverse(foliageId);

    if (flagAnimazione) { //if this flag is true it means that i've clicked on the button on the screen, so it starts grizzly's walking animation increasing its position by 0.35 at a time 
        if (step < 22 && walkFlag)    { //i use this walkFlag in order to let the grizzly walk in this first phase only if this flag is set on true
            walkFunction();
            step += 0.35; 
        }
        if (step >= 22) { //when the step variable reaches the value 22, grizzly starts doing stand up phase and then scratching phase, using those flags to coordinate those operations in the correct order
            walkFlag = false; //here i set this to false because now the grizzly has stopped to walk forward, and now there are the stand up and scratching phases
            if (legFlag)    {
                posizioneArrivoFunction();
            }
            if (startScratch)   {
                scratchFunction();
            }
        }
        if (step > -20 && flagGoBack) { //here, until the step variable doesn't reach the value -20 (starting value) and, at the same time, flagGoBack is true, the grizzly starts returning back to its start position decreasing its position by a 0.35 decrease at time
            flagAndata = false;
            walkFunction();
            step -= 0.35;
        }
        if (step <= -20 && flagGoBack)    { //when the grizzly reaches final position, i set flagArrivato to true
            flagArrivato = true;
        }  
        if (flagArrivato)    {
            posizioneFinaleRitornoFunction(); //with this flagArrivato set to true, this function let grizzly's leg angles return to their starting values
            flagGoBack = false; //now i can set this flag to false in order to finally stop the whole animation
        }
    }
    requestAnimationFrame(render);
}