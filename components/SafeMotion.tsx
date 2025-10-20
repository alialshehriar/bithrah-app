'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, ComponentProps } from 'react';

// Safe wrapper for motion components that prevents SSR issues
export function SafeMotion({ children, ...props }: ComponentProps<typeof motion.div>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div {...(props as any)}>{children}</div>;
  }

  return <motion.div {...props}>{children}</motion.div>;
}

// Safe AnimatePresence wrapper
export function SafeAnimatePresence({ children, ...props }: ComponentProps<typeof AnimatePresence>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <AnimatePresence {...props}>{children}</AnimatePresence>;
}

export { motion };

