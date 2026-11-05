import React, { useEffect, useRef, useState } from 'react';
import SmilesDrawer from 'smiles-drawer';
import { ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';

interface StructureCanvasProps {
  smiles: string;
  name: string;
  pubchemCid?: number;
  width?: number;
  height?: number;
  className?: string;
  showControls?: boolean;
}

export const StructureCanvas: React.FC<StructureCanvasProps> = ({
  smiles,
  name,
  pubchemCid,
  width = 280,
  height = 190,
  className = '',
  showControls = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [usePubChemImage, setUsePubChemImage] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (usePubChemImage || !canvasRef.current) return;

    try {
      const drawer = new SmilesDrawer.Drawer({
        width: width * zoom,
        height: height * zoom,
        bondThickness: 1.6,
        bondLength: 15,
        shortBondLength: 0.85,
        bondSpacing: 0.18,
        fontSizeLarge: 7,
        fontSizeSmall: 5,
        padding: 12,
        compactDrawing: false,
      });

      SmilesDrawer.parse(
        smiles,
        (tree: unknown) => {
          if (canvasRef.current) {
            drawer.draw(tree, canvasRef.current, 'light', false);
            setRenderError(null);
          }
        },
        (err: unknown) => {
          console.warn('SmilesDrawer parse error for', smiles, err);
          setRenderError('Complex SMILES rendering: fallback available');
        }
      );
    } catch (e) {
      console.warn('SmilesDrawer exception:', e);
      setRenderError('Render error');
    }
  }, [smiles, zoom, usePubChemImage, width, height]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.min(z + 0.25, 2.0));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.max(z - 0.25, 0.75));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
  };

  const togglePubchem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUsePubChemImage(!usePubChemImage);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}>
      {/* Control bar */}
      {showControls && (
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-md p-1 shadow-xs">
          {pubchemCid && (
            <button
              onClick={togglePubchem}
              title={usePubChemImage ? 'Switch to Dynamic Vector Canvas' : 'Switch to PubChem 2D Depiction'}
              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle depiction source"
            >
              {usePubChemImage ? <Sparkles className="w-3.5 h-3.5 text-blue-600" /> : <ImageIcon className="w-3.5 h-3.5" />}
            </button>
          )}
          {!usePubChemImage && (
            <>
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              {zoom !== 1 && (
                <button
                  onClick={handleReset}
                  title="Reset Zoom"
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Canvas or Image View */}
      <div className="w-full flex items-center justify-center p-2 min-h-[170px] overflow-hidden">
        {usePubChemImage && pubchemCid ? (
          <img
            src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubchemCid}/PNG?image_size=300x300`}
            alt={`${name} 2D chemical structure`}
            className="max-h-[180px] max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={width * zoom}
            height={height * zoom}
            className="max-w-full max-h-[185px] object-contain transition-transform duration-150"
          />
        )}
      </div>

      {renderError && !usePubChemImage && (
        <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-1">
          {renderError}
        </div>
      )}

      {/* Footer depiction badge */}
      <div className="w-full px-2 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="truncate max-w-[170px]" title={name}>
          {name}
        </span>
        <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.2 rounded font-sans">
          {usePubChemImage ? 'PubChem 2D' : 'SmilesDrawer'}
        </span>
      </div>
    </div>
  );
};
