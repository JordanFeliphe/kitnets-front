import { useState, useCallback, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc';

interface SortConfig {
  key: string;
  order: SortOrder;
}

interface UseSortingOptions {
  initialSortKey?: string;
  initialSortOrder?: SortOrder;
}

interface UseSortingReturn<T> {
  sortConfig: SortConfig | null;
  sortedData: T[];
  requestSort: (key: string) => void;
  getSortOrder: (key: string) => SortOrder | null;
  isSorted: (key: string) => boolean;
  clearSort: () => void;
}

const getSortValue = (item: any, key: string): any => {
  // Handle nested keys (e.g., 'user.name')
  const keys = key.split('.');
  let value = item;
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

const compareValues = (a: any, b: any, order: SortOrder): number => {
  // Handle null/undefined values
  if (a == null && b == null) return 0;
  if (a == null) return order === 'asc' ? -1 : 1;
  if (b == null) return order === 'asc' ? 1 : -1;
  
  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    const diff = a.getTime() - b.getTime();
    return order === 'asc' ? diff : -diff;
  }
  
  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    const diff = a - b;
    return order === 'asc' ? diff : -diff;
  }
  
  // Handle strings (case-insensitive)
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  
  if (aStr < bStr) {
    return order === 'asc' ? -1 : 1;
  }
  if (aStr > bStr) {
    return order === 'asc' ? 1 : -1;
  }
  
  return 0;
};

export const useSorting = <T>({ 
  initialSortKey, 
  initialSortOrder = 'asc' 
}: UseSortingOptions = {}): UseSortingReturn<T> => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    initialSortKey ? { key: initialSortKey, order: initialSortOrder } : null
  );
  
  const [data, setData] = useState<T[]>([]);

  const requestSort = useCallback((key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig && prevConfig.key === key) {
        // Toggle order if same key
        return {
          key,
          order: prevConfig.order === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // New key, default to ascending
        return {
          key,
          order: 'asc',
        };
      }
    });
  }, []);

  const getSortOrder = useCallback((key: string): SortOrder | null => {
    return sortConfig?.key === key ? sortConfig.order : null;
  }, [sortConfig]);

  const isSorted = useCallback((key: string): boolean => {
    return sortConfig?.key === key;
  }, [sortConfig]);

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  // This is a placeholder for the sorted data
  // The actual data sorting should be handled by the consuming component
  // This hook provides the sorting configuration and utilities
  const sortedData = useMemo(() => {
    if (!sortConfig || data.length === 0) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);
      
      return compareValues(aValue, bValue, sortConfig.order);
    });
  }, [data, sortConfig]);

  // Expose internal data setter for use cases where sorting is needed
  const setSortingData = useCallback((newData: T[]) => {
    setData(newData);
  }, []);

  return {
    sortConfig,
    sortedData,
    requestSort,
    getSortOrder,
    isSorted,
    clearSort,
    // Internal method for setting data - should be used carefully
    setSortingData: setSortingData as any,
  };
};

// Utility hook for sorting data directly
export const useSortedData = <T>(
  data: T[], 
  options: UseSortingOptions = {}
): UseSortingReturn<T> => {
  const sorting = useSorting<T>(options);
  
  const sortedData = useMemo(() => {
    if (!sorting.sortConfig || data.length === 0) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getSortValue(a, sorting.sortConfig!.key);
      const bValue = getSortValue(b, sorting.sortConfig!.key);
      
      return compareValues(aValue, bValue, sorting.sortConfig!.order);
    });
  }, [data, sorting.sortConfig]);

  return {
    ...sorting,
    sortedData,
  };
};