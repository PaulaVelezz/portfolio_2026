import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ResumeENG from "/CV_Paula_Velez_ Frontend_Developer_(ENG).pdf";
import ResumeESP from "/CV_Paula_Velez_ Desarrollador_Frontend_(ESP).pdf";

const asciiChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+?/@<>[]{}";

function AsciiWord({ text }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    let timeout;

    const scramble = () => {
      const original = text;

      let iteration = 0;

      clearInterval(timeout);

      timeout = setInterval(() => {
        el.innerText = original
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return original[index];
            }

            return asciiChars[Math.floor(Math.random() * asciiChars.length)];
          })
          .join("");

        if (iteration >= original.length) {
          clearInterval(timeout);
        }

        iteration += 1 / 2;
      }, 35);
    };

    el.addEventListener("mouseenter", scramble);

    return () => {
      el.removeEventListener("mouseenter", scramble);
      clearInterval(timeout);
    };
  }, [text]);

  return (
    <div
      ref={ref}
      className="
        font-mono
        font-black
        leading-[0.82]
        tracking-[-0.06em]
        text-white
        cursor-default
        select-none
      "
    >
      {text}
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-black
        border-t
        border-white/5
      "
    >
      {/* Glow */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-40
        "
      >
        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-[800px]
            h-[800px]
            rounded-full
            blur-[180px]
            bg-[#6D28D9]/20
          "
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5">
        {/* STATUS */}
        <div
          className="
            flex
            items-center
            gap-3
            mb-12
            mt-5
          "
        >
          <div className="relative">
            <div
              className="
                w-3 h-3
                rounded-full
                bg-[#A3E635]
              "
            />

            <div
              className="
                absolute
                inset-0
                rounded-full
                bg-[#A3E635]
                animate-ping
                opacity-40
              "
            />
          </div>

          <span
            className="
              text-xs
              tracking-[0.3em]
              uppercase
              text-neutral-400
            "
          >
            Available for select projects
          </span>
        </div>
        {/* CONTACT */}
        <div
          className="
            grid
            lg:grid-cols-12
            gap-16
            mb-24
          "
        >
          <div className="md:col-span-8 lg:col-span-6 text-left">
            <span className="text-[10px] text-[#a3e635] font-space tracking-[0.3em] block mb-3">
              // LET'S CONNECT
            </span>
            <h2 className="text-4xl sm:text-6xl font-sans font-black tracking-tighter uppercase leading-none">
              HAVE A PROJECT <br />
              <span className="text-neutral-500">IN MIND?</span>
            </h2>
            <a
              href="mailto:velezpaula.a@gmail.com"
              className="text-2xl sm:text-4xl font-space font-bold text-white hover:text-[#a3e635] transition-colors mt-6 inline-block underline decoration-1 underline-offset-8"
              data-cursor="magnetic"
            >
              velezpaula.a@gmail.com
            </a>
          </div>

          {/* Social Links & Credentials Grid */}
          <div className="md:col-span-4 lg:col-span-6 grid grid-cols-2 text-left text-xs font-space tracking-widest pl-0 md:pl-8">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-neutral-500">// SOCIALS</span>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://github.com/PaulaVelezz"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    GITHUB
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/paula-velez/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    LINKEDIN
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.behance.net/___paulavelez"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    BEHANCE
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/PaulaVelezz"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    TELEGRAM
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-neutral-500">// ARCHIVE</span>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    SERVICES
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    PROJECTS
                  </a>
                </li>
                <li>
                  <a
                    href={ResumeESP}
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    CV ESP
                  </a>
                </li>
                <li>
                  <a
                    href={ResumeENG}
                    className="hover:text-[#a3e635] transition-colors"
                    data-cursor="pointer"
                  >
                    CV ENG
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* HERO TITLE */}
        <div className="mb-20">
          <div
            className="
              text-[11vw]
              leading-none
              whitespace-nowrap
            "
          >
            <AsciiWord text="CREATIVE FRONTEND" />
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            justify-between
            gap-4
            pt-8
            border-t
            border-white/10
            text-neutral-500
            text-xs
            uppercase
            tracking-[0.2em]
          "
        >
          <span>© 2026 Paula Velez</span>

          <span>Built with React · GSAP · ASCII Systems</span>

          <span>Córdoba — Argentina</span>
        </div>
      </div>
    </footer>
  );
}
