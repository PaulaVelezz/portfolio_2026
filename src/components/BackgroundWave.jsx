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

        // Interactive pushing and warping using a smooth exponential falloff (no hard if-statements)
        vec2 diff = uv - mouseUv;
        float dist = length(diff);
        
        // Dynamic push force
        float warpForce = exp(-dist * 4.5) * 0.15;
        vec2 distortedUv = uv + normalize(diff) * warpForce;

        // Visual Layering: Compute two noise octaves with different details and scrolling speeds
        // Layer 1: Slow, large-scale topographic field
        vec3 coord1 = vec3(distortedUv * 2.2, u_time * 0.015);
        float noise1 = snoise(coord1);
        
        // Layer 2: Medium-speed, high-frequency details
        vec3 coord2 = vec3(distortedUv * 4.5 + vec3(17.3, 34.7, u_time * 0.008), u_time * 0.01);
        float noise2 = snoise(coord2) * 0.4;
        
        float finalNoise = noise1 + noise2;

        // Draw Layer 1 Contours (Denser, ultra-thin, low opacity)
        float freq1 = 28.0;
        float val1 = sin(finalNoise * freq1 + u_time * 0.08);
        float line1 = smoothstep(0.018, 0.0, abs(val1));

        // Draw Layer 2 Contours (Medium density, slightly thicker, reacts to noise variations)
        float freq2 = 14.0;
        float val2 = sin(finalNoise * freq2 - u_time * 0.05);
        float line2 = smoothstep(0.024, 0.0, abs(val2));

        // Deep cinematic background colors
        vec3 bgColor = vec3(0.027, 0.027, 0.031); // #070708

        // Line color palettes: blend faint slate gray and copper highlights based on noise gradient
        vec3 slateGray = vec3(0.12, 0.13, 0.15); // very dark, subtle slate
        vec3 copperGlow = vec3(0.26, 0.20, 0.15); // soft warm copper
        vec3 colorA = mix(slateGray, copperGlow, finalNoise * 0.5 + 0.5);
        
        vec3 line1Color = colorA * 0.5; // Layer 1 is fainter
        vec3 line2Color = colorA * 0.8; // Layer 2 is brighter

        // Vignette for depth (fades elements smoothly at the edges)
        float vignette = smoothstep(0.95, 0.35, length(uv - 0.5));

        // Blend layers together onto the background
        vec3 finalColor = bgColor;
        finalColor = mix(finalColor, line1Color, line1 * vignette * 0.35);
        finalColor = mix(finalColor, line2Color, line2 * vignette * 0.45);

        // Add a subtle highlight near the cursor for extra depth
        float glow = exp(-dist * 3.5) * 0.06;
        finalColor += copperGlow * glow * vignette;

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
