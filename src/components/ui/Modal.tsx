'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in">
      {/* Backdrop overlay click handler */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative z-10 w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col rounded-[24px] border border-[#282c37] bg-[#1a1d24] text-white shadow-2xl overflow-hidden my-auto pointer-events-auto',
          sizeClass,
          className
        )}
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#242834] px-6 py-4 flex-shrink-0 bg-[#1a1d24]/90 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Modal Body — Fully scrollable without clipping top/bottom */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin overscroll-contain touch-pan-y min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
