import React from "react"
import ShaderCanvas from "@signal-noise/react-shader-canvas"
import windowSize from "../utils/windowResize"

const shader = `
// Author: Ryan Winstead
// Title: Truchet shader

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float hash21(vec2 p)
    {
    p = fract(p*vec2(12231.34, 235.345));
    p += dot(p,p+5.23);
    return fract(p.x*p.y);   
}


void main() {
    //Screensetup
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st = st-vec2(.5); //Placing origin in middle of squares
    //*****
    
    float zoom =10.0;
    

  	//zoom += u_time/6.0;
	  st +=u_time*.006;

    vec3 color = vec3(0.0);
    st*=zoom; //Decides number of squares on screen
    vec2 grid = fract(st)-.5; //Puts origin of each square in center of square
    vec2 id = floor(st);

    // grid.x*=-1.0;//Flips lines across x axis
    
    float n = hash21(id); // Returns random number between 0 and 1
    
    
    
    if(n<.5) grid.x *= -1.0;
    float width = u_mouse.y/8000.;
    float dist = abs(abs(grid.x + grid.y)-.5); //Rectangular maze
    float mask = smoothstep(.01,-.01, dist-width); //rect maze

    
    
    //Circular pattern
    vec2 C_st = grid - sign(grid.x + grid.y + .000001)*.5;
    //dist = length(C_st)-.5;
    //mask = smoothstep(.01,-.01, abs(dist)-width);
    
    float angle = atan(C_st.x, C_st.y); // returns between -pi to pi

    float alternate = mod(id.x +id.y, 2.0)*2.0-1.0; 
    float flow = sin(u_time+alternate*angle*u_mouse.x/100.);
    // color +=n;
    color += flow*mask;
    
//    color.rg=grid;
    
     //if(grid.x>.48 || grid.y>.48) co/lor = vec3(1,0,0); //Red lines
    


     gl_FragColor = vec4(color*vec3(10.,u_mouse.x/6.,u_mouse.x),1.0);
}

`;

export default function TruchetShader() {
    const size = windowSize();

    return (
            <ShaderCanvas
            width={size.width}
            height={size.height}
            fragShader={shader}
        />
    )
}