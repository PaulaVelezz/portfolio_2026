import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            setIsVisible(false);

            setTimeout(() => {
              if (onComplete) onComplete();
            }, 500);
          }, 300);

          return 100;
        }

        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Initializing Archive
              </span>

              <motion.div
                className="text-5xl font-bold tracking-tighter text-foreground md:text-7xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                CTA
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-[1px] w-48 overflow-hidden bg-border">
                <motion.div
                  className="h-full bg-foreground"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {Math.min(Math.round(progress), 100)
                  .toString()
                  .padStart(3, "0")}
                %
              </span>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-8 font-mono text-[10px] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="uppercase tracking-[0.15em]">
              Creative Technology Archive
            </span>
            <br />
            <span className="text-accent-beige">v1.0.0</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
