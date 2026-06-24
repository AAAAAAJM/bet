import type { CandidateItem, Grade, RatedCandidate } from "./candidateFilter.js";

export interface ScenarioPolicy {
  minItems: number;
  maxItems: number;
  maxScenarios: number;
  duplicateGroupAllowed: boolean;
  sharedLabelPenalty: number;
}

export interface Scenario {
  id: string;
  items: RatedCandidate[];
  probability: number;
  adjustedProbability: number;
  grade: Grade;
  warnings: string[];
}

function round(value: number, digits = 4): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function product(values: number[]): number {
  return round(values.reduce((acc, value) => acc * value, 1));
}

function choose<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];

  function walk(startIndex: number, current: T[]): void {
    if (current.length === size) {
      result.push([...current]);
      return;
    }

    for (let index = startIndex; index < items.length; index += 1) {
      const item = items[index];
      if (item === undefined) continue;
      current.push(item);
      walk(index + 1, current);
      current.pop();
    }
  }

  walk(0, []);
  return result;
}

function hasDuplicateGroup(items: CandidateItem[]): boolean {
  const groups = new Set<string>();

  for (const item of items) {
    if (groups.has(item.groupId)) return true;
    groups.add(item.groupId);
  }

  return false;
}

function countSharedLabels(items: CandidateItem[]): number {
  const labelCounts = new Map<string, number>();

  for (const item of items) {
    for (const label of item.labels ?? []) {
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
    }
  }

  return [...labelCounts.values()].filter((count) => count > 1).length;
}

function gradeScenario(probability: number, warnings: string[]): Grade {
  if (warnings.length >= 2) return "C";
  if (probability >= 0.55) return "S";
  if (probability >= 0.42) return "A";
  if (probability >= 0.3) return "B";
  return "C";
}

export function buildScenarios(
  candidates: RatedCandidate[],
  policy: ScenarioPolicy,
): Scenario[] {
  const scenarios: Scenario[] = [];

  for (let size = policy.minItems; size <= policy.maxItems; size += 1) {
    const groups = choose(candidates, size);

    for (const group of groups) {
      const warnings: string[] = [];

      if (!policy.duplicateGroupAllowed && hasDuplicateGroup(group)) {
        continue;
      }

      const sharedLabels = countSharedLabels(group);
      const penalty = Math.min(sharedLabels * policy.sharedLabelPenalty, 0.35);
      const probability = product(group.map((item) => item.probability));
      const adjustedProbability = round(probability * (1 - penalty));

      if (sharedLabels > 0) {
        warnings.push("shared labels reduce independence");
      }

      if (group.some((item) => item.level === "HIGH")) {
        warnings.push("contains high uncertainty item");
      }

      scenarios.push({
        id: group.map((item) => item.id).join("+"),
        items: group,
        probability,
        adjustedProbability,
        grade: gradeScenario(adjustedProbability, warnings),
        warnings,
      });
    }
  }

  return scenarios
    .sort((a, b) => b.adjustedProbability - a.adjustedProbability)
    .slice(0, policy.maxScenarios);
}
