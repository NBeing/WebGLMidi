precision mediump float;
attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
uniform vec2 u_texRotation;
//attribute vec2 a_texcoord;
varying vec2 v_texcoord;

void main(){
    vec2 scaledPosition = a_position * u_scale;
    vec2 rotatedPosition = vec2(
        scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
        scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
    );
    vec2 position = rotatedPosition + u_translation;
    vec2 zeroToOne = position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
    
    vec2 st = a_position.xy/u_resolution.xy;
    vec2 scale_st =  st;
    vec2 rotatedPosition2 = vec2(
        scale_st.x * u_texRotation.y + scale_st.y * u_texRotation.x,
        scale_st.y * u_texRotation.y - scale_st.x * u_texRotation.x
    );
    vec2 position2 = rotatedPosition2 + u_translation;
    vec2 zeroToOne2 = position2 / u_resolution;
    vec2 zeroToTwo2 = zeroToOne2 * 2.0;
    vec2 clipSpace2 = zeroToTwo2 - 1.0;
    v_texcoord = vec2(position2.x, position2.y) * vec2(1,-1);
    // v_texcoord = rotatedPosition * vec2(-1.,1.);

    // gl_Position = vec4(scaledPosition.x, scaledPosition.y, 0.,1.);
}