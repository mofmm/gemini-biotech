import React, { useState, useMemo } from 'react';
import { CompoundRecord, exportCompoundsToCSV, exportCompoundsToSDF } from '../utils/dataPreparation';
import { Download, Copy, Check, FileSpreadsheet, FileCode, Database, CheckSquare, Square, FileText } from 'lucide-react';

interface DataExportCenterViewProps {
  compounds: CompoundRecord[];
  onSelectCompound: (compound: CompoundRecord) => void;
}

export const DataExportCenterView: React.FC<DataExportCenterViewProps> = ({
  compounds,
  onSelectCompound
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(compounds.map((c) => c.id))
  );
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'sdf' | 'smi'>('csv');
  const [copied, setCopied] = useState(false);

  // Toggle selection
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => setSelectedIds(new Set(compounds.map((c) => c.id)));
  const selectMacrocyclesOnly = () =>
    setSelectedIds(new Set(compounds.filter((c) => c.series === 'macrocyclic').map((c) => c.id)));
  const selectAcyclicsOnly = () =>
    setSelectedIds(new Set(compounds.filter((c) => c.series === 'acyclic').map((c) => c.id)));
  const clearAll = () => setSelectedIds(new Set());

  // Filtered compounds based on selection
  const compoundsToExport = useMemo(
    () => compounds.filter((c) => selectedIds.has(c.id)),
    [compounds, selectedIds]
  );

  // Formatted string based on format
  const formattedContent = useMemo(() => {
    if (compoundsToExport.length === 0) return 'No compounds selected for export.';

    switch (exportFormat) {
      case 'csv':
        return exportCompoundsToCSV(compoundsToExport);
      case 'json':
        return JSON.stringify(
          {
            datasetMetadata: {
              name: 'Crizotinib and Lorlatinib Series: Macrocyclic & Acyclic ALK/ROS1 Inhibitor Dataset',
              curationDate: '2026-11-04',
              compoundCount: compoundsToExport.length,
              source: 'J. Med. Chem., Cancer Discovery, WO 2013/132376, WO 2006/021884, PubChem, ChEMBL',
              propertiesIncluded: [
                'ID', 'Name', 'Series', 'MacrocyclicRingSize', 'Formula', 'MW', 'SMILES', 'InChIKey',
                'Physicochemical (XLogP, TPSA, HBD, HBA, RotB)',
                'Kinase Potency IC50 (ALK WT, L1196M, G1202R, ROS1, c-MET)',
                'ADMET & CNS (CNS MPO, P-gp Substrate, MDCK Papp)',
                'Patent & Literature Provenance'
              ]
            },
            compounds: compoundsToExport
          },
          null,
          2
        );
      case 'sdf':
        return exportCompoundsToSDF(compoundsToExport);
      case 'smi':
        return compoundsToExport
          .map((c) => `${c.smiles}\t${c.id}\t${c.name}\t${c.series}`)
          .join('\n');
    }
  }, [compoundsToExport, exportFormat]);

  const handleDownload = () => {
    let filename = `alk_inhibitors_${exportFormat}_${Date.now()}`;
    let mimeType = 'text/plain';

    switch (exportFormat) {
      case 'csv':
        filename += '.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
        filename += '.json';
        mimeType = 'application/json';
        break;
      case 'sdf':
        filename += '.sdf';
        mimeType = 'chemical/x-mdl-sdfile';
        break;
      case 'smi':
        filename += '.smi';
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([formattedContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Summary statistics
  const stats = useMemo(() => {
    const list = compoundsToExport;
    const macroCount = list.filter((c) => c.series === 'macrocyclic').length;
    const acyclicCount = list.filter((c) => c.series === 'acyclic').length;
    const g1202rCount = list.filter((c) => (c.alkG1202r_ic50 ?? 9999) <= 100).length;
    const avgCnsMpo = list.length > 0
      ? list.reduce((acc, c) => acc + c.cnsMpo, 0) / list.length
      : 0;

    return {
      total: list.length,
      macroCount,
      acyclicCount,
      g1202rCount,
      avgCnsMpo: avgCnsMpo.toFixed(2)
    };
  }, [compoundsToExport]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Data Preparation &amp; Cheminformatics Pipeline
            </span>
            <span className="text-xs text-slate-500 font-mono">Ready for QSAR, RDKit, Python &amp; Maestro</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Export Compounds &amp; Associated Data</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Export structured datasets in computational chemistry formats with full 2D structures, ADMET predictions, and bioactivity profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Data'}
          </button>
          <button
            onClick={handleDownload}
            disabled={compoundsToExport.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download {exportFormat.toUpperCase()} ({compoundsToExport.length})
          </button>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500">Selected Compounds</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">of {compounds.length} total</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500">Macrocyclic Entities</div>
          <div className="text-xl font-bold font-mono text-purple-700 mt-1">{stats.macroCount}</div>
          <div className="text-[10px] text-purple-600 mt-0.5">Rigid pre-organized</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500">Acyclic Entities</div>
          <div className="text-xl font-bold font-mono text-blue-700 mt-1">{stats.acyclicCount}</div>
          <div className="text-[10px] text-blue-600 mt-0.5">Flexible series</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500">G1202R Potent (≤100 nM)</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{stats.g1202rCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Resistance overcoming</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500">Mean CNS MPO</div>
          <div className="text-xl font-bold font-mono text-indigo-700 mt-1">{stats.avgCnsMpo}</div>
          <div className="text-[10px] text-indigo-600 mt-0.5">Target: ≥ 4.0</div>
        </div>
      </div>

      {/* Main Grid: Selection Matrix + Export Options & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Compound Checklist & Quick Selection (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Entities</h3>
            <div className="flex items-center gap-1.5 text-xs">
              <button onClick={selectAll} className="text-blue-600 hover:text-blue-800">All</button>
              <span className="text-slate-300">•</span>
              <button onClick={selectMacrocyclesOnly} className="text-purple-600 hover:text-purple-800">Macro</button>
              <span className="text-slate-300">•</span>
              <button onClick={selectAcyclicsOnly} className="text-blue-600 hover:text-blue-800">Acyclic</button>
              <span className="text-slate-300">•</span>
              <button onClick={clearAll} className="text-slate-400 hover:text-slate-600">None</button>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
            {compounds.map((c) => {
              const isChecked = selectedIds.has(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleSelect(c.id)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    isChecked ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      className="text-slate-500 hover:text-slate-800"
                      aria-label={`Select ${c.name}`}
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                    </button>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{c.id} • {c.formula}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
                    c.series === 'macrocyclic' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.macrocyclicRingSize ? `${c.macrocyclicRingSize}M` : 'Acyclic'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Format Selector & Live Code Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Export Format</h3>
            
            {/* Format toggle pills */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setExportFormat('csv')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  exportFormat === 'csv' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV (Tables/Pandas)
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  exportFormat === 'json' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" /> JSON (Full Schema)
              </button>
              <button
                onClick={() => setExportFormat('sdf')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  exportFormat === 'sdf' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5" /> SDF (RDKit/Maestro)
              </button>
              <button
                onClick={() => setExportFormat('smi')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  exportFormat === 'smi' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> SMILES (.smi)
              </button>
            </div>
          </div>

          {/* Description of current format */}
          <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {exportFormat === 'csv' && (
              <span><strong>CSV Format:</strong> 31 tabular columns including IC50s (ALK WT, L1196M, G1202R, ROS1, c-MET), physicochemical parameters (MW, XLogP, TPSA, HBD, HBA, RotB), CNS MPO score, P-gp liability, and literature citations.</span>
            )}
            {exportFormat === 'json' && (
              <span><strong>JSON Format:</strong> Structured hierarchical schema with dataset curation provenance, units metadata, chemical representations, and bioactivities.</span>
            )}
            {exportFormat === 'sdf' && (
              <span><strong>SDF Format:</strong> MDL V2000 Structure-Data File with connection table headers, formatted `&gt; &lt;FIELD_NAME&gt;` blocks, and standard `$$$$` delimiters, ready for import into RDKit, Schrödinger Maestro, MOE, and DataWarrior.</span>
            )}
            {exportFormat === 'smi' && (
              <span><strong>SMILES Format:</strong> Standard tab-delimited SMILES string with compound ID, name, and series classification. Ideal for batch virtual screening and docking pipelines.</span>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="relative">
            <pre className="w-full h-[400px] overflow-auto bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed select-all">
              {formattedContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
