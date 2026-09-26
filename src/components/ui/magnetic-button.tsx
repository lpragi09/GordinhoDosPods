"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  strength?: number;
};

export function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
  strength = 18,
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.94 }}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-accent px-7 py-3.5 text-sm font-semibold tracking-tight text-accent-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-y-full bg-foreground transition-transform duration-300 ease-out group-hover:translate-y-0" />
      <span className="pointer-events-none absolute inset-0 z-[5] flex translate-y-full items-center justify-center gap-2 text-background transition-transform duration-300 ease-out group-hover:translate-y-0">
        {children}
      </span>
    </motion.button>
  );
}
