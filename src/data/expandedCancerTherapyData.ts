/**
 * @fileoverview Expanded oncology dataset covering broader ALK inhibitors,
 * related tyrosine kinase inhibitors, and macrocyclic vs acyclic therapeutics across cancer.
 */

import { CompoundRecord } from '../utils/dataPreparation';

export interface BroadOncologyTherapy {
  id: string;
  name: string;
  targetCategory: 'ALK / RTK Cousins' | 'MCL-1 Apoptosis' | 'CDK Cell Cycle' | 'Tubulin Dynamics' | 'Macrocyclic PROTAC / Degrader';
  targetSymbol: string;
  molecularType: 'Macrocyclic' | 'Acyclic';
  ringSize?: number;
  cancerIndication: string;
  clinicalStage: string;
  smiles: string;
  formula: string;
  mw: number;
  mechanismSummary: string;
  macrocycleAdvantageOverAcyclic: string;
  keyCitation: string;
  patentReference: string;
}

export const EXPANDED_RTK_AND_BROADER_COMPOUNDS: CompoundRecord[] = [
  {
    id: 'CH5424802',
    name: 'Alectinib',
    codeName: 'CH5424802 / RG7853',
    series: 'acyclic',
    subseries: 'Benzo[b]carbazole Acyclic Lead',
    linkerType: 'Rigid fused polycyclic diaryl',
    formula: 'C30H34N4O2',
    mw: 482.62,
    smiles: 'CCC1(C2=C(C=C(C=C2)N3CCOCC3)C4=C1C5=C(C=CC(=C5)C#N)N4)O',
    inchiKey: 'KDGIZZZIRWHAIA-UHFFFAOYSA-N',
    pubchemCid: 49806720,
    chemblId: 'CHEMBL2105759',
    pdbId: '3AOX',
    xlogp: 4.1,
    tpsa: 68.2,
    hbd: 2,
    hba: 5,
    rotatableBonds: 3,
    alkWt_ic50: 1.9,
    alkL1196m_ic50: 1.5,
    alkG1202r_ic50: 640.0,
    ros1Wt_ic50: 1000.0,
    cMet_ic50: 2000.0,
    cnsMpo: 4.8,
    pGpSubstrate: 'Low',
    mdckPapp: 14.0,
    primaryLiterature: '10.1021/jm2000889 (J. Med. Chem. 2011, 54, 6286–6294)',
    primaryPatent: 'WO 2010/143664 A1 / US 8,637,508 B2',
    assignee: 'Chugai / Roche',
    clinicalPhase: 'Approved (FDA 2015)',
    notes: '2nd-generation ALK inhibitor with impressive CNS penetration (not a P-gp substrate), active against gatekeeper L1196M but clinically susceptible to G1202R solvent-front mutation.'
  },
  {
    id: 'ASP2215',
    name: 'Gilteritinib',
    codeName: 'ASP2215',
    series: 'acyclic',
    subseries: 'Pyrazinecarboxamide Acyclic Series',
    linkerType: 'Acyclic flexible amine-ether',
    formula: 'C29H44N8O3',
    mw: 552.71,
    smiles: 'CCN1CCN(CC1)C2=CC=C(C=C2)NC3=NC(=CN=C3C(=O)NC4CCN(CC4)C)OCC',
    inchiKey: 'OQJFFNOLKAFMDZ-UHFFFAOYSA-N',
    pubchemCid: 49803313,
    chemblId: 'CHEMBL3545115',
    pdbId: '6BP8',
    xlogp: 2.8,
    tpsa: 104.2,
    hbd: 2,
    hba: 8,
    rotatableBonds: 8,
    alkWt_ic50: 2.3,
    alkL1196m_ic50: 45.0,
    alkG1202r_ic50: 580.0,
    ros1Wt_ic50: 8.5,
    cMet_ic50: 1100.0,
    cnsMpo: 3.8,
    pGpSubstrate: 'Moderate',
    mdckPapp: 4.5,
    primaryLiterature: '10.1158/1078-0432.CCR-16-1601 (Blood 2017, 129, 347–358)',
    primaryPatent: 'WO 2010/128659 A1 / US 8,969,336 B2',
    assignee: 'Astellas Pharma',
    clinicalPhase: 'Approved (FDA 2018 for AML)',
    notes: 'Dual FLT3/AXL/ALK inhibitor showing multi-kinase polypharmacology in acute myeloid leukemia and refractory kinase-driven hematologic malignancies.'
  },
  {
    id: 'TG101348',
    name: 'Fedratinib',
    codeName: 'TG101348 / SAR302503',
    series: 'acyclic',
    subseries: 'Diarylamino-pyrimidine Acyclic Series',
    linkerType: 'Acyclic sulfonamide',
    formula: 'C27H36N6O3S',
    mw: 524.68,
    smiles: 'CC(C)(C)NC(=O)C1=CC=C(C=C1)NC2=NC=C(C(=N2)NC3=CC=CC(=C3)S(=O)(=O)C)Cl',
    inchiKey: 'FXOONPIGVABYTI-UHFFFAOYSA-N',
    pubchemCid: 16722836,
    chemblId: 'CHEMBL2031758',
    xlogp: 3.6,
    tpsa: 103.5,
    hbd: 3,
    hba: 6,
    rotatableBonds: 7,
    alkWt_ic50: 8.5,
    alkL1196m_ic50: 140.0,
    alkG1202r_ic50: 950.0,
    ros1Wt_ic50: 28.0,
    cMet_ic50: 890.0,
    cnsMpo: 3.3,
    pGpSubstrate: 'High',
    primaryLiterature: '10.1016/j.ccr.2009.11.001 (Cancer Cell 2009, 16, 421–432)',
    primaryPatent: 'WO 2007/053452 A1 / US 7,528,143 B2',
    assignee: 'Bristol Myers Squibb / Celgene',
    clinicalPhase: 'Approved (FDA 2019 for Myelofibrosis)',
    notes: 'JAK2/FLT3/ALK-family inhibitor; illustrates how acyclic sulfonamide hinge-binders display high target selectivity but limited CNS penetration.'
  }
];

export const BROAD_ONCOLOGY_APPLICATIONS: BroadOncologyTherapy[] = [
  {
    id: 's63845-mcl1',
    name: 'S63845 (MCL-1 Macrocycle)',
    targetCategory: 'MCL-1 Apoptosis',
    targetSymbol: 'MCL1',
    molecularType: 'Macrocyclic',
    ringSize: 14,
    cancerIndication: 'Multiple Myeloma, Acute Myeloid Leukemia (AML), Lymphoma',
    clinicalStage: 'Clinical Candidate / Proof-of-concept benchmark',
    smiles: 'CC1=C(C=C(C=C1)Cl)C2=NC(=CS2)C(=O)NC3=CC=C(C=C3)OCCC4=C(C=CC(=C4)S(=O)(=O)N1)Cl',
    formula: 'C39H35ClN6O6S2',
    mw: 783.31,
    mechanismSummary: 'Binds into the deep, hydrophobic BH3-binding groove of anti-apoptotic MCL-1 with picomolar affinity (Kd < 100 pM), displacing pro-apoptotic BAK/BIM to trigger rapid mitochondrial apoptosis.',
    macrocycleAdvantageOverAcyclic: 'Macrocyclic tether pre-organizes the two chlorine-bearing aromatic anchors into the p2 and p4 hydrophobic subpockets of MCL-1. Acyclic counterparts lose >1000-fold affinity due to severe entropic penalties in the wide protein-protein interaction (PPI) groove.',
    keyCitation: 'Kotschy et al., Nature 2016, 538, 477–482 (DOI: 10.1038/nature19830)',
    patentReference: 'WO 2015/097123 A1 / US 9,562,061 B2 (Servier / Novartis)'
  },
  {
    id: 'amg-176-mcl1',
    name: 'AMG 176 (MCL-1 Macrocycle)',
    targetCategory: 'MCL-1 Apoptosis',
    targetSymbol: 'MCL1',
    molecularType: 'Macrocyclic',
    ringSize: 15,
    cancerIndication: 'Relapsed/Refractory AML, Non-Hodgkin Lymphoma',
    clinicalStage: 'Phase I Clinical Trials (First-in-class MCL-1 macrocycle to enter clinic)',
    smiles: 'CC1C2=C(C=CC(=C2)Cl)OC3=C(C=CC(=C3)C(=O)N(C1)C4=CC=C(C=C4)S(=O)(=O)N)O',
    formula: 'C31H28ClN3O7S',
    mw: 622.09,
    mechanismSummary: 'Selective MCL-1 macrocycle designed with high conformational rigidity to preserve nanomolar cell killing while maintaining oral bioavailability.',
    macrocycleAdvantageOverAcyclic: 'Macrocyclization eliminated flexible rotatable bonds that previously degraded permeability and caused high metabolic clearance in earlier linear MCL-1 inhibitors.',
    keyCitation: 'Caenepeel et al., Cancer Discovery 2018, 8, 1582–1597',
    patentReference: 'WO 2016/207216 A1 / US 9,963,456 B2 (Amgen Inc.)'
  },
  {
    id: 'alvocidib-cdk',
    name: 'Alvocidib vs. Macrocyclic CDK Inhibitors',
    targetCategory: 'CDK Cell Cycle',
    targetSymbol: 'CDK9 / CDK2 / CDK7',
    molecularType: 'Acyclic',
    cancerIndication: 'Acute Myeloid Leukemia (AML), Chronic Lymphocytic Leukemia (CLL)',
    clinicalStage: 'Approved Breakthrough Designation / Phase II',
    smiles: 'CN1CCC(C(C1)O)C2=C(C=C(C3=C2OC(=CC3=O)C4=CC=CC=C4Cl)O)O',
    formula: 'C21H20ClNO5',
    mw: 401.84,
    mechanismSummary: 'Flavone-derived CDK9/cyclin T inhibitor that suppresses RNA Polymerase II transcription, causing rapid downregulation of the oncogenic survival protein MCL-1 and MYC.',
    macrocycleAdvantageOverAcyclic: 'While Alvocidib is an acyclic planar alkaloid, next-generation macrocyclic CDK2/CDK9 inhibitors (e.g. NVP-2 derivatives) utilize a flexible macrocyclic tether to selectively contact non-conserved outer-hinge residues, achieving dramatic selectivity against CDK1/CDK4/CDK6 that acyclics cannot match.',
    keyCitation: 'Olson et al., Cell Chem. Biol. 2018, 25, 338–348',
    patentReference: 'US 6,040,321 / WO 2017/001488 (Novartis Macrocyclic CDK)'
  },
  {
    id: 'ixabepilone-tubulin',
    name: 'Ixabepilone (Epothilone B Macrocycle)',
    targetCategory: 'Tubulin Dynamics',
    targetSymbol: 'TUBB (Beta-tubulin)',
    molecularType: 'Macrocyclic',
    ringSize: 16,
    cancerIndication: 'Metastatic Breast Cancer refractory to Paclitaxel / Anthracyclines',
    clinicalStage: 'Approved (FDA 2007)',
    smiles: 'CC1C(=O)NC(C2=C(C=C(C=C2)C)OC3=C1CC(C(C3=O)O)C)C=C(C)C4=CSC(=N4)C',
    formula: 'C27H42N2O5S',
    mw: 506.70,
    mechanismSummary: 'Semisynthetic aza-epothilone B 16-membered macrocycle that binds beta-tubulin, promoting tubulin polymer stabilization and mitotic arrest at the G2/M phase.',
    macrocycleAdvantageOverAcyclic: 'Overcomes multidrug resistance (MDR) driven by P-glycoprotein efflux pumps and beta-III-tubulin overexpression that render standard acyclic/semi-flexible taxanes (Paclitaxel) ineffective.',
    keyCitation: 'BMS-247550 Clinical Evaluation, J. Clin. Oncol. 2005, 23, 8708–8718',
    patentReference: 'US 6,605,599 B1 / WO 1999/027890 (Bristol Myers Squibb)'
  },
  {
    id: 'macrocyclic-protac',
    name: 'Macrocyclic PROTAC (Targeted Degrader)',
    targetCategory: 'Macrocyclic PROTAC / Degrader',
    targetSymbol: 'VHL - ALK / BRD4 Ternary Complex',
    molecularType: 'Macrocyclic',
    ringSize: 24,
    cancerIndication: 'Refractory Kinase-Mutant Cancers, NSCLC, Lymphoma',
    clinicalStage: 'Preclinical Frontier / Next-Generation Degrader',
    smiles: 'CC1CNC(=O)C2=C(C=CC(=C2)F)OC3=C(N=CC(=C3)C4=CN(N=C4)C5=CC=C(C=C5)OCCCC(=O)NC6CC(CN6C(=O)C(C(C)(C)C)NC(=O)C)O)C1',
    formula: 'C48H58FN9O8',
    mw: 924.04,
    mechanismSummary: 'Bifunctional targeted protein degrader where the linker connecting the ALK inhibitor warhead and the E3 ubiquitin ligase ligand (VHL/CRBN) is macrocyclized back onto itself, enforcing a fixed spatial orientation.',
    macrocycleAdvantageOverAcyclic: 'Conventional linear PROTACs suffer from high linker conformational entropy and uncontrolled "hook effect" self-competition. Macrocyclizing the linker creates positive thermodynamic cooperativity (alpha > 1), achieving catalytic protein degradation at 10-fold lower concentrations.',
    keyCitation: 'Testa et al., Angew. Chem. Int. Ed. 2020, 59, 1727–1734',
    patentReference: 'WO 2020/115502 A1 (University of Dundee / Boehringer Ingelheim)'
  }
];
