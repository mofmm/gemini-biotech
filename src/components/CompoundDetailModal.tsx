import React, { useState } from 'react';
import { CompoundRecord, evaluateLipinski, evaluateVeber, exportCompoundsToSDF } from '../utils/dataPreparation';
import { StructureCanvas } from './StructureCanvas';
import { X, Copy, Check, ExternalLink, Download, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CompoundDetailModalProps {
  compound: CompoundRecord | null;
  onClose: () => void;
  onCompareWith?: (compound: CompoundRecord) => void;
}

export const CompoundDetailModal: React.FC<CompoundDetailModalProps> = ({
  compound,
  onClose,
  onCompareWith
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!compound) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadSingleSDF = () => {
    const sdfContent = exportCompoundsToSDF([compound]);
    const blob = new Blob([sdfContent], { type: 'chemical/x-mdl-sdfile' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${compound.id}_structure.sdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lipinski = evaluateLipinski(compound.mw, compound.xlogp, compound.hbd, compound.hba);
  const veber = evaluateVeber(compound.rotatableBonds, compound.tpsa);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{compound.name}</h2>
              {compound.codeName && (
                <span className="text-xs px-2 py-0.5 font-mono bg-slate-200/80 text-slate-700 rounded-md">
                  {compound.codeName}
                </span>
              )}
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                compound.series === 'macrocyclic'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : compound.series === 'acyclic'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {compound.series.toUpperCase()} {compound.macrocyclicRingSize ? `(${compound.macrocyclicRingSize}-membered)` : ''}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{compound.subseries} • {compound.clinicalPhase} • {compound.assignee}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {onCompareWith && (
              <button
                onClick={() => onCompareWith(compound)}
                className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                Compare in Pairwise
              </button>
            )}
            <button
              onClick={handleDownloadSingleSDF}
              className="text-xs flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-md font-medium transition-colors"
              title="Download single molecule SDF file"
            >
              <Download className="w-3.5 h-3.5" />
              SDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Grid: Structure Canvas & Quick Identifiers */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5">
              <StructureCanvas
                smiles={compound.smiles}
                name={compound.name}
                pubchemCid={compound.pubchemCid}
                width={340}
                height={230}
                className="shadow-xs"
              />
              <div className="mt-2 text-center text-xs text-slate-500">
                Formula: <span className="font-mono font-medium text-slate-800">{compound.formula}</span> • MW: <span className="font-mono font-medium text-slate-800">{compound.mw.toFixed(2)} g/mol</span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Identifiers & Structure Representation</h3>
              
              {/* SMILES block */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-medium">Canonical SMILES:</span>
                  <button
                    onClick={() => copyToClipboard(compound.smiles, 'smiles')}
                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
                  >
                    {copiedField === 'smiles' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'smiles' ? 'Copied' : 'Copy SMILES'}
                  </button>
                </div>
                <div className="font-mono text-slate-800 text-[11px] break-all select-all bg-white p-1.5 rounded border border-slate-200">
                  {compound.smiles}
                </div>
              </div>

              {/* InChIKey block */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-medium">InChIKey:</span>
                  <button
                    onClick={() => copyToClipboard(compound.inchiKey, 'inchikey')}
                    className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
                  >
                    {copiedField === 'inchikey' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'inchikey' ? 'Copied' : 'Copy InChIKey'}
                  </button>
                </div>
                <div className="font-mono text-slate-800 text-[11px] select-all bg-white p-1.5 rounded border border-slate-200">
                  {compound.inchiKey}
                </div>
              </div>

              {/* External Database Links */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                {compound.pubchemCid && (
                  <a
                    href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.pubchemCid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                  >
                    PubChem CID: {compound.pubchemCid}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {compound.chemblId && (
                  <a
                    href={`https://www.ebi.ac.uk/chembl/compound_report_card/${compound.chemblId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                  >
                    ChEMBL: {compound.chemblId}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {compound.pdbId && (
                  <a
                    href={`https://www.rcsb.org/structure/${compound.pdbId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-md border border-amber-200 transition-colors"
                  >
                    PDB Crystal: {compound.pdbId}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Kinase Inhibition & Resistance Profile */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center justify-between">
              <span>Kinase Inhibition &amp; Resistance Mutation Potency (IC50 in nM)</span>
              <span className="text-[11px] font-normal text-slate-500">Lower is more potent (sub-10 nM = highly potent)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">ALK Wild-Type</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {compound.alkWt_ic50} <span className="text-xs font-normal text-slate-500">nM</span>
                </div>
                <div className={`text-[10px] mt-1 font-medium ${compound.alkWt_ic50 <= 5 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {compound.alkWt_ic50 <= 5 ? '● Sub-nanomolar / Potent' : '● Moderate'}
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">ALK L1196M (Gatekeeper)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {compound.alkL1196m_ic50 !== undefined ? `${compound.alkL1196m_ic50}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-slate-500">nM</span>
                </div>
                <div className={`text-[10px] mt-1 font-medium ${
                  (compound.alkL1196m_ic50 ?? 999) <= 25 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {(compound.alkL1196m_ic50 ?? 999) <= 25 ? '● Overcomes L1196M' : '● Resistant'}
                </div>
              </div>

              <div className={`bg-white p-3 rounded-lg border ${
                (compound.alkG1202r_ic50 ?? 999) <= 60 ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
              }`}>
                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                  <span>ALK G1202R (Solvent Front)</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {compound.alkG1202r_ic50 !== undefined ? `${compound.alkG1202r_ic50}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-slate-500">nM</span>
                </div>
                <div className={`text-[10px] mt-1 font-semibold ${
                  (compound.alkG1202r_ic50 ?? 999) <= 60 ? 'text-emerald-700' : (compound.alkG1202r_ic50 ?? 999) <= 300 ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {(compound.alkG1202r_ic50 ?? 999) <= 60 ? '★ Overcomes G1202R!' : (compound.alkG1202r_ic50 ?? 999) <= 300 ? '● Intermediate' : '✖ Clinically Resistant'}
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">ROS1 Wild-Type</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {compound.ros1Wt_ic50 !== undefined ? `${compound.ros1Wt_ic50}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-slate-500">nM</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-500">Cousin RTK Target</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">c-MET (HGFR)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {compound.cMet_ic50 !== undefined ? `${compound.cMet_ic50}` : 'N/A'}{' '}
                  <span className="text-xs font-normal text-slate-500">nM</span>
                </div>
                <div className="text-[10px] mt-1 text-slate-500">Crizotinib ancestral target</div>
              </div>
            </div>
          </div>

          {/* ADMET, CNS Permeability & Drug-Likeness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Physicochemical & Rules */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Physicochemical Properties &amp; Rules</h4>
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">XLogP</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{compound.xlogp.toFixed(2)}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">TPSA</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{compound.tpsa.toFixed(1)} Å²</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">Rotatable Bonds</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{compound.rotatableBonds}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">H-Bond Donors</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{compound.hbd}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">H-Bond Acceptors</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{compound.hba}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">Ring System</div>
                  <div className="font-sans font-bold text-slate-900 mt-0.5 truncate">{compound.linkerType || compound.subseries}</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    {lipinski.passes ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                    Lipinski Rule of 5:
                  </span>
                  <span className={`font-medium ${lipinski.passes ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {lipinski.passes ? 'Passed (0-1 violations)' : `${lipinski.violations.length} violations`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    {veber.passes ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                    Veber Bioavailability:
                  </span>
                  <span className={`font-medium ${veber.passes ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {veber.passes ? 'Passed (RotB ≤ 10, TPSA ≤ 140)' : 'Violated'}
                  </span>
                </div>
              </div>
            </div>

            {/* CNS Permeability & Blood-Brain Barrier */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Blood-Brain Barrier &amp; CNS Permeability</h4>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                <div>
                  <div className="text-xs text-slate-500 font-medium">CNS MPO Score (0 - 6)</div>
                  <div className="text-xs text-slate-400 mt-0.5">Wager score: ≥ 4.0 indicates high brain penetrance</div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold font-mono ${
                    compound.cnsMpo >= 4.5 ? 'text-emerald-600' : compound.cnsMpo >= 3.5 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {compound.cnsMpo.toFixed(1)}
                  </span>
                  <div className={`text-[10px] font-semibold ${
                    compound.cnsMpo >= 4.5 ? 'text-emerald-700' : compound.cnsMpo >= 3.5 ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {compound.cnsMpo >= 4.5 ? 'High CNS Access' : compound.cnsMpo >= 3.5 ? 'Moderate' : 'Poor CNS Penetrance'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">P-gp Efflux Substrate</div>
                  <div className={`font-bold mt-0.5 ${
                    compound.pGpSubstrate === 'Low' ? 'text-emerald-700' : compound.pGpSubstrate === 'Moderate' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {compound.pGpSubstrate} Liability
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-500 text-[10px]">MDCK Papp (10⁻⁶ cm/s)</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    {compound.mdckPapp ? `${compound.mdckPapp} (High)` : 'Est. ~ 2-5'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medicinal Chemistry Notes & Patents */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Medicinal Chemistry &amp; Structural Rationale</h4>
            <p className="text-slate-700 leading-relaxed">{compound.notes}</p>
            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-slate-600 text-[11px]">
              <div>
                <span className="font-medium text-slate-800">Primary Literature: </span>
                <span className="font-mono">{compound.primaryLiterature}</span>
              </div>
              <div>
                <span className="font-medium text-slate-800">Primary Patent: </span>
                <span className="font-mono">{compound.primaryPatent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Prepared for downstream computational modeling &amp; SAR analysis</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
