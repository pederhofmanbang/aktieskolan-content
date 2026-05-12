export function formatKr(n: number, fractionDigits = 0): string {
  const v = n.toLocaleString("sv-SE", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${v} kr`;
}

export function formatSignedKr(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "" : "";
  return `${sign}${formatKr(n)}`;
}

export function formatPct(n: number, fractionDigits = 1): string {
  return `${n.toFixed(fractionDigits)} %`;
}
