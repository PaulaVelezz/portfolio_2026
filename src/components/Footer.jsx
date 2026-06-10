import { useEffect, useRef } from "react";

export default function Footer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = 280; // Keep canvas height fixed at bottom section

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Comet Particle setup
    const cometCount = 6;
    const comets = Array.from({ length: cometCount }, (_, i) => ({
      xProgress: Math.random(), // 0 to 1 along x-axis
      speed: 0.0015 + Math.random() * 0.002,
      waveIndex: i % 3,
      size: 1.5 + Math.random() * 1.5,
      trail: [], // history of past coords for smooth tail drawing
    }));

    let time = 0;

    // Render loop
    const animate = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render 3 faint atmospheric background waves
      const waveConfigs = [
        {
          amp: 24,
          freq: 0.005,
          phase: time * 0.4,
          yOffset: height * 0.45,
          opacity: 0.06,
        },
        {
          amp: 16,
          freq: 0.007,
          phase: -time * 0.3,
          yOffset: height * 0.5,
          opacity: 0.08,
        },
        {
          amp: 30,
          freq: 0.004,
          phase: time * 0.2,
          yOffset: height * 0.55,
          opacity: 0.05,
        },
      ];

      const mouse = mouseRef.current;

      waveConfigs.forEach((wave, wIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 92, 53, ${wave.opacity})`;
        ctx.lineWidth = 1.0;

        for (let x = 0; x < width; x += 4) {
          // Calculate baseline sine wave coordinate
          let y =
            wave.yOffset + Math.sin(x * wave.freq + wave.phase) * wave.amp;

          // Apply cursor-proximity ripple distortion
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) * 0.35;
            // Push wave coordinates away from cursor coordinates
            y += Math.sin(x * 0.05 - time * 3) * force;
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Animate and render comets flowing along wave vectors
      comets.forEach((comet) => {
        // Move along x-axis
        comet.xProgress += comet.speed;
        if (comet.xProgress > 1.0) {
          comet.xProgress = 0;
          comet.speed = 0.0015 + Math.random() * 0.002;
          comet.waveIndex = Math.floor(Math.random() * waveConfigs.length);
        }

        const wave = waveConfigs[comet.waveIndex];
        const x = comet.xProgress * width;

        // Calculate position on wave with cursor response
        let y = wave.yOffset + Math.sin(x * wave.freq + wave.phase) * wave.amp;
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) * 0.35;
          y += Math.sin(x * 0.05 - time * 3) * force;
        }

        // Add coordinate to trail history
        comet.trail.push({ x, y });
        if (comet.trail.length > 25) {
          comet.trail.shift();
        }

        // Draw fading comet trail lines
        if (comet.trail.length > 1) {
          ctx.beginPath();
          ctx.lineWidth = comet.size * 0.8;

          for (let i = 0; i < comet.trail.length - 1; i++) {
            const pt1 = comet.trail[i];
            const pt2 = comet.trail[i + 1];
            const trailOpacity = (i / comet.trail.length) * 0.25;

            ctx.strokeStyle = `rgba(255, 92, 53, ${trailOpacity})`;
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.stroke();
          }
        }

        // Draw glowing comet head particle
        ctx.beginPath();
        ctx.arc(x, y, comet.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ff5c35";
        ctx.shadowColor = "#ff5c35";
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.85;
        ctx.fill();

        // Reset canvas shadow attributes to prevent performance drag
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative w-full bg-[#0a0a0c] text-white pt-24 pb-12 z-10 overflow-hidden select-none border-t border-white/5"
      role="contentinfo"
      aria-label="Footer area"
    >
      {/* Comet wave canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 w-full h-[280px] pointer-events-none z-0 opacity-80"
      />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 flex flex-col gap-16">
        {/* Contact CTA banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 text-left">
            <span className="text-[10px] text-[#ff5c35] font-space tracking-[0.3em] block mb-3">
              // LET'S CONNECT
            </span>
            <h2 className="text-4xl sm:text-6xl font-sans font-black tracking-tighter uppercase leading-none">
              HAVE A PROJECT <br />
              <span className="text-neutral-500">IN MIND?</span>
            </h2>
            <a
              href="mailto:velezpaula.a@gmail.com"
              className="text-2xl sm:text-4xl font-space font-bold text-white hover:text-[#ff5c35] transition-colors mt-6 inline-block underline decoration-1 underline-offset-8"
              data-cursor="magnetic"
            >
              velezpaula.a@gmail.com
            </a>
          </div>

          {/* Social Links & Credentials Grid */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8 text-left text-xs font-space tracking-widest pl-0 md:pl-8">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-neutral-500">// SOCIALS</span>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#ff5c35] transition-colors"
                    data-cursor="pointer"
                  >
                    GITHUB
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#ff5c35] transition-colors"
                    data-cursor="pointer"
                  >
                    LINKEDIN
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#ff5c35] transition-colors"
                    data-cursor="pointer"
                  >
                    TWITTER
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-neutral-500">// ARCHIVE</span>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#ff5c35] transition-colors"
                    data-cursor="pointer"
                  >
                    CASE STUDIES
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#ff5c35] transition-colors"
                    data-cursor="pointer"
                  >
                    CURRICULUM
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#ff5c35] transition-colors"
                    data-cursor="pointer"
                  >
                    GLSL LABS
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Base copyright credits */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-8 text-[10px] font-space tracking-widest text-neutral-500">
          <span>© 2026 PAULA A. ALL RIGHTS RESERVED.</span>
          <span>CÓRDOBA // ARGENTINA</span>
        </div>
      </div>
    </footer>
  );
}
