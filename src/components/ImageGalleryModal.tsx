// src/components/ImageGalleryModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  propertyTitle: string;
  initialIndex?: number;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  propertyTitle,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, zoom]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
    if (zoom <= 1.25) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Touch events for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // Mouse drag for zoomed images
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-3 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-base sm:text-xl font-medium truncate pr-2">
              {propertyTitle}
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="ml-2 sm:ml-4 w-12 h-12 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm flex-shrink-0"
            aria-label="Close gallery"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center px-2 sm:px-16 py-16 sm:py-20"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="relative max-w-7xl max-h-full overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`${propertyTitle} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-[65vh] sm:max-h-[75vh] object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transformOrigin: 'center center'
            }}
            draggable={false}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
          </>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="w-11 h-11 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all rounded"
          aria-label="Zoom out"
        >
          <MagnifyingGlassMinusIcon className="w-5 h-5" />
        </button>
        
        <span className="text-white text-xs sm:text-sm font-medium min-w-[50px] sm:min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="w-11 h-11 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all rounded"
          aria-label="Zoom in"
        >
          <MagnifyingGlassPlusIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={resetZoom}
          disabled={zoom === 1}
          className="ml-1 sm:ml-2 w-11 h-11 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all rounded"
          aria-label="Reset zoom"
        >
          <ArrowsPointingOutIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-[72px] sm:bottom-24 left-0 right-0 px-2 sm:px-4">
          <div className="max-w-4xl mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex gap-1.5 sm:gap-2 justify-start sm:justify-center pb-2 px-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetZoom();
                  }}
                  className={`flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 overflow-hidden transition-all rounded ${
                    index === currentIndex
                      ? 'ring-2 ring-white opacity-100 scale-105'
                      : 'opacity-50 hover:opacity-75 active:opacity-90'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGalleryModal;
