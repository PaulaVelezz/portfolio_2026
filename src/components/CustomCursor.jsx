import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!dot || !ring) return;

    // Set initial position out of screen
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    
    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Inner dot follows mouse immediately
      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.1,
        ease: 'power3.out',
      });
    };

    // Smooth lerp for outer ring (Lag ring)
    const tick = () => {
      const dt = 0.15; // interpolation factor
      ringPos.x += (mouse.x - ringPos.x) * dt;
      ringPos.y += (mouse.y - ringPos.y) * dt;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
      });

      requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animFrame = requestAnimationFrame(tick);

    // Event Delegation for hover effects
    const handleMouseOver = (e) => {
      // Find closest ancestor with data-cursor attribute
      const hoverTarget = e.target.closest('[data-cursor]');
      if (!hoverTarget) return;

      const cursorType = hoverTarget.getAttribute('data-cursor');

      if (cursorType === 'view') {
        setCursorText('VIEW');
        gsap.to(ring, {
          width: 80,
          height: 80,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(255, 255, 255, 1)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, { opacity: 0, scale: 0, duration: 0.2 });
        gsap.to(text, { opacity: 1, scale: 1, color: '#070708', duration: 0.3 });
      } else if (cursorType === 'pointer') {
        gsap.to(ring, {
          scale: 1.6,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          scale: 1.5,
          backgroundColor: '#e5c07b', // Accent color
          duration: 0.2,
        });
      } else if (cursorType === 'magnetic') {
        // snaps ring slightly to target, grows it
        const rect = hoverTarget.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        gsap.to(ring, {
          width: rect.width + 16,
          height: rect.height + 16,
          borderRadius: '8px', // Match tag shape
          borderColor: '#e5c07b',
          duration: 0.3,
          ease: 'power2.out',
        });
        
        // Add magnetic pull to the target button
        gsap.to(hoverTarget, {
          x: (mouse.x - center.x) * 0.3,
          y: (mouse.y - center.y) * 0.3,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseOut = (e) => {
      const hoverTarget = e.target.closest('[data-cursor]');
      if (!hoverTarget) return;

      const cursorType = hoverTarget.getAttribute('data-cursor');

      // Reset cursor to default
      gsap.to(ring, {
        width: 36,
        height: 36,
        scale: 1.0,
        borderRadius: '50%',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        opacity: 1,
        scale: 1.0,
        backgroundColor: '#ffffff',
        duration: 0.2,
      });
      gsap.to(text, { opacity: 0, scale: 0.8, duration: 0.2 });

      if (cursorType === 'magnetic') {
        gsap.to(hoverTarget, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    // If mouse moves while over magnetic, recalculate magnetic offset
    const handleMouseMoveMagnetic = (e) => {
      const hoverTarget = e.target.closest('[data-cursor="magnetic"]');
      if (!hoverTarget) return;

      const rect = hoverTarget.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      gsap.to(hoverTarget, {
        x: (e.clientX - center.x) * 0.35,
        y: (e.clientY - center.y) * 0.35,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMouseMoveMagnetic);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrame);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousemove', handleMouseMoveMagnetic);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-50">
      {/* Outer Lag Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[36px] h-[36px] rounded-full border border-white/40 mix-blend-difference pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      >
        <span
          ref={textRef}
          className="text-[10px] font-space font-bold tracking-widest opacity-0 scale-75 select-none transition-transform"
        >
          {cursorText}
        </span>
      </div>

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] bg-white rounded-full mix-blend-difference pointer-events-none -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
