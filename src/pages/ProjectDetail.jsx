import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import devinImg from '../assets/devin_project.png';
import devinDetailImg from '../assets/devin_detail.png';
import fluidImg from '../assets/fluid_project.png';
import topoImg from '../assets/topo_project.png';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetail({ setPage }) {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollRef = useRef(null);

  // Horizontal Scroll Pinning (GSAP ScrollTrigger)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const triggerElement = triggerRef.current;
    if (!scrollContainer || !triggerElement) return;

    const calculateScrollWidth = () => {
      return -(scrollContainer.scrollWidth - window.innerWidth);
    };

    const pin = gsap.fromTo(
      scrollContainer,
      { x: 0 },
      {
        x: calculateScrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerElement,
          pin: true,
          scrub: 0.7,
          start: 'top top',
          end: () => `+=${scrollContainer.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      pin.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full z-10 bg-[#0a0a0c] text-white">
      
      {/* 1. Reconstructed Project Info (3-Column Split - Screenshot 8) */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-24 md:px-12 md:pb-32 select-none">
        
        {/* Main Title Row */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white mb-16">
          Paula Labs
        </h1>

        {/* 3-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1 (Left - 5 cols): Description Copy & Launch Button */}
          <div className="lg:col-span-5 flex flex-col gap-6 items-start">
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">
              Dedication to Innovation and Exploration. Our dedicated space showcases internal R&D initiatives, reflecting our commitment to tech advancement. With a sleek, enchanting design, the site offers exclusive insights into our ongoing research, sparking curiosity and inspiring engaging experiences.
            </p>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">
              Pioneering the Future of Tech-Driven Products. For our clients, this website unveils uncharted possibilities. Displaying our prowess with groundbreaking tech, it inspires fresh avenues for captivating and engaging target audiences.
            </p>
            
            {/* White Pill button with black circle dot */}
            <button
              onClick={() => window.open('https://github.com')}
              className="h-11 px-6 rounded-full bg-white text-black hover:bg-neutral-100 flex items-center gap-3 text-[11px] font-space font-bold tracking-widest transition-colors cursor-pointer mt-4"
              data-cursor="magnetic"
            >
              <span className="w-2 h-2 bg-black rounded-full" />
              LAUNCH PROJECT
            </button>
          </div>

          {/* Column 2 (Middle - 3 cols): Lists of Services & Links */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 text-xs font-space tracking-widest pl-0 lg:pl-8">
            {/* Services List */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-neutral-500">// SERVICES</span>
              <ul className="flex flex-col gap-2 text-white">
                <li>Concept</li>
                <li>Web Design</li>
                <li>Web Development</li>
                <li>3D Design</li>
                <li>WebGL</li>
              </ul>
            </div>
            
            {/* Links List */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-6 lg:pt-0 lg:border-t-0">
              <span className="text-[10px] text-neutral-500">// LINKS</span>
              <ul className="flex flex-col gap-2 text-white">
                <li>FWA SOTD</li>
                <li>Awwwards SOTD</li>
              </ul>
            </div>
          </div>

          {/* Column 3 (Right - 4 cols): Large Rounded Media Card */}
          <div className="lg:col-span-4">
            <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-neutral-950">
              <img
                src={devinImg}
                alt="3D Particle Logo Visual"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. Pinned Horizontal Gallery Section (Screenshot 9) */}
      <section ref={triggerRef} className="relative h-screen w-full overflow-hidden bg-[#0d0d0f]">
        
        {/* Horizontal Container scrolling right */}
        <div ref={scrollRef} className="absolute top-0 left-0 h-full flex items-center gap-12 pl-12 pr-0 select-none">
          
          {/* Card 1: Particle Love layout */}
          <div className="w-[480px] h-[580px] flex-shrink-0 flex flex-col justify-between p-10 bg-black rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
            
            {/* Smoke / Particle Background */}
            <div className="absolute inset-0 opacity-40">
              <img
                src={fluidImg}
                alt="Smoke particles"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Top row metadata */}
            <div className="w-full flex justify-between items-start z-10 text-[9px] font-space tracking-widest text-neutral-400">
              <span>EXP 010 / 2026</span>
              <span className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center text-xs">●</span>
            </div>

            {/* Bottom details */}
            <div className="z-10 text-left">
              <h3 className="text-3xl font-sans font-bold tracking-tight text-white mb-2">
                Particle Love
              </h3>
              <span className="text-[10px] font-space tracking-widest text-[#ff5c35]">
                WEBGL / SHADERS
              </span>
            </div>
          </div>

          {/* Card 2: App Mockups on Slate Rock Background */}
          <div className="w-[780px] h-[580px] flex-shrink-0 flex items-center justify-center bg-neutral-950 border border-white/5 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0">
              <img
                src={devinDetailImg}
                alt="Slate texture"
                className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Mockups Container */}
            <div className="relative z-10 grid grid-cols-3 gap-6 max-w-2xl px-6 items-center">
              <div className="aspect-[9/16] bg-white text-black p-4 rounded-xl shadow-lg text-[8px] font-sans flex flex-col justify-between">
                <div>
                  <div className="font-bold border-b pb-1 mb-2">LUSION</div>
                  <div className="text-lg font-bold font-syne leading-none">Mind<br />Flayer</div>
                </div>
                <div className="w-full h-1/2 bg-black rounded" />
              </div>
              <div className="aspect-[9/16] bg-neutral-900 text-white p-4 rounded-xl shadow-lg text-[8px] font-sans flex flex-col justify-between border border-white/10">
                <div>
                  <div className="font-bold border-b border-white/10 pb-1 mb-2">LUSION</div>
                  <div className="text-lg font-bold font-syne leading-none text-[#ff5c35]">System<br />Core</div>
                </div>
                <div className="w-full h-1/2 bg-neutral-800 rounded" />
              </div>
              <div className="aspect-[9/16] bg-white text-black p-4 rounded-xl shadow-lg text-[8px] font-sans flex flex-col justify-between">
                <div>
                  <div className="font-bold border-b pb-1 mb-2">LUSION</div>
                  <div className="text-lg font-bold font-syne leading-none">Play<br />Ground</div>
                </div>
                <div className="w-full h-1/2 bg-black rounded" />
              </div>
            </div>
          </div>

          {/* Next Project Slider Panel (Reconstructed light slide - Screenshot 9 right side) */}
          <div
            onClick={() => setPage('home')}
            className="w-[100vw] h-full flex-shrink-0 bg-[#f0f0f5] text-black flex flex-col justify-between p-16 select-none relative overflow-hidden cursor-pointer"
            data-cursor="view"
          >
            {/* Decorative leaf shadow overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
              {/* Simple palm leaf SVG shadow */}
              <svg className="w-full h-full scale-150 origin-bottom-right rotate-45" viewBox="0 0 100 100" fill="currentColor">
                <path d="M90 90 Q 70 80 50 60 T 10 10 Q 30 40 50 60 T 90 90 Z M80 70 Q 60 65 45 55 T 5 5 Z M60 50 Q 40 45 30 35 T 2 1 Z" />
              </svg>
            </div>

            {/* Empty top for structural margins */}
            <div />

            {/* Giant Title */}
            <div className="text-left z-10 max-w-4xl">
              <h2 className="text-6xl sm:text-7xl md:text-8xl font-sans font-medium tracking-tight text-neutral-800 leading-none">
                My Little <br />
                Storybook.
              </h2>
            </div>

            {/* Next Project Link & Line Indicator */}
            <div className="w-full flex justify-between items-center z-10 border-t border-black/10 pt-8 mt-12 max-w-4xl">
              <div className="flex items-center gap-6">
                <span className="text-xs font-space font-bold tracking-widest text-neutral-800">
                  NEXT PROJECT
                </span>
                {/* Horizontal Progress Bar */}
                <div className="w-36 h-[2px] bg-neutral-300 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-[#ff5c35]" />
                </div>
              </div>
              
              {/* Arrow */}
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
