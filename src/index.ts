import { filterCandidates } from "./core/candidateFilter.js";
import { buildScenarios } from "./core/scenarioBuilder.js";
import type { CandidateItem } from "./core/candidateFilter.js";

const sampleItems: CandidateItem[] = [
  {
    id: "mci-safe-result",
    groupId: "match-001",
    title: "Manchester City vs Everton",
    option: "City positive result",
    probability: 0.82,
    level: "LOW",
    labels: ["epl", "home-favorite"],
  },
  {
    id: "barca-goal-line",
    groupId: "match-002",
    title: "Barcelona vs Valencia",
    option: "Barcelona attacking trend",
    probability: 0.78,
    level: "LOW",
    labels: ["laliga", "strong-attack"],
  },
  {
    id: "inter-defensive-edge",
    groupId: "match-003",
    title: "Inter vs Torino",
    option: "Inter defensive edge",
    probability: 0.74,
    level: "MEDIUM",
    labels: ["serie-a", "defense"],
  },
  {
    id: "psg-attacking-edge",
    groupId: "match-004",
    title: "PSG vs Nantes",
    option: "PSG attacking edge",
    probability: 0.8,
    level: "LOW",
    labels: ["ligue1", "strong-attack"],
  },
  {
    id: "cup-rotation-risk",
    groupId: "match-005",
    title: "Cup Match Example",
    option: "favorite trend with rotation risk",
    probability: 0.68,
    level: "HIGH",
    labels: ["cup", "rotation-risk"],
  },
];

const candidates = filterCandidates(sampleItems, {
  minimumProbability: 0.65,
  preferredProbability: 0.72,
  includeHighLevelItems: false,
});

const scenarios = buildScenarios(candidates, {
  minItems: 2,
  maxItems: 3,
  maxScenarios: 10,
  duplicateGroupAllowed: false,
  sharedLabelPenalty: 0.08,
});

console.log("\n=== Filtered Candidates ===");
console.table(
  candidates.map((item) => ({
    id: item.id,
    title: item.title,
    probability: item.probability,
    level: item.level,
    grade: item.grade,
  })),
);

console.log("\n=== Scenario Candidates ===");
console.table(
  scenarios.map((scenario) => ({
    id: scenario.id,
    legs: scenario.items.length,
    probability: scenario.probability,
    adjustedProbability: scenario.adjustedProbability,
    grade: scenario.grade,
    warnings: scenario.warnings.join(" | ") || "none",
  })),
);

console.log("\nNotice: This MVP is an analysis tool. It does not guarantee outcomes or remove loss risk.");
