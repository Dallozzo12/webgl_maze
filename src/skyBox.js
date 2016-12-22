function getSkyProgramLocations(gl, skyProgram){
 // Get storage locations of attribute and uniform variables in program object for single color drawing
  skyProgram.a_Position = gl.getAttribLocation(skyProgram, 'a_Position');
  skyProgram.u_MvpMatrix = gl.getUniformLocation(skyProgram, 'u_MvpMatrix');
  skyProgram.u_CubeMap = gl.getUniformLocation(skyProgram, 'u_CubeMap');
  if (skyProgram.a_Position < 0 || !skyProgram.u_MvpMatrix || !skyProgram.u_CubeMap) { 
  console.log('Failed to get the storage location of attribute or uniform variable of skyProgram'); 
  return;
  }

  return skyProgram;
}


function initSkyCubeVertexBuffers(gl){
  var vertices = new Float32Array([   // Vertex coordinates
     50.0, 50.0, 50.0,  -50.0, 50.0, 50.0,  -50.0,-50.0, 50.0,   50.0,-50.0, 50.0,    // v0-v1-v2-v3 front
     50.0, 50.0, 50.0,   50.0,-50.0, 50.0,   50.0,-50.0,-50.0,   50.0, 50.0,-50.0,    // v0-v3-v4-v5 right
     50.0, 50.0, 50.0,   50.0, 50.0,-50.0,  -50.0, 50.0,-50.0,  -50.0, 50.0, 50.0,    // v0-v5-v6-v1 up
    -50.0, 50.0, 50.0,  -50.0, 50.0,-50.0,  -50.0,-50.0,-50.0,  -50.0,-50.0, 50.0,    // v1-v6-v7-v2 left
    -50.0,-50.0,-50.0,   50.0,-50.0,-50.0,   50.0,-50.0, 50.0,  -50.0,-50.0, 50.0,    // v7-v4-v3-v2 down
     50.0,-50.0,-50.0,  -50.0,-50.0,-50.0,  -50.0, 50.0,-50.0,   50.0, 50.0,-50.0     // v4-v7-v6-v5 back
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


  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  
  o.numIndices = indices.length;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return o;
}



function createCubeMap(gl, posx, negx, posy, negy, posz, negz) {
  var texture = gl.createTexture();
  loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_POSITIVE_X, posx);
  loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, negx);
  loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, posy);
  loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, negy);
  loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, posz);
  loadCubeFace(gl, texture, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, negz);

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

  return texture;
}
function loadCubeFace(gl, texture, face, path) {
  var imgdata = new Image();
  imgdata.onload = function () {
    setCubeFace(gl, texture, face, imgdata);
  }
  imgdata.src = path;
}

function setCubeFace(gl, texture, face, imgdata) {
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  //
  gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgdata);

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

function drawTexSkyBox(gl, program, o, texture) {
  gl.useProgram(program);

  //gl.uniform1i( this . skyBoxShader . uCubeMapLocation , 0) ;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  gl.depthMask(false);
  
  drawSkyBox(gl, program, o);

  gl.depthMask(true);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  

}

function drawSkyBox(gl, program, o){  
  gl.useProgram(program);
  g_modelMatrix.setIdentity(gl, program);

  //g_cameraMatrix.setTranslate(xPos,pyPos,zPos);
  g_cameraMatrix.setRotate(yaw, 0, 1, 0);
  g_cameraMatrix.rotate(pitch, 1, 0, 0);

  g_viewMatrix.setInverseOf(g_cameraMatrix);

  g_mvpMatrix.set(g_projMatrix).multiply(g_viewMatrix).multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw


}