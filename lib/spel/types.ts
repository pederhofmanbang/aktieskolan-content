export type ScenarioId = string;

export type EffectField =
  | "capital"
  | "debt"
  | "monthlyCost"
  | "monthlyRevenue"
  | "ownership"
  | "voteShare"
  | "time";

export type Effect = {
  field: EffectField;
  delta: number;
  description?: string;
};

export type Choice = {
  id: string;
  label: string;
  effects: Effect[];
  outcome?: string;
  pedagogicalNote?: string;
  lessonLink?: { lessonSlug: string; label: string };
  isOptimal?: boolean;
};

export type Scenario = {
  id: ScenarioId;
  moduleId: string;
  lessonSlug: string;
  title: string;
  situation: string;
  speaker?: { emoji: string; name: string };
  choices: Choice[];
};

export type ModuleId =
  | "pizzan"
  | "mr-market"
  | "lasagne"
  | "snoboll"
  | "berget"
  | "lagdraften"
  | "lagenheter"
  | "bilbesiktning"
  | "panik"
  | "ips";

export type ModuleDef = {
  id: ModuleId;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  lessonSlug: string;
  estMinutes: number;
  status: "available" | "coming-soon";
};

export type PizzaState = {
  capital: number;
  debt: number;
  monthlyCost: number;
  monthlyRevenue: number;
  ownership: number;
  voteShare: number;
  monthsElapsed: number;
};

export const INITIAL_PIZZA: PizzaState = {
  capital: 50_000,
  debt: 0,
  monthlyCost: 0,
  monthlyRevenue: 0,
  ownership: 100,
  voteShare: 100,
  monthsElapsed: 0,
};

export type ModuleRun = {
  moduleId: ModuleId;
  completedAt?: string;
  history: { scenarioId: string; choiceId: string }[];
  state: PizzaState;
  victory?: boolean;
};

export type GameProgress = {
  unlockedLessons: string[];
  completedModules: ModuleId[];
  runs: Partial<Record<ModuleId, ModuleRun>>;
};

export const INITIAL_PROGRESS: GameProgress = {
  unlockedLessons: ["01-vad-ar-en-aktie"],
  completedModules: [],
  runs: {},
};
