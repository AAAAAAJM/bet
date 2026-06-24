export type Level = "LOW" | "MEDIUM" | "HIGH";
export type Grade = "S" | "A" | "B" | "C" | "X";

export interface CandidateItem {
  id: string;
  groupId: string;
  title: string;
  option: string;
  probability: number;
  level: Level;
  labels?: string[];
}

export interface CandidatePolicy {
  minimumProbability: number;
  preferredProbability: number;
  includeHighLevelItems: boolean;
}

export interface RatedCandidate extends CandidateItem {
  grade: Grade;
  notes: string[];
}

function levelPenalty(level: Level): number {
  if (level === "LOW") return 0;
  if (level === "MEDIUM") return 0.08;
  return 0.18;
}

export function rateCandidate(item: CandidateItem, policy: CandidatePolicy): Grade {
  const adjusted = item.probability - levelPenalty(item.level);

  if (item.level === "HIGH" && !policy.includeHighLevelItems) return "X";
  if (item.probability < policy.minimumProbability) return "X";
  if (adjusted >= 0.78 && item.level === "LOW") return "S";
  if (adjusted >= policy.preferredProbability) return "A";
  if (adjusted >= policy.minimumProbability) return "B";
  return "C";
}

export function filterCandidates(
  items: CandidateItem[],
  policy: CandidatePolicy,
): RatedCandidate[] {
  return items
    .map((item) => {
      const grade = rateCandidate(item, policy);
      const notes: string[] = [];

      if (item.probability >= policy.preferredProbability) {
        notes.push("preferred probability range");
      }

      if (item.level === "LOW") {
        notes.push("low uncertainty");
      }

      if (item.level === "HIGH") {
        notes.push("high uncertainty; analysis only");
      }

      if (grade === "X") {
        notes.push("excluded by policy");
      }

      return { ...item, grade, notes };
    })
    .filter((item) => item.grade !== "X");
}
