import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-background pb-12 pt-32 md:pb-20"
    >
      {/* Atmospheric background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <motion.div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--accent-wine) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, var(--accent-olive) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, -20, 30, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating metadata - left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{ y, opacity }}
        className="absolute left-6 top-1/3 hidden flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground md:left-12 lg:flex"
      >
        <span>Status</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-olive" />
          Available for projects
        </span>
      </motion.div>

      {/* Floating metadata - right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        style={{ y, opacity }}
        className="absolute right-6 top-1/3 hidden flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground md:right-12 lg:flex"
      >
        <span>Location</span>
        <span>Buenos Aires, AR</span>
        <span className="mt-2">Coordinates</span>
        <span>-34.6037, -58.3816</span>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 px-6 md:px-12"
      >
        <div className="mx-auto max-w-[1800px]">
          {/* Top labels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-6 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:mb-8"
          >
            <span>Creative Frontend Developer</span>
            <span className="h-1 w-1 rounded-full bg-accent-wine" />
            <span>Digital Experiences</span>
            <span className="h-1 w-1 rounded-full bg-accent-wine" />
            <span>Interactive Systems</span>
          </motion.div>

          {/* Giant typography */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
              className="display-giant text-foreground"
            >
              <span className="block">CREATIVE</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="display-giant text-foreground"
            >
              <span className="block">TECHNOLOGY</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.33, 1, 0.68, 1] }}
              className="display-giant text-accent-beige"
            >
              <span className="block">ARCHIVE</span>
            </motion.h1>
          </div>

          {/* Bottom row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 flex flex-col items-start justify-between gap-6 md:mt-12 md:flex-row md:items-end"
          >
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              A living frontend system. Designing and engineering digital
              experiences through code, motion, and creative technology.
            </p>

            <div className="flex items-center gap-4">
              <motion.a
                href="#work"
                className="group flex items-center gap-3 border border-border px-6 py-3 transition-all hover:border-foreground hover:bg-foreground hover:text-background"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.1em]">
                  View Work
                </span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Scroll
          </span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-muted-foreground to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
