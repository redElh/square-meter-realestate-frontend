/**
 * PdfPreviewModal — Full-screen PDF viewer with zoom/pan controls.
 * Displays the generated PDF in an iframe before downloading.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

interface PdfPreviewModalProps {
  isOpen: boolean;
  blobUrl: string | null;
  filename: string;
  onClose: () => void;
  onDownload: () => void;
}

const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200];

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  blobUrl,
  filename,
  onClose,
  onDownload,
}) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) setZoom(100);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const zoomIn = useCallback(() => {
    setZoom(prev => {
      const idx = ZOOM_LEVELS.indexOf(prev);
      return idx < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[idx + 1] : prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => {
      const idx = ZOOM_LEVELS.indexOf(prev);
      return idx > 0 ? ZOOM_LEVELS[idx - 1] : prev;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  if (!isOpen || !blobUrl) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col w-[95vw] h-[92vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn"
      >
        {/* ── Top toolbar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-[#023927] to-[#0a4d3a] border-b border-white/10 flex-shrink-0">
          {/* Left: title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#c8a97e]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#c8a97e]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{filename}</p>
              <p className="text-white/50 text-xs">Apercu du rapport PDF</p>
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg px-1 py-0.5">
              <button
                onClick={zoomOut}
                disabled={zoom <= ZOOM_LEVELS[0]}
                className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom arriere"
              >
                <MagnifyingGlassMinusIcon className="w-4 h-4" />
              </button>
              <span className="text-white text-xs font-mono w-12 text-center">{zoom}%</span>
              <button
                onClick={zoomIn}
                disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom avant"
              >
                <MagnifyingGlassPlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Plein ecran"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c8a97e] text-[#023927] font-semibold text-sm hover:bg-[#d4b88a] active:scale-95 transition-all shadow-lg"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Telecharger</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Fermer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Zoom bar for mobile ── */}
        <div className="flex sm:hidden items-center justify-center gap-3 px-4 py-2 bg-gray-800 border-b border-white/5 flex-shrink-0">
          <button onClick={zoomOut} disabled={zoom <= ZOOM_LEVELS[0]} className="p-1 text-white/70 hover:text-white disabled:opacity-30">
            <MagnifyingGlassMinusIcon className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-mono w-14 text-center">{zoom}%</span>
          <button onClick={zoomIn} disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]} className="p-1 text-white/70 hover:text-white disabled:opacity-30">
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ── PDF viewport ── */}
        <div className="flex-1 overflow-auto bg-gray-800 flex items-start justify-center p-4">
          <div
            style={{
              width: `${zoom}%`,
              maxWidth: zoom >= 100 ? 'none' : '100%',
              transformOrigin: 'top center',
              transition: 'width 0.2s ease',
            }}
            className="shadow-2xl rounded-lg overflow-hidden bg-white"
          >
            <iframe
              ref={iframeRef}
              src={blobUrl}
              className="w-full border-0"
              style={{ height: `${Math.max(800, zoom * 8)}px` }}
              title="Apercu PDF"
            />
          </div>
        </div>

        {/* ── Bottom status bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-gray-900 border-t border-white/5 flex-shrink-0">
          <p className="text-white/40 text-xs">
            Utilisez les boutons +/- pour ajuster le zoom. Appuyez sur Echap pour fermer.
          </p>
          <p className="text-white/40 text-xs hidden sm:block">
            Cliquez sur "Telecharger" pour enregistrer le PDF.
          </p>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
      `}</style>
    </div>,
    document.body
  );
};

export default PdfPreviewModal;
