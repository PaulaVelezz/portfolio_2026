import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import devinImg from "../assets/devin_project.png";
import fluidImg from "../assets/fluid_project.png";
import topoImg from "../assets/topo_project.png";

export default function Projects({ setPage }) {
  const containerRef = useRef(null);
  const blobCanvasRef = useRef(null);

  const projects = [
    {
      id: "devin_ai",
      title: "Devin AI Platform",
      category: "UI Simulation / Shaders",
      year: "2026",
      image: devinImg,
    },
    {
      id: "fluid_dynamics",
      title: "Fluid dynamics canvas",
      category: "WebGL / Mathematical loops",
      year: "2025",
      image: fluidImg,
    },
    {
      id: "topographic_waves",
      title: "Topographic contour mesh",
      category: "GLSL / GPGPU",
      year: "2025",
      image: topoImg,
    },
  ];

  // WebGL Iridescent Fluid Blob Shader (above headline)
  useEffect(() => {
    const canvas = blobCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Noise Helpers
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx) ;
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute(
                   i.y + vec3(0.0, i1.y, 1.0 ))
                 + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0 ;
        vec3 h = abs(x) - 0.5 ;
        vec3 a0 = x - floor(x + 0.5);
        vec3 vel = a0 * a0 + h * h;
        vec3 r = a0 * a0 + h * h;
        m *= 1.79284291400159 - 0.85373472095314 * r;
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = v_uv - 0.5;
        
        // Morphing coordinates using noise
        float n = snoise(uv * 2.0 + u_time * 0.4);
        float r = 0.28 + n * 0.06;
        
        // Mouse interaction displacement
        vec2 mPos = u_mouse - 0.5;
        float dMouse = length(uv - mPos);
        if (dMouse < 0.3) {
          r += (1.0 - smoothstep(0.0, 0.3, dMouse)) * 0.05;
        }

        float dist = length(uv);
        float blob = smoothstep(r, r - 0.015, dist);

        // Iridescent colors matching Lusion blob
        vec3 colA = vec3(0.0, 0.9, 0.9);   // Cyan
        vec3 colB = vec3(1.0, 0.5, 0.2);   // Orange
        vec3 colC = vec3(0.9, 0.1, 0.6);   // Pink/Magenta
        vec3 colD = vec3(0.1, 0.2, 0.9);   // Deep Blue

        float cTime = u_time * 0.3;
        vec3 liquidColor = mix(colA, colB, sin(uv.x * 2.0 + cTime) * 0.5 + 0.5);
        liquidColor = mix(liquidColor, colC, cos(uv.y * 3.0 - cTime) * 0.5 + 0.5);
        liquidColor = mix(liquidColor, colD, n * 0.5 + 0.5);

        // Output color with smooth transparent edges
        gl_FragColor = vec4(liquidColor, blob * 0.8);
      }
    `;

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    let mouse = { x: 0.5, y: 0.5 };
    let lerpedMouse = { x: 0.5, y: 0.5 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / canvas.width;
      mouse.y = 1.0 - (e.clientY - rect.top) / canvas.height; // Flip Y
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;
    let startTime = performance.now();

    const render = () => {
      const time = (performance.now() - startTime) * 0.001;
      lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.08;
      lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.08;

      gl.uniform1f(timeLoc, time);
      gl.uniform2f(mouseLoc, lerpedMouse.x, lerpedMouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  useEffect(() => {
    // Project cards load animation
    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#f0f0f5] text-black px-6 pt-36 pb-20 md:px-12 md:pb-32 z-10"
    >
      {/* 1. Projects Page Header Grid (Light Style) */}
      <div className="max-w-7xl mx-auto w-full relative mb-20 select-none">
        {/* Colorful WebGL Fluid Blob floating above title */}
        <div className="absolute -top-16 left-24 w-[280px] h-[280px] pointer-events-none z-10">
          <canvas
            ref={blobCanvasRef}
            width="280"
            height="280"
            className="w-full h-full"
          />
        </div>

        {/* Title Content */}
        <div className="flex items-start gap-4">
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-sans font-black tracking-tighter leading-none">
            PROJECTS
          </h2>
          <div className="flex flex-col items-start gap-2 pt-2 md:pt-4">
            <span className="text-xs sm:text-sm font-space font-bold tracking-widest text-neutral-400 leading-none">
              12
            </span>
            {/* Large diagonal arrow */}
            <svg
              className="w-10 h-10 md:w-16 md:h-16 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0H8.25m11.25 0V8.25"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Projects Grid*/}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {projects.map((project) => {
          const cardRef = useRef(null);
          const imgRef = useRef(null);

          const handleMouseMove = (e) => {
            const card = cardRef.current;
            const img = imgRef.current;
            if (!card || !img) return;

            const rect = card.getBoundingClientRect();
            // Normalized relative coordinates inside card (-0.5 to 0.5)
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Tilt card container on X and Y axes
            gsap.to(card, {
              rotateX: -y * 12,
              rotateY: x * 12,
              scale: 1.015,
              duration: 0.35,
              ease: "power2.out",
            });

            // Parallax image in opposite direction to create window depth effect
            gsap.to(img, {
              x: -x * 24,
              y: -y * 24,
              scale: 1.08,
              duration: 0.35,
              ease: "power2.out",
            });
          };

          const handleMouseLeave = () => {
            const card = cardRef.current;
            const img = imgRef.current;
            if (!card || !img) return;

            // Reset smoothly to default resting coordinates
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              scale: 1.0,
              duration: 0.6,
              ease: "power3.out",
            });

            gsap.to(img, {
              x: 0,
              y: 0,
              scale: 1.0,
              duration: 0.6,
              ease: "power3.out",
            });
          };

          return (
            <div
              key={project.id}
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setPage("detail")}
              className="project-card group flex flex-col gap-4 cursor-pointer"
              style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
              data-cursor="view"
              tabIndex={0}
              role="button"
              aria-label={`View case study for ${project.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setPage("detail");
                }
              }}
            >
              {/* Thumbnail Card with rounded corners */}
              <div
                className="w-full aspect-video rounded-3xl overflow-hidden border border-neutral-200/50 shadow-md bg-neutral-900"
                style={{ transform: "translateZ(15px)" }}
              >
                <img
                  ref={imgRef}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
              </div>

              {/* Typography metadata */}
              <div
                className="flex justify-between items-center px-2 select-none"
                style={{ transform: "translateZ(25px)" }}
              >
                <div className="flex flex-col text-left">
                  <h3 className="text-lg font-space font-bold tracking-tight text-neutral-900 group-hover:text-[#ff5c35] transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs text-neutral-400 font-sans">
                    {project.category}
                  </span>
                </div>
                <span className="text-xs font-space font-bold text-neutral-400">
                  {project.year}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
