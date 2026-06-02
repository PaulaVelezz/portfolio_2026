import { useEffect, useRef } from 'react';

export default function BackgroundWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use webgl or webgl2
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source (featuring Simplex 3D noise by Ashima Arts)
    const fsSource = `
      precision mediump float;
      
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      // Ashima Simplex Noise 3D code
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouseUv = u_mouse.xy / u_resolution.xy;

        // Interaction distortion: warp noise grid coordinates around the cursor
        vec2 diff = uv - mouseUv;
        float dist = length(diff);
        vec2 distortedUv = uv;

        // Interactive pushing effect
        if (dist < 0.4) {
          float strength = (1.0 - smoothstep(0.0, 0.4, dist)) * 0.08;
          distortedUv += normalize(diff) * strength;
        }

        // Scale and animate noise field
        vec3 noiseCoord = vec3(distortedUv * 3.0, u_time * 0.04);
        float n1 = snoise(noiseCoord);
        float n2 = snoise(noiseCoord * 2.2 + vec3(10.0, 20.0, u_time * 0.02)) * 0.45;
        float noiseVal = n1 + n2;

        // Construct topographic lines (draw when sin of scaled noise is close to zero)
        float lineFreq = 16.0;
        float linePhase = u_time * 0.15;
        float lineValue = sin(noiseVal * lineFreq + linePhase);
        
        // Anti-aliased line width logic
        float lineThickness = 0.08;
        float line = smoothstep(lineThickness, lineThickness - 0.02, abs(lineValue));

        // Background dark layout color
        vec3 bgColor = vec3(0.027, 0.027, 0.031); // #070708

        // Line color: deep slate grey / brass-tint blend for cinematic atmosphere
        vec3 colorA = vec3(0.18, 0.18, 0.22); // Faint steel gray
        vec3 colorB = vec3(0.24, 0.20, 0.16); // Subtle brass highlight
        vec3 lineColor = mix(colorA, colorB, noiseVal * 0.5 + 0.5);

        // Vignette to fade out towards edges for depth
        float vignette = smoothstep(0.9, 0.2, length(uv - 0.5));

        // Blend lines onto background
        vec3 finalColor = mix(bgColor, lineColor, line * vignette * 0.25);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Compile Helper
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compiler error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Link Program
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Setup Quad Geometry
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const timeLoc = gl.getUniformLocation(program, 'u_time');

    // Mouse positions: target and interpolated
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lerpedMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = window.innerHeight - e.clientY; // Flip Y for WebGL coordinates
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLoc, width, height);
    };

    window.addEventListener('resize', resize);
    resize(); // Initial resize

    // Animation Loop
    let animationFrameId;
    let startTime = performance.now();

    const render = () => {
      const time = (performance.now() - startTime) * 0.001; // Seconds

      // Lerp mouse coordinates for organic inertia (crucial for Lusion styling)
      lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.05;
      lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.05;

      gl.uniform2f(mouseLoc, lerpedMouse.x, lerpedMouse.y);
      gl.uniform1f(timeLoc, time);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bg-canvas fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
