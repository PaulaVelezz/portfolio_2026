import { useEffect, useState } from "react";
import { gsap } from "gsap";
import AsciiPortrait from "./AsciiPortrait";

// Premium Text Scrambling Reveal Component
function ScrambleText({
  text,
  delay = 0,
  duration = 1.2,
  isRevealed = false,
  onComplete,
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!isRevealed) {
      setDisplayText("");
      return;
    }

    const chars = text.split("");
    const scrambleSymbols = "XX//??**++--%%&&$$##@@!!01".split("");
    let frame = 0;
    const fps = 60;
    const startFrame = Math.round(delay * fps);
    const endFrame = Math.round((delay + duration) * fps);

    const intervalId = setInterval(() => {
      frame++;
      if (frame < startFrame) {
        setDisplayText("");
        return;
      }

      const progress = (frame - startFrame) / (endFrame - startFrame);
      if (progress >= 1) {
        setDisplayText(text);
        clearInterval(intervalId);
        if (onComplete) onComplete();
        return;
      }

      // Reveal progressively from left to right
      const revealCount = Math.floor(chars.length * progress);
      const scrambled = chars.map((char, index) => {
        if (index < revealCount) {
          return char;
        }
        if (index < revealCount + 4 && char !== " ") {
          return scrambleSymbols[
            Math.floor(Math.random() * scrambleSymbols.length)
          ];
        }
        return ""; // Hidden / masked
      });

      setDisplayText(scrambled.join(""));
    }, 1000 / fps);

    return () => clearInterval(intervalId);
  }, [text, delay, duration, isRevealed]);

  return <span className="font-mono">{displayText}</span>;
}

export default function HeroSection({ setPage }) {
  const [startSecondaryReveal, setStartSecondaryReveal] = useState(false);
  const [portraitRevealed, setPortraitRevealed] = useState(false);

  useEffect(() => {
    if (startSecondaryReveal) {
      gsap.fromTo(
        ".hero-sub-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        },
      );
      // Trigger ASCII portrait entrance
      setPortraitRevealed(true);
    }
  }, [startSecondaryReveal]);

  return (
    <section className="relative min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-between z-10 border-b border-white/5">
      <div className="w-full flex justify-between items-center px-6 py-6 md:px-12 border-b border-white/5">
        <button
          onClick={() => setPage("home")}
          className="text-2xl font-black tracking-tighter cursor-pointer text-white font-syne select-none hover:text-[#ff5c35] transition-colors"
          data-cursor="magnetic"
          aria-label="Home page logo link"
        >
          PAULA A.
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 md:px-12 my-auto py-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-8 select-none">
          <div className="flex flex-col gap-2">
            {/* Masking container for headline line 1 */}
            <div className="overflow-hidden">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-syne font-extrabold tracking-tight text-white leading-none">
                <ScrambleText
                  text="Interactive code."
                  delay={0.1}
                  isRevealed={true}
                />
              </h1>
            </div>
            {/* Masking container for headline line 2 */}
            <div className="overflow-hidden">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-syne font-extrabold tracking-tight text-neutral-500 leading-none">
                <ScrambleText
                  text="Sensory logic."
                  delay={0.6}
                  isRevealed={true}
                  onComplete={() => setStartSecondaryReveal(true)}
                />
              </h1>
            </div>
          </div>

          {/* Subtext reveal - triggered after title settles */}
          <div className="hero-sub-reveal opacity-0 max-w-lg">
            <p className="text-sm md:text-base text-neutral-400 font-sans leading-relaxed">
              Paula A. is an interactive developer sculpting
              hardware-accelerated interfaces. Focused on motion design,
              interactive physics, and high-performance WebGL modules.
            </p>
          </div>

          {/* Interactive CTAs */}
          <div className="hero-sub-reveal opacity-0 flex items-center gap-6 mt-4">
            <div className="flex items-center">
              <button
                onClick={() => setPage("projects")}
                className="h-12 px-6 bg-[#ff5c35] hover:bg-[#e04b27] flex items-center text-white text-xs font-space font-bold tracking-widest transition-colors cursor-pointer rounded-l-full"
                data-cursor="magnetic"
              >
                EXPLORE WORK
              </button>
              <button
                onClick={() => setPage("projects")}
                className="w-12 h-12 bg-[#ff5c35]/90 hover:bg-[#ff5c35] text-white border-l border-black/10 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer rounded-r-full"
                data-cursor="magnetic"
                aria-label="Quick view portfolio list"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 flex justify-center lg:justify-end overflow-hidden w-full">
          <div className="w-full max-w-[420px]">
            <AsciiPortrait isRevealed={portraitRevealed} />
          </div>
        </div>
      </div>
    </section>
  );
}
