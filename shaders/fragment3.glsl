precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform vec4 u_color;
uniform float test;
uniform float knobtest;
uniform float knobtest2;

// void main(){

//   vec2 st = gl_FragCoord.xy;
//   gl_FragColor = texture2D(u_texture, v_texcoord + 
//   vec2(
//     sin(st.y / 15. + u_time * 3.) * 0.1 * u_time,
//     st.y)
//   );
//   gl_FragColor = vec4(
//     gl_FragColor.r + u_color.r,
//     gl_FragColor.g + u_color.g,
//     gl_FragColor.b + u_color.b,
//     test
//   );
// }
void main(){
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // float aspect = u_resolution.x / u_resolution.y;
    // st.x = st.x * aspect;
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st * 4.-1.;

  // Make the distance field
  d = length( abs(st) - (knobtest2 / 100.) + sin(u_time) / 100.);
  // d = length( min(abs(st)-.3,0.) );
  // d = length( max(abs(st)-.3,0.) );

  // Visualize the distance field
  gl_FragColor = vec4(
    fract(u_color.x * d * knobtest * 10.),
    fract(u_color.y * d * knobtest * 10. ),
    fract(u_color.z * d * knobtest * 10. ),
    1.
  );


  // Drawing with the distance field
  // gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
  // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);

  // gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);
}