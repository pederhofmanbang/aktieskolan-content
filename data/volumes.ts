export type VolumeInfo = {
  avgDailyVolume: number;
};

export const VOLUMES: Record<string, VolumeInfo> = {
  "INVE-A.ST": { avgDailyVolume: 150_000 },
  "INVE-B.ST": { avgDailyVolume: 2_500_000 },
  "HM-B.ST": { avgDailyVolume: 3_000_000 },
  "VOLV-B.ST": { avgDailyVolume: 4_500_000 },
  "ATCO-B.ST": { avgDailyVolume: 2_000_000 },
  "ERIC-B.ST": { avgDailyVolume: 7_000_000 },
  "SHB-A.ST": { avgDailyVolume: 3_000_000 },
  "SEB-A.ST": { avgDailyVolume: 2_500_000 },
  "SWED-A.ST": { avgDailyVolume: 2_000_000 },
  "NDA-SE.ST": { avgDailyVolume: 5_000_000 },
  "EVO.ST": { avgDailyVolume: 1_000_000 },
  "AZN.ST": { avgDailyVolume: 700_000 },
  "SAND.ST": { avgDailyVolume: 1_500_000 },
  "ASSA-B.ST": { avgDailyVolume: 1_500_000 },
  "BOL.ST": { avgDailyVolume: 700_000 },
  "ABB.ST": { avgDailyVolume: 700_000 },
};
