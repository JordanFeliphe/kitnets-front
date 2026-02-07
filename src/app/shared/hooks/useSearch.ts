import React from 'react';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T | string)[];
  debounceMs?: number;
  caseSensitive?: boolean;
  exactMatch?: boolean;
  highlightMatches?: boolean;
}

interface UseSearchReturn<T> {
  searchTerm: string;
  filteredData: T[];
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
  matchCount: number;
  highlightText: (text: string, searchTerm?: string) => any;
}

const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

const normalizeSearchTerm = (term: string, caseSensitive: boolean): string => {
  return caseSensitive ? term : term.toLowerCase();
};

const highlightMatches = (text: string, searchTerm: string, caseSensitive: boolean): any => {
  if (!searchTerm.trim()) return text;
  
  const normalizedSearch = normalizeSearchTerm(searchTerm, caseSensitive);
  
  const parts = text.split(new RegExp(`(${escapeRegExp(searchTerm)})`, caseSensitive ? 'g' : 'gi'));
  
  return parts.map((part, index) => {
    const isMatch = normalizeSearchTerm(part, caseSensitive) === normalizedSearch;
    if (isMatch) {
      return React.createElement('mark', {
        key: index,
        className: 'bg-yellow-200 dark:bg-yellow-800 px-0.5 py-0 rounded'
      }, part);
    }
    return part;
  });
};

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const useSearch = <T>({
  data,
  searchFields,
  debounceMs = 300,
  caseSensitive = false,
  exactMatch = false,
  highlightMatches: enableHighlight = false,
}: UseSearchOptions<T>): UseSearchReturn<T> => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce search term
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, debounceMs]);

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return data;
    }

    const normalizedSearch = normalizeSearchTerm(debouncedSearchTerm, caseSensitive);

    return data.filter(item => {
      return searchFields.some(field => {
        const value = getNestedValue(item, field as string);
        
        if (value == null) return false;
        
        const stringValue = String(value);
        const normalizedValue = normalizeSearchTerm(stringValue, caseSensitive);
        
        if (exactMatch) {
          return normalizedValue === normalizedSearch;
        } else {
          return normalizedValue.includes(normalizedSearch);
        }
      });
    });
  }, [data, debouncedSearchTerm, searchFields, caseSensitive, exactMatch]);

  const matchCount = useMemo(() => {
    return filteredData.length;
  }, [filteredData]);

  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
  }, []);

  const highlightTextFunction = useCallback((
    text: string, 
    searchTermOverride?: string
  ): React.ReactNode => {
    if (!enableHighlight) return text;
    
    const termToUse = searchTermOverride || debouncedSearchTerm;
    return highlightMatches(text, termToUse, caseSensitive);
  }, [debouncedSearchTerm, caseSensitive, enableHighlight]);

  return {
    searchTerm,
    filteredData,
    setSearchTerm: updateSearchTerm,
    clearSearch,
    isSearching,
    matchCount,
    highlightText: highlightTextFunction,
  };
};

// Advanced search hook with multiple search modes
export const useAdvancedSearch = <T>(data: T[], searchFields: (keyof T | string)[]) => {
  const [searchMode, setSearchMode] = useState<'contains' | 'startsWith' | 'endsWith' | 'exact'>('contains');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const normalizedSearch = normalizeSearchTerm(searchTerm, caseSensitive);

    return data.filter(item => {
      return searchFields.some(field => {
        const value = getNestedValue(item, field as string);
        
        if (value == null) return false;
        
        const stringValue = String(value);
        const normalizedValue = normalizeSearchTerm(stringValue, caseSensitive);
        
        switch (searchMode) {
          case 'exact':
            return normalizedValue === normalizedSearch;
          case 'startsWith':
            return normalizedValue.startsWith(normalizedSearch);
          case 'endsWith':
            return normalizedValue.endsWith(normalizedSearch);
          case 'contains':
          default:
            return normalizedValue.includes(normalizedSearch);
        }
      });
    });
  }, [data, searchTerm, searchFields, searchMode, caseSensitive]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    searchMode,
    setSearchMode,
    caseSensitive,
    setCaseSensitive,
    clearSearch: () => setSearchTerm(''),
    matchCount: filteredData.length,
  };
};