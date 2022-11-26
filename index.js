const fragmentShaderText = require("./shaders/fragment.glsl").default
const fragmentShader2Text = require("./shaders/fragment2.glsl").default
const vertexShaderText = require("./shaders/vertex.glsl").default
const vertexShader2Text = require("./shaders/vertex2.glsl").default
const util = require("./src/util")
const ui = require("./src/ui_util")
const GlobalTimer = require("./src/GlobalTimer")
const { EventBus, MidiTracker } = require("./src/eventBus")
const { runDummyEvents, makeMidiMessage } = require("./src/testEvents")
const { createGLBoilerplate, setUniforms, setupImage } = require("./src/boilerPlateHelpers")
const { WebMidi } = require("webmidi")

  // Some dummy textures to play with
const fImg = require("./src/img/f-texture.png")
const spriteImg = require("./src/img/sprite.png")

let overrides = {}

const globalTimer = new GlobalTimer()
const eventBus = new EventBus();
const midiTracker = new MidiTracker(eventBus, 8)

// We want an event where we start a timer based on the real existent time
// The midi clock --> eventbus must start the event, but it needs to tick in "real time"
// Todo : make this into a class?
const timers = {}
let last_time = 0;
const updateTimers = (timeElapsedSinceStart) => {
  const timeDelta = timeElapsedSinceStart - last_time 
  const keys = Object.keys(timers)
  if(keys.length > 0){
    keys.forEach(key =>{ 
      timers[key].value += timeDelta
      if(timers[key].type = "INC"){
        if(timers[key].value >= timers[key].runUntil){
          delete timers[key]
        }
      }
    })
  }
  last_time = timeElapsedSinceStart
}
const spawnTimer = (name, type="INC") => {
  console.log("Spawning", name)
  timers[name] = {
    timeStarted: globalTimer.getSecondsElapsed(),
    name,
    type,
    value: 0,
    runUntil: 10,
    hasRunFor: 0, 
  }
}


// Subscribe to events
eventBus.subscribe("nameEvent", (func, num) => {
  if(typeof func === "function"){
    func()
  } else {
    console.log("Why not func")
    debugger;
  }
});
eventBus.subscribe("nTicksTest", (func, num) => {
  console.log("N Ticks Test")
})
eventBus.subscribe("nuTimer", (func, num) => {
  func()
})

eventBus.subscribe("runNow", (func, num) => {
  func()
  spawnTimer("nu_time")

})

eventBus.subscribe("runOnce",(func) => {
  console.log("Spawning nu timer")
  spawnTimer("nu_time")
})

runDummyEvents(midiTracker)
// These values may be for the BSP and not universal
const MIDI_CLOCK_MSG = 248
const MIDI_STOP_MSG = 252


const onWebMidiEnabled = () => {
  const midiInput = WebMidi.getInputByName("loopMIDI Port")
  midiInput.addListener("midimessage", (e)=>{
    console.log(e)
    if(e.data[0] == MIDI_CLOCK_MSG ){
      midiTracker.tick()
    }
  })
}
WebMidi.enable()
  .then(onWebMidiEnabled)
  .catch(()=> console.log("Could not init webmidi"))
function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

const gl = util.setupCanvas();

const commonAttributeNames = ["a_position"]
const commonUniformNames = [
  {name: "u_color"        , setter: "uniform4fv" },
  {name: "u_resolution"   , setter: "uniform2fv"  },
  {name: "u_translation"  , setter: "uniform2fv" }, 
  {name: "u_rotation"     , setter: "uniform2fv" },
  {name: "u_scale"        , setter: "uniform2fv" },
  {name: "u_time"         , setter: "uniform1f"  }
]

const programTwoUniforms = [
  ...commonUniformNames, 
  {name: "u_texture"     , setter: "uniform2fv" }, 
  {name: "u_texRotation" , setter: "uniform2fv" }
]
const programTwoAttributes = [...commonAttributeNames, "a_texcoord"]

const glPipelines = {
  programOne:  createGLBoilerplate(gl,vertexShaderText, fragmentShaderText, commonUniformNames, commonAttributeNames),
  programTwo:  createGLBoilerplate(gl, vertexShader2Text, fragmentShader2Text, programTwoUniforms, programTwoAttributes)

}
console.log("Initialized GL Pipelines convenience", glPipelines)

function setRectangle(gl, x, y, width, height) {
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

function setTexCoords(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0,// x1, y1
      0.0, 0.0,// x2, y1
      0.0, 0.0,// x1, y2
      0.0, 0.0,// x1, y2
      0.0, 0.0,// x2, y1
      0.0, 0.0,// x2, y2
    ]),
    gl.STATIC_DRAW);
}

  // create a texture 
  let texture = gl.createTexture()
  setupImage(gl, spriteImg, texture)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // // Fill the texture with a 1x1 blue pixel 
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE,
  //   new Uint8Array([0, 0, 255])
  // )
  const setupVertexAttribBuffer = (gl, program, attribute, vertexConfig) =>{
    // turns on the generic vertex attribute array at the specified index 
    // into the list of attribute arrays. 
    gl.enableVertexAttribArray(program.attributes[attribute].location)
    // binds the buffer currently bound to gl.ARRAY_BUFFER to
    // a generic vertex attribute of the current vertex buffer object 
    // and specifies its layout. 
    gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers[attribute].location)

    gl.vertexAttribPointer(
      location,
      vertexConfig.size,
      vertexConfig.type,
      vertexConfig.normalize,
      vertexConfig.stride,
      vertexConfig.num_verts
    )
  }

function drawScene(){
  // Our Program Setup  
  const ui_values = ui.getValues()
  util.resizeCanvasToDisplaySize(gl.canvas)
  const vals = {
    u_time: timers?.nu_time?.value || 0,
    u_resolution: [gl.canvas.width, gl.canvas.height]
  }
  updateTimers(globalTimer.getSecondsElapsed())
  const config_vals = Object.assign({}, vals, ui_values, overrides)

  // GL Prep
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);

  const primitiveType = gl.TRIANGLES;  
  // You gotta enable the program before the textures 
  gl.useProgram(glPipelines.programTwo.program)
  gl.enableVertexAttribArray(glPipelines.programTwo.attributes.a_position.location)
  gl.bindBuffer(gl.ARRAY_BUFFER, glPipelines.programTwo.buffers.a_position.location)
  
  // TODO: Look at abstracting texture code better
  let uTexture = gl.getUniformLocation(glPipelines.programTwo.program, 'u_texture')
  if (!uTexture) {
    console.log("Faled to get USampler")
  }
  gl.uniform1i(uTexture, 0)
  setTexCoords(gl);

  setupVertexAttribBuffer(gl,
    glPipelines.programTwo, 'a_position', 
    {
      size      : 2,
      type      : gl.FLOAT,
      normalize : false,
      stride    : 0,
      num_verts : 0,
    }
  )
  
  setUniforms(gl, glPipelines.programTwo, {
    "u_time"        : {value: config_vals.u_time       , },
    "u_resolution"  : {value: config_vals.u_resolution , },
    "u_translation" : {value: config_vals.u_translation, },
    "u_rotation"    : {value: config_vals.u_rotation   , },
    "u_scale"       : {value: config_vals.u_scale      , },
    "u_color"       : {value: config_vals.u_color      , },
    "u_texRotation" : {value: config_vals.u_texRotation, },
  })

  setRectangle(gl, 0, 0, window.innerWidth, window.innerHeight)
  gl.drawArrays(primitiveType, 0, 6)

  // New Program who dis
  gl.useProgram(glPipelines.programOne.program)

  setupVertexAttribBuffer(gl,
    glPipelines.programOne, 'a_position', 
    {
      size : 2,
      type : gl.FLOAT,
      normalize : false,
      stride : 0,
      offset : 0,
    }
  )

  setUniforms(gl, glPipelines.programOne, {
    "u_time"        : {value: config_vals.u_time       , },
    "u_resolution"  : {value: config_vals.u_resolution , },
    "u_translation" : {value: config_vals.u_translation, },
    "u_rotation"    : {value: config_vals.u_rotation   , },
    "u_scale"       : {value: config_vals.u_scale      , },
    "u_color"       : {value: config_vals.u_color      , },
  })
  // Alpha setup
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);

  setRectangle( gl, 0, 0, window.innerWidth, window.innerHeight )
  gl.drawArrays(primitiveType, 0, 18);

}

// INIT 
ui.initUi(gl)

function draw(timestamp) {
  drawScene()
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
