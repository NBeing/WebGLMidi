const values = {
    u_translation : [0, 0],
    width : 100,
    height : 30,
    u_color : [Math.random(), Math.random(), Math.random(), 1],
    u_rotation : [0,1],
    u_texRotation : [0,1],
    u_scale : [1.01,1.01],
}
// drawScene();

// Setup a ui.
const initUi = (gl) =>{
    webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#rotation", {slide: updateRotation, min: -360, max: 360, precision: 2, step:0.01});
    webglLessonsUI.setupSlider("#scaleX", {value: values.u_scale[0], slide: updateScale(0), min: -1, max: 1, step: 0.001, precision: 3});
    webglLessonsUI.setupSlider("#scaleY", {value: values.u_scale[1], slide: updateScale(1), min: -1, max: 1, step: 0.001, precision: 3});
    webglLessonsUI.setupSlider("#texRotation", {slide: updateTexRotation, min: -360, max: 360, precision: 2, step:0.01});
}
// const handleMouseMove = event => {
//     translation[0] = event.clientX
//     translation[1] = event.clientY
//     // console.log("translation", translation)
//     drawScene() 
// }
// document.onmousemove = handleMouseMove

function updatePosition(index) {
    return function(event, ui) {
        values.u_translation[index] = ui.value;
        // drawScene();
    };
}
function updateScale(index) {
    return function(event, ui) {
        values.u_scale[index] = ui.value;
        // drawScene();
    };
}
function updateRotation(event, ui){
    let angleInDegrees = 360 - ui.value;
    let angleInRadians = angleInDegrees * Math.PI / 180;
    values.u_rotation[0] = Math.sin(angleInRadians)
    values.u_rotation[1] = Math.cos(angleInRadians)
    // drawScene()
}
function updateTexRotation(event, ui){
    let angleInDegrees = 360 - ui.value;
    let angleInRadians = angleInDegrees * Math.PI / 180;
    values.u_texRotation[0] = Math.sin(angleInRadians)
    values.u_texRotation[1] = Math.cos(angleInRadians)
    // drawScene()
}

const getValues = () => {
    return values
}
const setValue = (key, value) => {
    return values[key] = value
}
module.exports = {
    getValues,
    initUi,
    setValue,
}