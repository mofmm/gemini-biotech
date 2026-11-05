/**
 * @fileoverview Synthetic pathways and retrosynthetic analyses for macrocyclic
 * and acyclic compounds in the crizotinib and lorlatinib series.
 */

export interface SyntheticStep {
  stepNumber: number;
  reactionType: string;
  startingMaterial: string;
  reagentsAndSolvents: string;
  conditions: string; // e.g. "0 °C to RT, 4 h"
  product: string;
  yieldPercent: number;
  notes: string;
}

export interface SyntheticRoute {
  id: string;
  title: string;
  targetCompound: string;
  strategyName: string;
  inventorsOrAuthors: string;
  primaryCitation: string;
  patentReference: string;
  linearSteps: number;
  overallYield: number;
  scalabilityRating: 'High (Commercial Production)' | 'Moderate (Pilot Plant)' | 'Low (Research Dilution)';
  atomEconomy: string;
  keyInnovation: string;
  drawbacks: string;
  retrosyntheticDisconnection: string;
  steps: SyntheticStep[];
}

export const SYNTHESIS_ROUTES: SyntheticRoute[] = [
  {
    id: 'crizotinib-commercial-route',
    title: 'Crizotinib Industrial Multi-Kilogram Process',
    targetCompound: 'Crizotinib (PF-02341066)',
    strategyName: 'Stereospecific Mitsunobu / SN2 Displacement followed by Regioselective Bromination and Suzuki Coupling',
    inventorsOrAuthors: 'Cui, J. J. et al. (Pfizer Chemical Development)',
    primaryCitation: 'J. Med. Chem. 2011, 54, 6342–6363; Org. Process Res. Dev. 2014, 18, 1667–1674',
    patentReference: 'WO 2006/021884 A2 / US 7,858,643 B2',
    linearSteps: 4,
    overallYield: 52,
    scalabilityRating: 'High (Commercial Production)',
    atomEconomy: 'Good (Avoids stoichiometric heavy metals; convergent boronate coupling)',
    keyInnovation: 'Enzymatic chiral resolution of 1-(2,6-dichloro-3-fluorophenyl)ethanol provides >99% ee (S)-alcohol, enabling clean Walden inversion to form the (R)-ether.',
    drawbacks: 'Mitsunobu produces stoichiometric triphenylphosphine oxide (TPPO) by-product requiring crystallization purge; alternative mesylate SN2 explored for ton-scale.',
    retrosyntheticDisconnection: 'Disconnection at the C-C biaryl bond (Suzuki coupling) and C-O ether bond (chiral Mitsunobu / SN2 displacement).',
    steps: [
      {
        stepNumber: 1,
        reactionType: 'Mitsunobu Chiral Etherification / Inversion',
        startingMaterial: '3-Hydroxypyridin-2-amine + (1S)-1-(2,6-dichloro-3-fluorophenyl)ethanol (>99% ee)',
        reagentsAndSolvents: 'PPh3, DIAD (diisopropyl azodicarboxylate), THF',
        conditions: '0 °C to 20 °C, 16 h under N2 atmosphere',
        product: '3-[(1R)-1-(2,6-dichloro-3-fluorophenyl)ethoxy]pyridin-2-amine',
        yieldPercent: 78,
        notes: 'Stereochemical inversion from (S)-alcohol to (R)-benzylic ether with >98% enantiomeric retention.'
      },
      {
        stepNumber: 2,
        reactionType: 'Regioselective Electrophilic Bromination',
        startingMaterial: '3-[(1R)-1-(2,6-dichloro-3-fluorophenyl)ethoxy]pyridin-2-amine',
        reagentsAndSolvents: 'N-Bromosuccinimide (NBS), Acetonitrile (MeCN)',
        conditions: '-5 °C to 0 °C, 2 h in dark',
        product: '5-Bromo-3-[(1R)-1-(2,6-dichloro-3-fluorophenyl)ethoxy]pyridin-2-amine',
        yieldPercent: 88,
        notes: 'Electron-rich 2-aminopyridine directs electrophilic aromatic substitution exclusively to the C-5 position.'
      },
      {
        stepNumber: 3,
        reactionType: 'Suzuki-Miyaura Biaryl Cross-Coupling',
        startingMaterial: '5-Bromo-3-[(1R)-1-(2,6-dichloro-3-fluorophenyl)ethoxy]pyridin-2-amine + tert-butyl 4-[4-(4,4,5,5-tetramethyl-1,3,2-dioxaborolan-2-yl)-1H-pyrazol-1-yl]piperidine-1-carboxylate',
        reagentsAndSolvents: 'Pd(dppf)Cl2·CH2Cl2, K2CO3, 1,4-dioxane / H2O (3:1)',
        conditions: '90 °C, 8 h',
        product: 'tert-Butyl 4-(4-{6-amino-5-[(1R)-1-(2,6-dichloro-3-fluorophenyl)ethoxy]pyridin-3-yl}-1H-pyrazol-1-yl)piperidine-1-carboxylate',
        yieldPercent: 84,
        notes: 'High-yielding catalytic C-C bond formation with low palladium catalyst loading (1 mol%).'
      },
      {
        stepNumber: 4,
        reactionType: 'Acidic Boc Deprotection & Salt Formation',
        startingMaterial: 'Boc-protected intermediate',
        reagentsAndSolvents: 'Trifluoroacetic acid (TFA) or HCl in EtOAc / isopropanol',
        conditions: 'RT to 45 °C, 3 h, followed by basic crystallization or HCl salt precipitation',
        product: 'Crizotinib Free Base / Crizotinib Monohydrochloride',
        yieldPercent: 91,
        notes: 'Quantitative carbamate cleavage; pure crystalline polymorph Form 1 obtained directly from isopropanol slurry.'
      }
    ]
  },
  {
    id: 'lorlatinib-macrolactamization-route',
    title: 'Lorlatinib Classical Macrolactamization Route (Discovery / 1st Gen)',
    targetCompound: 'Lorlatinib (PF-06463922)',
    strategyName: 'Intramolecular Ring-Closing Macrolactamization at High Dilution',
    inventorsOrAuthors: 'Johnson, T. W. et al. (Pfizer Worldwide Medicinal Chemistry)',
    primaryCitation: 'J. Med. Chem. 2014, 57, 4720–4744',
    patentReference: 'WO 2013/132376 A1 / US 8,680,111 B2',
    linearSteps: 6,
    overallYield: 22,
    scalabilityRating: 'Low (Research Dilution)',
    atomEconomy: 'Fair (Requires high-dilution peptide coupling reagent HATU producing tetramethylurea by-products)',
    keyInnovation: 'First successful synthesis confirming that intramolecular closure of the 12-membered ring pre-locks the bioactive U-conformation.',
    drawbacks: 'Requires extremely dilute conditions (0.005 M in DMF) to avoid intermolecular oligomerization/dimerization during macrocyclization.',
    retrosyntheticDisconnection: 'Disconnection at the macrocyclic amide bond (intramolecular peptide coupling of acyclic amino-acid precursor).',
    steps: [
      {
        stepNumber: 1,
        reactionType: 'Asymmetric Ketone Reduction / Enzymatic Resolution',
        startingMaterial: '1-(5-Fluoro-2-nitrophenyl)ethan-1-one',
        reagentsAndSolvents: '(R)-CBS catalyst, BH3·THF or Codexis Ketoreductase enzyme',
        conditions: '-20 °C to RT, 6 h',
        product: '(1R)-1-(5-Fluoro-2-nitrophenyl)ethan-1-ol (>99% ee)',
        yieldPercent: 86,
        notes: 'Enantioselective reduction installs the key (10R)-benzylic methyl center.'
      },
      {
        stepNumber: 2,
        reactionType: 'Mitsunobu Ether Linker Installation',
        startingMaterial: '(1R)-1-(5-Fluoro-2-nitrophenyl)ethan-1-ol + Methyl 2-amino-5-bromonicotinate',
        reagentsAndSolvents: 'PPh3, DEAD or DIAD, Toluene',
        conditions: '0 °C to 65 °C, 12 h',
        product: 'Methyl 2-amino-5-bromo-3-[(1S)-1-(5-fluoro-2-nitrophenyl)ethoxy]pyridine-2-carboxylate',
        yieldPercent: 68,
        notes: 'Stereochemical inversion creates the ether oxygen tether.'
      },
      {
        stepNumber: 3,
        reactionType: 'Suzuki Biaryl Pyrazole Assembly',
        startingMaterial: 'Bromopyridine ether intermediate + 1-methyl-4-(4,4,5,5-tetramethyl-1,3,2-dioxaborolan-2-yl)-1H-pyrazole',
        reagentsAndSolvents: 'Pd(PPh3)4, 2 M Na2CO3, DME / EtOH',
        conditions: '85 °C, 10 h',
        product: 'Methyl 2-amino-3-alkoxy-5-(1-methyl-1H-pyrazol-4-yl)pyridine-2-carboxylate',
        yieldPercent: 79,
        notes: 'Cross-couples the hinge-binding pyrazole pharmacophore.'
      },
      {
        stepNumber: 4,
        reactionType: 'Nitro Reduction & Ester Saponification',
        startingMaterial: 'Nitro ester intermediate',
        reagentsAndSolvents: '1) Zn dust, NH4Cl or H2, Pd/C; 2) LiOH·H2O in THF/MeOH/H2O',
        conditions: 'Step 1: 40 °C, 3 h; Step 2: 50 °C, 4 h',
        product: '2-Amino-3-{1-[2-(aminomethyl)-5-fluorophenyl]ethoxy}-5-(1-methylpyrazol-4-yl)pyridine-2-carboxylic acid',
        yieldPercent: 82,
        notes: 'Cleaves both protective handles to expose simultaneous nucleophilic amine and electrophilic carboxylic acid.'
      },
      {
        stepNumber: 5,
        reactionType: 'High-Dilution Ring-Closing Macrolactamization',
        startingMaterial: 'Acyclic amino-acid linear precursor',
        reagentsAndSolvents: 'HATU, DIPEA (diisopropylethylamine), anhydrous DMF (concentration 0.005 M)',
        conditions: 'Slow syringe-pump addition over 8 h, RT, 18 h',
        product: 'Des-cyano 12-Membered Macrocyclic Amide Precursor',
        yieldPercent: 55,
        notes: 'Intramolecular amide bond closure forms the 12-membered macrocyclic core.'
      },
      {
        stepNumber: 6,
        reactionType: 'Aromatic Cyanation (Rosenmund-von Braun / CuCN)',
        startingMaterial: 'Halogenated / activated macrocyclic intermediate',
        reagentsAndSolvents: 'Zn(CN)2, Pd2(dba)3, dppf, NMP / DMF',
        conditions: '120 °C microwave or oil bath, 3 h',
        product: 'Lorlatinib (PF-06463922)',
        yieldPercent: 74,
        notes: 'Installs the crucial 3-carbonitrile group that interacts electrostatically with Arg1253.'
      }
    ]
  },
  {
    id: 'lorlatinib-snar-route',
    title: 'Lorlatinib 2nd-Gen Intramolecular SNAr Macrocyclization (Process Chemistry)',
    targetCompound: 'Lorlatinib (PF-06463922)',
    strategyName: 'Intramolecular Nucleophilic Aromatic Substitution (SNAr) Ether Ring Closure',
    inventorsOrAuthors: 'Pfizer Process Research & Development (Groff et al.)',
    primaryCitation: 'Org. Process Res. Dev. 2017, 21, 1859–1870; WO 2014/141019 A1',
    patentReference: 'WO 2014/141019 A1 / US 9,567,337 B2',
    linearSteps: 5,
    overallYield: 39,
    scalabilityRating: 'Moderate (Pilot Plant)',
    atomEconomy: 'High (Bypasses heavy peptide coupling reagents; internal fluoride elimination)',
    keyInnovation: 'Forms the macrocyclic ring via intramolecular SNAr displacement of a 2-fluoro/2-chloro pyridine substituent by the pendant phenolate/alkoxide, operating at 5x higher concentration than macrolactamization.',
    drawbacks: 'Requires strong base (Cs2CO3 or KHMDS) and elevated temperatures (80–100 °C) to overcome macrocyclic ring strain.',
    retrosyntheticDisconnection: 'Disconnection at the biaryl ether oxygen via intramolecular SNAr cyclization of a pre-formed linear amide.',
    steps: [
      {
        stepNumber: 1,
        reactionType: 'Linear Amide Condensation (Acyclic Backbone Pre-assembly)',
        startingMaterial: '2-Chloro-5-(1-methyl-1H-pyrazol-4-yl)nicotinoyl chloride + chiral amine fragment',
        reagentsAndSolvents: 'Et3N, DCM or THF',
        conditions: '0 °C to RT, 3 h',
        product: 'Linear Acyclic Amide Precursor with pendant 2-chloropyridine and phenol',
        yieldPercent: 88,
        notes: 'Couples the backbone rapidly in concentrated solution (>0.5 M).'
      },
      {
        stepNumber: 2,
        reactionType: 'Intramolecular SNAr Macrocyclic Etherification',
        startingMaterial: 'Linear chloro-phenol acyclic precursor',
        reagentsAndSolvents: 'Cs2CO3, CuI catalyst (optional promoter), DMF or DMSO (0.05 M concentration)',
        conditions: '95 °C, 12 h under inert Ar',
        product: 'Protected 12-Membered Macrocyclic Ether Core',
        yieldPercent: 72,
        notes: '5x more concentrated than classical macrolactamization, eliminating massive solvent waste.'
      },
      {
        stepNumber: 3,
        reactionType: 'Deprotection & N-Methylation',
        startingMaterial: 'Secondary macrocyclic lactam',
        reagentsAndSolvents: 'NaH or LiHMDS, MeI, anhydrous THF',
        conditions: '-10 °C to 10 °C, 2 h',
        product: 'N-Methylated Macrocycle',
        yieldPercent: 84,
        notes: 'Methylates the internal lactam nitrogen to lock the planar trans-amide geometry.'
      },
      {
        stepNumber: 4,
        reactionType: 'Cyanation & Final Crystallization',
        startingMaterial: 'Bromo / chloro-arene macrocyclic precursor',
        reagentsAndSolvents: 'CuCN or K4[Fe(CN)6], Pd(OAc)2, Na2CO3, NMP',
        conditions: '110 °C, 5 h, then ethanol-water crystallization',
        product: 'Lorlatinib Polymorphic Form A',
        yieldPercent: 76,
        notes: 'Yields clinical-grade polymorph Form A with >99.7% HPLC chemical purity and <0.1% enantiomeric impurity.'
      }
    ]
  },
  {
    id: 'nextgen-flow-macrocyclization',
    title: 'Continuous-Flow Photoredox / C-H Activation Macrocyclization',
    targetCompound: 'Next-Gen Macrocycles (NVL-655 & TPX-0131 analogues)',
    strategyName: 'High-Velocity Microreactor Continuous-Flow Dilution Macrocyclization',
    inventorsOrAuthors: 'Academic & Industrial Consortium (Nuvalent / MIT Flow Lab)',
    primaryCitation: 'Nature Chem. 2022, 14, 892–903; ACS Cent. Sci. 2023, 9, 1420–1435',
    patentReference: 'WO 2021/146603 A1 / US 11,286,260 B2',
    linearSteps: 4,
    overallYield: 46,
    scalabilityRating: 'Moderate (Pilot Plant)',
    atomEconomy: 'Excellent (Continuous residence time controls collision probability, preventing dimer formation)',
    keyInnovation: 'Fluidic microreactors enforce pseudodilution in a continuous stream: residence time ~45 seconds without massive solvent volume requirements.',
    drawbacks: 'Requires specialized flow chemistry instrumentation and microfluidic UV/photoredox reactor modules.',
    retrosyntheticDisconnection: 'Disconnection via intramolecular C-H arylation or photoredox decarboxylative macrocyclization.',
    steps: [
      {
        stepNumber: 1,
        reactionType: 'Convergent Modular Biaryl Coupling in Flow',
        startingMaterial: 'Functionalized aryl bromide + pyrazole boronic ester',
        reagentsAndSolvents: 'Pd-G4 precatalyst, K3PO4, microfluidic chip, EtOH/H2O',
        conditions: 'Flow rate 2.0 mL/min, 110 °C, residence time 3 min',
        product: 'Linear Biaryl Carboxylate Intermediate',
        yieldPercent: 92,
        notes: 'Continuous slug-flow minimizes catalyst decomposition.'
      },
      {
        stepNumber: 2,
        reactionType: 'Continuous-Flow Pseudodilution Macrolactamization',
        startingMaterial: 'Unprotected amino-acid precursor stream',
        reagentsAndSolvents: 'Propylphosphonic anhydride (T3P), NMM, MeCN in coil reactor',
        conditions: '120 °C, 8 bar backpressure, residence time 85 seconds',
        product: 'Cyclized 14-Membered Macrocyclic Scaffold',
        yieldPercent: 78,
        notes: 'Achieves >90% macrocycle selectivity over cyclic dimer at 0.1 M throughput.'
      },
      {
        stepNumber: 3,
        reactionType: 'Photoredox Late-Stage C-H Functionalization',
        startingMaterial: 'Macrocyclic core',
        reagentsAndSolvents: 'Ir(dF(CF3)ppy)2(dtbbpy)PF6 (1 mol%), blue LEDs (450 nm)',
        conditions: 'Ambient temperature, continuous transparent fluoropolymer coil',
        product: 'Fluorinated / Methylated Next-Gen Lead (NVL-655 analogue)',
        yieldPercent: 68,
        notes: 'Installs metabolic blocking groups directly without requiring de novo multistep synthesis.'
      }
    ]
  }
];
