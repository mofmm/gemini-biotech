import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePredictedEfficacyIndex,
  calculateStructuralNoveltyScore,
  prioritizeCompounds
} from './prioritizationEngine';
import { CompoundRecord } from './dataPreparation';

const mockLorlatinib: CompoundRecord = {
  id: 'PF-06463922',
  name: 'Lorlatinib',
  series: 'macrocyclic',
  subseries: '12-membered',
  macrocyclicRingSize: 12,
  formula: 'C21H19FN6O',
  mw: 406.41,
  smiles: 'CC1C2=C(C=CC(=C2)F)OC3=C(N=CC(=C3)C4=CN(N=C4)C)C(=O)N(C1)C',
  inchiKey: 'ANMSOUKPWHCCLC-UHFFFAOYSA-N',
  xlogp: 2.3,
  tpsa: 75.3,
  hbd: 1,
  hba: 6,
  rotatableBonds: 1,
  alkWt_ic50: 0.6,
  alkL1196m_ic50: 12.0,
  alkG1202r_ic50: 40.0,
  ros1Wt_ic50: 0.2,
  cnsMpo: 5.3,
  pGpSubstrate: 'Low',
  primaryLiterature: '10.1021/jm500261q',
  primaryPatent: 'WO 2013/132376',
  assignee: 'Pfizer',
  clinicalPhase: 'Approved',
  notes: '3rd-gen macrocycle'
};

const mockCrizotinib: CompoundRecord = {
  id: 'PF-02341066',
  name: 'Crizotinib',
  series: 'acyclic',
  subseries: 'Acyclic',
  formula: 'C21H22Cl2FN5O',
  mw: 450.34,
  smiles: 'CC(C1=C(C=CC(=C1Cl)F)Cl)OC2=C(N=CC(=C2)C3=CN(N=C3)C4CCNCC4)N',
  inchiKey: 'KSSURHUKNXAUPP-UHFFFAOYSA-N',
  xlogp: 1.8,
  tpsa: 80.8,
  hbd: 2,
  hba: 6,
  rotatableBonds: 5,
  alkWt_ic50: 3.0,
  alkL1196m_ic50: 160.0,
  alkG1202r_ic50: 1200.0,
  ros1Wt_ic50: 0.8,
  cnsMpo: 3.2,
  pGpSubstrate: 'High',
  primaryLiterature: '10.1021/jm200632q',
  primaryPatent: 'WO 2006/021884',
  assignee: 'Pfizer',
  clinicalPhase: 'Approved',
  notes: '1st-gen acyclic'
};

test('calculatePredictedEfficacyIndex scores Lorlatinib substantially higher than Crizotinib', () => {
  const lorEfficacy = calculatePredictedEfficacyIndex(mockLorlatinib);
  const crizEfficacy = calculatePredictedEfficacyIndex(mockCrizotinib);

  assert.ok(lorEfficacy >= 80, `Expected Lorlatinib PEI >= 80, got ${lorEfficacy}`);
  assert.ok(crizEfficacy < 55, `Expected Crizotinib PEI < 55, got ${crizEfficacy}`);
  assert.ok(lorEfficacy > crizEfficacy + 30, 'Lorlatinib should exceed Crizotinib by >30 points due to G1202R potency & CNS MPO');
});

test('calculateStructuralNoveltyScore rewards macrocyclic ring constraint', () => {
  const lorNovelty = calculateStructuralNoveltyScore(mockLorlatinib);
  const crizNovelty = calculateStructuralNoveltyScore(mockCrizotinib);

  assert.ok(lorNovelty >= 80, `Expected macrocycle novelty >= 80, got ${lorNovelty}`);
  assert.ok(crizNovelty <= 40, `Expected acyclic novelty <= 40, got ${crizNovelty}`);
});

test('prioritizeCompounds correctly ranks Lorlatinib as Tier 1 over Crizotinib', () => {
  const results = prioritizeCompounds([mockCrizotinib, mockLorlatinib]);
  assert.equal(results.length, 2);
  assert.equal(results[0].compound.id, 'PF-06463922');
  assert.equal(results[0].rank, 1);
  assert.equal(results[0].prioritizationTier, 'Tier 1: High-Priority Lead');

  assert.equal(results[1].compound.id, 'PF-02341066');
  assert.equal(results[1].rank, 2);
});
