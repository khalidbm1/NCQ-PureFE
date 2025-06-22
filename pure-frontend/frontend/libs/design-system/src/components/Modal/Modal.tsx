import React from 'react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className={cn('bg-white rounded p-4')}
        role="dialog"
      >
        {children}
        <button onClick={onClose} aria-label="Close" className="mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
