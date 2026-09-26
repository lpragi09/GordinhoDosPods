"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function HeroCta() {
  const router = useRouter();

  return (
    <MagneticButton onClick={() => router.push("/produtos")} className="px-8 py-4 text-base">
      Ver produtos
      <ArrowRight size={18} />
    </MagneticButton>
  );
}
