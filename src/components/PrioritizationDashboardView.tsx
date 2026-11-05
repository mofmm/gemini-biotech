import React, { useState, useMemo } from 'react';
import { CompoundRecord } from '../utils/dataPreparation';
import { prioritizeCompounds, PrioritizedCompound } from '../utils/prioritizationEngine';
import { 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Brain, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Layers, 
  Search, 
  ExternalLink, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  Atom
} from 'lucide-react';
import { exportCompoundsToCSV, downloadTextFile } from '../utils/dataPreparation';

interface PrioritizationDashboardViewProps {
  compounds: CompoundRecord[];
  onSelectCompound: (compound: CompoundRecord) => void;
  onOpen3DViewer?: (compoundName: string) => void;
}

export const PrioritizationDashboardView: React.FC<PrioritizationDashboardViewProps> = ({
  compounds,
  onSelectCompound,
  onOpen3DViewer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedSeries, setSelectedSeries] = useState<'all' | 'macrocyclic' | 'acyclic'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'composite' | 'pei' | 'novelty' | 'wt' | 'g1202r' | 'cns'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Compute prioritized records
  const prioritizedList = useMemo(() => {
    return prioritizeCompounds(compounds);
  }, [compounds]);

  // Filtering and sorting
  const filteredAndSorted = useMemo(() => {
    let result = prioritizedList.filter((item) => {
      const c = item.compound;
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.codeName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.primaryPatent.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = selectedTier === 'all' || item.prioritizationTier.startsWith(selectedTier);
      const matchesSeries = selectedSeries === 'all' || c.series === selectedSeries;

      return matchesSearch && matchesTier && matchesSeries;
    });

    result.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      switch (sortBy) {
        case 'rank':
          valA = a.rank;
          valB = b.rank;
          break;
        case 'composite':
          valA = a.compositePriorityScore;
          valB = b.compositePriorityScore;
          break;
        case 'pei':
          valA = a.predictedEfficacyIndex;
          valB = b.predictedEfficacyIndex;
          break;
        case 'novelty':
          valA = a.structuralNoveltyScore;
          valB = b.structuralNoveltyScore;
          break;
        case 'wt':
          valA = a.compound.alkWt_ic50;
          valB = b.compound.alkWt_ic50;
          break;
        case 'g1202r':
          valA = a.compound.alkG1202r_ic50 ?? 9999;
          valB = b.compound.alkG1202r_ic50 ?? 9999;
          break;
        case 'cns':
          valA = a.compound.cnsMpo;
          valB = b.compound.cnsMpo;
          break;
      }

      if (sortBy === 'rank' || sortBy === 'wt' || sortBy === 'g1202r') {
        // Lower is better
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      } else {
        // Higher is better
        return sortDirection === 'asc' ? valB - valA : valA - valB;
      }
    });

    return result;
  }, [prioritizedList, searchTerm, selectedTier, selectedSeries, sortBy, sortDirection]);

  // Export Top Prioritized Leads to CSV
  const handleExportPrioritizedCSV = () => {
    const recordsToExport = filteredAndSorted.map((item) => item.compound);
    const csv = exportCompoundsToCSV(recordsToExport);
    downloadTextFile(csv, `ALK_Prioritized_Compounds_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const tierCounts = useMemo(() => {
    return {
      tier1: prioritizedList.filter((p) => p.prioritizationTier.includes('Tier 1')).length,
      tier2: prioritizedList.filter((p) => p.prioritizationTier.includes('Tier 2')).length,
      tier3: prioritizedList.filter((p) => p.prioritizationTier.includes('Tier 3')).length,
      tier4: prioritizedList.filter((p) => p.prioritizationTier.includes('Tier 4')).length,
    };
  }, [prioritizedList]);

  return (
    <div className="space-y-6">
      {/* Top Section: Overview & Scoring Formula Rationale */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-6 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Trophy className="w-5 h-5 text-amber-400" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Predicted Efficacy &amp; Structural Novelty Prioritization
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-semibold">
              Multi-Parameter Optimization (MPO)
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Prioritizes compounds from academic literature (J. Med. Chem. 2011/2014) and patents (WO 2013/132376, US 8,680,111) 
            by balancing <strong>Predicted Efficacy (PEI, 65%)</strong> against <strong>Structural Novelty (35%)</strong>.
            Emphasizes resilient binding against the devastating clinical solvent-front mutation <strong>G1202R</strong>, 
            gatekeeper <strong>L1196M</strong>, and optimal blood-brain barrier penetrance (<strong>CNS MPO &ge; 5.0</strong>).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>G1202R Potency</span>
              </div>
              <div className="text-base font-bold text-white mt-1">30 Pts Weight</div>
              <div className="text-[10px] text-slate-400">Primary resistance bypass</div>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-sky-400" />
                <span>CNS MPO Score</span>
              </div>
              <div className="text-base font-bold text-white mt-1">20 Pts Weight</div>
              <div className="text-[10px] text-slate-400">P-gp efflux avoidance</div>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>WT &amp; Gatekeeper</span>
              </div>
              <div className="text-base font-bold text-white mt-1">40 Pts Weight</div>
              <div className="text-[10px] text-slate-400">ALK WT (20) + L1196M (20)</div>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Novel Macrocycle</span>
              </div>
              <div className="text-base font-bold text-white mt-1">35 Pts Novelty</div>
              <div className="text-[10px] text-slate-400">Entropy pre-organization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedTier(selectedTier === 'Tier 1' ? 'all' : 'Tier 1')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedTier === 'Tier 1'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Tier 1: High Priority</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {tierCounts.tier1} Leads
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">Score &ge; 80</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Overcomes G1202R, CNS MPO &ge; 5.0, rigid macrocyclic scaffold (Lorlatinib, NVL-655).
          </p>
        </button>

        <button
          onClick={() => setSelectedTier(selectedTier === 'Tier 2' ? 'all' : 'Tier 2')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedTier === 'Tier 2'
              ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Tier 2: Potent Exemplars</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {tierCounts.tier2} Leads
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">Score 65 – 79</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Potent wild-type inhibition with selective mutant coverage or high CNS delivery (Repotrectinib, Cpd 9).
          </p>
        </button>

        <button
          onClick={() => setSelectedTier(selectedTier === 'Tier 3' ? 'all' : 'Tier 3')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedTier === 'Tier 3'
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Tier 3: Benchmarks</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {tierCounts.tier3} Leads
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">Score 45 – 64</div>
          <p className="text-[11px] text-slate-500 mt-1">
            1st &amp; 2nd-gen clinical benchmarks susceptible to solvent front clash (Crizotinib, Ceritinib, Alectinib).
          </p>
        </button>

        <button
          onClick={() => setSelectedTier(selectedTier === 'Tier 4' ? 'all' : 'Tier 4')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedTier === 'Tier 4'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tier 4: SAR Probes</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {tierCounts.tier4} Leads
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-2">Score &lt; 45</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Open-chain synthetic precursors, enantiomers, and inactive ring size probes (Cpd 3, 11S, 13-mer).
          </p>
        </button>
      </div>

      {/* Control Bar: Filters, Search, Sorting, and Export */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, patents, formulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Series Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedSeries('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedSeries === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              All Series
            </button>
            <button
              onClick={() => setSelectedSeries('macrocyclic')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedSeries === 'macrocyclic' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Macrocyclic
            </button>
            <button
              onClick={() => setSelectedSeries('acyclic')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedSeries === 'acyclic' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Acyclic
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="rank">Composite Rank</option>
              <option value="composite">Composite Score</option>
              <option value="pei">Predicted Efficacy (PEI)</option>
              <option value="novelty">Structural Novelty</option>
              <option value="g1202r">G1202R Potency</option>
              <option value="wt">ALK WT Potency</option>
              <option value="cns">CNS MPO Score</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportPrioritizedCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Leads CSV ({filteredAndSorted.length})
          </button>
        </div>
      </div>

      {/* Prioritized Compounds Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Compound &amp; Scaffold</th>
                <th className="py-3 px-3 text-center">Prioritization Tier</th>
                <th className="py-3 px-3 text-center">Composite Score</th>
                <th className="py-3 px-3 text-center">PEI (Efficacy)</th>
                <th className="py-3 px-3 text-center">Novelty</th>
                <th className="py-3 px-3 text-center">ALK WT (nM)</th>
                <th className="py-3 px-3 text-center">G1202R (nM)</th>
                <th className="py-3 px-3 text-center">CNS MPO</th>
                <th className="py-3 px-4">Key Prioritization Rationale</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAndSorted.map((item) => {
                const c = item.compound;
                const isTier1 = item.prioritizationTier.includes('Tier 1');
                const isTier2 = item.prioritizationTier.includes('Tier 2');
                const isTier3 = item.prioritizationTier.includes('Tier 3');

                return (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isTier1 ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        item.rank === 1 
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : item.rank <= 3
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.rank}
                      </span>
                    </td>

                    {/* Name & Series */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectCompound(c)}
                            className="font-bold text-slate-900 hover:text-indigo-600 text-left transition-colors"
                          >
                            {c.name}
                          </button>
                          {c.series === 'macrocyclic' && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200">
                              {c.macrocyclicRingSize ? `${c.macrocyclicRingSize}-mer` : 'Macro'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.codeName} • {c.formula}
                        </span>
                      </div>
                    </td>

                    {/* Tier Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isTier1 
                          ? 'bg-amber-100 text-amber-800 border-amber-300' 
                          : isTier2
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : isTier3
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.prioritizationTier.split(':')[0]}
                      </span>
                    </td>

                    {/* Composite Score */}
                    <td className="py-3 px-3 text-center font-bold">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-sm ${
                          item.compositePriorityScore >= 80 ? 'text-amber-600 font-extrabold' : 'text-slate-900'
                        }`}>
                          {item.compositePriorityScore}
                        </span>
                        <span className="text-[10px] text-slate-400">/100</span>
                      </div>
                    </td>

                    {/* PEI */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-block w-12 bg-slate-100 rounded-full h-2 overflow-hidden mr-1">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${item.predictedEfficacyIndex}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {item.predictedEfficacyIndex}
                      </span>
                    </td>

                    {/* Novelty */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-block w-12 bg-slate-100 rounded-full h-2 overflow-hidden mr-1">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${item.structuralNoveltyScore}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {item.structuralNoveltyScore}
                      </span>
                    </td>

                    {/* ALK WT */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`font-semibold ${c.alkWt_ic50 <= 1.0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {c.alkWt_ic50}
                      </span>
                    </td>

                    {/* ALK G1202R */}
                    <td className="py-3 px-3 text-center font-mono">
                      {c.alkG1202r_ic50 !== undefined ? (
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          c.alkG1202r_ic50 <= 50.0 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : c.alkG1202r_ic50 <= 200.0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {c.alkG1202r_ic50}
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    {/* CNS MPO */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`font-semibold ${
                        c.cnsMpo >= 5.0 
                          ? 'text-sky-700 font-bold' 
                          : c.cnsMpo >= 4.0 
                          ? 'text-slate-700' 
                          : 'text-amber-700'
                      }`}>
                        {c.cnsMpo.toFixed(1)}
                      </span>
                    </td>

                    {/* Rationale */}
                    <td className="py-3 px-4 max-w-xs text-slate-500 leading-tight text-[11px]">
                      {item.rationale}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectCompound(c)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[10px] transition-colors"
                          title="View detailed properties & radar"
                        >
                          Details
                        </button>
                        {onOpen3DViewer && (
                          <button
                            onClick={() => onOpen3DViewer(c.name)}
                            className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-[10px] transition-colors flex items-center gap-1"
                            title="Inspect in 3D WebGL Studio"
                          >
                            <Atom className="w-3 h-3" />
                            3D
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
