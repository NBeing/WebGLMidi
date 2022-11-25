precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform vec4 u_color;

void main(){
//   vec2 st = gl_FragCoord.xy/u_resolution.xy;
//   st.x *= u_resolution.x/u_resolution.y;
//   vec3 color = vec3(0.0);
//   float d = 0.0;

//   // Remap the space to -1. to 1.
// //   st = (st * 2.) -1.;
//   st = st * abs(sin(u_time / 2.))-.3;

//   // Make the distance field
// //   d = length( abs(st)-(abs(sin(u_time / 4.))) );
//   d = length( abs(st) - .3);
// //   d = length( min(abs(st)-.3,0.) );
// //   d = length( max(abs(st)-.3,0.) );

//   // Visualize the distance field
//   gl_FragColor = vec4(
//         vec3(fract(d*10.0)) + vec3(clamp(sin(u_time),0.1,0.5), 0.2,0.3),
//         1.0
//     );
  vec2 st = gl_FragCoord.xy;
  gl_FragColor = texture2D(u_texture, v_texcoord + 
  vec2(
    sin(st.y / 15. + u_time * 3.) * 0.1 * u_time,
    // sin(st.x / 15. + u_time * 3.) * 0.001 )
    st.y)
  );
  gl_FragColor = vec4(
    gl_FragColor.r + u_color.r,
    gl_FragColor.g + u_color.g,
    gl_FragColor.b + u_color.b,
    gl_FragColor.a + u_color.a
  );
  // if (gl_FragColor.r == 1.0){
  //   gl_FragColor = vec4(0.,0.,0.,0.);
  // }
  // gl_FragColor = vec4(
  //   gl_FragColor.x, 
  //   gl_FragColor.y + sin(u_time) * 0.002,
  //   0.,
  //   1.);
//   gl_FragColor *= sin(u_time);
  // Drawing with the distance field
  // gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
  // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
  // gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);
}
