import { useState, useRef, useEffect, useCallback } from 'react';
import { useAddressSearch } from '../hooks/useAddressSearch';
import { useClickOutside } from '../hooks/useClickOutside';
import type { Address } from '../types/address';
import { AddressList } from './AddressList';
import './AddressAutocomplete.css';

interface AddressAutocompleteProps {
  onSelect?: (address: Address) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Main autocomplete component for address search
 */
export function AddressAutocomplete({
  onSelect,
  placeholder = 'Search for an address...',
  className = '',
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const justSelectedRef = useRef(false);

  const { results, loading, error, search, clearError } = useAddressSearch();

  // Close dropdown when clicking outside
  useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  });

  // Update search when input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      search(value);
      setIsOpen(true);
      setHighlightedIndex(-1);
      clearError();
    },
    [search, clearError]
  );

  // Handle address selection
  const handleSelect = useCallback(
    (address: Address) => {
      justSelectedRef.current = true;
      const displayValue = `${address.street} ${address.municipalityNumber}, ${address.postNumber}, ${address.municipality}`;
      setInputValue(displayValue);
      setIsOpen(false);
      setHighlightedIndex(-1);
      if (onSelect) {
        onSelect(address);
      }
    },
    [onSelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || results.length === 0) {
        if (e.key === 'Enter' && inputValue.trim().length >= 3) {
          // Reopen dropdown if Enter is pressed and we have a query
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < results.length) {
            handleSelect(results[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [isOpen, results, highlightedIndex, handleSelect, inputValue]
  );

  // Handle input focus
  const handleFocus = useCallback(() => {
    if (results.length > 0 || inputValue.trim().length >= 3) {
      setIsOpen(true);
    }
  }, [results.length, inputValue]);

  // Handle clear button
  const handleClear = useCallback(() => {
    setInputValue('');
    search('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    clearError();
    inputRef.current?.focus();
  }, [search, clearError]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.address-list-item');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex]);

  // Update isOpen based on results
  useEffect(() => {
    // Don't open if we just selected a value
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    // Otherwise, open if there are results or the input value is at least 3 characters
    if (results.length > 0 && inputValue.trim().length >= 3) {
      setIsOpen(true);
    } else if (results.length === 0 && !loading && inputValue.trim().length >= 3) {
      // Keep open to show "no results" state if needed
      setIsOpen(true);
    }
  }, [results.length, loading, inputValue]);

  const showResults = isOpen && results.length > 0;
  const showNoResults = isOpen && results.length === 0 && !loading && inputValue.trim().length >= 3;

  return (
    <div
      ref={containerRef}
      className={`address-autocomplete ${className}`}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <div className="address-autocomplete__input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="address-autocomplete__input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls="address-list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `address-option-${highlightedIndex}`
              : undefined
          }
        />
        {loading && (
          <span
            className="address-autocomplete__loading"
            aria-label="Loading results"
          >
            <span className="address-autocomplete__spinner"></span>
          </span>
        )}
        {inputValue && !loading && (
          <button
            type="button"
            className="address-autocomplete__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            &#215;
          </button>
        )}
      </div>
      {error && (
        <div className="address-autocomplete__error" role="alert">
          {error}
        </div>
      )}
      {showResults && (
        <AddressList
          addresses={results}
          onSelect={handleSelect}
          highlightedIndex={highlightedIndex}
        />
      )}
      {showNoResults && (
        <div className="address-autocomplete__no-results">
          No results found
        </div>
      )}
    </div>
  );
}

