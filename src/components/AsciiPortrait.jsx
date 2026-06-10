import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function AsciiPortrait({ isRevealed = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [asciiGrid, setAsciiGrid] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animation values using refs for high-frequency canvas render updates without React re-renders
  const revealProgress = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lerpedMouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // Fetch raw ASCII file from public path
    fetch("/ascii-profile.txt")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").filter((line) => line.length > 0);
        const grid = lines.map((line) => line.split(""));
        setAsciiGrid(grid);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load ASCII portrait:", err);
        setLoading(false);
      });
  }, []);

  // Trigger reveal animation when isRevealed changes
  useEffect(() => {
    if (loading || !asciiGrid) return;
    if (isRevealed) {
      gsap.to(revealProgress, {
        current: 1.2,
        duration: 1.8,
        ease: "power3.out",
        delay: 0.4,
      });
    } else {
      revealProgress.current = 0;
    }
  }, [isRevealed, loading, asciiGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || loading || !asciiGrid) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId;
    const rows = asciiGrid.length;
    const cols = asciiGrid[0].length;

    // Track mouse coordinates relative to the canvas
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

    // Characters list for scrambling
    const scramblePool = "vczXYUJQLOZdhbka*M#w+-?10{}[]()/|\\".split("");

    // Handle Resize
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Make canvas size fit container and scale for retina displays
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Core Canvas Render Loop
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Setup typography: compute cell sizes to fit the container grid perfectly
      const cellWidth = width / cols;
      const cellHeight = height / rows;
      const fontSize = Math.max(5, cellHeight * 1.05); // ensure text fills cell height

      ctx.font = `${fontSize}px "Space Mono", monospace`;
      ctx.textBaseline = "top";

      // Lerp mouse coordinate for premium lag momentum effect
      const mouse = mouseRef.current;
      const lerpedMouse = lerpedMouseRef.current;
      lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.1;
      lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.1;

      const progress = revealProgress.current;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const char = asciiGrid[r][c];

          // Compute character grid world positions
          const posX = c * cellWidth;
          const posY = r * cellHeight;

          // Reveal time for this cell (diagonal scan: top-left to bottom-right)
          const revealThreshold = (r / rows) * 0.6 + (c / cols) * 0.3;

          // Cell state based on reveal timeline
          if (progress < revealThreshold) {
            // Not revealed yet - render nothing
            continue;
          }

          // Compute distance to mouse cursor for interactive effects
          const dx = posX + cellWidth / 2 - lerpedMouse.x;
          const dy = posY + cellHeight / 2 - lerpedMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const isNearMouse = dist < 90;

          // Compute character scrambling state during reveal sequence
          const isRecentlyRevealed = progress - revealThreshold < 0.15;

          let displayChar = char;
          let color = "#e2e2e2";
          let opacity = 0.85;

          // Reveal Scrambling logic
          if (isRecentlyRevealed) {
            // Flash random character
            const poolIndex = Math.floor(Math.random() * scramblePool.length);
            displayChar = scramblePool[poolIndex];
            color = "#ff5c35"; // highlight reveal front in theme orange
            opacity = 0.95;
          }
          // Interactive Cursor Proximity logic
          else if (isNearMouse) {
            const proximityFactor = 1.0 - dist / 90; // 0 to 1

            // 1. Symbol scrambling / replacement
            if (Math.random() < 0.15 * proximityFactor) {
              const poolIndex = Math.floor(Math.random() * scramblePool.length);
              displayChar = scramblePool[poolIndex];
            } else if (Math.random() < 0.08 * proximityFactor) {
              // Binary digital transformation
              displayChar = Math.random() > 0.5 ? "1" : "0";
            }

            // 2. Color transitions: blend from grey to vibrant portfolio orange-red
            const rVal = Math.round(226 + (255 - 226) * proximityFactor);
            const gVal = Math.round(226 + (92 - 226) * proximityFactor);
            const bVal = Math.round(226 + (53 - 226) * proximityFactor);
            color = `rgb(${rVal}, ${gVal}, ${bVal})`;

            opacity = 0.7 + 0.3 * proximityFactor;
          }

          // Apply opacity to graphics context
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;

          // Draw character to screen grid
          ctx.fillText(displayChar, posX, posY);
        }
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [loading, asciiGrid]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative aspect-[0.8] select-none flex items-center justify-center overflow-hidden cursor-crosshair rounded-2xl border border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md p-4 shadow-2xl"
      aria-label="Interactive computational ASCII portrait of Paula A."
      role="img"
    >
      {loading ? (
        <div className="text-neutral-500 font-space text-[10px] tracking-widest uppercase animate-pulse">
          Loading system matrix...
        </div>
      ) : (
        <canvas ref={canvasRef} className="block w-full h-full" />
      )}
    </div>
  );
}
