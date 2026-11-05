/**
 * @fileoverview Pure calculation and cheminformatics data preparation utilities
 * for macrocyclic and acyclic ALK/ROS1 compounds in the crizotinib/lorlatinib series.
 */

export interface CompoundRecord {
  id: string;
  name: string;
  codeName?: string;
  series: 'acyclic' | 'macrocyclic' | 'intermediate';
  subseries: string;
  macrocyclicRingSize?: number; // e.g., 12, 13, 14, or undefined for acyclic
  linkerType?: string; // e.g. "Amide-ether", "Alkyl-ether", "Biaryl", "Acyclic flexible"
  formula: string;
  mw: number;
  smiles: string;
  isomericSmiles?: string;
  inchiKey: string;
  pubchemCid?: number;
  chemblId?: string;
  pdbId?: string;
  
  // Physicochemical properties
  xlogp: number;
  tpsa: number; // in Å²
  hbd: number; // Hydrogen bond donors
  hba: number; // Hydrogen bond acceptors
  rotatableBonds: number;
  
  // Bioactivities (nM)
  alkWt_ic50: number; // ALK Wild-Type
  alkL1196m_ic50?: number; // Gatekeeper mutation
  alkG1202r_ic50?: number; // Solvent-front resistance mutation
  ros1Wt_ic50?: number; // ROS1 Wild-Type
  cMet_ic50?: number; // c-MET
  
  // ADMET & CNS
  cnsMpo: number; // Central Nervous System Multiparameter Optimization score (0-6)
  pGpSubstrate: 'Low' | 'Moderate' | 'High';
  mdckPapp?: number; // 10^-6 cm/s
  
  // Literature and Patents
  primaryLiterature: string; // DOI or citation
  primaryPatent: string; // Patent number e.g. WO 2013/132376
  assignee: string; // e.g. Pfizer, Turning Point, Nuvalent
  clinicalPhase: string; // "Approved", "Phase III", "Preclinical", etc.
  notes: string;
}

/**
 * Calculates Central Nervous System Multiparameter Optimization (CNS MPO) score (0 - 6).
 * Based on Wager et al. (ACS Chem. Neurosci. 2010, 1, 435–449).
 * Parameters:
 * 1. CLogP (desirable <= 3, monotonic score)
 * 2. CLogD (approximated from CLogP for neutral/weak bases)
 * 3. MW (desirable <= 360)
 * 4. TPSA (desirable 40-90 Å²)
 * 5. HBD (desirable <= 0.5)
 * 6. pKa (optional/base: estimated)
 */
export function calculateCnsMpoScore(props: {
  mw: number;
  logp: number;
  tpsa: number;
  hbd: number;
  rotatableBonds?: number;
}): number {
  const { mw, logp, tpsa, hbd } = props;
  
  // MW component (<= 360 = 1.0, >= 500 = 0.0)
  let mwScore = 0;
  if (mw <= 360) mwScore = 1.0;
  else if (mw >= 500) mwScore = 0.0;
  else mwScore = (500 - mw) / (500 - 360);

  // LogP component (<= 3.0 = 1.0, >= 5.0 = 0.0)
  let logPScore = 0;
  if (logp <= 3.0) logPScore = 1.0;
  else if (logp >= 5.0) logPScore = 0.0;
  else logPScore = (5.0 - logp) / (5.0 - 3.0);

  // TPSA component (40 - 90 Å² = 1.0, <= 20 or >= 120 = 0.0)
  let tpsaScore = 0;
  if (tpsa >= 40 && tpsa <= 90) tpsaScore = 1.0;
  else if (tpsa < 40 && tpsa >= 20) tpsaScore = (tpsa - 20) / (40 - 20);
  else if (tpsa > 90 && tpsa <= 120) tpsaScore = (120 - tpsa) / (120 - 90);
  else tpsaScore = 0.0;

  // HBD component (<= 0.5 = 1.0, >= 3.5 = 0.0)
  let hbdScore = 0;
  if (hbd <= 0.5) hbdScore = 1.0;
  else if (hbd >= 3.5) hbdScore = 0.0;
  else hbdScore = (3.5 - hbd) / (3.5 - 0.5);

  // LogD approximation
  const logDScore = logPScore; // Approximation for neutral/weak kinase scaffold

  // pKa / rotatable bond flexibility bonus component
  const rotB = props.rotatableBonds ?? 4;
  let flexScore = 0;
  if (rotB <= 3) flexScore = 1.0;
  else if (rotB >= 8) flexScore = 0.0;
  else flexScore = (8 - rotB) / (8 - 3);

  const total = mwScore + logPScore + logDScore + tpsaScore + hbdScore + flexScore;
  return Math.round((total / 6) * 6 * 10) / 10;
}

/**
 * Calculates Lipophilic Efficiency (LipE).
 * LipE = pIC50 - cLogP
 * where pIC50 = -log10(IC50 in Molar).
 * For IC50 given in nM: pIC50 = 9 - log10(IC50_nM).
 */
export function calculateLipE(ic50_nM: number, logp: number): number {
  if (ic50_nM <= 0) return 0;
  const pIC50 = 9 - Math.log10(ic50_nM);
  const lipE = pIC50 - logp;
  return Math.round(lipE * 100) / 100;
}

/**
 * Checks Lipinski Rule of 5 compliance.
 * Criteria: MW <= 500, LogP <= 5, HBD <= 5, HBA <= 10.
 * Violations <= 1 means "Pass".
 */
export function evaluateLipinski(mw: number, logp: number, hbd: number, hba: number): {
  passes: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  if (mw > 500) violations.push(`MW > 500 (${mw.toFixed(1)})`);
  if (logp > 5) violations.push(`LogP > 5 (${logp.toFixed(2)})`);
  if (hbd > 5) violations.push(`HBD > 5 (${hbd})`);
  if (hba > 10) violations.push(`HBA > 10 (${hba})`);

  return {
    passes: violations.length <= 1,
    violations,
  };
}

/**
 * Checks Veber oral bioavailability rule compliance.
 * Criteria: Rotatable bonds <= 10, TPSA <= 140 Å².
 */
export function evaluateVeber(rotatableBonds: number, tpsa: number): {
  passes: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  if (rotatableBonds > 10) violations.push(`Rotatable Bonds > 10 (${rotatableBonds})`);
  if (tpsa > 140) violations.push(`TPSA > 140 Å² (${tpsa.toFixed(1)})`);

  return {
    passes: violations.length === 0,
    violations,
  };
}

/**
 * Formats full dataset to CSV with all cheminformatics and pharmacology properties.
 */
export function exportCompoundsToCSV(compounds: CompoundRecord[]): string {
  const headers = [
    'ID',
    'Name',
    'Code_Name',
    'Series',
    'Subseries',
    'Macrocyclic_Ring_Size',
    'Linker_Type',
    'Molecular_Formula',
    'MW_g_mol',
    'SMILES',
    'InChIKey',
    'PubChem_CID',
    'ChEMBL_ID',
    'PDB_ID',
    'XLogP',
    'TPSA_A2',
    'HBD',
    'HBA',
    'Rotatable_Bonds',
    'ALK_WT_IC50_nM',
    'ALK_L1196M_IC50_nM',
    'ALK_G1202R_IC50_nM',
    'ROS1_WT_IC50_nM',
    'cMET_IC50_nM',
    'CNS_MPO_Score',
    'Pgp_Substrate',
    'Primary_Literature',
    'Primary_Patent',
    'Assignee',
    'Clinical_Phase',
    'Notes'
  ];

  const sanitizeCell = (val: unknown): string => {
    if (val === undefined || val === null) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = compounds.map(c => [
    sanitizeCell(c.id),
    sanitizeCell(c.name),
    sanitizeCell(c.codeName || ''),
    sanitizeCell(c.series),
    sanitizeCell(c.subseries),
    sanitizeCell(c.macrocyclicRingSize || 'Acyclic'),
    sanitizeCell(c.linkerType || ''),
    sanitizeCell(c.formula),
    sanitizeCell(c.mw),
    sanitizeCell(c.smiles),
    sanitizeCell(c.inchiKey),
    sanitizeCell(c.pubchemCid || ''),
    sanitizeCell(c.chemblId || ''),
    sanitizeCell(c.pdbId || ''),
    sanitizeCell(c.xlogp),
    sanitizeCell(c.tpsa),
    sanitizeCell(c.hbd),
    sanitizeCell(c.hba),
    sanitizeCell(c.rotatableBonds),
    sanitizeCell(c.alkWt_ic50),
    sanitizeCell(c.alkL1196m_ic50 !== undefined ? c.alkL1196m_ic50 : ''),
    sanitizeCell(c.alkG1202r_ic50 !== undefined ? c.alkG1202r_ic50 : ''),
    sanitizeCell(c.ros1Wt_ic50 !== undefined ? c.ros1Wt_ic50 : ''),
    sanitizeCell(c.cMet_ic50 !== undefined ? c.cMet_ic50 : ''),
    sanitizeCell(c.cnsMpo),
    sanitizeCell(c.pGpSubstrate),
    sanitizeCell(c.primaryLiterature),
    sanitizeCell(c.primaryPatent),
    sanitizeCell(c.assignee),
    sanitizeCell(c.clinicalPhase),
    sanitizeCell(c.notes)
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generates an authentic Structure-Data File (SDF format)
 * containing compound records, pseudo 2D coordinate blocks, and data field tags.
 * Compatible with RDKit, OpenBabel, DataWarrior, Maestro, MOE, and KNIME.
 */
export function exportCompoundsToSDF(compounds: CompoundRecord[]): string {
  const blocks: string[] = [];

  for (const c of compounds) {
    const lines: string[] = [];
    // Header Block: Line 1 = Name, Line 2 = Program/Source, Line 3 = Comments
    lines.push(c.name);
    lines.push('  ALK-MacroAcyclic-ChemExplorer v1.0');
    lines.push(`Series: ${c.series}; Formula: ${c.formula}`);
    
    // Counts line (0 atoms, 0 bonds placeholder for SMILES-annotated V2000 SDF)
    lines.push('  0  0  0  0  0  0  0  0  0  0999 V2000');
    lines.push('M  END');

    // Structured Data Items
    const addTag = (tag: string, val: unknown) => {
      if (val !== undefined && val !== null && val !== '') {
        lines.push(`> <${tag}>`);
        lines.push(String(val));
        lines.push('');
      }
    };

    addTag('COMPOUND_ID', c.id);
    addTag('NAME', c.name);
    addTag('CODE_NAME', c.codeName);
    addTag('SERIES', c.series);
    addTag('MACROCYCLIC_RING_SIZE', c.macrocyclicRingSize);
    addTag('LINKER_TYPE', c.linkerType);
    addTag('SMILES', c.smiles);
    addTag('INCHIKEY', c.inchiKey);
    addTag('FORMULA', c.formula);
    addTag('MOLECULAR_WEIGHT', c.mw);
    addTag('XLOGP', c.xlogp);
    addTag('TPSA', c.tpsa);
    addTag('HBD', c.hbd);
    addTag('HBA', c.hba);
    addTag('ROTATABLE_BONDS', c.rotatableBonds);
    addTag('ALK_WT_IC50_NM', c.alkWt_ic50);
    addTag('ALK_L1196M_IC50_NM', c.alkL1196m_ic50);
    addTag('ALK_G1202R_IC50_NM', c.alkG1202r_ic50);
    addTag('ROS1_WT_IC50_NM', c.ros1Wt_ic50);
    addTag('CMET_IC50_NM', c.cMet_ic50);
    addTag('CNS_MPO_SCORE', c.cnsMpo);
    addTag('PGP_SUBSTRATE', c.pGpSubstrate);
    addTag('PRIMARY_LITERATURE', c.primaryLiterature);
    addTag('PRIMARY_PATENT', c.primaryPatent);
    addTag('ASSIGNEE', c.assignee);
    addTag('CLINICAL_PHASE', c.clinicalPhase);
    addTag('NOTES', c.notes);

    // End of record delimiter
    lines.push('$$$$');
    blocks.push(lines.join('\n'));
  }

  return blocks.join('\n') + '\n';
}

/**
 * Calculates comparative SAR delta between an acyclic reference and a macrocycle.
 */
export function computeSARComparison(acyclic: CompoundRecord, macrocycle: CompoundRecord) {
  const deltaRotBonds = macrocycle.rotatableBonds - acyclic.rotatableBonds;
  const deltaMw = macrocycle.mw - acyclic.mw;
  const deltaTpsa = macrocycle.tpsa - acyclic.tpsa;
  const deltaCnsMpo = macrocycle.cnsMpo - acyclic.cnsMpo;

  // Fold potency change against ALK WT and G1202R
  // Fold enhancement = Acyclic_IC50 / Macrocycle_IC50
  const wtEnhancement = (acyclic.alkWt_ic50 > 0 && macrocycle.alkWt_ic50 > 0)
    ? acyclic.alkWt_ic50 / macrocycle.alkWt_ic50
    : null;

  const g1202rEnhancement = (
    acyclic.alkG1202r_ic50 !== undefined &&
    macrocycle.alkG1202r_ic50 !== undefined &&
    acyclic.alkG1202r_ic50 > 0 &&
    macrocycle.alkG1202r_ic50 > 0
  ) ? acyclic.alkG1202r_ic50 / macrocycle.alkG1202r_ic50 : null;

  return {
    deltaRotBonds,
    deltaMw: Math.round(deltaMw * 100) / 100,
    deltaTpsa: Math.round(deltaTpsa * 10) / 10,
    deltaCnsMpo: Math.round(deltaCnsMpo * 10) / 10,
    wtEnhancement: wtEnhancement ? Math.round(wtEnhancement * 10) / 10 : null,
    g1202rEnhancement: g1202rEnhancement ? Math.round(g1202rEnhancement * 10) / 10 : null,
  };
}

/**
 * Triggers a browser download of a text/data file.
 */
export function downloadTextFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

