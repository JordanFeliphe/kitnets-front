import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
  maxVisiblePages?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  
  // Navigation
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  
  // Utilities
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  visiblePages: number[];
  
  // Page size control
  changePageSize: (newSize: number) => void;
  
  // Info
  getItemsInfo: () => {
    start: number;
    end: number;
    total: number;
  };
}

export const usePagination = ({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
  maxVisiblePages = 5,
}: UsePaginationOptions): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems);
  }, [startIndex, pageSize, totalItems]);

  const canGoToPrevious = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const canGoToNext = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we don't have enough pages on one side
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (canGoToNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [canGoToNext]);

  const goToPreviousPage = useCallback(() => {
    if (canGoToPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [canGoToPrevious]);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    // Adjust current page to maintain position as much as possible
    const currentFirstItem = (currentPage - 1) * pageSize + 1;
    const newPage = Math.ceil(currentFirstItem / newSize);
    setCurrentPage(newPage);
  }, [currentPage, pageSize]);

  const getItemsInfo = useCallback(() => {
    return {
      start: totalItems === 0 ? 0 : startIndex + 1,
      end: endIndex,
      total: totalItems,
    };
  }, [startIndex, endIndex, totalItems]);

  // Reset to first page when total items change significantly
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    itemsPerPage: pageSize,
    startIndex,
    endIndex,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    canGoToPrevious,
    canGoToNext,
    visiblePages,
    changePageSize,
    getItemsInfo,
  };
};