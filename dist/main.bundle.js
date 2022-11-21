/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./shaders/fragment.glsl":
/*!*******************************!*\
  !*** ./shaders/fragment.glsl ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;        \r\nuniform vec2 u_resolution;\r\nuniform vec2 u_mouse;\r\nuniform float u_time;\r\n\r\nfloat drawRect(vec2 st,  vec2 tr_offset, vec2 bl_offset){\r\n    // float size = 1.0 - _size;\r\n    // bottom-left\r\n    vec2 bl = vec2(0.0);\r\n    bl.x = step(bl_offset.x, st.x);\r\n    bl.y = step(bl_offset.y, st.y);\r\n    float pct = bl.x * bl.y;\r\n\r\n    // top-right\r\n    vec2 tr = vec2(0.0);\r\n    tr.x = step(tr_offset.x, 1.-st.x);\r\n    tr.y = step(tr_offset.y, 1.-st.y);\r\n\r\n    pct *= tr.x * tr.y;\r\n    return pct;\r\n}\r\nfloat drawRect2(\r\n    vec2 st,\r\n    float top, \r\n    float left,\r\n    float bottom,\r\n    float right\r\n){\r\n    vec2 bl = vec2(\r\n        step(left, st.x),\r\n        step(1. - bottom, st.y)\r\n    );\r\n    float pct = bl.x * bl.y;\r\n\r\n    vec2 tr = vec2(\r\n        step(1. - right, 1.-st.x),\r\n        step(top, 1.-st.y)\r\n    );\r\n\r\n    pct *= tr.x * tr.y;\r\n    return pct;\r\n}\r\nfloat drawRect3(\r\n    vec2 st,\r\n    float top, \r\n    float left,\r\n    float bottom,\r\n    float right\r\n){\r\n    float lerp = 0.01;\r\n    vec2 bl = vec2(\r\n        smoothstep(left, left + lerp, st.x) - smoothstep(left, left - lerp, st.x),\r\n        smoothstep(bottom, bottom + lerp, st.y) - smoothstep(bottom, bottom - lerp, st.y)\r\n    );\r\n    float pct = bl.x * bl.y;\r\n\r\n    vec2 tr = vec2(\r\n        smoothstep(right, right + .01, st.x) - smoothstep(right, right - lerp, st.x),\r\n        smoothstep(top, top + lerp, st.y) - smoothstep(top, top - lerp, st.y)\r\n\r\n    );\r\n\r\n    pct *= tr.x * tr.y;\r\n    return pct;\r\n}\r\n\r\nfloat drawRect4(\r\n    vec2 st,\r\n    float top, \r\n    float left,\r\n    float bottom,\r\n    float right\r\n){\r\n    float thiccness = 0.2;\r\n    vec2 bl = vec2(\r\n        step(left, st.x),\r\n        step(1. - bottom, st.y)\r\n    );\r\n    float pct = bl.x * bl.y;\r\n\r\n    vec2 tr = vec2(\r\n        step(1. - right, 1.-st.x),\r\n        step(top, 1.-st.y)\r\n    );\r\n\r\n    pct *= tr.x * tr.y;\r\n    return pct;\r\n}\r\n\r\nvoid main(){\r\n    vec2 st = gl_FragCoord.xy/u_resolution.xy;\r\n    float aspect = u_resolution.x / u_resolution.y;\r\n    st.x = st.x * aspect;\r\n    vec2 stcopy = st;\r\n    st = st * 100.0;\r\n    st = fract(st);\r\n    float pct  = drawRect2(\r\n        st,\r\n        0.0,\r\n        0.0,\r\n        1., //- abs(sin(u_time * 1.)),\r\n        1.\r\n    );\r\n\r\n    float pct2 = drawRect2(\r\n        st,\r\n        0.0,\r\n        0.0,\r\n        1.0 - abs(sin(u_time * 2.)),\r\n        1.\r\n    );\r\n    \r\n    vec2 translate = vec2(cos(u_time),sin(u_time));\r\n    float pct3 = smoothstep(0., 0.2, distance(stcopy + translate * .25, vec2(0.5, 0.5/aspect)));\r\n\r\n    vec2 translate2 = vec2(sin(u_time),sin(u_time));\r\n    float pct4 = smoothstep(\r\n        0., \r\n        0.2, \r\n        distance(stcopy + translate2 * .25, vec2(0.5))\r\n    );\r\n\r\n    vec2 translate3 = vec2(- sin(u_time * 1.5),  cos(u_time * 1.));\r\n    float pct5 = smoothstep(\r\n        0., \r\n        0.2,\r\n        distance(stcopy + translate3 * .25, vec2(0.5)));\r\n\r\n    vec2 translate4 = vec2(- sin(u_time * .8),  cos(u_time * 1.));\r\n    vec2 rings = stcopy;\r\n    rings = rings * 2. -1.;\r\n\r\n    float pct6 = smoothstep(\r\n        0., \r\n        0.2,\r\n        distance(\r\n            stcopy + translate4 * .25, \r\n            vec2(0.5)\r\n        )\r\n    );\r\n\r\n    vec2 translate5 = vec2(- sin(u_time * 1.),  cos(u_time * 1.));\r\n    float pct7 = smoothstep(0., 0.2,distance(stcopy + translate5 * .25, vec2(0.5)));\r\n    float pct8 = 1.;smoothstep(0., 0.99, distance(st, vec2(0.5)));\r\n\r\n    vec3 test  = vec3(pct) *  vec3(0.0, 0.4588, 0.3216);\r\n    vec3 test2 = vec3(pct2) *  vec3(0.2, st.y - 0.4, 0.4078);\r\n\r\n    vec3 bg = vec3(0.0353, 0.1412, 0.2353);\r\n    vec3 color = vec3(bg + (test + test2));\r\n    gl_FragColor = vec4(color * pct8 *(1.0 -(pct3 * pct4 * pct5 * pct6)), 1.0);\r\n}\r\n");

/***/ }),

/***/ "./shaders/vertex.glsl":
/*!*****************************!*\
  !*** ./shaders/vertex.glsl ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\r\nattribute vec2 a_position;\r\nuniform vec2 u_resolution;\r\nuniform vec2 u_translation;\r\nuniform vec2 u_rotation;\r\nuniform vec2 u_scale;\r\nvoid main(){\r\n    vec2 scaledPosition = a_position * u_scale;\r\n    vec2 rotatedPosition = vec2(\r\n        scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,\r\n        scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);\r\n    vec2 position = rotatedPosition + u_translation;\r\n    vec2 zeroToOne = position / u_resolution;\r\n    vec2 zeroToTwo = zeroToOne * 2.0;\r\n    vec2 clipSpace = zeroToTwo - 1.0;\r\n    gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);\r\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
const fragmentShaderText = (__webpack_require__(/*! ./shaders/fragment.glsl */ "./shaders/fragment.glsl")["default"])
const vertexShaderText = (__webpack_require__(/*! ./shaders/vertex.glsl */ "./shaders/vertex.glsl")["default"])

let canvas = document.querySelector("#c")
let gl = canvas.getContext("webgl")
if(!gl){ throw new Error("No WebGl")}
console.log("Successfully got context")

const startDate = new Date();
const startTime = startDate.getTime();

function seconds_elapsed (){
    var date_now = new Date ();
    var time_now = date_now.getTime ();
    var time_diff = time_now - startTime;
    var seconds_elapsed = time_diff / 1000;

    return ( seconds_elapsed ); 
}
function resizeCanvasToDisplaySize(canvas) {
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
var vertexShaderSource = vertexShaderText
var fragmentShaderSource = fragmentShaderText
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

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
let program = createProgram(gl, vertexShader, fragmentShader)
let positionAttributeLocation = gl.getAttribLocation(program, "a_position")
let positionBuffer = gl.createBuffer()
let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
let colorUniformLocation = gl.getUniformLocation(program, "u_color")
let translationUniformLocation = gl.getUniformLocation(program, "u_translation")
let rotationLocation = gl.getUniformLocation(program, "u_rotation")
let scaleLocation = gl.getUniformLocation(program, "u_scale")
let timeLocation = gl.getUniformLocation(program, "u_time")

function randomInt(range){
    return Math.floor(Math.random() * range);
}

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
setGeometry(gl);

let translation = [0, 0];
let width = 100;
let height = 30;
let color = [Math.random(), Math.random(), Math.random(), 1];
let rotation = [0,1]
let scale = [1,1]
drawScene();

// Setup a ui.
webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});
webglLessonsUI.setupSlider("#rotation", {slide: updateRotation, max: 360});
webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
// const handleMouseMove = event => {
//     translation[0] = event.clientX
//     translation[1] = event.clientY
//     // console.log("translation", translation)
//     drawScene() 
// }
// document.onmousemove = handleMouseMove

function updatePosition(index) {
    return function(event, ui) {
        translation[index] = ui.value;
        drawScene();
    };
}
function updateScale(index) {
    return function(event, ui) {
        scale[index] = ui.value;
        drawScene();
    };
}
function updateRotation(event, ui){
    let angleInDegrees = 360 - ui.value;
    let angleInRadians = angleInDegrees * Math.PI / 180;
    rotation[0] = Math.sin(angleInRadians)
    rotation[1] = Math.cos(angleInRadians)
    drawScene()
}
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,
    
            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,
    
            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW);
}
function drawScene(){
    resizeCanvasToDisplaySize(gl.canvas)
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height)
    gl.clearColor(0,0,0,0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    let size = 2
    let type = gl.FLOAT
    let normalize = false
    let stride = 0
    let offset = 0 
    gl.vertexAttribPointer(
        positionAttributeLocation, 
        size,
        type,
        normalize,
        stride,
        offset
        )
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
    gl.uniform4fv(colorUniformLocation, color)
    gl.uniform2fv(translationUniformLocation, translation);
    gl.uniform2fv(rotationLocation, rotation)
    gl.uniform2fv(scaleLocation, scale)
    gl.uniform1f(timeLocation, seconds_elapsed())
    // offset = 0
    // count = 18
    // gl.drawArrays(primitiveType, offset, count)
    for ( let ii = 0; ii < 50; ++ii){
    setRectangle(
        gl, randomInt(100), randomInt(100),randomInt(500),randomInt(500)
        // gl, 0, 0, window.innerWidth, window.innerHeight
    )
     // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    // var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}    
        
}
function draw(timestamp){
    drawScene()
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map