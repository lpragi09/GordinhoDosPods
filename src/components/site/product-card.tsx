"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  slug: string;
  name: string;
  priceCents: number;
  compareCents?: number | null;
  imageUrl?: string | null;
};

export function ProductCard({
  slug,
  name,
  priceCents,
  compareCents,
  imageUrl,
}: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    ref.current?.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current?.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <Link href={`/produtos/${slug}`}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
        style={{
          backgroundImage:
            "radial-gradient(240px circle at var(--x, 50%) var(--y, 50%), rgba(214,255,63,0.12), transparent 70%)",
        }}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-black/20">
          {imageUrl ? (
            <motion.div style={{ rotateX, rotateY }} className="h-full w-full [transform-style:preserve-3d]">
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">Sem imagem</div>
          )}
        </div>
        <div className="relative z-10 p-4">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground/90">{name}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-accent">
              {formatCurrency(priceCents)}
            </span>
            {compareCents && compareCents > priceCents && (
              <span className="text-xs text-muted line-through">{formatCurrency(compareCents)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
