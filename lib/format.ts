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

export function formatShares(n: number, isFund: boolean): string {
  if (isFund) {
    return `${n.toLocaleString("sv-SE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })} andelar`;
  }
  return `${Math.round(n).toLocaleString("sv-SE")} st`;
}

export function formatVolume(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toLocaleString("sv-SE", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} milj/dag`;
  }
  if (n >= 1_000) {
    return `${Math.round(n / 1_000).toLocaleString("sv-SE")} k/dag`;
  }
  return `${Math.round(n).toLocaleString("sv-SE")}/dag`;
}
