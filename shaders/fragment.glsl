precision mediump float;        
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float drawRect(vec2 st,  vec2 tr_offset, vec2 bl_offset){
    // float size = 1.0 - _size;
    // bottom-left
    vec2 bl = vec2(0.0);
    bl.x = step(bl_offset.x, st.x);
    bl.y = step(bl_offset.y, st.y);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = vec2(0.0);
    tr.x = step(tr_offset.x, 1.-st.x);
    tr.y = step(tr_offset.y, 1.-st.y);

    pct *= tr.x * tr.y;
    return pct;
}
float drawRect2(
    vec2 st,
    float top, 
    float left,
    float bottom,
    float right
){
    vec2 bl = vec2(
        step(left, st.x),
        step(1. - bottom, st.y)
    );
    float pct = bl.x * bl.y;

    vec2 tr = vec2(
        step(1. - right, 1.-st.x),
        step(top, 1.-st.y)
    );

    pct *= tr.x * tr.y;
    return pct;
}
float drawRect3(
    vec2 st,
    float top, 
    float left,
    float bottom,
    float right
){
    float lerp = 0.01;
    vec2 bl = vec2(
        smoothstep(left, left + lerp, st.x) - smoothstep(left, left - lerp, st.x),
        smoothstep(bottom, bottom + lerp, st.y) - smoothstep(bottom, bottom - lerp, st.y)
    );
    float pct = bl.x * bl.y;

    vec2 tr = vec2(
        smoothstep(right, right + .01, st.x) - smoothstep(right, right - lerp, st.x),
        smoothstep(top, top + lerp, st.y) - smoothstep(top, top - lerp, st.y)

    );

    pct *= tr.x * tr.y;
    return pct;
}

float drawRect4(
    vec2 st,
    float top, 
    float left,
    float bottom,
    float right
){
    float thiccness = 0.2;
    vec2 bl = vec2(
        step(left, st.x),
        step(1. - bottom, st.y)
    );
    float pct = bl.x * bl.y;

    vec2 tr = vec2(
        step(1. - right, 1.-st.x),
        step(top, 1.-st.y)
    );

    pct *= tr.x * tr.y;
    return pct;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    st.x = st.x * aspect;
    vec2 stcopy = st;
    st = st * 100.0;
    st = fract(st);
    float pct  = drawRect2(
        st,
        0.0,
        0.0,
        1., //- abs(sin(u_time * 1.)),
        1.
    );

    float pct2 = drawRect2(
        st,
        0.0,
        0.0,
        1.0 - abs(sin(u_time * 2.)),
        1.
    );
    
    vec2 translate = vec2(cos(u_time),sin(u_time));
    float pct3 = smoothstep(0., 0.2, distance(stcopy + translate * .25, vec2(0.5, 0.5/aspect)));

    vec2 translate2 = vec2(sin(u_time),sin(u_time));
    float pct4 = smoothstep(
        0., 
        0.2, 
        distance(stcopy + translate2 * .25, vec2(0.5))
    );

    vec2 translate3 = vec2(- sin(u_time * 1.5),  cos(u_time * 1.));
    float pct5 = smoothstep(
        0., 
        0.2,
        distance(stcopy + translate3 * .25, vec2(0.5)));

    vec2 translate4 = vec2(- sin(u_time * .8),  cos(u_time * 1.));
    vec2 rings = stcopy;
    rings = rings * 2. -1.;

    float pct6 = smoothstep(
        0., 
        0.2,
        distance(
            stcopy + translate4 * .25, 
            vec2(0.5)
        )
    );

    vec2 translate5 = vec2(- sin(u_time * 1.),  cos(u_time * 1.));
    float pct7 = smoothstep(0., 0.2,distance(stcopy + translate5 * .25, vec2(0.5)));
    float pct8 = 1.;smoothstep(0., 0.99, distance(st, vec2(0.5)));

    vec3 test  = vec3(pct) *  vec3(0.0, 0.4588, 0.3216);
    vec3 test2 = vec3(pct2) *  vec3(0.2, st.y - 0.4, 0.4078);

    vec3 bg = vec3(0.0353, 0.1412, 0.2353);
    vec3 color = vec3(bg + (test + test2));
    if(color.r == bg.r ){
        gl_FragColor = vec4(0.);
    } else{
        gl_FragColor = vec4(color * pct8 *(1.0 -(pct3 * pct4 * pct5 * pct6)), 1.0);
    }

}
