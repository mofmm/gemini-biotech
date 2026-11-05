import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCnsMpoScore,
  calculateLipE,
  evaluateLipinski,
  evaluateVeber,
  exportCompoundsToCSV,
  exportCompoundsToSDF,
  computeSARComparison,
  CompoundRecord
} from './dataPreparation';

const mockCrizotinib: CompoundRecord = {
  id: 'PF-02341066',
  name: 'Crizotinib',
  codeName: 'PF-02341066',
  series: 'acyclic',
  subseries: 'Aminopyridine acyclic',
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
  alkG1202r_ic50: 1000.0,
  ros1Wt_ic50: 0.8,
  cMet_ic50: 11.0,
  cnsMpo: 3.2,
  pGpSubstrate: 'High',
  primaryLiterature: '10.1021/jm200632q',
  primaryPatent: 'WO 2006/021884 A2',
  assignee: 'Pfizer',
  clinicalPhase: 'Approved (FDA 2011)',
  notes: 'First-in-class acyclic ALK/ROS1 inhibitor. Poor CNS penetration.'
};

const mockLorlatinib: CompoundRecord = {
  id: 'PF-06463922',
  name: 'Lorlatinib',
  codeName: 'PF-06463922',
  series: 'macrocyclic',
  subseries: '12-membered ether-amide',
  macrocyclicRingSize: 12,
  linkerType: 'Amide-ether cyclic bridge',
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
  cMet_ic50: 400.0,
  cnsMpo: 5.3,
  pGpSubstrate: 'Low',
  primaryLiterature: '10.1021/jm500261q',
  primaryPatent: 'WO 2013/132376 A1',
  assignee: 'Pfizer',
  clinicalPhase: 'Approved (FDA 2018)',
  notes: 'Third-gen macrocyclic ALK/ROS1 inhibitor. High brain permeability.'
};

test('calculateCnsMpoScore evaluates favorable parameters accurately', () => {
  const mpo = calculateCnsMpoScore({
    mw: 406.41,
    logp: 2.3,
    tpsa: 75.3,
    hbd: 1,
    rotatableBonds: 1,
  });
  // Should score high (>= 4.5) for favorable drug-like properties
  assert.ok(mpo >= 4.5, `Expected high CNS MPO, got ${mpo}`);
  assert.ok(mpo <= 6.0, `MPO cannot exceed 6.0, got ${mpo}`);
});

test('calculateLipE computes Lipophilic Efficiency from IC50 and LogP', () => {
  // IC50 = 0.6 nM -> pIC50 = 9 - log10(0.6) = 9 - (-0.2218) = 9.22
  // LipE = 9.22 - 2.3 = 6.92
  const lipE = calculateLipE(0.6, 2.3);
  assert.ok(lipE > 6.5 && lipE < 7.2, `Expected LipE around 6.9, got ${lipE}`);
});

test('evaluateLipinski passes for compliant compounds and detects violations', () => {
  const crizEvaluation = evaluateLipinski(450.34, 1.8, 2, 6);
  assert.equal(crizEvaluation.passes, true);
  assert.equal(crizEvaluation.violations.length, 0);

  const heavyMol = evaluateLipinski(620, 6.2, 7, 12);
  assert.equal(heavyMol.passes, false);
  assert.ok(heavyMol.violations.length >= 3);
});

test('evaluateVeber checks rotatable bonds and TPSA', () => {
  const lorlatinibVeber = evaluateVeber(1, 75.3);
  assert.equal(lorlatinibVeber.passes, true);

  const floppyMol = evaluateVeber(14, 160);
  assert.equal(floppyMol.passes, false);
  assert.equal(floppyMol.violations.length, 2);
});

test('exportCompoundsToCSV produces valid CSV with headers and records', () => {
  const csv = exportCompoundsToCSV([mockCrizotinib, mockLorlatinib]);
  assert.ok(csv.includes('ID,Name,Code_Name'));
  assert.ok(csv.includes('Crizotinib'));
  assert.ok(csv.includes('Lorlatinib'));
  assert.ok(csv.includes('WO 2013/132376 A1'));
  const lines = csv.trim().split('\n');
  assert.equal(lines.length, 3); // 1 header + 2 compounds
});

test('exportCompoundsToSDF produces authentic V2000 SDF blocks with delimiter $$$$', () => {
  const sdf = exportCompoundsToSDF([mockCrizotinib, mockLorlatinib]);
  assert.ok(sdf.includes('$$$$'));
  assert.ok(sdf.includes('> <COMPOUND_ID>'));
  assert.ok(sdf.includes('> <MACROCYCLIC_RING_SIZE>'));
  assert.ok(sdf.includes('PF-06463922'));
  const records = sdf.split('$$$$\n').filter(r => r.trim().length > 0);
  assert.equal(records.length, 2);
});

test('computeSARComparison accurately computes delta properties and fold-enhancement', () => {
  const sar = computeSARComparison(mockCrizotinib, mockLorlatinib);
  // Macrocycle has 1 rot bond vs crizotinib 5 rot bonds -> delta = -4
  assert.equal(sar.deltaRotBonds, -4);
  // Lorlatinib ALK WT IC50 0.6 vs crizotinib 3.0 -> 5-fold enhancement
  assert.equal(sar.wtEnhancement, 5);
  // Lorlatinib G1202R IC50 40 vs crizotinib 1000 -> 25-fold enhancement
  assert.equal(sar.g1202rEnhancement, 25);
});
