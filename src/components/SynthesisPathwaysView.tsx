import React, { useState } from 'react';
import { SYNTHESIS_ROUTES, SyntheticRoute, SyntheticStep } from '../data/synthesisData';
import { 
  FlaskConical, 
  GitBranch, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  BarChart3, 
  Download, 
  BookOpen, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { downloadTextFile } from '../utils/dataPreparation';

export const SynthesisPathwaysView: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(SYNTHESIS_ROUTES[1].id); // Default to Lorlatinib Macrolactamization
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);

  const selectedRoute = SYNTHESIS_ROUTES.find((r) => r.id === selectedRouteId) || SYNTHESIS_ROUTES[0];

  const handleExportSynthesisJSON = () => {
    const jsonStr = JSON.stringify(SYNTHESIS_ROUTES, null, 2);
    downloadTextFile(jsonStr, `ALK_Macrocycle_Synthesis_Pathways_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <FlaskConical className="w-5 h-5 text-indigo-400" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Chemical Synthesis Pathways &amp; Retrosynthetic Disconnections
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-semibold">
              Process Chemistry &amp; Macrolactamization
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Exhaustive synthesis schemes compiled from academic literature (<em>J. Med. Chem. 2011/2014</em>, <em>Org. Process Res. Dev. 2017</em>) 
            and patent disclosures (<em>WO 2006/021884</em>, <em>WO 2013/132376</em>, <em>US 9,567,337</em>).
            Contrasts linear acyclic assembly with 1st-generation high-dilution macrolactamization, 
            2nd-generation intramolecular S<sub>N</sub>Ar etherification, and modern continuous-flow pseudodilution.
          </p>
        </div>
      </div>

      {/* Cross-Route Comparative Metrics Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Comparative Synthesis Efficiency &amp; Scalability Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Benchmarking overall chemical yields, step count, atom economy, and dilution requirements across strategies.
            </p>
          </div>
          <button
            onClick={handleExportSynthesisJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Synthesis JSON
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Synthesis Route</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-2 text-center">Linear Steps</th>
                <th className="py-2.5 px-2 text-center">Overall Yield</th>
                <th className="py-2.5 px-3">Scalability Tier</th>
                <th className="py-2.5 px-4">Key Macrocyclization / Coupling Disconnection</th>
                <th className="py-2.5 px-3">Primary Patent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SYNTHESIS_ROUTES.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <tr
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/80 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                        <span className="font-bold text-slate-900">{route.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{route.targetCompound}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">
                      {route.linearSteps}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        route.overallYield >= 45 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : route.overallYield >= 30
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {route.overallYield}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        route.scalabilityRating.includes('High')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : route.scalabilityRating.includes('Moderate')
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {route.scalabilityRating}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 text-[11px]" title={route.retrosyntheticDisconnection}>
                      {route.retrosyntheticDisconnection}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                      {route.patentReference.split('/')[0]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Route Detailed Interactive Visualizer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
        {/* Route Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3">
          {SYNTHESIS_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => {
                setSelectedRouteId(route.id);
                setExpandedStepIndex(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedRouteId === route.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              {route.title.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Selected Route Header Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Strategy Name</span>
            <p className="font-semibold text-slate-900 leading-snug">{selectedRoute.strategyName}</p>
            <p className="text-[11px] text-slate-500">Inventors: {selectedRoute.inventorsOrAuthors}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Disconnection &amp; Innovation</span>
            <p className="text-slate-800 leading-snug">{selectedRoute.keyInnovation}</p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-indigo-700">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{selectedRoute.primaryCitation}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Known Drawbacks &amp; Limitations</span>
            <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{selectedRoute.drawbacks}</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Reaction Flow Diagram */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            Step-by-Step Chemical Transformations ({selectedRoute.steps.length} Steps)
          </h4>

          <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
            {selectedRoute.steps.map((step, idx) => {
              const isExpanded = expandedStepIndex === idx;
              return (
                <div 
                  key={step.stepNumber} 
                  className="relative bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all shadow-2xs"
                >
                  {/* Step Bullet Icon */}
                  <div className="absolute -left-[35px] top-4 w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {step.stepNumber}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {step.reactionType}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 mt-1">
                        Step {step.stepNumber}: {step.startingMaterial.split('+')[0]} &rarr; {step.product.split('(')[0]}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {step.yieldPercent}% Yield
                      </span>
                    </div>
                  </div>

                  {/* Reaction Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Starting Material(s)
                      </span>
                      <p className="font-medium text-slate-800 mt-0.5">{step.startingMaterial}</p>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Product
                      </span>
                      <p className="font-medium text-indigo-900 mt-0.5">{step.product}</p>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Reagents &amp; Solvents
                      </span>
                      <p className="text-slate-700 font-mono text-[11px] mt-0.5">{step.reagentsAndSolvents}</p>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Reaction Conditions
                      </span>
                      <p className="text-slate-700 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{step.conditions}</span>
                      </p>
                    </div>
                  </div>

                  {/* Chemical Insights & Mechanistic Notes */}
                  <div className="mt-3 pt-2 text-[11px] text-slate-600 flex items-start gap-1.5 border-t border-slate-200/50">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong>Chemical Insight:</strong> {step.notes}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Retrosynthetic Summary Panel */}
        <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-bold">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>Retrosynthetic Analysis &amp; Disconnection Logic</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {selectedRoute.retrosyntheticDisconnection}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
            <span><strong>Patent Reference:</strong> {selectedRoute.patentReference}</span>
            <span>&bull;</span>
            <span><strong>Atom Economy:</strong> {selectedRoute.atomEconomy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
