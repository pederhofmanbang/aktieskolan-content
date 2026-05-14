export const SECTOR_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  Bank: { bg: "bg-blue-100", text: "text-blue-800", ring: "ring-blue-200" },
  Industri: { bg: "bg-neutral-100", text: "text-neutral-800", ring: "ring-neutral-200" },
  Spel: { bg: "bg-purple-100", text: "text-purple-800", ring: "ring-purple-200" },
  Läkemedel: { bg: "bg-emerald-100", text: "text-emerald-800", ring: "ring-emerald-200" },
  Telekom: { bg: "bg-cyan-100", text: "text-cyan-800", ring: "ring-cyan-200" },
  Detaljhandel: { bg: "bg-pink-100", text: "text-pink-800", ring: "ring-pink-200" },
  Investmentbolag: { bg: "bg-amber-100", text: "text-amber-800", ring: "ring-amber-200" },
  Råvaror: { bg: "bg-orange-100", text: "text-orange-800", ring: "ring-orange-200" },
  Fond: { bg: "bg-primary/10", text: "text-primary-dark", ring: "ring-primary/20" },
};

export function sectorColors(sector: string | undefined) {
  return SECTOR_COLORS[sector ?? "Fond"] ?? SECTOR_COLORS.Industri;
}
