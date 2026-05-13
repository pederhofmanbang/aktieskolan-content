export type Fundamentals = {
  pe: number;
  ps: number;
  pb: number;
  directYield: number;
  solidity: number;
  roe: number;
};

/**
 * Pedagogiska nyckeltal för screener-uppdraget i lektion 8.
 *
 * Värdena är realistiska approximationer baserat på publika siffror från
 * Avanza/Börsdata under perioden 2024-2026 men ska inte tolkas som exakt
 * realtidsdata — de räcker för att låta användaren öva på att sätta filter
 * och se rimliga utfall (exempelvis: P/E < 12 plockar fram banker, soliditet
 * > 50 % filtrerar bort bankerna, etc.).
 */
export const FUNDAMENTALS: Record<string, Fundamentals> = {
  "INVE-A.ST": { pe: 15.5, ps: 12.0, pb: 1.05, directYield: 3.0, solidity: 80, roe: 13 },
  "INVE-B.ST": { pe: 15.5, ps: 12.0, pb: 1.05, directYield: 3.0, solidity: 80, roe: 13 },
  "HM-B.ST":   { pe: 22.0, ps: 1.4,  pb: 5.5,  directYield: 3.5, solidity: 50, roe: 25 },
  "VOLV-B.ST": { pe: 12.0, ps: 1.1,  pb: 2.8,  directYield: 4.0, solidity: 33, roe: 22 },
  "ATCO-B.ST": { pe: 25.0, ps: 4.0,  pb: 7.5,  directYield: 2.2, solidity: 50, roe: 30 },
  "ERIC-B.ST": { pe: 14.0, ps: 1.4,  pb: 1.8,  directYield: 2.7, solidity: 37, roe: 12 },
  "SHB-A.ST":  { pe: 9.0,  ps: 3.1,  pb: 1.0,  directYield: 6.0, solidity: 5,  roe: 13 },
  "SEB-A.ST":  { pe: 8.0,  ps: 2.5,  pb: 1.1,  directYield: 7.0, solidity: 5,  roe: 16 },
  "SWED-A.ST": { pe: 9.0,  ps: 3.0,  pb: 1.2,  directYield: 6.0, solidity: 5,  roe: 14 },
  "NDA-SE.ST": { pe: 8.0,  ps: 2.5,  pb: 1.3,  directYield: 7.0, solidity: 5,  roe: 15 },
  "EVO.ST":    { pe: 18.0, ps: 8.0,  pb: 5.0,  directYield: 3.0, solidity: 70, roe: 30 },
  "AZN.ST":    { pe: 18.0, ps: 4.5,  pb: 4.0,  directYield: 2.0, solidity: 40, roe: 15 },
  "SAND.ST":   { pe: 16.0, ps: 2.0,  pb: 3.5,  directYield: 3.0, solidity: 50, roe: 20 },
  "ASSA-B.ST": { pe: 20.0, ps: 2.4,  pb: 4.0,  directYield: 2.0, solidity: 45, roe: 17 },
  "BOL.ST":    { pe: 12.0, ps: 1.6,  pb: 1.8,  directYield: 3.5, solidity: 55, roe: 15 },
  "ABB.ST":    { pe: 22.0, ps: 2.8,  pb: 5.0,  directYield: 2.5, solidity: 40, roe: 20 },
};
