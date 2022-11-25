const util = require("./util")

const createGLBoilerplate = (gl, vertexShaderText, fragmentShaderText, _uniforms, _attributes) => {
  const shaders = {
    vertex: util.createShader(gl, gl.VERTEX_SHADER, vertexShaderText),
    fragment: util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText)
  }

  const program = util.createProgram(gl, shaders.vertex, shaders.fragment)
  const uniforms = _uniforms.reduce((acc, cur) => {
    acc[cur.name] = {
      name: cur.name,
      setter: cur.setter,
      location: gl.getUniformLocation(program, cur.name)
    }
    return acc
  }, {})

  const buffers = _attributes.reduce((acc, cur) => {
    acc[cur] = {
      name: cur,
      location: gl.createBuffer()
    }
    return acc
  }, {})

  const attributes = _attributes.reduce((acc, cur) => {
    acc[cur] = {
      name: cur,
      location: gl.getAttribLocation(program, cur)
    }
    return acc
  }, {})

  return {
    program,
    shaders,
    buffers,
    uniforms,
    attributes,
  }
}

const setUniforms = (gl, programConfig, uniformNameToValue, ) => {
  const uniformMappingKeys = Object.keys(uniformNameToValue)
  uniformMappingKeys.forEach( mappingKey => {
    const glConfig = programConfig.uniforms[mappingKey]
    const uniformToValueMapping = uniformNameToValue[mappingKey]
    gl[glConfig.setter](glConfig.location, uniformToValueMapping.value )
  })
}
const setupImage = (gl, src, texture ) =>{
  let image = new Image()
  image.src = src
  image.addEventListener('load', function () {
    // console.log("Loaded Image", image)
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
    // Not sure why the tutorial mentions this, it unbinds the very texture we want to use?
    // gl.bindTexture(gl.TEXTURE_2D, null)
  })
  return image
}

module.exports = {
  createGLBoilerplate,
  setUniforms,
  setupImage
}