export interface AcademicPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  pmid?: string;
  seriesCovered: ('Acyclic' | 'Macrocyclic' | 'Comparative SAR')[];
  keyFindings: string[];
  significance: string;
  url: string;
}

export interface PatentRecord {
  id: string;
  patentNumber: string;
  jurisdiction: 'WIPO (PCT)' | 'USPTO' | 'EPO';
  title: string;
  assignee: string;
  inventors: string;
  priorityDate: string;
  publicationDate: string;
  grantDate?: string;
  status: 'Granted' | 'Application';
  seriesType: 'Acyclic' | 'Macrocyclic' | 'Both';
  exemplarCompounds: string[];
  keyClaims: string[];
  abstract: string;
  url: string;
}

export const ACADEMIC_LITERATURE: AcademicPaper[] = [
  {
    id: 'johnson-2014-jmedchem',
    title: 'Discovery of (10R)-7-Amino-12-fluoro-2,10,16-trimethyl-15-oxo-10,14,16,17-tetraazatricyclo[10.3.1.1(4,8)]heptadeca-1(16),4(17),5,7,12,14-hexaene-3-carbonitrile (PF-06463922), a Macrocyclic Inhibitor of ALK/ROS1 with Overwhelming Brain Permeation and Overcoming Clinically Acquired Resistance Mutations',
    authors: 'Johnson, T. W.; Richardson, P. F.; Bailey, S.; Brooun, A.; Burke, B. J.; Collins, M. R.; Cui, J. J.; Deal, J. G.; Deng, Y. L.; Dinh, D.; et al.',
    journal: 'Journal of Medicinal Chemistry',
    year: 2014,
    doi: '10.1021/jm500261q',
    pmid: '24819109',
    seriesCovered: ['Macrocyclic', 'Comparative SAR'],
    keyFindings: [
      'Disclosed the rational macrocyclization of acyclic aminopyridine precursors to create Lorlatinib (PF-06463922).',
      'Macrocyclic ring constraint reduced rotatable bonds from 7 down to 1, lowering entropic penalty upon kinase binding.',
      'Demonstrated high potency against ALK solvent-front mutation G1202R (IC50 = 40 nM) and gatekeeper L1196M (IC50 = 12 nM).',
      'Engineered low P-glycoprotein (P-gp) substrate liability (efflux ratio < 2) and high lipophilic efficiency (LipE = 6.9), achieving overwhelming brain penetration.'
    ],
    significance: 'Landmark discovery paper establishing macrocyclization as a premier strategy to conquer kinase drug resistance mutations and blood-brain barrier permeability.',
    url: 'https://doi.org/10.1021/jm500261q'
  },
  {
    id: 'cui-2011-jmedchem',
    title: 'Tranformation of an Oral c-Met Inhibitor to a Dual MET/ALK Kinase Inhibitor: Discovery of Crizotinib (PF-02341066)',
    authors: 'Cui, J. J.; Tran-Dube, M.; Shen, H.; Nambu, M.; Kung, P. P.; Pairish, M.; Jia, L.; Meng, J.; Funk, L.; Botrous, I.; et al.',
    journal: 'Journal of Medicinal Chemistry',
    year: 2011,
    doi: '10.1021/jm200632q',
    pmid: '21812414',
    seriesCovered: ['Acyclic'],
    keyFindings: [
      'Discovery of first-in-class dual c-MET/ALK acyclic inhibitor Crizotinib from PHA-665752 scaffold.',
      'Optimization of 2-aminopyridine hinge-binding element with (R)-enantiomer benzylic ether.',
      'Showed potent in vitro ALK inhibition (IC50 = 3 nM) and regression of EML4-ALK NSCLC tumors in preclinical models.',
      'Identified clinical vulnerability: rapid onset of resistance mutations (L1196M, G1202R) and inadequate CNS exposure.'
    ],
    significance: 'Foundational paper describing the chemical genesis of the acyclic aminopyridine ALK inhibitor class.',
    url: 'https://doi.org/10.1021/jm200632q'
  },
  {
    id: 'shaw-2019-lancet-oncol',
    title: 'Lorlatinib in Advanced ALK-Positive Non-Small-Cell Lung Cancer: Analysis of Resistant Mutations and Central Nervous System Efficacy in a Phase 1/2 Study',
    authors: 'Shaw, A. T.; Solomon, B. J.; Besse, B.; Bauer, T. M.; Lin, C. C.; Soo, R. A.; Riely, G. J.; Ou, S. H. I.; Clancy, J. S.; et al.',
    journal: 'The Lancet Oncology',
    year: 2019,
    doi: '10.1016/S1470-2045(19)30654-7',
    pmid: '31699661',
    seriesCovered: ['Macrocyclic', 'Comparative SAR'],
    keyFindings: [
      'Clinical proof-of-concept that macrocyclic Lorlatinib drives intracranial objective response rates of 67% in patients previously progressing on acyclic inhibitors.',
      'Confirmed high clinical efficacy against tumors harboring the G1202R solvent-front mutation, which was resistant to all 1st and 2nd gen acyclic inhibitors.',
      'Characterized newly emerging compound mutations (e.g., G1202R + L1196M) that eventually emerge under macrocyclic selective pressure.'
    ],
    significance: 'Established the clinical benchmark for macrocyclic kinase inhibitors in CNS-metastatic and mutation-resistant cancer.',
    url: 'https://doi.org/10.1016/S1470-2045(19)30654-7'
  },
  {
    id: 'drilon-2018-cancer-disc',
    title: 'A Next-Generation TRK and ROS1 Inhibitor (Repotrectinib, TPX-0005) Overcomes Solvent Front Resistance Mutations',
    authors: 'Drilon, A.; Ou, S. H. I.; Cho, B. C.; Kim, D. W.; Lee, J.; Solomon, B. J.; Lin, J. J.; Zhu, V. W.; Ward, M. J.; et al.',
    journal: 'Cancer Discovery',
    year: 2018,
    doi: '10.1158/2159-8290.CD-18-0484',
    pmid: '29954751',
    seriesCovered: ['Macrocyclic'],
    keyFindings: [
      'Demonstrated design of compact 14-membered macrocycle to avoid steric clash with bulky Arg residue at solvent front.',
      'Presents sub-nanomolar potency against WT and solvent-front mutants of ROS1 (G2032R), TRK, and ALK (G1202R).',
      'CNS MPO of 5.6 confirming superior brain barrier penetration.'
    ],
    significance: 'Showcased the evolution from 12-membered to compact 14-membered macrocycles across the Crizotinib/Lorlatinib cousin family.',
    url: 'https://doi.org/10.1158/2159-8290.CD-18-0484'
  },
  {
    id: 'pelish-2023-cancer-disc',
    title: 'NVL-655 is a Selective, Brain-Penetrant ALK Inhibitor Designed to Overcome Compound Mutations While Sparing TRK',
    authors: 'Pelish, H. E.; Tang, C. Y.; Zhang, Z.; Hodous, B. L.; Ge, J.; Dorsch, M.; et al.',
    journal: 'Cancer Discovery',
    year: 2023,
    doi: '10.1158/2159-8290.CD-23-0402',
    pmid: '37466453',
    seriesCovered: ['Macrocyclic', 'Comparative SAR'],
    keyFindings: [
      'Engineered next-generation macrocycle specifically selective for ALK over TRK family kinases.',
      'Solves Lorlatinib-associated neurocognitive adverse events caused by off-target TRKB/C inhibition.',
      'Retains picomolar activity on ALK WT and single mutants (G1202R, L1196M) while active against double compound mutations.'
    ],
    significance: 'Current cutting-edge clinical stage macrocyclic ALK inhibitor defining 4th-generation kinase medicinal chemistry.',
    url: 'https://doi.org/10.1158/2159-8290.CD-23-0402'
  }
];

export const PATENT_LITERATURE: PatentRecord[] = [
  {
    id: 'pfizer-wo-2013132376',
    patentNumber: 'WO 2013/132376 A1',
    jurisdiction: 'WIPO (PCT)',
    title: 'Macrocyclic Compounds as Kinase Inhibitors',
    assignee: 'Pfizer Inc.',
    inventors: 'Johnson, Ted W.; Bailey, Simon; Brooun, Alexei; Collins, Michael R.; Cui, Jingrong Jean; Deal, Judith G.; et al.',
    priorityDate: '2012-03-05',
    publicationDate: '2013-09-12',
    status: 'Application',
    seriesType: 'Macrocyclic',
    exemplarCompounds: ['PF-06463922 (Lorlatinib)', 'Example 1', 'Example 8a', 'Example 15', 'Example 22'],
    keyClaims: [
      'Claims macrocyclic compounds represented by Formula (I) comprising a 12- to 14-membered macrocyclic core containing an aminopyridine hinge binder and an amide-ether bridge.',
      'Claims specific (10R)-stereoisomers exhibiting selective inhibition of wild-type and mutant ALK (L1196M, G1202R) and ROS1 kinases.',
      'Claims pharmaceutical compositions formulated for central nervous system tumor delivery.'
    ],
    abstract: 'The present invention relates to novel macrocyclic compounds of Formula (I), to pharmaceutical compositions containing them, and to their use in the treatment of abnormal cell growth, such as cancer, in particular tumors mediated by ALK or ROS1 kinase activities.',
    url: 'https://patents.google.com/patent/WO2013132376A1/en'
  },
  {
    id: 'pfizer-us-8680111',
    patentNumber: 'US 8,680,111 B2',
    jurisdiction: 'USPTO',
    title: 'Macrocyclic Kinase Inhibitors',
    assignee: 'Pfizer Inc.',
    inventors: 'Johnson, Ted W.; Bailey, Simon; Brooun, Alexei; Collins, Michael R.; Cui, Jingrong Jean',
    priorityDate: '2012-03-05',
    publicationDate: '2014-03-25',
    grantDate: '2014-03-25',
    status: 'Granted',
    seriesType: 'Macrocyclic',
    exemplarCompounds: ['Lorlatinib (PF-06463922)', 'Example 1', 'Example 15'],
    keyClaims: [
      'Granted composition-of-matter claim covering Lorlatinib and its pharmaceutically acceptable salts.',
      'Defines the 12-membered ring with (R)-benzylic methyl and fluoro-phenyl ether linkages.',
      'Protection granted through 2033 (with patent term extension provisions).'
    ],
    abstract: 'This invention provides compounds of Formula (I) or pharmaceutically acceptable salts thereof, wherein the macrocyclic ring provides unexpectedly high brain permeability and activity against drug-resistant ALK and ROS1 mutant proteins.',
    url: 'https://patents.google.com/patent/US8680111B2/en'
  },
  {
    id: 'pfizer-us-9567337',
    patentNumber: 'US 9,567,337 B2',
    jurisdiction: 'USPTO',
    title: 'Methods of Treating Cancer Using Macrocyclic Kinase Inhibitors',
    assignee: 'Pfizer Inc.',
    inventors: 'Johnson, Ted W.; Bailey, Simon; Brooun, Alexei',
    priorityDate: '2012-03-05',
    publicationDate: '2017-02-14',
    grantDate: '2017-02-14',
    status: 'Granted',
    seriesType: 'Macrocyclic',
    exemplarCompounds: ['Lorlatinib', 'Compound 8a', 'Compound 12'],
    keyClaims: [
      'Method of treating non-small cell lung cancer (NSCLC) harboring an ALK G1202R mutation in a patient previously treated with crizotinib or ceritinib.',
      'Method of reducing intracranial metastases in ALK-driven malignancies using orally administered macrocycles.'
    ],
    abstract: 'Methods for treating patients with abnormal cell growth using macrocyclic ALK/ROS1 inhibitors, including patients who have acquired resistance to acyclic kinase inhibitors like crizotinib.',
    url: 'https://patents.google.com/patent/US9567337B2/en'
  },
  {
    id: 'pfizer-wo-2006021884',
    patentNumber: 'WO 2006/021884 A2',
    jurisdiction: 'WIPO (PCT)',
    title: 'Enantiomerically Pure Aminoheteroaryl Compounds as Protein Kinase Inhibitors',
    assignee: 'Pfizer Inc.',
    inventors: 'Cui, Jingrong Jean; Shen, Hong; Tran-Dube, Michelle; Kung, Pei-Pei; Meng, Jerry J.; et al.',
    priorityDate: '2004-08-19',
    publicationDate: '2006-03-02',
    status: 'Granted',
    seriesType: 'Acyclic',
    exemplarCompounds: ['PF-02341066 (Crizotinib)', 'Example 1', 'Example 14'],
    keyClaims: [
      'Composition-of-matter claims covering acyclic (R)-enantiomer 3-[1-(2,6-dichloro-3-fluorophenyl)ethoxy]-5-(1-piperidin-4-yl-1H-pyrazol-4-yl)pyridin-2-amine.',
      'Use of acyclic 2-aminopyridines for inhibition of c-MET and ALK receptor tyrosine kinases.',
      'Synthetic schemes for stereospecific etherification of 2-aminopyridines with chiral 1-arylethanols.'
    ],
    abstract: 'Novel enantiomerically pure aminoheteroaryl compounds, pharmaceutical compositions containing them, and methods of using them to treat abnormal cell growth mediated by protein kinases such as c-Met, ALK, and Ron.',
    url: 'https://patents.google.com/patent/WO2006021884A2/en'
  },
  {
    id: 'turningpoint-wo-2015112806',
    patentNumber: 'WO 2015/112806 A1',
    jurisdiction: 'WIPO (PCT)',
    title: 'Macrocyclic Kinase Inhibitors and Methods of Use',
    assignee: 'Turning Point Therapeutics, Inc.',
    inventors: 'Cui, Jingrong Jean; Li, Yishan; Rogers, Evan; Zhai, Dayong',
    priorityDate: '2014-01-24',
    publicationDate: '2015-07-30',
    status: 'Granted',
    seriesType: 'Macrocyclic',
    exemplarCompounds: ['Repotrectinib (TPX-0005)', 'Example 3', 'Example 12'],
    keyClaims: [
      'Claims compact 14-membered macrocyclic diaryl ether compounds lacking exocyclic amide linkers.',
      'Claims high inhibitory potency against solvent-front mutations in ALK, ROS1, and TRK kinases.'
    ],
    abstract: 'The present disclosure relates to compact macrocyclic compounds useful as inhibitors of kinases such as ROS1, ALK, TRKA, TRKB, and TRKC, overcoming clinical solvent front mutations.',
    url: 'https://patents.google.com/patent/WO2015112806A1/en'
  },
  {
    id: 'nuvalent-wo-2021146603',
    patentNumber: 'WO 2021/146603 A1',
    jurisdiction: 'WIPO (PCT)',
    title: 'Macrocyclic Compounds as ALK Inhibitors',
    assignee: 'Nuvalent, Inc.',
    inventors: 'Pelish, Henry E.; Tang, Christopher Y.; Hodous, Brian L.',
    priorityDate: '2020-01-17',
    publicationDate: '2021-07-22',
    status: 'Granted',
    seriesType: 'Macrocyclic',
    exemplarCompounds: ['NVL-655', 'Example 18', 'Example 29'],
    keyClaims: [
      'Claims selective macrocyclic ALK inhibitors that spare TRK neurogenic receptors.',
      'Claims activity against ALK single resistance mutations (G1202R, L1196M) and double compound mutations (e.g., G1202R+L1196M, G1202R+G1269A).'
    ],
    abstract: 'Provided herein are novel macrocyclic inhibitors of ALK with exceptional central nervous system penetration and high selectivity against TRK family kinases for the treatment of refractory cancer.',
    url: 'https://patents.google.com/patent/WO2021146603A1/en'
  }
];
