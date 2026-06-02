import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Header({ currentPage, setPage, menuOpen, setMenuOpen }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    if (menuOpen) {
      // Slide down and fade in dropdown
      gsap.fromTo(
        dropdown,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    } else {
      // Slide up and fade out dropdown
      gsap.to(dropdown, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.25,
        ease: 'power3.in',
      });
    }
  }, [menuOpen]);

  const navLinks = [
    { label: 'HOME', page: 'home' },
    { label: 'ABOUT US', page: 'about' },
    { label: 'PROJECTS', page: 'projects' },
    { label: 'CONTACT', page: 'detail' }, // Case Study details behaves as contact / detailed template in layout
  ];

  return (
    <div className="fixed top-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* 1. Pill Header Row */}
      <div className="flex items-center gap-2">
        {/* Wave Squiggle Pill (White circle) */}
        <button
          onClick={() => setPage('home')}
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300"
          data-cursor="magnetic"
          aria-label="Home"
        >
          {/* squiggly wave icon */}
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12c3-4 6-4 9 0s6 4 9 0"
            />
          </svg>
        </button>

        {/* Talk Pill (Dark) */}
        <a
          href="mailto:hello@paula-studio.com"
          className="h-11 px-6 rounded-full bg-[#1e2025] hover:bg-[#2b2d35] flex items-center gap-3 text-white text-[11px] font-space font-bold tracking-widest cursor-pointer shadow-lg transition-colors"
          data-cursor="magnetic"
        >
          LET'S TALK
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
        </a>

        {/* Menu Toggle Pill (White) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-11 px-6 rounded-full bg-white hover:bg-neutral-100 flex items-center gap-3 text-black text-[11px] font-space font-bold tracking-widest cursor-pointer shadow-lg transition-colors"
          data-cursor="magnetic"
        >
          {menuOpen ? 'CLOSE' : 'MENU'}
          <div className="flex flex-col gap-[3px] items-center justify-center">
            <span className="w-1 h-1 bg-black rounded-full" />
            <span className="w-1 h-1 bg-black rounded-full" />
          </div>
        </button>
      </div>

      {/* 2. Dropdown Menu Block (Slides down under pills) */}
      {(menuOpen || dropdownRef.current) && (
        <div
          ref={dropdownRef}
          className={`w-72 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden flex flex-col transition-all duration-300 ${
            menuOpen ? 'pointer-events-auto block' : 'pointer-events-none hidden'
          }`}
        >
          {/* Main Links Container (White box) */}
          <div className="p-8 flex flex-col gap-6 bg-white">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    setPage(link.page);
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-between text-left group cursor-pointer"
                  data-cursor="pointer"
                >
                  <span className="text-xl font-space font-bold tracking-tight text-neutral-800 group-hover:text-black transition-colors">
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="w-2.5 h-2.5 bg-black rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Attached Pill (Black bar) */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="bg-black py-4 px-8 flex justify-between items-center text-white hover:text-[#e5c07b] transition-colors cursor-pointer"
            data-cursor="pointer"
          >
            <span className="text-sm font-space font-bold tracking-widest flex items-center gap-1">
              <span className="text-base">ö</span> LABS
            </span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
