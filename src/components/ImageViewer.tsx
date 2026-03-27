/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ImageViewer({ images, currentIndex, onClose, onPrev, onNext }: ImageViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10 select-none"
        onClick={onClose}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[310]"
        >
          <X className="w-8 h-8" />
        </button>

        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[310] p-4"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[310] p-4"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </>
        )}

        <motion.div 
          key={currentImage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={currentImage} 
            alt="Full view" 
            className="max-w-full max-h-full object-contain shadow-2xl"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute bottom-0 left-0 right-0 text-center py-6 text-white/40 text-[10px] font-black uppercase tracking-widest">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
