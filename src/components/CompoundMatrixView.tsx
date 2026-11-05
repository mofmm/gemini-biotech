import React, { useState, useMemo } from 'react';
import { CompoundRecord } from '../utils/dataPreparation';
import { StructureCanvas } from './StructureCanvas';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, Sparkles, Brain, CheckSquare, Square, Eye } from 'lucide-react';

interface CompoundMatrixViewProps {
  compounds: CompoundRecord[];
  onSelectCompound: (compound: CompoundRecord) => void;
  selectedForCompare: CompoundRecord[];
  onToggleCompare: (compound: CompoundRecord) => void;
}

export const CompoundMatrixView: React.FC<CompoundMatrixViewProps> = ({
  compounds,
  onSelectCompound,
  selectedForCompare,
  onToggleCompare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState<'all' | 'macrocyclic' | 'acyclic' | 'intermediate'>('all');
  const [g1202rOnly, setG1202rOnly] = useState(false);
  const [cnsMpoOnly, setCnsMpoOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'alkWt' | 'alkG1202r' | 'cnsMpo' | 'rotBonds' | 'mw'>('alkWt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredCompounds = useMemo(() => {
    return compounds
      .filter((c) => {
        // Series filter
        if (seriesFilter !== 'all' && c.series !== seriesFilter) return false;
        // G1202R solver filter (IC50 <= 100 nM)
        if (g1202rOnly && (c.alkG1202r_ic50 === undefined || c.alkG1202r_ic50 > 100)) return false;
        // CNS MPO >= 4.5
        if (cnsMpoOnly && c.cnsMpo < 4.5) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            c.name.toLowerCase().includes(q) ||
            (c.codeName && c.codeName.toLowerCase().includes(q)) ||
            c.formula.toLowerCase().includes(q) ||
            c.smiles.toLowerCase().includes(q) ||
            c.subseries.toLowerCase().includes(q) ||
            c.primaryPatent.toLowerCase().includes(q) ||
            c.assignee.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA: number | string = 0;
        let valB: number | string = 0;

        switch (sortBy) {
          case 'name':
            valA = a.name;
            valB = b.name;
            break;
          case 'alkWt':
            valA = a.alkWt_ic50;
            valB = b.alkWt_ic50;
            break;
          case 'alkG1202r':
            valA = a.alkG1202r_ic50 ?? 99999;
            valB = b.alkG1202r_ic50 ?? 99999;
            break;
          case 'cnsMpo':
            valA = a.cnsMpo;
            valB = b.cnsMpo;
            break;
          case 'rotBonds':
            valA = a.rotatableBonds;
            valB = b.rotatableBonds;
            break;
          case 'mw':
            valA = a.mw;
            valB = b.mw;
            break;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [compounds, seriesFilter, g1202rOnly, cnsMpoOnly, searchQuery, sortBy, sortOrder]);

  const isSelectedForCompare = (id: string) => selectedForCompare.some((c) => c.id === id);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by compound name, SMILES, formula, code name, patent, or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick preset filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setSeriesFilter('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  seriesFilter === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({compounds.length})
              </button>
              <button
                onClick={() => setSeriesFilter('macrocyclic')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  seriesFilter === 'macrocyclic' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Macrocycles ({compounds.filter((c) => c.series === 'macrocyclic').length})
              </button>
              <button
                onClick={() => setSeriesFilter('acyclic')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  seriesFilter === 'acyclic' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Acyclic ({compounds.filter((c) => c.series === 'acyclic').length})
              </button>
            </div>

            {/* View switcher */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md ${viewMode === 'cards' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                title="Grid Card View"
                aria-label="Grid card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                title="Dense Data Table View"
                aria-label="Dense table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Second row: Specialized Toggles & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            <button
              onClick={() => setG1202rOnly(!g1202rOnly)}
              className={`px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                g1202rOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              G1202R Active (≤100 nM)
            </button>

            <button
              onClick={() => setCnsMpoOnly(!cnsMpoOnly)}
              className={`px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                cnsMpoOnly
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Brain className="w-3 h-3 text-indigo-600" />
              High CNS Permeability (MPO ≥ 4.5)
            </button>

            {(searchQuery || seriesFilter !== 'all' || g1202rOnly || cnsMpoOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSeriesFilter('all');
                  setG1202rOnly(false);
                  setCnsMpoOnly(false);
                }}
                className="text-slate-500 hover:text-slate-800 underline ml-1"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
            >
              <option value="alkWt">ALK WT Potency (lowest first)</option>
              <option value="alkG1202r">ALK G1202R Potency</option>
              <option value="cnsMpo">CNS MPO Score (highest first)</option>
              <option value="rotBonds">Rotatable Bonds (rigidity)</option>
              <option value="mw">Molecular Weight</option>
              <option value="name">Compound Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              title="Toggle sort direction"
            >
              {sortOrder === 'asc' ? 'Asc ↑' : 'Desc ↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Compare Tray Notification if selected */}
      {selectedForCompare.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Selected for Pairwise Comparison ({selectedForCompare.length}/2):</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedForCompare.map((c) => (
                <span key={c.id} className="bg-white border border-indigo-200 px-2 py-0.5 rounded font-mono font-medium">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
          <span className="text-indigo-600">
            {selectedForCompare.length === 2 ? 'Head to Pairwise Compare tab to see full comparison' : 'Select 1 more compound to compare'}
          </span>
        </div>
      )}

      {/* Main Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-800">{filteredCompounds.length}</strong> compounds matching criteria</span>
        <span>Click any compound card to inspect chemical structure &amp; data tags</span>
      </div>

      {/* Card Grid View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompounds.map((c) => {
            const isComparing = isSelectedForCompare(c.id);
            return (
              <div
                key={c.id}
                onClick={() => onSelectCompound(c)}
                className="group bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-3.5 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {c.name}
                        </h4>
                        {c.macrocyclicRingSize && (
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-medium px-1.5 py-0.2 rounded-full">
                            {c.macrocyclicRingSize}-mer
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {c.codeName || c.formula} • {c.assignee}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(c);
                      }}
                      className={`p-1 rounded text-xs transition-colors flex items-center gap-1 ${
                        isComparing ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title={isComparing ? 'Remove from comparison' : 'Add to compare'}
                      aria-label={`Toggle comparison for ${c.name}`}
                    >
                      {isComparing ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}
                      <span className="text-[10px]">Compare</span>
                    </button>
                  </div>
                </div>

                {/* 2D Structure Canvas Preview */}
                <div className="px-3.5 py-1">
                  <StructureCanvas
                    smiles={c.smiles}
                    name={c.name}
                    pubchemCid={c.pubchemCid}
                    width={260}
                    height={160}
                    showControls={false}
                    className="border-slate-100 group-hover:border-slate-200"
                  />
                </div>

                {/* Potency & Key Metrics Grid */}
                <div className="p-3.5 pt-2 space-y-2.5">
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">ALK WT</div>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                        {c.alkWt_ic50} <span className="text-[9px] font-normal text-slate-500">nM</span>
                      </div>
                    </div>

                    <div className={`p-1.5 rounded border ${
                      (c.alkG1202r_ic50 ?? 9999) <= 60
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="text-[10px] text-slate-500 font-medium">G1202R</div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {c.alkG1202r_ic50 !== undefined ? `${c.alkG1202r_ic50} nM` : 'N/A'}
                      </div>
                    </div>

                    <div className={`p-1.5 rounded border ${
                      c.cnsMpo >= 4.5
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="text-[10px] text-slate-500 font-medium">CNS MPO</div>
                      <div className="text-xs font-mono font-bold mt-0.5">
                        {c.cnsMpo.toFixed(1)} <span className="text-[9px] font-normal text-slate-400">/6</span>
                      </div>
                    </div>
                  </div>

                  {/* Physicochemical badges */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-mono">MW {c.mw.toFixed(1)}</span>
                    <span className="font-mono">RotB: {c.rotatableBonds}</span>
                    <span className="font-mono">TPSA {c.tpsa.toFixed(0)}Å²</span>
                    <span className="text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> Inspect
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Data Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Compare</th>
                <th className="py-2.5 px-3">Compound</th>
                <th className="py-2.5 px-3">Series / Ring</th>
                <th className="py-2.5 px-3">ALK WT (nM)</th>
                <th className="py-2.5 px-3">L1196M (nM)</th>
                <th className="py-2.5 px-3">G1202R (nM)</th>
                <th className="py-2.5 px-3">ROS1 WT</th>
                <th className="py-2.5 px-3">CNS MPO</th>
                <th className="py-2.5 px-3">RotB</th>
                <th className="py-2.5 px-3">MW</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredCompounds.map((c) => {
                const isComparing = isSelectedForCompare(c.id);
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCompound(c)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleCompare(c)}
                        className="text-slate-400 hover:text-indigo-600"
                        aria-label={`Toggle compare for ${c.name}`}
                      >
                        {isComparing ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{c.codeName || c.formula}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        c.series === 'macrocyclic'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.macrocyclicRingSize ? `${c.macrocyclicRingSize}-mer Macrocycle` : 'Acyclic'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {c.alkWt_ic50}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {c.alkL1196m_ic50 !== undefined ? c.alkL1196m_ic50 : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${
                        (c.alkG1202r_ic50 ?? 9999) <= 60
                          ? 'bg-emerald-100 text-emerald-800'
                          : (c.alkG1202r_ic50 ?? 9999) <= 250
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-slate-500'
                      }`}>
                        {c.alkG1202r_ic50 !== undefined ? `${c.alkG1202r_ic50}` : '—'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {c.ros1Wt_ic50 !== undefined ? c.ros1Wt_ic50 : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className={`font-bold ${c.cnsMpo >= 4.5 ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {c.cnsMpo.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{c.rotatableBonds}</td>
                    <td className="py-2.5 px-3 font-mono">{c.mw.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 truncate max-w-[120px]">
                      {c.clinicalPhase}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCompound(c);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
