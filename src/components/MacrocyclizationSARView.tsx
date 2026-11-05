import React, { useState } from 'react';
import { CompoundRecord, computeSARComparison } from '../utils/dataPreparation';
import { ShieldCheck, Activity, Dna, Brain, ArrowRight, Layers, Flame, CheckCircle2 } from 'lucide-react';

interface MacrocyclizationSARViewProps {
  compounds: CompoundRecord[];
  onSelectCompound: (compound: CompoundRecord) => void;
}

export const MacrocyclizationSARView: React.FC<MacrocyclizationSARViewProps> = ({
  compounds,
  onSelectCompound
}) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'pairs' | 'heatmap' | 'scatter'>('principles');

  // Key reference compounds
  const crizotinib = compounds.find((c) => c.id === 'PF-02341066')!;
  const lorlatinib = compounds.find((c) => c.id === 'PF-06463922')!;
  const acyclicPrecursor = compounds.find((c) => c.id === 'PF-ACYCLIC-CPD3')!;
  const sEnantiomer = compounds.find((c) => c.id === 'PF-06463923')!;
  const macro13mer = compounds.find((c) => c.id === 'PF-MACRO-CPD9B')!;

  const pairCrizLor = crizotinib && lorlatinib ? computeSARComparison(crizotinib, lorlatinib) : null;
  const pairPrecLor = acyclicPrecursor && lorlatinib ? computeSARComparison(acyclicPrecursor, lorlatinib) : null;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full">
                Medicinal Chemistry SAR Hub
              </span>
              <span className="text-xs text-slate-400 font-mono">Pfizer ALK Kinase Evolution</span>
            </div>
            <h2 className="text-2xl font-bold mt-2">The Acyclic-to-Macrocyclic Paradigm Shift</h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Comparative analysis of how conformational pre-organization transformed flexible acyclic ALK inhibitors (Crizotinib) into compact, brain-penetrant macrocycles (Lorlatinib) capable of conquering refractory solvent-front G1202R mutations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setActiveTab('principles')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'principles' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Core Principles
            </button>
            <button
              onClick={() => setActiveTab('pairs')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'pairs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Direct SAR Pairs
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'heatmap' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mutant Heatmap
            </button>
            <button
              onClick={() => setActiveTab('scatter')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'scatter' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              ADMET Scatter
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Core Principles */}
      {activeTab === 'principles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Principle 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Conformational Pre-Organization</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Acyclic inhibitors like Crizotinib possess <strong>5–8 rotatable bonds</strong>, suffering a substantial thermodynamic entropy penalty (<code className="font-mono text-slate-800">-TΔS</code>) upon freezing into the kinase binding pocket. By cyclizing the flexible linker into a <strong>12-membered macrocycle</strong>, Lorlatinib pre-locks into the bioactive conformation, boosting ALK affinity by over <strong>50-fold</strong>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>RotB: 7 (Acyclic) → 1 (Macrocycle)</span>
                <span className="text-emerald-700 font-bold">ΔS Penalty Minimal</span>
              </div>
            </div>

            {/* Principle 2 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
                  <Dna className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Overcoming G1202R Solvent-Front Mutation</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  The clinical solvent-front mutation <strong>G1202R</strong> replaces Gly1202 with a bulky, positively charged Arginine side chain at the entrance of the ATP pocket. Crizotinib’s extended piperidine sterically clashes, resulting in resistance (&gt;1,000 nM). The compact macrocyclic core tucks neatly beneath Arg1202 without collision (Lorlatinib IC50 = 40 nM).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>G1202R IC50: &gt;1000 nM → 40 nM</span>
                <span className="text-emerald-700 font-bold">&gt;25x Potency Gain</span>
              </div>
            </div>

            {/* Principle 3 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-3">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Overwhelming Brain &amp; CNS Penetrance</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Crizotinib is a recognized substrate for P-glycoprotein (P-gp/MDR1) efflux, leading to frequent intracranial relapse. Lorlatinib was optimized using the <strong>CNS Multiparameter Optimization (CNS MPO)</strong> score (achieving <strong>5.3 / 6.0</strong>), ensuring low efflux liability, high passive permeability, and profound intracranial response rates.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>CNS MPO: 3.2 (Poor) → 5.3 (High)</span>
                <span className="text-indigo-700 font-bold">Low P-gp Efflux</span>
              </div>
            </div>
          </div>

          {/* Detailed Macrocycle vs Acyclic Comparison Showcase */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Direct Structural &amp; Biophysical Audit: Crizotinib vs. Lorlatinib
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crizotinib Card */}
              <div 
                onClick={() => crizotinib && onSelectCompound(crizotinib)}
                className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      1st Gen Acyclic Prototype
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">Crizotinib (PF-02341066)</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-500">FDA 2011</span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span className="text-slate-500">Architecture:</span>
                    <span className="font-medium text-slate-800">Acyclic 2-aminopyridine-piperidine</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span className="text-slate-500">Rotatable Bonds:</span>
                    <span className="font-mono font-bold text-slate-800">5 bonds (flexible)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span className="text-slate-500">ALK WT IC50:</span>
                    <span className="font-mono font-bold text-slate-800">3.0 nM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span className="text-slate-500">ALK G1202R (Solvent Front):</span>
                    <span className="font-mono font-bold text-rose-600">&gt;1,000 nM (Resistant)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span className="text-slate-500">CNS MPO Score:</span>
                    <span className="font-mono font-bold text-amber-700">3.2 / 6.0 (Suboptimal)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">P-gp Efflux Liability:</span>
                    <span className="font-bold text-rose-600">High Efflux (Brain relapse common)</span>
                  </div>
                </div>
              </div>

              {/* Lorlatinib Card */}
              <div 
                onClick={() => lorlatinib && onSelectCompound(lorlatinib)}
                className="p-5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      3rd Gen Macrocyclic Standard
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">Lorlatinib (PF-06463922)</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-500">FDA 2018</span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Architecture:</span>
                    <span className="font-medium text-slate-800">12-membered ether-amide macrocycle</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">Rotatable Bonds:</span>
                    <span className="font-mono font-bold text-emerald-700">1 bond (pre-organized)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">ALK WT IC50:</span>
                    <span className="font-mono font-bold text-emerald-700">0.6 nM (5x higher potency)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">ALK G1202R (Solvent Front):</span>
                    <span className="font-mono font-bold text-emerald-700">40 nM (Active / Overcomes!)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-purple-100">
                    <span className="text-slate-500">CNS MPO Score:</span>
                    <span className="font-mono font-bold text-emerald-700">5.3 / 6.0 (Superior)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">P-gp Efflux Liability:</span>
                    <span className="font-bold text-emerald-700">Low Efflux (Substantial intracranial ORR)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Direct SAR Pairs */}
      {activeTab === 'pairs' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Direct Medicinal Chemistry SAR Transitions</h3>
            <p className="text-xs text-slate-500 mb-4">
              Quantitative impact of chemical modifications across the Pfizer macrocycle development program.
            </p>

            {/* Pair 1: Linear Precursor 3 -> Lorlatinib */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span className="font-bold text-slate-900 text-sm">Macrolactamization Ring Closure</span>
                  <span className="text-xs text-slate-500">(Open Amide Cpd 3 → Macrocycle Lorlatinib)</span>
                </div>
                <div className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  +63x ALK WT • +60x G1202R Potency
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">Rotatable Bonds</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5">7 → 1 (-6 bonds)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Entropic freeze</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">ALK WT IC50</div>
                  <div className="text-sm font-bold font-mono text-emerald-700 mt-0.5">38.0 nM → 0.6 nM</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">63-fold enhancement</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">ALK G1202R IC50</div>
                  <div className="text-sm font-bold font-mono text-emerald-700 mt-0.5">2,400 nM → 40 nM</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">60-fold enhancement</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[10px]">CNS MPO Score</div>
                  <div className="text-sm font-bold font-mono text-indigo-700 mt-0.5">3.6 → 5.3 (+1.7)</div>
                  <div className="text-[10px] text-indigo-600 mt-0.5">Crosses blood-brain barrier</div>
                </div>
              </div>
            </div>

            {/* Pair 2: Stereocenter Inversion: (10R) vs (10S) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span className="font-bold text-slate-900 text-sm">Stereochemical Eudismic Preference</span>
                  <span className="text-xs text-slate-500">(10R)-Lorlatinib vs. (10S)-Enantiomer PF-06463923</span>
                </div>
                <div className="text-xs font-mono text-rose-700 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  123-fold Eudismic Ratio
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed">
                The (10R)-methyl group packs cleanly into a lipophilic pocket formed by Leu1198 and Met1199. When inverted to the <strong>(10S)-configuration</strong>, severe steric clash with the kinase hinge region drops ALK WT affinity from <strong>0.6 nM down to 74.0 nM</strong> (123-fold loss) and G1202R affinity from <strong>40 nM to 3,800 nM</strong>.
              </div>
            </div>

            {/* Pair 3: Ring Size Optimization: 12-mer vs 13-mer */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <span className="font-bold text-slate-900 text-sm">Ring Size Strictness</span>
                  <span className="text-xs text-slate-500">(12-membered Ring Lorlatinib vs 13-membered Homolog Cpd 9b)</span>
                </div>
                <div className="text-xs font-mono text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  8-fold Loss on 1-Carbon Expansion
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed">
                Expanding the macrocyclic ring by a single carbon (from 12 to 13 members) adds conformational wiggle room that compromises optimal hinge geometry. ALK WT IC50 softens from <strong>0.6 nM to 4.8 nM</strong>, and G1202R potency deteriorates from <strong>40 nM to 320 nM</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Kinase Resistance Profile Heatmap */}
      {activeTab === 'heatmap' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Kinase &amp; Resistance Mutation Potency Matrix</h3>
              <p className="text-xs text-slate-500">Color-coded IC50 values (nM) across the series.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> &lt;10 nM (Highly Potent)
              </span>
              <span className="flex items-center gap-1 font-medium text-amber-800">
                <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> 10–100 nM (Moderate)
              </span>
              <span className="flex items-center gap-1 font-medium text-rose-800">
                <span className="w-2.5 h-2.5 rounded bg-rose-400"></span> &gt;100 nM (Resistant)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Compound</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3 text-center">ALK WT (nM)</th>
                  <th className="py-2.5 px-3 text-center">L1196M (Gatekeeper)</th>
                  <th className="py-2.5 px-3 text-center">G1202R (Solvent Front)</th>
                  <th className="py-2.5 px-3 text-center">ROS1 WT</th>
                  <th className="py-2.5 px-3 text-center">c-MET</th>
                  <th className="py-2.5 px-3 text-center">CNS MPO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {compounds.map((c) => {
                  const getPotencyColor = (val?: number) => {
                    if (val === undefined) return 'bg-slate-50 text-slate-400';
                    if (val <= 10) return 'bg-emerald-100 text-emerald-900 font-bold';
                    if (val <= 100) return 'bg-amber-100 text-amber-900 font-medium';
                    return 'bg-rose-100 text-rose-900';
                  };

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCompound(c)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">
                        {c.name}
                      </td>
                      <td className="py-2 px-3 font-sans text-[11px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          c.series === 'macrocyclic' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {c.macrocyclicRingSize ? `${c.macrocyclicRingSize}M Macro` : 'Acyclic'}
                        </span>
                      </td>
                      <td className={`py-2 px-3 text-center ${getPotencyColor(c.alkWt_ic50)}`}>
                        {c.alkWt_ic50}
                      </td>
                      <td className={`py-2 px-3 text-center ${getPotencyColor(c.alkL1196m_ic50)}`}>
                        {c.alkL1196m_ic50 ?? '—'}
                      </td>
                      <td className={`py-2 px-3 text-center ${getPotencyColor(c.alkG1202r_ic50)}`}>
                        {c.alkG1202r_ic50 ?? '—'}
                      </td>
                      <td className={`py-2 px-3 text-center ${getPotencyColor(c.ros1Wt_ic50)}`}>
                        {c.ros1Wt_ic50 ?? '—'}
                      </td>
                      <td className={`py-2 px-3 text-center ${getPotencyColor(c.cMet_ic50)}`}>
                        {c.cMet_ic50 ?? '—'}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">
                        {c.cnsMpo.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ADMET Scatter / Correlation */}
      {activeTab === 'scatter' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Rotatable Bonds vs. Brain Permeability (CNS MPO)</h3>
            <p className="text-xs text-slate-500">
              Macrocyclic rigidification drastically reduces rotatable bonds and eliminates floppy conformations that drive P-glycoprotein efflux liability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Macrocyclic Series (Rigid Scaffold)</h4>
              <div className="space-y-2">
                {compounds.filter((c) => c.series === 'macrocyclic').map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectCompound(c)}
                    className="p-2.5 bg-white rounded-lg border border-purple-200 hover:border-purple-400 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-[10px] text-purple-700 ml-1.5 font-medium">({c.macrocyclicRingSize}-mer)</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-500">RotB: <strong className="text-slate-800">{c.rotatableBonds}</strong></span>
                      <span className="text-indigo-700 font-bold">MPO: {c.cnsMpo.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Acyclic Series (Flexible Scaffold)</h4>
              <div className="space-y-2">
                {compounds.filter((c) => c.series === 'acyclic').map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectCompound(c)}
                    className="p-2.5 bg-white rounded-lg border border-blue-200 hover:border-blue-400 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5">({c.subseries})</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-500">RotB: <strong className="text-slate-800">{c.rotatableBonds}</strong></span>
                      <span className="text-amber-700 font-bold">MPO: {c.cnsMpo.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
