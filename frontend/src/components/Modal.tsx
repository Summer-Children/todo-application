import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-600 bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};
