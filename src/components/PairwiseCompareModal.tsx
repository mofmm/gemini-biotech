import React from 'react';
import { CompoundRecord, computeSARComparison } from '../utils/dataPreparation';
import { StructureCanvas } from './StructureCanvas';
import { X, ArrowRight, ShieldCheck, AlertTriangle, Sparkles, Scale } from 'lucide-react';

interface PairwiseCompareModalProps {
  compoundA: CompoundRecord;
  compoundB: CompoundRecord;
  allCompounds: CompoundRecord[];
  onSelectA: (compound: CompoundRecord) => void;
  onSelectB: (compound: CompoundRecord) => void;
  onClose: () => void;
}

export const PairwiseCompareModal: React.FC<PairwiseCompareModalProps> = ({
  compoundA,
  compoundB,
  allCompounds,
  onSelectA,
  onSelectB,
  onClose
}) => {
  const sar = computeSARComparison(compoundA, compoundB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pairwise SAR Structure &amp; Potency Comparison</h2>
              <p className="text-xs text-slate-500">Side-by-side analysis of chemical structure, conformational flexibility, and mutant coverage</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compound Selector Dropdowns */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-semibold text-slate-700 shrink-0">Molecule 1:</span>
            <select
              value={compoundA.id}
              onChange={(e) => {
                const found = allCompounds.find((c) => c.id === e.target.value);
                if (found) onSelectA(found);
              }}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none w-full sm:w-64"
            >
              {allCompounds.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.series})
                </option>
              ))}
            </select>
          </div>

          <div className="text-slate-400 font-bold hidden sm:block">VS</div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-semibold text-slate-700 shrink-0">Molecule 2:</span>
            <select
              value={compoundB.id}
              onChange={(e) => {
                const found = allCompounds.find((c) => c.id === e.target.value);
                if (found) onSelectB(found);
              }}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-none w-full sm:w-64"
            >
              {allCompounds.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.series})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Side by side 2D structures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Molecule A */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    compoundA.series === 'macrocyclic' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {compoundA.series.toUpperCase()} {compoundA.macrocyclicRingSize ? `(${compoundA.macrocyclicRingSize}-mer)` : ''}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{compoundA.name}</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">{compoundA.formula}</span>
              </div>

              <StructureCanvas
                smiles={compoundA.smiles}
                name={compoundA.name}
                pubchemCid={compoundA.pubchemCid}
                width={300}
                height={190}
                showControls={false}
              />
            </div>

            {/* Molecule B */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    compoundB.series === 'macrocyclic' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {compoundB.series.toUpperCase()} {compoundB.macrocyclicRingSize ? `(${compoundB.macrocyclicRingSize}-mer)` : ''}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{compoundB.name}</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">{compoundB.formula}</span>
              </div>

              <StructureCanvas
                smiles={compoundB.smiles}
                name={compoundB.name}
                pubchemCid={compoundB.pubchemCid}
                width={300}
                height={190}
                showControls={false}
              />
            </div>
          </div>

          {/* Computed Delta Summary Strip */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Calculated SAR Deltas (Molecule 2 relative to Molecule 1)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-slate-500 text-[10px]">Rotatable Bonds Delta</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {sar.deltaRotBonds > 0 ? `+${sar.deltaRotBonds}` : sar.deltaRotBonds}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Rigidity change</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-slate-500 text-[10px]">CNS MPO Delta</div>
                <div className="text-base font-bold font-mono text-indigo-700 mt-0.5">
                  {sar.deltaCnsMpo > 0 ? `+${sar.deltaCnsMpo}` : sar.deltaCnsMpo}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Brain penetrance shift</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-slate-500 text-[10px]">ALK WT Potency Ratio</div>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                  {sar.wtEnhancement ? `${sar.wtEnhancement}x` : '—'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Fold potency gain</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-slate-500 text-[10px]">G1202R Potency Ratio</div>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                  {sar.g1202rEnhancement ? `${sar.g1202rEnhancement}x` : '—'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Solvent-front gain</div>
              </div>
            </div>
          </div>

          {/* Deep Metric Comparison Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Metric / Property</th>
                  <th className="py-2.5 px-4">{compoundA.name}</th>
                  <th className="py-2.5 px-4">{compoundB.name}</th>
                  <th className="py-2.5 px-4">Significance in SAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">Structural Class</td>
                  <td className="py-2.5 px-4 font-mono text-slate-800">{compoundA.series}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-800">{compoundB.series}</td>
                  <td className="py-2.5 px-4 text-slate-500">Macrocycle vs Acyclic</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">Rotatable Bonds</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{compoundA.rotatableBonds}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{compoundB.rotatableBonds}</td>
                  <td className="py-2.5 px-4 text-slate-500">Conformational entropy penalty</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">Molecular Weight</td>
                  <td className="py-2.5 px-4 font-mono">{compoundA.mw.toFixed(2)} g/mol</td>
                  <td className="py-2.5 px-4 font-mono">{compoundB.mw.toFixed(2)} g/mol</td>
                  <td className="py-2.5 px-4 text-slate-500">Lipinski criterion (≤ 500)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">XLogP</td>
                  <td className="py-2.5 px-4 font-mono">{compoundA.xlogp.toFixed(2)}</td>
                  <td className="py-2.5 px-4 font-mono">{compoundB.xlogp.toFixed(2)}</td>
                  <td className="py-2.5 px-4 text-slate-500">Lipophilicity balance</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">TPSA (Å²)</td>
                  <td className="py-2.5 px-4 font-mono">{compoundA.tpsa.toFixed(1)} Å²</td>
                  <td className="py-2.5 px-4 font-mono">{compoundB.tpsa.toFixed(1)} Å²</td>
                  <td className="py-2.5 px-4 text-slate-500">Membrane permeation (≤ 90 for CNS)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">ALK WT IC50</td>
                  <td className="py-2.5 px-4 font-mono font-bold">{compoundA.alkWt_ic50} nM</td>
                  <td className="py-2.5 px-4 font-mono font-bold">{compoundB.alkWt_ic50} nM</td>
                  <td className="py-2.5 px-4 text-slate-500">Target potency on unmutated kinase</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">ALK G1202R IC50</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-rose-600">
                    {compoundA.alkG1202r_ic50 !== undefined ? `${compoundA.alkG1202r_ic50} nM` : 'N/A'}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                    {compoundB.alkG1202r_ic50 !== undefined ? `${compoundB.alkG1202r_ic50} nM` : 'N/A'}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">Key solvent-front clinical resistance mutation</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">CNS MPO Score</td>
                  <td className="py-2.5 px-4 font-mono font-bold">{compoundA.cnsMpo.toFixed(1)} / 6.0</td>
                  <td className="py-2.5 px-4 font-mono font-bold">{compoundB.cnsMpo.toFixed(1)} / 6.0</td>
                  <td className="py-2.5 px-4 text-slate-500">Blood-brain barrier alignment</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-700">P-gp Efflux Substrate</td>
                  <td className="py-2.5 px-4 font-bold">{compoundA.pGpSubstrate}</td>
                  <td className="py-2.5 px-4 font-bold">{compoundB.pGpSubstrate}</td>
                  <td className="py-2.5 px-4 text-slate-500">Active efflux out of brain capillary cells</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-medium transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
