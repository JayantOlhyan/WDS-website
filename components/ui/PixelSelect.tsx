"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { sound } from "@/lib/soundEffects";

export interface SelectOption {
  value: string;
  label: string;
}

interface PixelSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

export function PixelSelect({
  value,
  onChange,
  options,
  placeholder = "Select option...",
  label,
  required = false,
  className = "",
  id,
}: PixelSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options array to { value, label } objects
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (optionValue: string) => {
    sound.playClick();
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-wds-white mb-1.5 select-none">
          {label} {required && <span className="text-wds-yellow">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => {
          sound.playClick();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        className={`w-full p-2.5 bg-wds-bg border text-left text-xs font-mono flex items-center justify-between transition-all duration-150 outline-none select-none cursor-pointer ${
          isOpen
            ? "border-wds-yellow bg-wds-yellow/10 text-wds-white shadow-pixel-yellow ring-1 ring-wds-yellow"
            : "border-wds-yellow/40 text-wds-white hover:border-wds-yellow"
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : <span className="text-wds-muted">{placeholder}</span>}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-wds-yellow shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Custom In-Website Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 border-2 border-wds-yellow bg-wds-card shadow-pixel-yellow max-h-60 overflow-y-auto divide-y divide-wds-yellow/20 font-mono text-xs">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3 py-2.5 cursor-pointer flex items-center justify-between transition-all select-none ${
                  isSelected
                    ? "bg-wds-yellow text-wds-bg font-bold"
                    : "text-wds-white hover:bg-wds-yellow/20 hover:text-wds-yellow"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
