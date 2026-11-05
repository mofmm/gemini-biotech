import React, { useState, useMemo } from 'react';
import { COMPOUNDS_DATA } from './data/compoundsData';
import { EXPANDED_RTK_AND_BROADER_COMPOUNDS } from './data/expandedCancerTherapyData';
import { CompoundRecord } from './utils/dataPreparation';
import { CompoundMatrixView } from './components/CompoundMatrixView';
import { MacrocyclizationSARView } from './components/MacrocyclizationSARView';
import { AcademicPatentMiningView } from './components/AcademicPatentMiningView';
import { DataExportCenterView } from './components/DataExportCenterView';
import { CompoundDetailModal } from './components/CompoundDetailModal';
import { PairwiseCompareModal } from './components/PairwiseCompareModal';
import { ThreeDmolViewer } from './components/ThreeDmolViewer';
import { PrioritizationDashboardView } from './components/PrioritizationDashboardView';
import { SynthesisPathwaysView } from './components/SynthesisPathwaysView';
import { ExpandedOncologyView } from './components/ExpandedOncologyView';
import { 
  Dna, 
  Layers, 
  BookOpen, 
  Download, 
  Scale, 
  Sparkles, 
  FlaskConical, 
  ShieldCheck, 
  ExternalLink,
  Trophy,
  GitBranch,
  Atom
} from 'lucide-react';

export default function App() {
  // Combine core ALK series with expanded RTK compounds
  const allCompounds = useMemo(() => {
    return [...COMPOUNDS_DATA, ...EXPANDED_RTK_AND_BROADER_COMPOUNDS];
  }, []);

  const [activeTab, setActiveTab] = useState<
    'matrix' | 'studio3d' | 'prioritization' | 'sar' | 'synthesis' | 'oncology' | 'literature' | 'export'
  >('matrix');
  const [selectedCompound, setSelectedCompound] = useState<CompoundRecord | null>(null);
  const [selected3DConformer, setSelected3DConformer] = useState<string>('Lorlatinib (PF-06463922)');
  
  // Pairwise compare state
  const [selectedForCompare, setSelectedForCompare] = useState<CompoundRecord[]>([
    COMPOUNDS_DATA[0], // Crizotinib
    COMPOUNDS_DATA[8], // Lorlatinib
  ]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleCompare = (compound: CompoundRecord) => {
    if (selectedForCompare.some((c) => c.id === compound.id)) {
      setSelectedForCompare(selectedForCompare.filter((c) => c.id !== compound.id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], compound]);
      } else {
        setSelectedForCompare([...selectedForCompare, compound]);
      }
    }
  };

  const handleQuickLoad = (compoundId: string) => {
    const found = allCompounds.find((c) => c.id === compoundId);
    if (found) {
      setSelectedCompound(found);
    }
  };

  const handleOpen3DStudio = (conformerName: string) => {
    if (conformerName.includes('Lorlatinib') || conformerName.includes('PF-06463922')) {
      setSelected3DConformer('Lorlatinib (PF-06463922)');
    } else if (conformerName.includes('Crizotinib') || conformerName.includes('PF-02341066')) {
      setSelected3DConformer('Crizotinib (PF-02341066)');
    } else if (conformerName.includes('NVL-655')) {
      setSelected3DConformer('NVL-655 (4th Gen Macrocycle)');
    } else {
      setSelected3DConformer('Lorlatinib (PF-06463922)');
    }
    setActiveTab('studio3d');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-sm">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  ALK Kinase Macrocycle &amp; Acyclic ChemExplorer
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Crizotinib &amp; Lorlatinib Series
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Academic &amp; Patent Literature Mining, 3D Kinase Studio, Lead Prioritization, Synthesis Routes &amp; SAR
              </p>
            </div>
          </div>

          {/* Dataset Quick Stats Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
              <span className="font-bold text-slate-900">{allCompounds.length}</span> Compounds
            </div>
            <div className="px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg text-purple-700">
              <span className="font-bold text-purple-900">{allCompounds.filter(c => c.series === 'macrocyclic').length}</span> Macrocycles
            </div>
            <div className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              <span className="font-bold text-blue-900">{allCompounds.filter(c => c.series === 'acyclic').length}</span> Acyclic
            </div>
          </div>
        </div>

        {/* Quick-Try Example Chip Bar (Science Workbench UX) */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Quick Examples:
          </span>
          <button
            onClick={() => handleQuickLoad('PF-06463922')}
            className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-700 shrink-0 transition-colors font-medium"
          >
            Lorlatinib (PF-06463922, 12-mer)
          </button>
          <button
            onClick={() => handleQuickLoad('PF-02341066')}
            className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 shrink-0 transition-colors font-medium"
          >
            Crizotinib (PF-02341066, Acyclic)
          </button>
          <button
            onClick={() => handleOpen3DStudio('Lorlatinib (PF-06463922)')}
            className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 shrink-0 transition-colors font-medium flex items-center gap-1"
          >
            <Atom className="w-3 h-3 text-indigo-600" />
            3D Kinase Pocket Clash Test
          </button>
          <button
            onClick={() => handleQuickLoad('NVL-655')}
            className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 shrink-0 transition-colors font-medium"
          >
            NVL-655 (4th Gen Macrocycle)
          </button>
          <button
            onClick={() => handleQuickLoad('CH5424802')}
            className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:text-amber-700 shrink-0 transition-colors font-medium"
          >
            Alectinib (CH5424802)
          </button>
          <button
            onClick={() => {
              setSelectedForCompare([
                allCompounds.find((c) => c.id === 'PF-02341066')!,
                allCompounds.find((c) => c.id === 'PF-06463922')!
              ]);
              setShowCompareModal(true);
            }}
            className="px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 shrink-0 transition-colors font-medium"
          >
            Compare Crizotinib vs Lorlatinib ⚖️
          </button>
        </div>

        {/* Primary View Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'matrix'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Compound Matrix &amp; 2D
          </button>

          <button
            onClick={() => setActiveTab('studio3d')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'studio3d'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Atom className="w-4 h-4 text-purple-600" />
            3D Molecular &amp; Kinase Studio
          </button>

          <button
            onClick={() => setActiveTab('prioritization')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'prioritization'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            Lead Prioritization (PEI &amp; Novelty)
          </button>

          <button
            onClick={() => setActiveTab('sar')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'sar'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            SAR &amp; Macrocyclization
          </button>

          <button
            onClick={() => setActiveTab('synthesis')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'synthesis'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4 text-emerald-600" />
            Synthesis Pathways &amp; Retrosynthesis
          </button>

          <button
            onClick={() => setActiveTab('oncology')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'oncology'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dna className="w-4 h-4 text-purple-500" />
            Broader Oncology &amp; RTKs
          </button>

          <button
            onClick={() => setActiveTab('literature')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'literature'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Literature &amp; Patents
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            Cheminformatics Export
          </button>

          <button
            onClick={() => setShowCompareModal(true)}
            className="py-3 px-3 border-b-2 border-transparent text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-all shrink-0 ml-auto"
          >
            <Scale className="w-4 h-4" />
            Pairwise Compare ({selectedForCompare.length})
          </button>
        </div>
      </header>

      {/* Main Body View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'matrix' && (
          <CompoundMatrixView
            compounds={allCompounds}
            onSelectCompound={(c) => setSelectedCompound(c)}
            selectedForCompare={selectedForCompare}
            onToggleCompare={toggleCompare}
          />
        )}

        {activeTab === 'studio3d' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Atom className="w-5 h-5 text-indigo-600" />
                  Three.js 3D Molecular &amp; Kinase ATP Binding Pocket Studio
                </h2>
                <p className="text-xs text-slate-500">
                  Interactive WebGL studio rendering with physical PBR materials, procedural conformers, 
                  and real-time Gatekeeper (L1196M) &amp; Solvent-Front (G1202R) steric clash simulations.
                </p>
              </div>
              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono">
                PBR: RoomEnvironment PMREM
              </div>
            </div>

            <ThreeDmolViewer
              initialCompoundName={selected3DConformer}
              onCompoundChange={(name) => setSelected3DConformer(name)}
            />
          </div>
        )}

        {activeTab === 'prioritization' && (
          <PrioritizationDashboardView
            compounds={allCompounds}
            onSelectCompound={(c) => setSelectedCompound(c)}
            onOpen3DViewer={handleOpen3DStudio}
          />
        )}

        {activeTab === 'sar' && (
          <MacrocyclizationSARView
            compounds={allCompounds}
            onSelectCompound={(c) => setSelectedCompound(c)}
          />
        )}

        {activeTab === 'synthesis' && (
          <SynthesisPathwaysView />
        )}

        {activeTab === 'oncology' && (
          <ExpandedOncologyView
            onSelectCompound={(c) => setSelectedCompound(c)}
          />
        )}

        {activeTab === 'literature' && (
          <AcademicPatentMiningView />
        )}

        {activeTab === 'export' && (
          <DataExportCenterView
            compounds={allCompounds}
            onSelectCompound={(c) => setSelectedCompound(c)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ALK Kinase Macrocycle &amp; Acyclic ChemExplorer • Crizotinib (PF-02341066) &amp; Lorlatinib (PF-06463922) Medicinal Chemistry Research Platform
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Primary Sources: J. Med. Chem. (2011 &amp; 2014) • WO 2013/132376 • US 9,567,337 • PubChem • ChEMBL</span>
          </div>
        </div>
      </footer>

      {/* Deep Inspection Modal */}
      {selectedCompound && (
        <CompoundDetailModal
          compound={selectedCompound}
          onClose={() => setSelectedCompound(null)}
          onCompareWith={(cpd) => {
            setSelectedForCompare([
              selectedForCompare[0] || allCompounds[0],
              cpd
            ]);
            setSelectedCompound(null);
            setShowCompareModal(true);
          }}
        />
      )}

      {/* Pairwise Comparison Modal */}
      {showCompareModal && selectedForCompare.length >= 2 && (
        <PairwiseCompareModal
          compoundA={selectedForCompare[0]}
          compoundB={selectedForCompare[1]}
          allCompounds={allCompounds}
          onSelectA={(cA) => setSelectedForCompare([cA, selectedForCompare[1]])}
          onSelectB={(cB) => setSelectedForCompare([selectedForCompare[0], cB])}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
}

