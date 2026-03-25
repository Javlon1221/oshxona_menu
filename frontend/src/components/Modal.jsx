import React, { useEffect, useRef, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } },
};

const modalVariants = {
  hidden: { y: 15, scale: 0.99, opacity: 0 },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 400,
      duration: 0.2
    },
  },
  exit: { 
    y: 10, 
    scale: 0.98, 
    opacity: 0, 
    transition: { duration: 0.12, ease: 'easeIn' } 
  },
};

/**
 * Modal ichidagi barcha focus qilish mumkin bo'lgan elementlarni topish
 */
const getFocusableElements = (container) => {
  if (!container) return [];
  
  try {
    return Array.from(
      container.querySelectorAll(
        'button:not([disabled]):not([aria-hidden="true"]), [href]:not([aria-hidden="true"]), input:not([disabled]):not([aria-hidden="true"]), select:not([disabled]):not([aria-hidden="true"]), textarea:not([disabled]):not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])'
      )
    ).filter((el) => {
      // Yashirin va o'chirilgan elementlarni filtrlash
      const style = window.getComputedStyle(el);
      return (
        el.offsetWidth > 0 && 
        el.offsetHeight > 0 && 
        style.visibility !== 'hidden' && 
        style.display !== 'none'
      );
    });
  } catch (error) {
    console.error('getFocusableElements error:', error);
    return [];
  }
};

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true
}) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousActiveRef = useRef(null);

  /**
   * Modalni yopish funksiyasi
   */
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  /**
   * Backdrop (fon) bosilganda modalni yopish
   */
  const handleBackdropClick = useCallback((e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      handleClose();
    }
  }, [closeOnBackdropClick, handleClose]);

  /**
   * Keyboard boshqaruvi (Escape, Tab)
   */
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    // Escape tugmasi - modalni yopish
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      handleClose();
      return;
    }

    // Tab tugmasi - focus trap (modal ichida aylanish)
    if (e.key === 'Tab') {
      if (!modalRef.current) return;

      const focusableElements = getFocusableElements(modalRef.current);
      
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (orqaga)
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab (oldinga)
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }, [isOpen, handleClose]);

  /**
   * Modal ochilganda va yopilganda effektlar
   */
  useEffect(() => {
    if (!isOpen) return;

    // Joriy focus elementini saqlash
    previousActiveRef.current = document.activeElement;

    // Body scroll ni to'xtatish
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Focus ni modal ichiga o'tkazish
    const focusModal = () => {
      if (!modalRef.current) return;

      const focusableElements = getFocusableElements(modalRef.current);
      
      if (focusableElements.length > 0) {
        // Birinchi focus qilish mumkin bo'lgan elementga focus
        focusableElements[0].focus();
      } else if (closeBtnRef.current) {
        // Agar focus elementi bo'lmasa, yopish tugmasiga focus
        closeBtnRef.current.focus();
      } else if (modalRef.current) {
        // Aks holda modal containerga focus
        modalRef.current.focus();
      }
    };

    // Kichik kechikish bilan focus (animation uchun)
    const timeoutId = setTimeout(focusModal, 50);

    // Keyboard event listener
    document.addEventListener('keydown', handleKeyDown, true);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = originalOverflow;
      
      // Avvalgi focus elementiga qaytish
      if (previousActiveRef.current && document.contains(previousActiveRef.current)) {
        // Kichik kechikish bilan focus qaytarish
        setTimeout(() => {
          try {
            if (previousActiveRef.current && typeof previousActiveRef.current.focus === 'function') {
              previousActiveRef.current.focus();
            }
          } catch (error) {
            console.error('Focus restore error:', error);
          }
        }, 50);
      }
    };
  }, [isOpen, handleKeyDown]);

  /**
   * Modal o'lchamlari
   */
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
          role="presentation"
        >
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            aria-hidden="true"
          />
          
          {/* Modal content */}
          <Motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby="modal-content"
            tabIndex={-1}
            className={`relative w-full ${sizeClasses[size] || sizeClasses.md} bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden border border-black/10`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 bg-[color:var(--brand-primary)] border-b border-black/10">
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-lg font-semibold text-white truncate pr-2"
                  >
                    {title}
                  </h2>
                )}
                
                {showCloseButton && (
                  <button
                    ref={closeBtnRef}
                    onClick={handleClose}
                    aria-label="Modalni yopish"
                    type="button"
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[color:var(--brand-primary)]"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div 
              id="modal-content"
              className="overflow-y-auto max-h-[calc(90vh-80px)] overscroll-contain"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#6D4C41 #F3E7C7'
              }}
            >
              <div className="p-6">
                {children}
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
