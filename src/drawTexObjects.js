function initMazeVertexBuffers(gl) {
  //the total length of the wall will be double the number of units
  var mazeWalls = [];
  var xUnits = 20.0;
  var yUnits = 3.0;
  
  mazeWalls[0] = initCubeVertexBuffers(gl, xUnits, yUnits);
  mazeWalls[0].xUnits = xUnits;
  mazeWalls[0].yUnits = yUnits;

  xUnits = 20.0;
  yUnits = 3.0;
  
  mazeWalls[1] = initCubeVertexBuffers(gl, xUnits, yUnits);
  mazeWalls[1].xUnits = xUnits;
  mazeWalls[1].yUnits = yUnits;

  for(i=0; i < mazeWalls.length; i++){
    if (!mazeWalls[i]) {
      console.log('Failed to set the cube vertex information');
      return;
    }
  }
  return mazeWalls;

}

function initFloorVertexBuffers(gl, halfLength) {

  var vertices = new Float32Array([
    halfLength,0.0,halfLength,
    halfLength,0.0,-halfLength,
    -halfLength,0.0,halfLength,
    -halfLength,0.0,-halfLength,
    ]);

  var indices = new Uint8Array([
    1,2,0,
    3,2,1,
    ]);

  var normals = new Float32Array([
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    0.0,1.0,0.0,
    ]);
  halfLength = 0.5*halfLength;
  var texCoords = new Float32Array([   // Texture coordinates
     0.0, 2*halfLength,   2*halfLength, 2*halfLength,   0.0, 0.0,   2*halfLength, 0.0,    // v0-v1-v2-v3 front
  ]);

  var o = new Object();

  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;

}

function initCubeVertexBuffers(gl, xUnits, yUnits) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  //the effective shape of the face is double the xUnits and yUnits, 
  var vertices = new Float32Array([   // Vertex coordinates
     xUnits, yUnits, 1.0,  -xUnits, yUnits, 1.0,  -xUnits,-yUnits, 1.0,   xUnits,-yUnits, 1.0,    // v0-v1-v2-v3 front
     xUnits, yUnits, 1.0,   xUnits,-yUnits, 1.0,   xUnits,-yUnits,-1.0,   xUnits, yUnits,-1.0,    // v0-v3-v4-v5 right
     xUnits, yUnits, 1.0,   xUnits, yUnits,-1.0,  -xUnits, yUnits,-1.0,  -xUnits, yUnits, 1.0,    // v0-v5-v6-v1 up
    -xUnits, yUnits, 1.0,  -xUnits, yUnits,-1.0,  -xUnits,-yUnits,-1.0,  -xUnits,-yUnits, 1.0,    // v1-v6-v7-v2 left
    -xUnits,-yUnits,-1.0,   xUnits,-yUnits,-1.0,   xUnits,-yUnits, 1.0,  -xUnits,-yUnits, 1.0,    // v7-v4-v3-v2 down
     xUnits,-yUnits,-1.0,  -xUnits,-yUnits,-1.0,  -xUnits, yUnits,-1.0,   xUnits, yUnits,-1.0     // v4-v7-v6-v5 back
  ]);

  var normals = new Float32Array([   // Normal
     0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,     // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0      // v4-v7-v6-v5 back
  ]);

  xUnits = 0.5*xUnits;
  yUnits = 0.5*yUnits; 
  var texCoords = new Float32Array([   // Texture coordinates
     2*xUnits, 2*yUnits,   0.0, 2*yUnits,   0.0, 0.0,   2*xUnits, 0.0,    // v0-v1-v2-v3 front
     0.0, 2*yUnits,   0.0, 0.0,   2.0, 0.0,   2.0, 2*yUnits,    // v0-v3-v4-v5 right
     2*xUnits, 0.0,   2*xUnits, 2.0,   0.0, 2.0,   0.0, 0.0,    // v0-v5-v6-v1 up
     2.0, 2*yUnits,   0.0, 2*yUnits,   0.0, 0.0,   2.0, 0.0,    // v1-v6-v7-v2 left
     0.0, 0.0,   2*xUnits, 0.0,   2*xUnits, 2.0,   0.0, 2.0,    // v7-v4-v3-v2 down
     0.0, 0.0,   2*xUnits, 0.0,   2*xUnits, 2*yUnits,   0.0, 2*yUnits     // v4-v7-v6-v5 back
  ]);

  var indices = new Uint8Array([        // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  var o = new Object(); // Utilize Object to to return multiple buffer objects together

  // Write vertex information to buffer object
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
  o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}

function init2DTexture(gl, program, path) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return null;
  }
  var image = new Image();  // Create a image object
  if (!image) {
    console.log('Failed to create the image object');
    return null;
  }
  
  // Register the event handler to be called when image loading is completed
  image.onload = function() {
    // Write the image data to texture object
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
  };

  // Tell the browser to load an Image
  image.src = path;

  return texture;
}

function getTexProgramLocations(gl, texProgram){
  // Get storage locations of attribute and uniform variables in program object for texture drawing
  texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
  texProgram.a_Normal = gl.getAttribLocation(texProgram, 'a_Normal');
  texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
  texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
  texProgram.u_NormalMatrix = gl.getUniformLocation(texProgram, 'u_NormalMatrix');
  texProgram.u_ModelMatrix = gl.getUniformLocation(texProgram, 'u_ModelMatrix');
  texProgram.u_CameraMatrix = gl.getUniformLocation(texProgram, 'u_CameraMatrix');
  texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');
  texProgram.u_TorchColor = gl.getUniformLocation(texProgram, 'u_TorchColor');
  texProgram.u_AmbientLight = gl.getUniformLocation(texProgram, 'u_AmbientLight');
  texProgram.u_TorchPosition = gl.getUniformLocation(texProgram, 'u_TorchPosition');


  if (texProgram.a_Position < 0 || texProgram.a_Normal < 0 || texProgram.a_TexCoord < 0 ||
    !texProgram.u_MvpMatrix || !texProgram.u_NormalMatrix || !texProgram.u_ModelMatrix || 
    !texProgram.u_CameraMatrix || !texProgram.u_Sampler || !texProgram.u_TorchColor ||
    !texProgram.u_AmbientLight || !texProgram.u_TorchPosition) { 
    console.log('Failed to get the storage location of attribute or uniform variable'); 
    return;
  }

  return texProgram; 
}

function drawTexFloor(gl, program, o, texture) {
  gl.useProgram(program);   // Tell that this program object is used

  // Assign the buffer objects and enable the assignment
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer);    // Normal
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices

  // Bind texture object to texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  drawFloor(gl, program, o);

}


function drawFloor(gl, program, o){
  // Calculate a model matrix
  g_modelMatrix.setTranslate(0.0, 0.0, 0.0);
  //g_modelMatrix.scale(10,0.0,-10);
  g_cameraMatrix.setTranslate(xPos,yPos,zPos);
  g_cameraMatrix.rotate(yaw, 0, 1, 0);
  g_cameraMatrix.rotate(pitch, 1, 0, 0);
  g_viewMatrix.setInverseOf(g_cameraMatrix);

  g_mvpMatrix.set(g_projMatrix).multiply(g_viewMatrix).multiply(g_modelMatrix);
  // Calculate transformation matrix for normals and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  var lightDirection = new Vector3([xPos, yPos, zPos]);
  //lightDirection.normalize();
// Normalize
  gl.uniform3fv(program.u_TorchPosition, lightDirection.elements);
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
  gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.uniformMatrix4fv(program.u_CameraMatrix, false, g_cameraMatrix.elements);

  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw


}
function drawSolidCube(gl, program, o, x) {
  gl.useProgram(program);   // Tell that this program object is used

  // Assign the buffer objects and enable the assignment
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer); // Vertex coordinates
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer);   // Normal
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices

  drawCube(gl, program, o, x);   // Draw
}

function drawTexCuboid(gl, program, o, texture, x, y, z, planeAngle) {
  gl.useProgram(program);   // Tell that this program object is used

  // Assign the buffer objects and enable the assignment
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer);    // Normal
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices

  // Bind texture object to texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  drawCuboid(gl, program, o, x, y, z, planeAngle); // Draw
  //gl.bindTexture(gl.TEXTURE_2D, null);
}
// Coordinate transformation matrix
var g_cameraMatrix = new Matrix4();
var g_viewMatrix = new Matrix4();
var g_projMatrix = new Matrix4();
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function drawCuboid(gl, program, o, x, y, z, planeAngle) {
  // Calculate a model matrix
  g_modelMatrix.setTranslate(x, y, z);
  g_modelMatrix.rotate(planeAngle, 0.0, 1.0, 0.0);
  
  g_cameraMatrix.setTranslate(xPos,yPos,zPos);
  g_cameraMatrix.rotate(yaw, 0, 1, 0);
  g_cameraMatrix.rotate(pitch, 1, 0, 0);
  g_viewMatrix.setInverseOf(g_cameraMatrix);

  //generating modelViewProjectionMatrix and passing it to the uniform variable
  g_mvpMatrix.set(g_projMatrix).multiply(g_viewMatrix).multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.uniformMatrix4fv(program.u_ModelMatrix, false, g_modelMatrix.elements);
  gl.uniformMatrix4fv(program.u_CameraMatrix, false, g_cameraMatrix.elements);
  // Calculate transformation matrix for normals and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, g_normalMatrix.elements);
  gl.uniform3f(program.u_TorchPosition, xPos, yPos, zPos);

  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw
}

function drawTexMazeWalls(gl, program, mazeWallsArray, texture){
  //x,y,x coordinates are referred to center of mass

  //right external wall
  drawTexCuboid(gl, program, mazeWallsArray[0], texture, 19.0, mazeWallsArray[0].yUnits, 0.0, 90.0);
  //left external wall
  drawTexCuboid(gl, program, mazeWallsArray[0], texture, -19.0, mazeWallsArray[0].yUnits, 0.0, 90.0);
  //top extarnal wall
  drawTexCuboid(gl, program, mazeWallsArray[0], texture, 0.0, mazeWallsArray[0].yUnits, -20.0, 0.0);
  //bottom extarnal wall
  drawTexCuboid(gl, program, mazeWallsArray[0], texture, 0.0, mazeWallsArray[0].yUnits, 20.0, 0.0);

}




