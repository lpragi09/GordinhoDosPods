import type { Settings } from "@prisma/client";

export function computeShippingCents(itemsCents: number, settings: Settings) {
  if (
    settings.freeShippingCents != null &&
    itemsCents >= settings.freeShippingCents
  ) {
    return 0;
  }
  return settings.flatShippingCents;
}
