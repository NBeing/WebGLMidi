const resizeCanvasToDisplaySize = (canvas) => {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;
  }

function randomInt(range){
  return Math.floor(Math.random() * range);
}
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}
const setupCanvas = () => {
  let canvas = document.querySelector("#c")
  let gl = canvas.getContext("webgl")
  if(!gl){ throw new Error("No WebGl")}
  console.log("Successfully got context")
  return gl
}

function createShader(gl, type, source){
  let shader = gl.createShader(type);
  gl.shaderSource(shader,source);
  gl.compileShader(shader)
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if(success){
   return shader
  } 
  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}
function createProgram(gl, vertexShader, fragmentShader){
   let program = gl.createProgram();
   gl.attachShader(program, vertexShader)
   gl.attachShader(program, fragmentShader)
   gl.linkProgram(program)
   let success = gl.getProgramParameter(program, gl.LINK_STATUS)
   if(success){
       return program
   }
   console.log(gl.getProgramInfoLog(program))
   gl.deleteProgram(program)    
}
  module.exports = {
    resizeCanvasToDisplaySize,
    createProgram,
    createShader,
    randomInt,
    isPowerOf2,
    setupCanvas
  }