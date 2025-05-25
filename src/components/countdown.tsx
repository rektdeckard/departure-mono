import { createEffect } from "solid-js";
import GlslCanvas from "glslCanvas";
import { Timer } from "../lib/utils";
import "./countdown.css";

export function Countdown() {
  let containerRef: HTMLDivElement;
  let countRef: HTMLSpanElement;
  let canvasRef: HTMLCanvasElement;
  const timer = new Timer(9);
  const [remaining] = timer.signal;

  createEffect(() => {
    window.addEventListener(
      "scroll",
      (_e) => {
        document.documentElement.style.setProperty(
          "--scroll",
          `${(window.scrollY / (document.body.offsetHeight - window.innerHeight)) * 100}%`,
        );
      },
      false,
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer.start();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(countRef);
  });

  createEffect(() => {
    canvasRef.width = window.innerWidth;
    canvasRef.height = containerRef.clientHeight;

    const sandbox = new GlslCanvas(canvasRef);
    sandbox.load(`\
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

// Modified @rektdeckard - 2024
// https://tobiasfried.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    return fract(u_time * 5.0 + sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(random(i + vec2(0.0,0.0)),
                   random(i + vec2(1.0,0.0)), u.x),
               mix(random(i + vec2(0.0,1.0)),
                   random(i + vec2(1.0,1.0)), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = u_mouse.x/u_mouse.y;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float rnd = random(st);
    st.y *= u_resolution.y/u_resolution.x;

    vec2 pos = st.yx*vec2(10.,3.);
    float pattern = pos.x;

    // Add noise
    pos = rotate2d(noise(pos)) * pos;

    // Draw lines
    pattern = lines(pos,0.5);

    gl_FragColor = vec4(vec3(rnd),1.0) + vec4(vec3(pattern),0.1) / 4.0;
}
`);
  });

  function reset() {
    timer.reset();
    timer.start();
  }

  return (
    <div id="countdown" ref={containerRef!} onClick={reset}>
      <div class="overlay"></div>
      <span id="count" ref={countRef!}>
        {remaining()}
      </span>
      <canvas ref={canvasRef!} />
    </div>
  );
}
