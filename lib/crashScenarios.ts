export type CrashScenario = {
  id: string;
  name: string;
  year: string;
  description: string;
  drawdown: number;
  durationMonths: number;
  recoveryMonths: number;
};

export const CRASH_SCENARIOS: CrashScenario[] = [
  {
    id: "dotcom",
    name: "Dotcom-kraschen",
    year: "2000–2002",
    description: "IT-bubblan sprack. Tech-aktier rasade hårdast, men hela bredden tappade.",
    drawdown: -0.65,
    durationMonths: 30,
    recoveryMonths: 60,
  },
  {
    id: "finance",
    name: "Finanskrisen",
    year: "2007–2009",
    description: "Banker kollapsade globalt efter sub-prime-bubblan. Svensk börs halverades.",
    drawdown: -0.55,
    durationMonths: 17,
    recoveryMonths: 36,
  },
  {
    id: "corona",
    name: "Coronakraschen",
    year: "2020",
    description: "Pandemin slog till på 4 veckor. Snabbaste raset någonsin — och snabbaste återhämtningen.",
    drawdown: -0.3,
    durationMonths: 1,
    recoveryMonths: 5,
  },
  {
    id: "inflation",
    name: "Inflations- och räntekrisen",
    year: "2022",
    description: "Räntorna höjdes snabbt mot inflationen. Tech-aktier och tillväxtbolag tog stryk.",
    drawdown: -0.25,
    durationMonths: 12,
    recoveryMonths: 18,
  },
];

export type CrashPoint = {
  monthIndex: number;
  monthLabel: string;
  marketValueMultiplier: number;
  phase: "before" | "down" | "trough" | "recovery" | "back";
};

/**
 * Simulera ett crash-scenario: peak → linjärt ner till trough → linjärt
 * tillbaka till break-even. Returnerar en multiplier för marknadsvärdet per
 * månad. Kassan påverkas inte.
 */
export function simulateCrash(scenario: CrashScenario): CrashPoint[] {
  const points: CrashPoint[] = [];
  const total = scenario.durationMonths + scenario.recoveryMonths;
  for (let i = 0; i <= total; i++) {
    let mult: number;
    let phase: CrashPoint["phase"];
    if (i === 0) {
      mult = 1;
      phase = "before";
    } else if (i < scenario.durationMonths) {
      mult = 1 + (scenario.drawdown * i) / scenario.durationMonths;
      phase = "down";
    } else if (i === scenario.durationMonths) {
      mult = 1 + scenario.drawdown;
      phase = "trough";
    } else if (i < total) {
      const recoveryStep = i - scenario.durationMonths;
      const trough = 1 + scenario.drawdown;
      mult = trough + (-scenario.drawdown * recoveryStep) / scenario.recoveryMonths;
      phase = "recovery";
    } else {
      mult = 1;
      phase = "back";
    }
    points.push({
      monthIndex: i,
      monthLabel: `Mån ${i}`,
      marketValueMultiplier: mult,
      phase,
    });
  }
  return points;
}
