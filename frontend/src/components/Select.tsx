"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";

interface Option {
  label: string;
  value: string;
  className?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Select = ({
  value,
  onChange,
  options = [],
  placeholder,
  className = "",
  disabled = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSelectedValue, setNewSelectedValue] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setNewSelectedValue(option.label);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative inline-block w-fit">
      <div
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2 cursor-pointer 
          whitespace-nowrap select-none w-full
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
      >
        {value === "updating"
          ? "Đang cập nhật..."
          : newSelectedValue || selectedOption?.label || placeholder}
        <IoChevronDown className="w-3 h-3 text-current" />
      </div>

      {isOpen && !disabled && (
        <div
          className="fixed bg-white rounded-lg shadow-lg min-w-max z-[1000] pointer-events-auto"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className={`
                px-4 py-2 cursor-pointer whitespace-nowrap z-[1000] 
                transition-all duration-200 hover:bg-gray-100
                ${index === 0 ? "rounded-t-lg" : ""}
                ${index === options.length - 1 ? "rounded-b-lg" : ""}
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
