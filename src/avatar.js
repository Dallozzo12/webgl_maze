var g_baseBuffer = null;     // Buffer object for a base
var g_arm1Buffer = null;     // Buffer object for arm1
var g_arm2Buffer = null;     // Buffer object for arm2
var g_palmBuffer = null;     // Buffer object for a palm
var g_fingerBuffer = null;   // Buffer object for fingers

function initAvatarVertexBuffers(gl){
  // Vertex coordinate (prepare coordinates of cuboids for all segments)
  var vertices_foot = new Float32Array([ // Foot(2x1x3)
     1.0, 1.0, 1.5, -1.0, 1.0, 1.5, -1.0, 0.0, 1.5,  1.0, 0.0, 1.5, // v0-v1-v2-v3 front
     1.0, 1.0, 1.5,  1.0, 0.0, 1.5,  1.0, 0.0,-1.5,  1.0, 1.0,-1.5, // v0-v3-v4-v5 right
     1.0, 1.0, 1.5,  1.0, 1.0,-1.5, -1.0, 1.0,-1.5, -1.0, 1.0, 1.5, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.5, -1.0, 1.0,-1.5, -1.0, 0.0,-1.5, -1.0, 0.0, 1.5, // v1-v6-v7-v2 left
    -1.0, 0.0,-1.5,  1.0, 0.0,-1.5,  1.0, 0.0, 1.5, -1.0, 0.0, 1.5, // v7-v4-v3-v2 down
     1.0, 0.0,-1.5, -1.0, 0.0,-1.5, -1.0, 1.0,-1.5,  1.0, 1.0,-1.5  // v4-v7-v6-v5 back
  ]);

  var vertices_body = new Float32Array([  // Body(5x7x5)
     2.5, 7.0, 2.5, -2.5, 7.0, 2.5, -2.5,  0.0, 2.5,  2.5,  0.0, 2.5, // v0-v1-v2-v3 front
     2.5, 7.0, 2.5,  2.5,  0.0, 2.5,  2.5,  0.0,-2.5,  2.5, 7.0,-2.5, // v0-v3-v4-v5 right
     2.5, 7.0, 2.5,  2.5, 7.0,-2.5, -2.5, 7.0,-2.5, -2.5, 7.0, 2.5, // v0-v5-v6-v1 up
    -2.5, 7.0, 2.5, -2.5, 7.0,-2.5, -2.5,  0.0,-2.5, -2.5,  0.0, 2.5, // v1-v6-v7-v2 left
    -2.5,  0.0,-2.5,  2.5,  0.0,-2.5,  2.5,  0.0, 2.5, -2.5,  0.0, 2.5, // v7-v4-v3-v2 down
     2.5,  0.0,-2.5, -2.5,  0.0,-2.5, -2.5, 7.0,-2.5,  2.5, 7.0,-2.5  // v4-v7-v6-v5 back
  ]);

  var vertices_halfLeg = new Float32Array([  // halfLeg(2x4x2)
     1.0, 4.0, 1.0, -1.0, 4.0, 1.0, -1.0,  0.0, 1.0,  1.0,  0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 4.0, 1.0,  1.0,  0.0, 1.0,  1.0,  0.0,-1.0,  1.0, 4.0,-1.0, // v0-v3-v4-v5 right
     1.0, 4.0, 1.0,  1.0, 4.0,-1.0, -1.0, 4.0,-1.0, -1.0, 4.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 4.0, 1.0, -1.0, 4.0,-1.0, -1.0,  0.0,-1.0, -1.0,  0.0, 1.0, // v1-v6-v7-v2 left
    -1.0,  0.0,-1.0,  1.0,  0.0,-1.0,  1.0,  0.0, 1.0, -1.0,  0.0, 1.0, // v7-v4-v3-v2 down
     1.0,  0.0,-1.0, -1.0,  0.0,-1.0, -1.0, 4.0,-1.0,  1.0, 4.0,-1.0  // v4-v7-v6-v5 back
  ]);

  var vertices_arm = new Float32Array([  // arm(2x8x2)
     1.0, 8.0, 1.0, -1.0, 8.0, 1.0, -1.0, 0.0, 1.0,  1.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 8.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0,-1.0,  1.0, 8.0,-1.0, // v0-v3-v4-v5 right
     1.0, 8.0, 1.0,  1.0, 8.0,-1.0, -1.0, 8.0,-1.0, -1.0, 8.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 8.0, 1.0, -1.0, 8.0,-1.0, -1.0, 0.0,-1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
    -1.0, 0.0,-1.0,  1.0, 0.0,-1.0,  1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
     1.0, 0.0,-1.0, -1.0, 0.0,-1.0, -1.0, 8.0,-1.0,  1.0, 8.0,-1.0  // v4-v7-v6-v5 back
  ]);

  var vertices_head = new Float32Array([  // head(3x3x3)
     1.5, 3.0, 1.5, -1.5, 3.0, 1.5, -1.5, 0.0, 1.5,  1.5, 0.0, 1.5, // v0-v1-v2-v3 front
     1.5, 3.0, 1.5,  1.5, 0.0, 1.5,  1.5, 0.0,-1.5,  1.5, 3.0,-1.5, // v0-v3-v4-v5 right
     1.5, 3.0, 1.5,  1.5, 3.0,-1.5, -1.5, 3.0,-1.5, -1.5, 3.0, 1.5, // v0-v5-v6-v1 up
    -1.5, 3.0, 1.5, -1.5, 3.0,-1.5, -1.5, 0.0,-1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
    -1.5, 0.0,-1.5,  1.5, 0.0,-1.5,  1.5, 0.0, 1.5, -1.5, 0.0, 1.5, // v7-v4-v3-v2 down
     1.5, 0.0,-1.5, -1.5, 0.0,-1.5, -1.5, 3.0,-1.5,  1.5, 3.0,-1.5  // v4-v7-v6-v5 back
  ]);
  
  var vertices_neck = new Float32Array([  // head(2x2x2)
     1.0, 2.0, 1.0, -1.0, 2.0, 1.0, -1.0, 0.0, 1.0,  1.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 2.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0,-1.0,  1.0, 2.0,-1.0, // v0-v3-v4-v5 right
     1.0, 2.0, 1.0,  1.0, 2.0,-1.0, -1.0, 2.0,-1.0, -1.0, 2.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 2.0, 1.0, -1.0, 2.0,-1.0, -1.0, 0.0,-1.0, -1.0, 0.0, 1.0, // v1-v6-v7-v2 left
    -1.0, 0.0,-1.0,  1.0, 0.0,-1.0,  1.0, 0.0, 1.0, -1.0, 0.0, 1.0, // v7-v4-v3-v2 down
     1.0, 0.0,-1.0, -1.0, 0.0,-1.0, -1.0, 2.0,-1.0,  1.0, 2.0,-1.0  // v4-v7-v6-v5 back
  ]);
  // Normal
  var normals = new Float32Array([
     0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write coords to buffers, but don't assign to attribute variables
  g_footBuffer = initArrayBufferForLaterUse(gl, vertices_foot, 3, gl.FLOAT);
  g_bodyBuffer = initArrayBufferForLaterUse(gl, vertices_body, 3, gl.FLOAT);
  g_halfLegBuffer = initArrayBufferForLaterUse(gl, vertices_halfLeg, 3, gl.FLOAT);
  g_armBuffer = initArrayBufferForLaterUse(gl, vertices_arm, 3, gl.FLOAT);
  g_headBuffer = initArrayBufferForLaterUse(gl, vertices_head, 3, gl.FLOAT);
  g_neckBuffer = initArrayBufferForLaterUse(gl, vertices_neck, 3, gl.FLOAT);
  if (!g_footBuffer || !g_bodyBuffer || !g_halfLegBuffer || 
    !g_armBuffer || !g_headBuffer || !g_neckBuffer) return -1;

  // Write normals to a buffer, assign it to a_Normal and enable it
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
