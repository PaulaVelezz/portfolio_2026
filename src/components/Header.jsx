import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Header({
  currentPage,
  setPage,
  menuOpen,
  setMenuOpen,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    if (menuOpen) {
      // Slide down and fade in dropdown
      gsap.fromTo(
        dropdown,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
      );
    } else {
      // Slide up and fade out dropdown
      gsap.to(dropdown, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.25,
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  const navLinks = [
    { label: "HOME", page: "home" },
    { label: "ABOUT US", page: "about" },
    { label: "PROJECTS", page: "projects" },
    { label: "CONTACT", page: "detail" },
  ];

  return (
    <div className="fixed top-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      <div className="flex items-center gap-2">
        <a
          href="mailto:velezpaula.a@gmail.com"
          className="h-11 px-6 bg-[#ff5c35] hover:bg-[#e04b27] flex items-center text-white text-[10px] font-space font-bold tracking-widest transition-colors cursor-pointer rounded-full"
          data-cursor="magnetic"
        >
          LET'S WORK TOGETHER
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-11 px-6 rounded-full bg-white hover:bg-neutral-100 flex items-center gap-3 text-black text-[11px] font-space font-bold tracking-widest cursor-pointer shadow-lg transition-colors"
          data-cursor="magnetic"
        >
          {menuOpen ? "CLOSE" : "MENU"}
          <div className="flex flex-col gap-[3px] items-center justify-center">
            <span className="w-1 h-1 bg-black rounded-full" />
            <span className="w-1 h-1 bg-black rounded-full" />
          </div>
        </button>
      </div>
    </div>
  );
}
