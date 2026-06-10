import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Custom Art Deco SVG pattern for card backs
const CardBackPattern = ({ letter }) => (
  <svg className="w-full h-full p-4" viewBox="0 0 200 300" fill="none">
    {/* Borders */}
    <rect
      x="5"
      y="5"
      width="190"
      height="290"
      rx="10"
      stroke="white"
      strokeWidth="1.5"
    />
    <rect
      x="10"
      y="10"
      width="180"
      height="280"
      rx="8"
      stroke="white"
      strokeWidth="0.75"
      strokeDasharray="3 3"
    />

    {/* Corner details */}
    <path
      d="M5 25h15M25 5v15M175 5v15M195 25h-15M5 275h15M25 295v-15M175 295v-15M195 275h-15"
      stroke="white"
      strokeWidth="1"
    />

    {/* Geometric lines */}
    <line x1="10" y1="50" x2="190" y2="50" stroke="white" strokeWidth="1" />
    <line x1="10" y1="250" x2="190" y2="250" stroke="white" strokeWidth="1" />
    <line x1="50" y1="50" x2="150" y2="250" stroke="white" strokeWidth="0.5" />
    <line x1="150" y1="50" x2="50" y2="250" stroke="white" strokeWidth="0.5" />

    {/* Center Diamond & Circle */}
    <path
      d="M100 90 L160 150 L100 210 L40 150 Z"
      stroke="white"
      strokeWidth="1.5"
    />
    <circle
      cx="100"
      cy="150"
      r="30"
      stroke="white"
      strokeWidth="1.5"
      fill="#0c2bf7"
    />
    <text
      x="100"
      y="158"
      className="font-syne font-black text-2xl"
      fill="white"
      textAnchor="middle"
    >
      {letter}
    </text>
  </svg>
);

export default function About({ setPage }) {
  const containerRef = useRef(null);
  const cardGroupRef = useRef(null);
  const particleCanvasRef = useRef(null);

  const cardsData = [
    {
      letter: "S",
      title: "STRATEGY",
      services: [
        "Digital Experience Strategy",
        "Technology Strategy",
        "Creative Direction",
        "Discovery",
        "Research",
      ],
    },
    {
      letter: "C",
      title: "CREATIVE",
      services: [
        "Art Direction",
        "UX/UI Design",
        "Motion Design",
        "Interactive Design",
        "Illustration",
      ],
    },
    {
      letter: "T",
      title: "TECH",
      services: [
        "WebGL Development",
        "Front End Development",
        "Unity/Unreal",
        "Interactive Installations",
        "AR and VR Experiences",
      ],
    },
    {
      letter: "P",
      title: "PRODUCTION",
      services: [
        "Technical Production",
        "Quality Assurance",
        "Performance Audits",
        "Continuous Integration",
        "Deployment Code",
      ],
    },
  ];

  const [flippedCards, setFlippedCards] = useState(
    Array(cardsData.length).fill(false),
  );

  // 1. Particle Wave Canvas Simulation (Let's Work Together Section)
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Generate particles
    const initParticles = () => {
      particles = [];
      const count = Math.min(600, Math.floor(canvas.width * 0.4));
      const shapes = ["circle", "square", "triangle", "plus"];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.1,
          baseY: Math.random() * canvas.height,
          amplitude: Math.random() * 40 + 20,
          frequency: Math.random() * 0.005 + 0.002,
        });
      }
    };
    initParticles();

    // Mouse Move Tracker relative to canvas
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const drawSymbol = (c, x, y, size, shape) => {
      c.strokeStyle = "rgba(255, 255, 255, 0.7)";
      c.fillStyle = "rgba(255, 255, 255, 0.7)";
      c.lineWidth = 1;
      c.beginPath();

      if (shape === "circle") {
        c.arc(x, y, size / 2, 0, Math.PI * 2);
        c.fill();
      } else if (shape === "square") {
        c.rect(x - size / 2, y - size / 2, size, size);
        c.fill();
      } else if (shape === "triangle") {
        c.moveTo(x, y - size / 2);
        c.lineTo(x + size / 2, y + size / 2);
        c.lineTo(x - size / 2, y + size / 2);
        c.closePath();
        c.fill();
      } else if (shape === "plus") {
        c.moveTo(x - size / 2, y);
        c.lineTo(x + size / 2, y);
        c.moveTo(x, y - size / 2);
        c.lineTo(x, y + size / 2);
        c.stroke();
      }
    };

    let time = 0;
    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Continuous wave flow
        p.x += p.speed;
        if (p.x > canvas.width) p.x = 0;

        // Sine wave vertical motion
        const sineY =
          p.baseY + Math.sin(p.x * p.frequency + time) * p.amplitude;

        // Mouse avoidance/attraction displacement
        const dx = mouse.x - p.x;
        const dy = mouse.y - sineY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let dispX = 0;
        let dispY = 0;

        if (dist < 120) {
          const force = (120 - dist) * 0.12;
          const angle = Math.atan2(dy, dx);
          dispX = -Math.cos(angle) * force;
          dispY = -Math.sin(angle) * force;
        }

        drawSymbol(ctx, p.x + dispX, sineY + dispY, p.size, p.shape);
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Scroll-linked card animations & triggers
  useEffect(() => {
    const cards = gsap.utils.toArray(".card-perspective");

    const timeouts = [];

    const entranceTween = gsap.fromTo(
      cards,
      {
        y: 100,
        rotationY: 0,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardGroupRef.current,
          start: "top 75%",
        },
      },
    );

    const flipTrigger = ScrollTrigger.create({
      trigger: cardGroupRef.current,
      start: "top 40%",

      // ↓ BAJANDO
      onEnter: () => {
        cardsData.forEach((_, i) => {
          const timeout = setTimeout(() => {
            setFlippedCards((prev) => {
              const updated = [...prev];
              updated[i] = true;
              return updated;
            });
          }, i * 300);

          timeouts.push(timeout);
        });
      },

      // ↑ SUBIENDO
      onLeaveBack: () => {
        [...cardsData].reverse().forEach((_, reverseIndex) => {
          const cardIndex = cardsData.length - 1 - reverseIndex;

          const timeout = setTimeout(() => {
            setFlippedCards((prev) => {
              const updated = [...prev];
              updated[cardIndex] = false;
              return updated;
            });
          }, reverseIndex * 200);

          timeouts.push(timeout);
        });
      },
    });

    return () => {
      timeouts.forEach(clearTimeout);

      flipTrigger.kill();

      if (entranceTween.scrollTrigger) {
        entranceTween.scrollTrigger.kill();
      }

      entranceTween.kill();
    };
  }, [cardsData.length]);

  const toggleCard = (index) => {
    setFlippedCards((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0c2bf7] text-white flex flex-col z-10 overflow-hidden"
    >
      {/* 1. Area of Expertise Section */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-36 pb-20 md:px-12 md:pb-24">
        {/* Headline Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20 select-none">
          <div className="lg:col-span-8">
            <h2 className="text-6xl sm:text-7xl md:text-8xl font-sans font-black tracking-tight leading-[0.9] text-white uppercase">
              AREA OF <br />
              EXPERTISE
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-6 pt-4 lg:pt-0">
            <p className="text-xs font-sans font-bold tracking-wider leading-relaxed text-white/85 max-w-sm lg:text-right">
              MULTIDISCIPLINARY EXPERTISE ACROSS STRATEGY, CREATIVE, TECHNOLOGY,
              AND PRODUCTION.
            </p>
            {/* Square badge indicators */}
            <div className="flex gap-2">
              {["S", "C", "T", "P"].map((l) => (
                <div
                  key={l}
                  className="w-8 h-8 border border-white/40 flex items-center justify-center text-xs font-space font-bold tracking-widest text-white/70"
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curved Connection Path & Cards Grid */}
        <div
          ref={cardGroupRef}
          className="relative w-full py-16 flex items-center justify-center"
        >
          {/* Curved track path behind cards */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 pointer-events-none opacity-40">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 Q250,90 500,50 T1000,50"
                fill="none"
                stroke="white"
                strokeWidth="4"
              />
            </svg>
          </div>

          {/* Playing Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full z-10">
            {cardsData.map((card, idx) => {
              const rotAngle =
                idx === 0
                  ? "-rotate-6"
                  : idx === 1
                    ? "-rotate-2"
                    : idx === 2
                      ? "rotate-2"
                      : "rotate-6";
              const isFlipped = flippedCards[idx];

              return (
                <div
                  key={card.title}
                  className={`card-perspective h-[420px] cursor-pointer ${rotAngle} hover:scale-105 transition-transform duration-300`}
                  onClick={() => toggleCard(idx)}
                  data-cursor="pointer"
                >
                  {/* Card Flip Inner */}
                  <div
                    className="card-inner w-full h-full shadow-2xl"
                    style={{
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                    }}
                  >
                    {/* CARD BACK Face (Blue Pattern) */}
                    <div className="card-face w-full h-full bg-[#0c2bf7] border border-white/20">
                      <CardBackPattern letter={card.letter} />
                    </div>

                    {/* CARD FRONT Face (White Info Box) */}
                    <div className="card-face card-back w-full h-full bg-white text-black p-6 flex flex-col justify-between select-none">
                      {/* Top Bar */}
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-space font-extrabold tracking-widest text-black/90">
                          {card.title}
                        </span>
                        <span className="w-6 h-6 bg-black text-white text-[11px] font-space font-bold flex items-center justify-center">
                          {card.letter}
                        </span>
                      </div>

                      {/* Middle Services List */}
                      <div className="flex flex-col gap-3 py-6 my-auto text-left font-sans text-xs">
                        {card.services.map((svc) => (
                          <div
                            key={svc}
                            className="pb-2 border-b border-dashed border-black/10 text-neutral-800 font-medium"
                          >
                            {svc}
                          </div>
                        ))}
                      </div>

                      {/* Bottom Bar (Inverted copy for card rotation) */}
                      <div className="flex justify-between items-end rotate-180">
                        <span className="text-xs font-space font-extrabold tracking-widest text-black/90">
                          {card.title}
                        </span>
                        <span className="w-6 h-6 bg-black text-white text-[11px] font-space font-bold flex items-center justify-center">
                          {card.letter}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
