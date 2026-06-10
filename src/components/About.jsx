import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function About() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-surface py-32 md:py-48"
    >
      <div className="mx-auto max-w-[1800px] px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24 lg:gap-32">
          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div style={{ y: imageY }} className="relative">
              {/* Main image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-background">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop"
                  alt="Creative Developer"
                  className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/50 via-transparent to-transparent" />
              </div>

              {/* Floating metadata */}
              <div className="absolute -right-4 bottom-12 bg-background p-4 md:-right-8">
                <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Based in
                </span>
                <span className="text-lg font-bold">Córdoba</span>
                <span className="block font-mono text-[10px] text-muted-foreground">
                  Argentina
                </span>
              </div>

              {/* Status indicator */}
              <div className="absolute -left-4 top-12 flex items-center gap-2 bg-accent-wine px-3 py-2 md:-left-8">
                <span className="h-2 w-2 animate-pulse rounded-full bg-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground">
                  Open to work
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content column */}
          <motion.div
            style={{ y: textY }}
            className="flex flex-col justify-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-wine"
            >
              04 / About
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              Building digital
              <br />
              <span className="text-accent-beige">experiences</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex flex-col gap-6"
            >
              <p className="text-lg leading-relaxed text-muted-foreground">
                Creative Frontend Developer focused on crafting immersive
                digital experiences through code, motion, and creative
                technology.
              </p>

              <p className="text-base leading-relaxed text-muted-foreground">
                With a background spanning React ecosystems, WordPress
                architecture, and motion design, I bridge the gap between design
                vision and technical implementation. Every project is an
                opportunity to push boundaries and create something meaningful.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-8 grid grid-cols-3 gap-8 border-y border-border py-8"
            >
              <div>
                <span className="block text-3xl font-bold md:text-4xl">5+</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Years Exp.
                </span>
              </div>

              <div>
                <span className="block text-3xl font-bold md:text-4xl">
                  50+
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Projects
                </span>
              </div>

              <div>
                <span className="block text-3xl font-bold md:text-4xl">
                  20+
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Clients
                </span>
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {[
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/paula-velez/",
                },
                { label: "GitHub", href: "https://github.com/PaulaVelezz" },
                {
                  label: "Behance",
                  href: "https://www.behance.net/___paulavelez",
                },
                { label: "CV", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                >
                  {link.label}

                  <svg
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
