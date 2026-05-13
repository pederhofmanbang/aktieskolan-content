/**
 * ISK-skatt 2026.
 *
 * Parametrar (Skatteverket / regeringens beslut):
 * - Fribelopp: 300 000 kr per person.
 * - Statslåneräntan 30/11 2025: 2,55 %.
 * - Schablonintäkten: max(SLR + 1, 1.25) procent av kapitalunderlaget över
 *   fribeloppet.
 * - Skattesatsen på schablonintäkten: 30 %.
 *
 * Resultat 2026: 1,065 % på kapital över 300 000 kr.
 */
export const ISK_FRIBELOPP_2026 = 300_000;
export const ISK_STATSLANERANTA_2026 = 0.0255;
export const ISK_PAFLAGG = 0.01;
export const ISK_MIN_RATE = 0.0125;
export const ISK_TAX_RATE = 0.3;

export type ISKBreakdown = {
  kapitalunderlag: number;
  fribelopp: number;
  skattegrund: number;
  schablonintaktRate: number;
  schablonintakt: number;
  skattRate: number;
  schablonskatt: number;
};

export function calculateISK(kapitalunderlag: number): ISKBreakdown {
  const skattegrund = Math.max(0, kapitalunderlag - ISK_FRIBELOPP_2026);
  const schablonintaktRate = Math.max(
    ISK_STATSLANERANTA_2026 + ISK_PAFLAGG,
    ISK_MIN_RATE,
  );
  const schablonintakt = skattegrund * schablonintaktRate;
  const schablonskatt = schablonintakt * ISK_TAX_RATE;
  const effectiveRate = schablonintaktRate * ISK_TAX_RATE;
  return {
    kapitalunderlag,
    fribelopp: ISK_FRIBELOPP_2026,
    skattegrund,
    schablonintaktRate,
    schablonintakt,
    skattRate: effectiveRate,
    schablonskatt,
  };
}

/**
 * Hur mycket AF-skatt skulle kosta vid en hypotetisk realisering av all vinst.
 */
export function calculateAFTax(realizedGain: number): number {
  if (realizedGain <= 0) return 0;
  return realizedGain * 0.3;
}

/**
 * Brytpunkt: vid vilken avkastning är ISK och AF lika dyra?
 *
 * AF-skatt = vinst × 0.3
 * ISK-skatt = (kapital - fribelopp) × 1.065 % (≈ 0.01065)
 *
 * Sätt lika och lös: vinst × 0.3 = kapital × 0.01065 (approximation där
 * kapital >> fribelopp). vinst/kapital = 0.01065 / 0.3 = ~3.55 %.
 */
export const ISK_BREAKEVEN_RETURN = 0.0355;
