"use client";

import React, { useEffect } from "react";

interface ModalCustomProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ModalCustom({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalCustomProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all ${className}`}
        >
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
}
