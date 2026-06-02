import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HamburgerMenu({ isOpen, setPage, onClose }) {
  const containerRef = useRef(null);
  const linksRef = useRef([]);
  const metaRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    const links = linksRef.current.filter(Boolean);
    const meta = metaRef.current;

    if (!container || !bg) return;

    if (isOpen) {
      // Open Timeline
      const tl = gsap.timeline();
      
      // Ensure visible
      gsap.set(container, { pointerEvents: 'all', visibility: 'visible' });
      gsap.set(bg, { skewY: 4, transformOrigin: 'top left', scaleY: 0 });
      gsap.set(links, { y: 80, opacity: 0 });
      if (meta) gsap.set(meta, { opacity: 0, y: 20 });

      tl.to(bg, {
        scaleY: 1,
        skewY: 0,
        duration: 0.8,
        ease: 'power4.inOut',
      })
      .to(links, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }, '-=0.3')
      .to(meta, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.4');

    } else {
      // Close Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container, { pointerEvents: 'none', visibility: 'hidden' });
        }
      });

      tl.to(links, {
        y: -40,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.in',
      })
      .to(meta, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.3')
      .to(bg, {
        scaleY: 0,
        skewY: -2,
        duration: 0.6,
        ease: 'power4.inOut',
      }, '-=0.2');
    }
  }, [isOpen]);

  const handleLinkClick = (page) => {
    setPage(page);
    onClose();
  };

  const navLinks = [
    { label: 'INDEX', page: 'home', desc: 'Return home' },
    { label: 'ABOUT', page: 'about', desc: 'Creative expertise' },
    { label: 'PROJECTS', page: 'projects', desc: 'Selected works' },
    { label: 'CASE STUDY', page: 'detail', desc: 'Devin AI template' },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-30 invisible pointer-events-none overflow-hidden"
    >
      {/* Skewed Background Overlay */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[#0d0d0f] border-b border-white/5 origin-top"
      />

      {/* Grid Lines for Tactile Feel */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-10">
        <div className="border-r border-white/20 h-full" />
        <div className="border-r border-white/20 h-full" />
        <div className="border-r border-white/20 h-full" />
        <div className="h-full" />
      </div>

      {/* Content Layout */}
      <div className="absolute inset-0 flex flex-col justify-between px-6 pt-32 pb-12 md:px-16 md:pb-16 max-w-7xl mx-auto w-full z-10">
        {/* Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Main Links */}
          <nav className="flex flex-col gap-6 md:gap-8">
            <span className="text-[10px] font-space tracking-[0.3em] text-white/40">
              NAVIGATION
            </span>
            <div className="flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <div key={link.label} className="overflow-hidden">
                  <div
                    ref={(el) => (linksRef.current[idx] = el)}
                    onClick={() => handleLinkClick(link.page)}
                    className="group flex items-baseline gap-4 cursor-pointer py-1"
                    data-cursor="pointer"
                  >
                    <span className="text-sm font-space text-[#e5c07b] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      // 0{idx + 1}
                    </span>
                    <span className="text-4xl md:text-6xl font-syne font-bold tracking-tight text-white/70 group-hover:text-white transition-colors duration-300">
                      {link.label}
                    </span>
                    <span className="hidden sm:inline text-xs font-serif italic text-white/30 group-hover:text-[#e5c07b] translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      {link.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Featured Project Widget */}
          <div
            ref={(el) => (linksRef.current[4] = el)}
            className="hidden md:flex flex-col gap-4 border border-white/5 p-8 bg-[#09090b]/50 backdrop-blur-sm"
          >
            <span className="text-[10px] font-space tracking-[0.3em] text-white/40">
              FEATURED WORK
            </span>
            <h3 className="text-2xl font-serif italic text-white">Devin AI Integration</h3>
            <p className="text-sm text-white/50 font-sans leading-relaxed">
              An interactive examination of machine learning pipelines, building a custom real-time code agent preview system.
            </p>
            <button
              onClick={() => handleLinkClick('detail')}
              className="self-start text-xs font-space tracking-widest text-[#e5c07b] hover:text-white transition-colors flex items-center gap-2 mt-4"
              data-cursor="magnetic"
            >
              READ CASE STUDY <span className="text-sm">→</span>
            </button>
          </div>
        </div>

        {/* Footer Meta */}
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
            >
              GITHUB
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-space tracking-widest text-white/50 hover:text-white transition-colors"
              data-cursor="pointer"
            >
              LINKEDIN
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-space tracking-widest text-white/50 hover:text-white transition-colors"
              data-cursor="pointer"
            >
              TWITTER
            </a>
          </div>

          <div className="text-xs font-space text-white/30">
            © 2026 PAULA A. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </div>
  );
}
