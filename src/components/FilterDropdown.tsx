// src/components/FilterDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface FilterDropdownOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label?: string;
  value: string;
  placeholder: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  variant?: 'hero' | 'light';
  compact?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  variant = 'hero',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target as Node);
      const isOutsidePanel = panelRef.current && !panelRef.current.contains(event.target as Node);

      if (isOutsideButton && isOutsidePanel) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    const handleResize = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const panelWidth = Math.max(rect.width, 260);
      let left = rect.left;
      if (left + panelWidth > window.innerWidth - 10) {
        left = window.innerWidth - panelWidth - 10;
      }
      if (left < 10) left = 10;
      setPanelPosition({ top: rect.bottom + 8, left, width: panelWidth });
    }
    setIsOpen(prev => !prev);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 transition-colors duration-300 focus:outline-none ${
          compact ? 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm' : 'px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base'
        } ${
          variant === 'light'
            ? 'border-2 border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-gray-400'
            : 'border-2 border-white/60 bg-white/95 backdrop-blur-sm text-gray-900 hover:border-white focus:border-white'
        }`}
        style={{ borderRadius: '0' }}
      >
        <span className="text-left min-w-0">
          {label && (
            <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 truncate">{label}</span>
          )}
          <span className="block font-medium truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && panelPosition && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label={label}
          className="fixed bg-white shadow-2xl border border-gray-200 py-1.5 z-[9999] animate-dropdown-in"
          style={{ top: `${panelPosition.top}px`, left: `${panelPosition.left}px`, width: `${panelPosition.width}px` }}
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm sm:text-base transition-colors duration-200 ${
                option.value === value
                  ? 'bg-[#023927]/10 text-[#023927] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{option.label}</span>
              {option.value === value && <CheckIcon className="w-4 h-4 text-[#023927] flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
