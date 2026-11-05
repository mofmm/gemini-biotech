import React, { useState } from 'react';
import { ACADEMIC_LITERATURE, PATENT_LITERATURE, AcademicPaper, PatentRecord } from '../data/literatureData';
import { Search, BookOpen, FileText, ExternalLink, Sparkles, Filter, Copy, Check, Loader2, ArrowRight } from 'lucide-react';

interface EuropePmcArticle {
  id: string;
  source: string;
  title: string;
  authorString: string;
  journalTitle?: string;
  pubYear?: string;
  doi?: string;
  pmid?: string;
  citedByCount?: number;
}

export const AcademicPatentMiningView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'academic' | 'patents' | 'liveSearch'>('academic');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Europe PMC Search State
  const [liveQuery, setLiveQuery] = useState('("crizotinib" OR "lorlatinib") AND "macrocycl"');
  const [liveResults, setLiveResults] = useState<EuropePmcArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const copyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLiveSearch = async (queryToRun?: string) => {
    const q = queryToRun || liveQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(
        q
      )}&format=json&pageSize=12&resultType=lite`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Europe PMC returned status ${res.status}`);
      }
      const data = await res.json();
      const results: EuropePmcArticle[] = data.resultList?.result || [];
      setLiveResults(results);
    } catch (err: unknown) {
      console.error('Europe PMC query error:', err);
      setSearchError(err instanceof Error ? err.message : 'Failed to query Europe PMC');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              Literature &amp; Intellectual Property
            </span>
            <span className="text-xs text-slate-500 font-mono">Curated + Live Europe PMC Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Academic &amp; Patent Literature Search</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer-reviewed medicinal chemistry papers, clinical trial outcomes, and patent disclosures on Crizotinib, Lorlatinib, and their related chemical series.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('academic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'academic' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            Curated Academic ({ACADEMIC_LITERATURE.length})
          </button>
          <button
            onClick={() => setActiveSubTab('patents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'patents' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-600" />
            Patents &amp; IP ({PATENT_LITERATURE.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('liveSearch');
              if (!hasSearched) handleLiveSearch();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'liveSearch' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Live Search (Europe PMC)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Curated Academic Literature */}
      {activeSubTab === 'academic' && (
        <div className="space-y-4">
          {ACADEMIC_LITERATURE.map((paper) => (
            <div
              key={paper.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {paper.journal} ({paper.year})
                    </span>
                    {paper.seriesCovered.map((s) => (
                      <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                    >
                      {paper.title}
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 italic">{paper.authors}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyCitation(`${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}. DOI: ${paper.doi}`, paper.id)}
                    className="p-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1 transition-colors"
                    title="Copy full citation"
                  >
                    {copiedId === paper.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedId === paper.id ? 'Copied' : 'Cite'}</span>
                  </button>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-md flex items-center gap-1 transition-colors"
                  >
                    DOI
                  </a>
                </div>
              </div>

              {/* Key findings list */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs">
                <span className="font-semibold text-slate-800 block mb-1.5">Key Findings &amp; Medicinal Chemistry Contributions:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {paper.keyFindings.map((finding, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="text-slate-700"><strong>Significance:</strong> {paper.significance}</span>
                <span className="font-mono text-slate-400">DOI: {paper.doi}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: Patent Disclosures & IP */}
      {activeSubTab === 'patents' && (
        <div className="space-y-4">
          {PATENT_LITERATURE.map((patent) => (
            <div
              key={patent.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                      {patent.patentNumber}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {patent.jurisdiction}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      patent.status === 'Granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {patent.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{patent.title}</h3>
                </div>

                <a
                  href={patent.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-purple-700 hover:bg-purple-800 rounded-md flex items-center gap-1 shrink-0 transition-colors"
                >
                  View Patent <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Patent Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Assignee</div>
                  <div className="font-bold text-slate-800 mt-0.5">{patent.assignee}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Priority Date</div>
                  <div className="font-mono text-slate-800 mt-0.5">{patent.priorityDate}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Publication Date</div>
                  <div className="font-mono text-slate-800 mt-0.5">{patent.publicationDate}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Series Covered</div>
                  <div className="font-bold text-purple-700 mt-0.5">{patent.seriesType}</div>
                </div>
              </div>

              {/* Abstract */}
              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800">Abstract: </span>
                {patent.abstract}
              </div>

              {/* Exemplar Compounds & Key Claims */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-700">Disclosed Exemplar Compounds:</span>
                  {patent.exemplarCompounds.map((cpd) => (
                    <span key={cpd} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px] border border-slate-200">
                      {cpd}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="font-semibold text-slate-700 block mb-1">Key Patent Claims:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {patent.keyClaims.map((claim, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {claim}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: Live Europe PMC Academic Search */}
      {activeSubTab === 'liveSearch' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Live Academic Literature Query (Europe PMC API)</h3>
            <p className="text-xs text-slate-500">
              Execute live searches across 40+ million biomedical research articles, preprints, and patents indexed in Europe PubMed Central.
            </p>

            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={liveQuery}
                  onChange={(e) => setLiveQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLiveSearch()}
                  placeholder='e.g. ("crizotinib" OR "lorlatinib") AND "G1202R"'
                  className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => handleLiveSearch()}
                disabled={isSearching}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Search
              </button>
            </div>

            {/* Preset Query Chips */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
              <span className="text-slate-400 text-[11px]">Quick Queries:</span>
              {[
                '("crizotinib" OR "lorlatinib") AND "macrocycl"',
                'lorlatinib "G1202R" resistance',
                '"PF-06463922" brain metastases',
                '"crizotinib" L1196M gatekeeper',
                'macrocyclic ALK inhibitors'
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setLiveQuery(q);
                    handleLiveSearch(q);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-mono transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Results list */}
          {searchError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              Error querying Europe PMC: {searchError}
            </div>
          )}

          {isSearching ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs text-slate-500">Querying Europe PMC biomedical literature repository...</p>
            </div>
          ) : liveResults.length > 0 ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 px-1">
                Showing <strong>{liveResults.length}</strong> live literature records for query: <code className="font-mono text-slate-800">{liveQuery}</code>
              </div>
              {liveResults.map((art) => (
                <div
                  key={art.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {art.journalTitle || art.source} {art.pubYear ? `(${art.pubYear})` : ''}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {art.title.replace(/<\/?[^>]+(>|$)/g, '')}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{art.authorString}</p>
                    </div>

                    <a
                      href={art.doi ? `https://doi.org/${art.doi}` : `https://europepmc.org/article/${art.source}/${art.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded flex items-center gap-1 shrink-0 transition-colors"
                    >
                      Article <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    {art.doi && <span>DOI: {art.doi}</span>}
                    {art.pmid && <span>PMID: {art.pmid}</span>}
                    {art.citedByCount !== undefined && <span>Citations: {art.citedByCount}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No articles returned for query. Try modifying the keywords.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
