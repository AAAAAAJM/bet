# Scenario Analysis Guide

This document explains the first MVP direction of this repository.

The MVP is a probability-based scenario explorer. It does not guarantee any outcome. It only helps compare candidate items, remove highly uncertain items, and create grouped scenarios for review.

## 1. Core Direction

The system follows these rules:

1. Do not analyze every item as equally useful.
2. Keep only candidates with sufficient model probability.
3. Reduce priority when uncertainty is high.
4. Build small scenarios from filtered candidates.
5. Penalize scenarios that share the same source of uncertainty.
6. Always display uncertainty and warnings.

## 2. Candidate Filtering

`candidateFilter.ts` evaluates each candidate with the following fields:

- probability
- uncertainty level
- group id
- labels
- policy thresholds

The output grade can be one of:

| Grade | Meaning |
| --- | --- |
| S | strong candidate with low uncertainty |
| A | preferred candidate |
| B | usable candidate |
| C | low priority candidate |
| X | excluded candidate |

## 3. Scenario Builder

`scenarioBuilder.ts` groups filtered candidates into small scenarios.

The current MVP supports:

- minimum scenario size
- maximum scenario size
- maximum number of scenarios
- duplicate group control
- shared label penalty

A scenario receives warnings when candidate items share labels or include high uncertainty items.

## 4. Probability Adjustment

A simple independence assumption is risky. If candidate items share the same label, they may be affected by the same hidden factor.

The MVP applies a simple penalty:

```text
adjusted probability = base probability * (1 - shared label penalty)
```

This is an early heuristic. Future versions should replace it with data-backed calibration.

## 5. Prohibited Claims

The product must not use these claims:

- guaranteed
- certain
- no loss
- risk free
- always correct
- recovery system

The correct product position is:

```text
probability analysis + scenario comparison + uncertainty explanation
```

## 6. Next Steps

1. Add JSON input support.
2. Add league-specific or domain-specific policy presets.
3. Add live data import later.
4. Add historical result logging.
5. Add calibration metrics.
6. Add a dashboard for long-term quality tracking.
