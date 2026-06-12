import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HamburgerMenu({ isOpen, setPage, onClose }) {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
  const metaRef = useRef(null);
  const bgRef = useRef(null);

  // Close menu on Escape key press (Accessibility requirement)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus within menu when open
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, a, [tabIndex="0"]',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleFocusTrap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleFocusTrap);
    // Focus first link on open
    if (firstElement) firstElement.focus();

    return () => container.removeEventListener("keydown", handleFocusTrap);
  }, [isOpen]);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    const links = linksRef.current.filter(Boolean);
    const meta = metaRef.current;

    if (!container || !bg) return;

    if (isOpen) {
      // Open Timeline
      const tl = gsap.timeline();

      // Ensure element is visible and interactive
      gsap.set(container, { pointerEvents: "all", visibility: "visible" });
      gsap.set(bg, { skewY: 5, transformOrigin: "top left", scaleY: 0 });
      gsap.set(links, { y: 100, opacity: 0 });
      if (meta) gsap.set(meta, { opacity: 0, y: 30 });

      tl.to(bg, {
        scaleY: 1,
        skewY: 0,
        duration: 0.9,
        ease: "power4.inOut",
      })
        .to(
          links,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.45",
        )
        .to(
          meta,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5",
        );
    } else {
      // Close Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container, { pointerEvents: "none", visibility: "hidden" });
        },
      });

      tl.to(links, {
        y: -60,
        opacity: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: "power3.in",
      })
        .to(
          meta,
          {
            opacity: 0,
            y: -20,
            duration: 0.35,
            ease: "power2.in",
          },
          "-=0.35",
        )
        .to(
          bg,
          {
            scaleY: 0,
            skewY: -3,
            duration: 0.7,
            ease: "power4.inOut",
          },
          "-=0.25",
        );
    }
  }, [isOpen]);

  const handleLinkClick = (page) => {
    setPage(page);
    onClose();
  };

  const navLinks = [
    { label: "INDEX", page: "home", desc: "Return home" },
    { label: "ABOUT", page: "about", desc: "Creative expertise" },
    { label: "PROJECTS", page: "projects", desc: "Selected works" },
    { label: "CASE STUDY", page: "detail", desc: "Devin AI template" },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-30 invisible pointer-events-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-expanded={isOpen}
      aria-label="Navigation Overlay Menu"
    >
      {/* Skewed Background Overlay Panel */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[#0d0d0f] border-b border-white/5 origin-top"
      />

      {/* Grid Lines for Tactile Visual Rhythm */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-[0.03]">
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="border-r border-white h-full" />
        <div className="h-full" />
      </div>

      {/* Content Layout Column Container */}
      <div className="absolute inset-0 flex flex-col justify-between px-6 pt-32 pb-12 md:px-16 md:pb-16 max-w-7xl mx-auto w-full z-10">
        {/* Navigation Links Grid splits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Main Staggered Links column */}
          <nav className="flex flex-col gap-6 md:gap-8">
            <span className="text-[10px] font-space tracking-[0.3em] text-white/30 text-left">
              NAVIGATION
            </span>

            <div className="flex flex-col gap-3">
              {navLinks.map((link, idx) => (
                <div key={link.label} className="overflow-hidden">
                  <button
                    ref={(el) => (linksRef.current[idx] = el)}
                    onClick={() => handleLinkClick(link.page)}
                    className="group flex items-baseline gap-4 cursor-pointer py-1 bg-transparent border-none text-left focus:outline-none w-full"
                    data-cursor="pointer"
                    tabIndex={isOpen ? 0 : -1}
                    aria-label={`Navigate to ${link.label} section`}
                  >
                    {/* Sliding arrow prefix on hover */}
                    <span className="text-xs font-space text-[#ff5c35] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 focus:opacity-100 focus:translate-x-0 transition-all duration-300">
                      // 0{idx + 1}
                    </span>

                    {/* Heading label shifts right on hover */}
                    <span className="text-4xl sm:text-5xl md:text-7xl font-syne font-black tracking-tight text-white/60 group-hover:text-white group-hover:translate-x-2 focus:text-white focus:translate-x-2 transition-all duration-300 uppercase leading-none">
                      {link.label}
                    </span>

                    <span className="hidden sm:inline text-xs font-serif italic text-white/20 group-hover:text-[#ff5c35] group-hover:translate-x-4 transition-all duration-300">
                      {link.desc}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </nav>

          {/* Featured Project Widget Block */}
          <div
            ref={(el) => (linksRef.current[4] = el)}
            className="hidden md:flex flex-col gap-4 border border-white/5 p-8 bg-[#09090b]/50 backdrop-blur-sm rounded-3xl"
          >
            <span className="text-[10px] font-space tracking-[0.3em] text-white/30 text-left">
              FEATURED WORK
            </span>
            <h3 className="text-2xl font-serif italic text-white text-left">
              Devin AI Integration
            </h3>
            <p className="text-sm text-white/50 font-sans leading-relaxed text-left">
              An interactive examination of machine learning pipelines, building
              a custom real-time code agent preview system.
            </p>
            <button
              onClick={() => handleLinkClick("detail")}
              className="self-start text-xs font-space tracking-widest text-[#ff5c35] hover:text-white transition-colors flex items-center gap-2 mt-4 cursor-pointer"
              data-cursor="magnetic"
              tabIndex={isOpen ? 0 : -1}
              aria-label="Read featured case study"
            >
              READ CASE STUDY <span className="text-sm">→</span>
            </button>
          </div>
        </div>

        {/* Footer Meta columns */}
        <div
          ref={metaRef}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-t border-white/5 pt-8"
        >
          <div className="flex gap-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-space tracking-widest text-white/50 hover:text-white transition-colors"
              data-cursor="pointer"
              tabIndex={isOpen ? 0 : -1}
            >
              GITHUB
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-space tracking-widest text-white/50 hover:text-white transition-colors"
              data-cursor="pointer"
              tabIndex={isOpen ? 0 : -1}
            >
              LINKEDIN
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-space tracking-widest text-white/50 hover:text-white transition-colors"
              data-cursor="pointer"
              tabIndex={isOpen ? 0 : -1}
            >
              TWITTER
            </a>
          </div>

          <div className="text-xs font-space text-white/30">
            © 2026 PAULA VELEZ - ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </div>
  );
}
