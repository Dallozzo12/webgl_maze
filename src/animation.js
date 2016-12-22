function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var pitch = 0;
var pitchRate = 0;
var yaw = 0;
var yawRate = 0;
var xPos = 0.0;
var yPos = 1.4;
var zPos = 15.0;
var speed = 0;

function handleKeys() {
    if (currentlyPressedKeys[80]) {
        // P
        pitchRate = 0.05;
    } else if (currentlyPressedKeys[76]) {
        // L
        pitchRate = -0.05;
    } else {
        pitchRate = 0;
    }
    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        yawRate = 0.05;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        yawRate = -0.05;

    } else {
        yawRate = 0;
    }
    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        speed = 0.03;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        speed = -0.03;
    } else {
        speed = 0;
    }
}
var lastTime = 0;
    // Used to make us "jog" up and down as we move forward.
var joggingAngle = 0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        if (speed != 0) {
            xPos -= Math.sin(degToRad(yaw)) * speed * elapsed;
            zPos -= Math.cos(degToRad(yaw)) * speed * elapsed;
            joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
            yPos = Math.sin(degToRad(joggingAngle)) / 20 + 1.4;
            //console.log('animating');
        }
        yaw += yawRate * elapsed;
        pitch += pitchRate * elapsed;
        //setting up camera matrix
        
    }
    lastTime = timeNow;
}