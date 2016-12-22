// ProgramObject.js (c) 2012 matsuda and kanda
// Vertex shader for single color drawing
var SKYBOX_VSHADER_SOURCE = " \
  uniform mat4 u_MvpMatrix;\n\
  attribute vec3 a_Position ;\n\
  varying vec3 vpos ;\n\
  void main ( void )\n\
  {\n\
    vpos = normalize ( a_Position ) ;\n\
    gl_Position = u_MvpMatrix * vec4 (a_Position , 1.0);\n \
  }";

var SKYBOX_FSHADER_SOURCE = " \
  precision highp float ;\n\
  uniform samplerCube u_CubeMap; \n \
  varying vec3 vpos ;\n\
  void main( void )\n\
  {\n\
    vec3 color = textureCube(u_CubeMap, normalize(vpos)).rgb;\n \
    gl_FragColor = vec4(0.5*color, 1.0) ;\n \
  } ";
// Vertex shader for texture drawing
var TEXTURE_VSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'varying float v_NdotL;\n' +
  'varying vec2 v_TexCoord;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec3 v_Normal;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader for texture drawing
var TEXTURE_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'uniform vec3 u_TorchColor;\n' +     // Light color  
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'uniform mat4 u_CameraMatrix;\n' +
  'uniform vec3 u_TorchPosition;\n' +
  'varying vec2 v_TexCoord;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  '  vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +

  '  vec3 normal = normalize(v_Normal);\n' +
  
  //diffuse light from light source
  '  vec4 torchDirection = u_CameraMatrix * vec4(0.0,0.0,-1.0, 0.0);\n' +
  '  float r = distance(u_TorchPosition, v_Position);\n' +
  '  vec3 L = normalize(u_TorchPosition - v_Position);\n' +
  '  float LdotNDiffuse = dot(torchDirection.xyz, -L);\n' +
  '  if(LdotNDiffuse > 0.6) LdotNDiffuse = pow(LdotNDiffuse, 100.0);\n' +
  '  else LdotNDiffuse = 0.0;\n' +
  '	 float NdotLDiffuse = max(0.0, dot(normal, L))/(0.003*r*r);\n' +
  '  float diffuseCoef = LdotNDiffuse*NdotLDiffuse;\n' +
  '  if(diffuseCoef>0.7) diffuseCoef = 0.7;\n ' +
  '  vec3 diffuse =  diffuseCoef * u_TorchColor * color.rgb ;\n' +

  //ambient light
  '  vec3 ambient = 0.8 * u_AmbientLight * color.rgb;\n' +
  '  if(gl_FrontFacing){ gl_FragColor = vec4(diffuse + 0.2*ambient, color.a);}\n' +
  
  '  else {gl_FragColor = vec4(1.0,0.0,0.0,1.0);}\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  var skyProgram = createProgram(gl,SKYBOX_VSHADER_SOURCE, SKYBOX_FSHADER_SOURCE);
  var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
  
  if (!texProgram || !skyProgram) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //retrieve locations of shader variables
  skyProgram = getSkyProgramLocations(gl, skyProgram);
  texProgram = getTexProgramLocations(gl, texProgram);
  
  
  //lights in the scene, better to put in a function
  gl.useProgram(texProgram);
   // Set the light color (white)
  gl.uniform3f(texProgram.u_TorchColor, 1.0, 1.0, 1.0);

  gl.uniform3f(texProgram.u_AmbientLight , 1.0, 1.0, 1.0);

  var mazeWalls = initMazeVertexBuffers(gl);

  var halfFloorSideLength = 50.0;
  var floor = initFloorVertexBuffers(gl, halfFloorSideLength);
  if (!floor){
    console.log('Failed to set floor vertex information');
    return;
  }

  var skyCube = initSkyCubeVertexBuffers(gl);
  if (!skyCube){
    console.log('failed to set skyCube vertex information');
  }

  // Set texture
  var mazeWallTexture = init2DTexture(gl, texProgram, 'resources/wall.jpg');
  if (!mazeWallTexture) {
    console.log('Failed to intialize the cube texture.');
    return;
  }

  var floorTexture = init2DTexture(gl, texProgram, 'resources/floor.jpg');
  if (!floorTexture) {
    console.log('Failed to intialize the floor texture.');
    return;
  }

  var cubeMapTexture = createCubeMap(gl,
    'resources/cubemap/posx.jpg',
    'resources/cubemap/negx.jpg',
    'resources/cubemap/posy.jpg',
    'resources/cubemap/negy.jpg',
    'resources/cubemap/posz.jpg',
    'resources/cubemap/negz.jpg'
    )
  if(!cubeMapTexture){
    console.log('failed to initialize sky texture. ')
  }
  // Set the clear color and enable the depth test
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  g_projMatrix.setPerspective(50.0, canvas.width/canvas.height, 0.02, 200.0);

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  var tick = function() {
    window.requestAnimationFrame(tick, canvas);
  
    handleKeys();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers
    drawTexSkyBox(gl, skyProgram, skyCube, cubeMapTexture);
    drawTexFloor(gl, texProgram, floor, floorTexture);
   	drawTexMazeWalls(gl, texProgram, mazeWalls, mazeWallTexture);
  
    animate();
  };
  tick();
}



// Assign the buffer objects and enable the assignment
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function initArrayBufferForLaterUse(gl, data, num, type) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Keep the information necessary to assign to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
  var buffer = gl.createBuffer();　  // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

