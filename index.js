const fragmentShaderText = require("./shaders/fragment.glsl").default
const fragmentShader2Text = require("./shaders/fragment2.glsl").default
const vertexShaderText = require("./shaders/vertex.glsl").default
const vertexShader2Text = require("./shaders/vertex2.glsl").default
const util = require("./src/util")
const ui = require("./src/ui_util")

// const fImg = require("./src/img/f-texture.png")
const fImg = require("./src/img/sprite.png")



let overrides = {}

// Midi API really only works on Chrome at this date
if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
} else {
    console.log('WebMIDI is not supported in this browser.');
}
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);


class Midi_Clock {
    ticks = 0;
    TICKS_PER_BEAT;
    BEATS_PER_MEASURE;
    // The midi clock sends 24 messages per quarter note
    constructor( _ticks_per_beat = 24, _beats_per_measure = 4){
        this.TICKS_PER_BEAT = _ticks_per_beat || this.TICKS_PER_BEAT
        this.BEATS_PER_MEASURE = _beats_per_measure || this.BEATS_PER_MEASURE
    }

    tick(){
        this.ticks = this.ticks + 1
    }
    getTick(){
        return this.ticks
    }
    setTick( _val ){
        this.ticks = val
    }
    reset(){
        this.ticks = 0
    }
    checkPulse(){
        return this.ticks == this.TICKS_PER_BEAT
    }
    checkMeasure(){
        return this.ticks == this.TICKS_PER_BEAT * this.BEATS_PER_MEASURE
    }
}
class Timer {
    startDate;
    startTime;
    constructor(){
        this.startDate = new Date();
        this.startTime = this.startDate.getTime();
    }

    getSecondsElapsed(startTime = this.startTime){
        var date_now = new Date ();
        var time_now = date_now.getTime ();
        var time_diff = time_now - startTime;
        var seconds_elapsed = time_diff / 1000;
        return ( seconds_elapsed ); 
    }
    getStartTime(){
        return this.startTime
    }
    setStartTime(val){
        this.startTime = val
    }
    getElapsedTime(){

    }

    resetTime(){
        this.startDate = new Date()
        this.startTime = this.startDate.getTime()
        return 0
    }
}
const Clock = new Midi_Clock()
const GlobalTimer = new Timer()

// These values may be for the BSP and not universal
const MIDI_CLOCK_MSG = 248
const MIDI_STOP_MSG = 252

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);

    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
    console.log(inputs, outputs)
    Array.from(midiAccess.inputs).forEach((input) => {
        input[1].onmidimessage = (msg) => { 
            
            if(msg.data.length == 1 && msg.data[0] == MIDI_CLOCK_MSG){
                if(Clock.checkMeasure()){
                    // console.log("Resetting! ")
                    overrides = { 
                        u_time: GlobalTimer.resetTime(), 
                    }
                    ui.setValue('texRotation', [Math.random() * 10,Math.random() * 10])
                    Clock.reset();
                }  else {
                    overrides = { }
                }
                Clock.tick()
            } else if (msg.data.length == 1 && msg.data[0] == MIDI_STOP_MSG) {
                Clock.reset();
        
            } else {
                // console.log(msg)

            }

        }
      })
    
}

function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
                noteOn(note, velocity);
            } else {
                noteOff(note);
            }
            break;
        case 128: // noteOff
            noteOff(note);
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}
const gl = util.setupCanvas();

let vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderText)
let fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText)

let vertexShader2 = util.createShader(gl, gl.VERTEX_SHADER, vertexShader2Text)
let fragmentShader2 = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShader2Text)


let program = util.createProgram(gl, vertexShader, fragmentShader)
let positionAttributeLocation = gl.getAttribLocation(program, "a_position")
let positionBuffer = gl.createBuffer()
let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
let colorUniformLocation = gl.getUniformLocation(program, "u_color")
let translationUniformLocation = gl.getUniformLocation(program, "u_translation")
let rotationLocation = gl.getUniformLocation(program, "u_rotation")
let scaleLocation = gl.getUniformLocation(program, "u_scale")
let timeLocation = gl.getUniformLocation(program, "u_time")

let program2 = util.createProgram(gl, vertexShader2, fragmentShader2)
let positionAttributeLocation2 = gl.getAttribLocation(program2, "a_position")
let positionBuffer2 = gl.createBuffer()
let resolutionUniformLocation2 = gl.getUniformLocation(program2, "u_resolution")
let colorUniformLocation2 = gl.getUniformLocation(program2, "u_color")
let translationUniformLocation2 = gl.getUniformLocation(program2, "u_translation")
let rotationLocation2 = gl.getUniformLocation(program2, "u_rotation")
let texRotationLocation2 = gl.getUniformLocation(program2, "u_texRotation")
let scaleLocation2 = gl.getUniformLocation(program2, "u_scale")
let timeLocation2 = gl.getUniformLocation(program2, "u_time")
let texcoordLocation = gl.getAttribLocation(program2, "a_texcoord")



function setRectangle(gl, x, y, width, height){
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;
    let positions = [
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(positions), 
        gl.STATIC_DRAW
    )
}

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

// let translation = [0, 0];
// let width = 100;
// let height = 30;
// let color = [Math.random(), Math.random(), Math.random(), 1];
// let rotation = [0,1]
// let texRotation = [0,1]
// let scale = [1.01,1.01]
// // drawScene();

// // Setup a ui.
// webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
// webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});
// webglLessonsUI.setupSlider("#rotation", {slide: updateRotation, min: -360, max: 360, precision: 2, step:0.01});
// webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -1, max: 1, step: 0.001, precision: 3});
// webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -1, max: 1, step: 0.001, precision: 3});
// webglLessonsUI.setupSlider("#texRotation", {slide: updateTexRotation, min: -360, max: 360, precision: 2, step:0.01});
// // const handleMouseMove = event => {
// //     translation[0] = event.clientX
// //     translation[1] = event.clientY
// //     // console.log("translation", translation)
// //     drawScene() 
// // }
// // document.onmousemove = handleMouseMove

// function updatePosition(index) {
//     return function(event, ui) {
//         translation[index] = ui.value;
//         drawScene();
//     };
// }
// function updateScale(index) {
//     return function(event, ui) {
//         scale[index] = ui.value;
//         drawScene();
//     };
// }
// function updateRotation(event, ui){
//     let angleInDegrees = 360 - ui.value;
//     let angleInRadians = angleInDegrees * Math.PI / 180;
//     rotation[0] = Math.sin(angleInRadians)
//     rotation[1] = Math.cos(angleInRadians)
//     drawScene()
// }
// function updateTexRotation(event, ui){
//     let angleInDegrees = 360 - ui.value;
//     let angleInRadians = angleInDegrees * Math.PI / 180;
//     texRotation[0] = Math.sin(angleInRadians)
//     texRotation[1] = Math.cos(angleInRadians)
//     drawScene()
// }
const getRandomSin = () => {
    return Math.sin(Math.random())
}
function setGeometry(gl, offsetX, offsetY, scale = 1.0 ) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0 *  scale  + offsetX, 0  * scale + offsetY,
            30*  scale  + offsetX, 0  * scale + offsetY,
            0*   scale  + offsetX, 150* scale + offsetY,
            0*   scale  + offsetX, 150* scale + offsetY,
            30*  scale  + offsetX, 0  * scale + offsetY,
            30*  scale  + offsetX, 150* scale + offsetY,
    
            // top rung
            30* scale + offsetX, 0*  scale + offsetY,
            100*scale + offsetX, 0*  scale + offsetY,
            30* scale + offsetX, 30* scale + offsetY,
            30* scale + offsetX, 30* scale + offsetY,
            100*scale + offsetX, 0*  scale + offsetY,
            100*scale + offsetX, 30* scale + offsetY,
    
            // middle rung
            30* scale + offsetX, 60* scale + offsetY,
            67* scale + offsetX, 60* scale + offsetY,
            30* scale + offsetX, 90* scale + offsetY,
            30* scale + offsetX, 90* scale + offsetY,
            67* scale + offsetX, 60* scale + offsetY,
            67* scale + offsetX, 90* scale + offsetY,
        ]),
        gl.STATIC_DRAW);
}
function setTexCoords(gl) {
    // x1, y1,
    // x2, y1,
    // x1, y2,
    // x1, y2,
    // x2, y1,
    // x2, y2
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // 0. , 1.,
            // 1. , 0.,
            // 1. , 1.,
            // 0. , -1.,
            // -1. , 0.,
            // -1. , -1.,
            0.0,0.0,
            0.0,0.0,
            0.0,0.0,
            0.0,0.0,
            0.0,0.0,
            0.0,0.0,
        ]),
        gl.STATIC_DRAW);
}

// create a texture 
let texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)
// Fill the texture with a 1x1 blue pixel 
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1,1,0,gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0,0,255])
)

// 
let image = new Image()
image.src = fImg
image.addEventListener('load', function(){
    console.log("Loaded", image)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    if (util.isPowerOf2(image.width) && util.isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
     } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
     }
    // gl.bindTexture(gl.TEXTURE_2D, null)
    window.setTimeout(()=>{
        console.log("Drawing again")
        // updateScale(0)({}, {value: 1.01})
        // updateScale(1)({}, {value: 1.01})
        // updateTexRotation({},{value: 1.01})
    }, 1000)
})
ui.initUi(gl)
function drawScene(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    const ui_values = ui.getValues()
    util.resizeCanvasToDisplaySize(gl.canvas)
    const vals = {
        u_time: GlobalTimer.getSecondsElapsed()
    }
    const config_vals = Object.assign({}, vals, ui_values, overrides )
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height)
    gl.clearColor(0,0,0,0)
    // gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const primitiveType = gl.TRIANGLES;


    gl.useProgram(program2)
    gl.enableVertexAttribArray(positionAttributeLocation2)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2)
    gl.enableVertexAttribArray(texcoordLocation)
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0,0)    

    let uTexture = gl.getUniformLocation(program2, 'u_texture')
    if(!uTexture){
        console.log("Faled to get USampler")
    }
    gl.uniform1i(uTexture,0)
    setTexCoords(gl);

    let size2 = 2
    let type2 = gl.FLOAT
    let normalize2 = false
    let stride2 = 0
    let offset2 = 0 
    gl.vertexAttribPointer(
        positionAttributeLocation2, 
        size2,
        type2,
        normalize2,
        stride2,
        offset2
    )
    gl.uniform2f(resolutionUniformLocation2, gl.canvas.width, gl.canvas.height)
    gl.uniform4fv(colorUniformLocation2, config_vals.color)
    gl.uniform2fv(translationUniformLocation2, config_vals.translation);
    gl.uniform2fv(rotationLocation2, config_vals.rotation)
    gl.uniform2fv(texRotationLocation2, config_vals.texRotation)

    gl.uniform2fv(scaleLocation2, config_vals.scale)
    gl.uniform1f(timeLocation2, config_vals.u_time)
    offset = 0
    count = 6
    // setGeometry(gl, 200, 150);
    setRectangle(
        // gl, 200, 200,util.randomInt(20),util.randomInt(20)
        gl, 0, 0, window.innerWidth, window.innerHeight
    )
    gl.drawArrays(primitiveType, offset, count)


    gl.useProgram(program)

    let size = 2
    let type = gl.FLOAT
    let normalize = false
    let stride = 0
    offset = 0 
    gl.vertexAttribPointer(
        positionAttributeLocation, 
        size,
        type,
        normalize,
        stride,
        offset
        )
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
    gl.uniform4fv(colorUniformLocation, config_vals.color)
    gl.uniform2fv(translationUniformLocation, config_vals.translation);
    gl.uniform2fv(rotationLocation, config_vals.rotation)
    gl.uniform2fv(scaleLocation, config_vals.scale)
    gl.uniform1f(timeLocation, config_vals.u_time)

    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    // gl.enable(gl.BLEND);
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    for ( let ii = 0; ii < 50; ++ii){
        setRectangle(
            // gl, 200, 200,util.randomInt(20),util.randomInt(20)
            gl, 0, 0, window.innerWidth,window.innerHeight
            )
        offset = 0;
        count = 18;
        // setGeometry(gl, 100, 150, 4.0);
        gl.drawArrays(primitiveType, offset, count);
    }
        
}
function draw(timestamp){
    drawScene()
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
