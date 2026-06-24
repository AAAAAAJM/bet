export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type RecommendationGrade = "S" | "A" | "B" | "C" | "X";

export interface MatchPick {
  id: string;
  matchId: string;
  matchName: string;
  market: string;
  selection: string;
  oddsMultiple: number;
  modelProbability: number;
  riskLevel: RiskLevel;
  tags?: string[];
}

export interface EvaluatedPick extends MatchPick {
  impliedProbability: number;
  edge: number;
  expectedValue: number;
  isPositiveEdge: boolean;
}

export interface CombinationPolicy {
  minLegs: number;
  maxLegs: number;
  maxCombinations: number;
  minSinglePickProbability: number;
  minCombinationProbability: number;
  minExpectedValue: number;
  minEdge: number;
  maxHighRiskLegs: number;
  baseUnit: number;
  correlationPenaltyPerSharedMatch: number;
  correlationPenaltyPerSharedTag: number;
}

export interface PickCombination {
  id: string;
  legs: EvaluatedPick[];
  oddsMultiple: number;
  rawProbability: number;
  adjustedProbability: number;
  expectedValue: number;
  unitReturnIfHit: number;
  netUnitResultIfHit: number;
  coversTotalUnits: boolean;
  grade: RecommendationGrade;
  warnings: string[];
}

export interface CombinationSummary {
  totalUnitCount: number;
  baseUnit: number;
  combinationCount: number;
  breakEvenMultiple: number;
  combinations: PickCombination[];
}
