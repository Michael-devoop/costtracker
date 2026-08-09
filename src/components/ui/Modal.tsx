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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto my-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div
        className={cn(
          'relative z-10 w-full my-auto max-h-[90vh] flex flex-col rounded-[24px] border border-[#282c37] bg-[#1a1d24] text-white shadow-2xl overflow-hidden',
          sizeClass,
          className
        )}
        style={{ animation: 'modalIn 0.25s ease-out forwards' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242834] px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Body — Scrollable with custom smooth scrollbar */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-70px)] scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
