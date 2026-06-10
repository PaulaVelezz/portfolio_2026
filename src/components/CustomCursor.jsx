import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;

    if (!dot || !ring) return;

    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
    });

    const mouse = {
      x: -100,
      y: -100,
    };

    const ringPos = {
      x: -100,
      y: -100,
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.08,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const tick = () => {
      const dt = 0.25; // menos lag

      ringPos.x += (mouse.x - ringPos.x) * dt;
      ringPos.y += (mouse.y - ringPos.y) * dt;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
      });

      requestAnimationFrame(tick);
    };

    const animationFrame = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMouseMove);

    const handleMouseOver = (e) => {
      const hoverTarget = e.target.closest("[data-cursor]");

      if (!hoverTarget) return;

      const cursorType = hoverTarget.getAttribute("data-cursor");

      // VIEW
      if (cursorType === "view") {
        setCursorText("VIEW");

        gsap.to(ring, {
          scale: 2.2,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderColor: "rgba(255,255,255,1)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });

        gsap.to(dot, {
          opacity: 0,
          scale: 0,
          duration: 0.2,
          overwrite: true,
        });

        gsap.to(text, {
          opacity: 1,
          scale: 1,
          color: "#070708",
          duration: 0.3,
          overwrite: true,
        });
      }

      // POINTER
      else if (cursorType === "pointer") {
        gsap.to(ring, {
          scale: 1.8,
          borderColor: "rgba(255,255,255,0.8)",
          backgroundColor: "rgba(255,255,255,0.05)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });

        gsap.to(dot, {
          scale: 1.8,
          backgroundColor: "#e5c07b",
          duration: 0.2,
          overwrite: true,
        });
      }

      // MAGNETIC
      else if (cursorType === "magnetic") {
        gsap.to(ring, {
          scale: 2,
          borderColor: "#e5c07b",
          backgroundColor: "rgba(229,192,123,0.05)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });

        gsap.to(dot, {
          scale: 2,
          backgroundColor: "#e5c07b",
          duration: 0.2,
          overwrite: true,
        });
      }
    };

    const handleMouseOut = (e) => {
      const hoverTarget = e.target.closest("[data-cursor]");

      if (!hoverTarget) return;

      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(255,255,255,0.4)",
        backgroundColor: "transparent",
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });

      gsap.to(dot, {
        opacity: 1,
        scale: 1,
        backgroundColor: "#ffffff",
        duration: 0.2,
        overwrite: true,
      });

      gsap.to(text, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        overwrite: true,
      });

      setCursorText("");

      if (hoverTarget.getAttribute("data-cursor") === "magnetic") {
        gsap.to(hoverTarget, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          overwrite: true,
        });
      }
    };

    const handleMagneticMove = (e) => {
      const hoverTarget = e.target.closest('[data-cursor="magnetic"]');

      if (!hoverTarget) return;

      const rect = hoverTarget.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      gsap.to(hoverTarget, {
        x: (e.clientX - centerX) * 0.25,
        y: (e.clientY - centerY) * 0.25,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true,
      });
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousemove", handleMagneticMove);

    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMouseMove);

      document.removeEventListener("mouseover", handleMouseOver);

      document.removeEventListener("mouseout", handleMouseOut);

      document.removeEventListener("mousemove", handleMagneticMove);

      cancelAnimationFrame(animationFrame);

      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[999]">
      <div
        ref={ringRef}
        className="
          fixed
          top-0
          left-0
          w-9
          h-9
          rounded-full
          border
          border-white/40
          mix-blend-difference
          flex
          items-center
          justify-center
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <span
          ref={textRef}
          className="
            text-[10px]
            font-space
            font-bold
            tracking-[0.2em]
            opacity-0
            scale-75
            select-none
          "
        >
          {cursorText}
        </span>
      </div>

      <div
        ref={dotRef}
        className="
          fixed
          top-0
          left-0
          w-[6px]
          h-[6px]
          bg-white
          rounded-full
          mix-blend-difference
          -translate-x-1/2
          -translate-y-1/2
        "
      />
    </div>
  );
}
