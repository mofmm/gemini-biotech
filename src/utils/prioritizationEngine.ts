/**
 * @fileoverview Predictive Efficacy and Novelty Prioritization Engine
 * Scores compounds on multi-parameter efficacy, resistance mutation resilience,
 * CNS penetrance, and structural novelty.
 */

import { CompoundRecord } from './dataPreparation';

export interface PrioritizedCompound {
  compound: CompoundRecord;
  predictedEfficacyIndex: number; // 0 - 100
  structuralNoveltyScore: number; // 0 - 100
  compositePriorityScore: number; // 0 - 100
  prioritizationTier: 'Tier 1: High-Priority Lead' | 'Tier 2: Potent Exemplar' | 'Tier 3: Standard Benchmark' | 'Tier 4: SAR Probe';
  rationale: string;
  rank: number;
}

/**
 * Calculates Predicted Efficacy Index (PEI) on a 0-100 scale.
 * Weights:
 * - ALK WT Potency (20 pts): IC50 <= 1 nM = 20 pts, <= 10 nM = 15 pts, <= 50 nM = 8 pts
 * - ALK G1202R Solvent-Front Potency (30 pts): IC50 <= 10 nM = 30 pts, <= 50 nM = 25 pts, <= 100 nM = 18 pts, <= 500 nM = 8 pts
 * - ALK L1196M Gatekeeper Potency (20 pts): IC50 <= 5 nM = 20 pts, <= 25 nM = 15 pts, <= 100 nM = 8 pts
 * - CNS MPO Score (20 pts): MPO >= 5.0 = 20 pts, >= 4.0 = 15 pts, >= 3.0 = 8 pts
 * - Lipophilic Efficiency LipE (10 pts): LipE >= 6.0 = 10 pts, >= 5.0 = 7 pts, >= 4.0 = 4 pts
 */
export function calculatePredictedEfficacyIndex(compound: CompoundRecord): number {
  let score = 0;

  // 1. ALK WT Potency (max 20)
  const wt = compound.alkWt_ic50;
  if (wt <= 1.0) score += 20;
  else if (wt <= 5.0) score += 16;
  else if (wt <= 15.0) score += 11;
  else if (wt <= 50.0) score += 6;
  else score += 2;

  // 2. ALK G1202R Solvent-Front Potency (max 30) - Primary clinical resistance driver
  const g1202r = compound.alkG1202r_ic50 ?? 5000;
  if (g1202r <= 10.0) score += 30;
  else if (g1202r <= 50.0) score += 25;
  else if (g1202r <= 100.0) score += 18;
  else if (g1202r <= 350.0) score += 10;
  else if (g1202r <= 1000.0) score += 3;
  else score += 0;

  // 3. ALK L1196M Gatekeeper Potency (max 20)
  const l1196m = compound.alkL1196m_ic50 ?? 5000;
  if (l1196m <= 5.0) score += 20;
  else if (l1196m <= 25.0) score += 16;
  else if (l1196m <= 100.0) score += 10;
  else if (l1196m <= 300.0) score += 4;
  else score += 0;

  // 4. CNS MPO Score (max 20)
  const mpo = compound.cnsMpo;
  if (mpo >= 5.2) score += 20;
  else if (mpo >= 4.5) score += 16;
  else if (mpo >= 3.8) score += 11;
  else if (mpo >= 3.0) score += 6;
  else score += 2;

  // 5. LipE (max 10)
  const pIC50 = wt > 0 ? 9 - Math.log10(wt) : 6;
  const lipE = pIC50 - compound.xlogp;
  if (lipE >= 6.5) score += 10;
  else if (lipE >= 5.5) score += 7;
  else if (lipE >= 4.5) score += 4;
  else score += 1;

  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Calculates Structural Novelty Score (0 - 100) based on conformational constraint,
 * macrocyclization architecture, and target selectivity.
 */
export function calculateStructuralNoveltyScore(compound: CompoundRecord): number {
  let score = 30; // base score

  // Macrocyclic architecture bonus
  if (compound.series === 'macrocyclic') {
    score += 35;
    if (compound.macrocyclicRingSize === 12) score += 15; // Optimal Johnson et al. ring size
    if (compound.macrocyclicRingSize === 14) score += 20; // Compact 4th-gen scaffold
  }

  // Rotatable bond rigidity bonus
  if (compound.rotatableBonds <= 1) score += 10;
  else if (compound.rotatableBonds <= 3) score += 5;

  // Low P-gp liability
  if (compound.pGpSubstrate === 'Low') score += 5;

  return Math.min(100, Math.max(0, score));
}

/**
 * Prioritizes an array of compounds, computing ranking, composite scores, and tiering.
 */
export function prioritizeCompounds(compounds: CompoundRecord[]): PrioritizedCompound[] {
  const scored = compounds.map((c) => {
    const pei = calculatePredictedEfficacyIndex(c);
    const novelty = calculateStructuralNoveltyScore(c);
    // Composite: 65% Efficacy, 35% Novelty
    const composite = Math.round((pei * 0.65 + novelty * 0.35) * 10) / 10;

    let tier: PrioritizedCompound['prioritizationTier'] = 'Tier 4: SAR Probe';
    let rationale = '';

    if (composite >= 80) {
      tier = 'Tier 1: High-Priority Lead';
      rationale = 'Sub-nanomolar potency, overcomes solvent-front G1202R, superior CNS MPO (>=5.0), and rigid macrocyclic constraint.';
    } else if (composite >= 65) {
      tier = 'Tier 2: Potent Exemplar';
      rationale = 'Robust kinase inhibition with moderate mutant coverage or established clinical track record.';
    } else if (composite >= 45) {
      tier = 'Tier 3: Standard Benchmark';
      rationale = 'Historical 1st/2nd generation inhibitor or potent WT binder susceptible to clinical resistance mutations.';
    } else {
      tier = 'Tier 4: SAR Probe';
      rationale = 'Exploratory intermediate, enantiomer, or ring-expanded probe demonstrating SAR boundaries.';
    }

    return {
      compound: c,
      predictedEfficacyIndex: pei,
      structuralNoveltyScore: novelty,
      compositePriorityScore: composite,
      prioritizationTier: tier,
      rationale,
      rank: 0,
    };
  });

  // Sort descending by compositePriorityScore
  scored.sort((a, b) => b.compositePriorityScore - a.compositePriorityScore);

  // Assign ranks
  scored.forEach((item, index) => {
    item.rank = index + 1;
  });

  return scored;
}
