"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const progress = useMotionValue(0);
  const scaleX = useSpring(progress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Start loading on path change
    setLoading(true);
    progress.set(0.3);

    // Animate to near-complete
    const t1 = setTimeout(() => progress.set(0.7), 100);
    const t2 = setTimeout(() => progress.set(0.9), 300);

    // Complete and hide
    const t3 = setTimeout(() => {
      progress.set(1);
      setTimeout(() => {
        setLoading(false);
        progress.set(0);
      }, 300);
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, progress]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              scaleX,
              background: "linear-gradient(90deg, #a3e635, #65a30d, #a3e635)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
