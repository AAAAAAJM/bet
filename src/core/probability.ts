export function round(value: number, digits = 4): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function assertProbability(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} must be a finite number between 0 and 1.`);
  }
}

export function productProbability(probabilities: number[]): number {
  if (probabilities.length === 0) return 0;

  const product = probabilities.reduce((acc, probability) => {
    assertProbability(probability, "probability");
    return acc * probability;
  }, 1);

  return round(product);
}

export function applyPenalty(probability: number, penaltyRate: number): number {
  assertProbability(probability, "probability");

  if (!Number.isFinite(penaltyRate) || penaltyRate < 0 || penaltyRate > 1) {
    throw new Error("penaltyRate must be a finite number between 0 and 1.");
  }

  return round(probability * (1 - penaltyRate));
}

export function averageProbability(probabilities: number[]): number {
  if (probabilities.length === 0) return 0;

  const sum = probabilities.reduce((acc, probability) => {
    assertProbability(probability, "probability");
    return acc + probability;
  }, 0);

  return round(sum / probabilities.length);
}
