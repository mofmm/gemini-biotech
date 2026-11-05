import React, { useState } from 'react';
import { 
  EXPANDED_RTK_AND_BROADER_COMPOUNDS, 
  BROAD_ONCOLOGY_APPLICATIONS, 
  BroadOncologyTherapy 
} from '../data/expandedCancerTherapyData';
import { CompoundRecord } from '../utils/dataPreparation';
import { 
  Dna, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Download, 
  BookOpen, 
  ShieldCheck, 
  Target, 
  Activity, 
  HelpCircle,
  FlaskConical,
  Flame,
  ArrowRight
} from 'lucide-react';
import { StructureCanvas } from './StructureCanvas';
import { downloadTextFile } from '../utils/dataPreparation';

interface ExpandedOncologyViewProps {
  onSelectCompound?: (compound: CompoundRecord) => void;
}

export const ExpandedOncologyView: React.FC<ExpandedOncologyViewProps> = ({
  onSelectCompound
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTherapy, setSelectedTherapy] = useState<BroadOncologyTherapy>(BROAD_ONCOLOGY_APPLICATIONS[0]);

  const categories = [
    'all',
    'ALK / RTK Cousins',
    'MCL-1 Apoptosis',
    'CDK Cell Cycle',
    'Tubulin Dynamics',
    'Macrocyclic PROTAC / Degrader'
  ];

  const filteredTherapies = activeCategory === 'all'
    ? BROAD_ONCOLOGY_APPLICATIONS
    : BROAD_ONCOLOGY_APPLICATIONS.filter((t) => t.targetCategory === activeCategory);

  const handleExportExpandedJSON = () => {
    const payload = {
      rtkCousins: EXPANDED_RTK_AND_BROADER_COMPOUNDS,
      broaderOncologyApplications: BROAD_ONCOLOGY_APPLICATIONS,
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    downloadTextFile(jsonStr, `Expanded_Oncology_Macrocycles_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Dna className="w-5 h-5 text-purple-400" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Broader Oncology Applications: Macrocyclic vs. Acyclic Therapeutics
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-semibold">
              Cross-Target Mechanistic Library
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Expands beyond Crizotinib and Lorlatinib across the oncology landscape. Explores how macrocyclization overcomes 
            conformational entropy, efflux pumps, and wide protein-protein interaction (PPI) grooves in <strong>MCL-1 apoptosis</strong>, 
            <strong>CDK transcription</strong>, <strong>tubulin polymerization</strong>, and <strong>ternary PROTAC degradation</strong>, 
            as well as sibling RTK inhibitors (Alectinib, Gilteritinib, Fedratinib).
          </p>
        </div>
      </div>

      {/* Part 1: Related Kinase Inhibitors (RTK Cousins) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Related Tyrosine Kinase Inhibitor Benchmarks (RTK Cousins)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing conformational scaffolds and resistance profiles in clinical ALK/FLT3/JAK kinase inhibitors.
            </p>
          </div>
          <button
            onClick={handleExportExpandedJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Expanded Oncology JSON
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPANDED_RTK_AND_BROADER_COMPOUNDS.map((compound) => (
            <div
              key={compound.id}
              className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-indigo-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{compound.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{compound.codeName}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {compound.clinicalPhase?.split('(')[0] || 'Approved'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-snug">
                  {compound.notes}
                </p>

                {/* Potency & CNS Metrics */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">ALK WT</span>
                    <span className="font-bold text-slate-900">{compound.alkWt_ic50} nM</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">G1202R</span>
                    <span className="font-bold text-rose-600">{compound.alkG1202r_ic50} nM</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">CNS MPO</span>
                    <span className="font-bold text-sky-600">{compound.cnsMpo}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">{compound.assignee}</span>
                {onSelectCompound && (
                  <button
                    onClick={() => onSelectCompound(compound)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View Details &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Broader Oncology Applications (Macrocyclic vs Acyclic) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Macrocycles in Diverse Oncologic Targets (Beyond Kinases)
          </h3>
          <p className="text-xs text-slate-500">
            How macrocyclic topology solves fundamental biophysical hurdles in apoptosis, transcription, tubulin, and targeted protein degradation.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Cancer Targets' : cat}
            </button>
          ))}
        </div>

        {/* Grid of Broad Oncology Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTherapies.map((item) => {
            const isSelected = selectedTherapy.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedTherapy(item)}
                className={`border rounded-2xl p-5 cursor-pointer transition-all space-y-3 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-400/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                          {item.targetCategory}
                        </span>
                        {item.ringSize && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {item.ringSize}-mer Ring
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{item.name}</h4>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 shrink-0 font-mono">
                      Target: {item.targetSymbol}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Indication &amp; Stage</span>
                    <p className="font-semibold text-slate-900">{item.cancerIndication}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.clinicalStage}</p>
                  </div>

                  {/* Mechanism Summary */}
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <p>{item.mechanismSummary}</p>
                  </div>

                  {/* Key Macrocycle Advantage */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Macrocyclic Advantage Over Acyclic Counterparts:</span>
                    </div>
                    <p className="text-purple-950 leading-relaxed text-[11px]">
                      {item.macrocycleAdvantageOverAcyclic}
                    </p>
                  </div>
                </div>

                {/* Footer Citations */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{item.keyCitation}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Patent: {item.patentReference}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
