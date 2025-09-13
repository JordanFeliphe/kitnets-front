import { useState, useEffect, useCallback } from 'react';
import { Unit, UnitFilter, CreateUnitForm, UnitStatus } from '@/types';
import { unitService } from '@/services/unitService';
import { useNotifications } from '@/contexts/NotificationContext';
import { useUI } from '@/contexts/UIContext';

interface UseUnitsReturn {
  units: Unit[];
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;

  // CRUD operations
  fetchUnits: (filter?: UnitFilter) => Promise<void>;
  createUnit: (unitData: CreateUnitForm) => Promise<void>;
  updateUnit: (id: string, unitData: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  getUnitById: (id: string) => Unit | undefined;
  getUnitByCode: (code: string) => Promise<Unit | null>;

  // Bulk operations
  bulkUpdateStatus: (unitIds: string[], status: UnitStatus) => Promise<void>;

  // Search and filter
  searchUnits: (query: string) => Promise<void>;
  filterUnits: (filter: UnitFilter) => void;
  clearFilters: () => void;

  // Utility functions
  getAvailableUnits: () => Unit[];
  getOccupiedUnits: () => Unit[];
  getUnitsByFloor: (floor: number) => Unit[];
  getUnitsByStatus: (status: UnitStatus) => Unit[];
  refreshUnits: () => Promise<void>;

  // Image management
  addUnitImage: (unitId: string, imageUrl: string) => Promise<void>;
  removeUnitImage: (unitId: string, imageUrl: string) => Promise<void>;

  // Statistics
  unitStats: {
    total: number;
    byStatus: Record<UnitStatus, number>;
    byFloor: Record<number, number>;
    occupancyRate: number;
    averageRent: number;
    totalMonthlyRevenue: number;
  } | null;
  fetchUnitStats: () => Promise<void>;
}

export const useUnits = (initialFilter?: UnitFilter): UseUnitsReturn => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseUnitsReturn['meta']>(null);
  const [currentFilter, setCurrentFilter] = useState<UnitFilter>(initialFilter || {});
  const [unitStats, setUnitStats] = useState<UseUnitsReturn['unitStats']>(null);

  const { success, error: showError } = useNotifications();
  const { setComponentLoading } = useUI();

  const fetchUnits = useCallback(async (filter: UnitFilter = currentFilter) => {
    setLoading(true);
    setError(null);
    setComponentLoading('units-table', { isLoading: true, message: 'Carregando unidades...' });

    try {
      const response = await unitService.getUnits(filter);
      
      if (response.success) {
        setUnits(response.data);
        setMeta(response.meta || null);
        setCurrentFilter(filter);
      } else {
        setError(response.message);
        showError('Erro ao carregar unidades', response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao carregar unidades';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
      setComponentLoading('units-table', { isLoading: false });
    }
  }, [currentFilter, showError, setComponentLoading]);

  const createUnit = useCallback(async (unitData: CreateUnitForm) => {
    setLoading(true);
    setError(null);

    try {
      const response = await unitService.createUnit(unitData);
      
      if (response.success) {
        await fetchUnits(); // Refresh the list
        success('Unidade criada', `Unidade ${response.data.code} foi criada com sucesso`);
      } else {
        setError(response.message);
        showError('Erro ao criar unidade', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao criar unidade';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUnits, success, showError]);

  const updateUnit = useCallback(async (id: string, unitData: Partial<Unit>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await unitService.updateUnit(id, unitData);
      
      if (response.success) {
        setUnits(prevUnits => 
          prevUnits.map(unit => unit.id === id ? response.data : unit)
        );
        success('Unidade atualizada', `Unidade ${response.data.code} foi atualizada com sucesso`);
      } else {
        setError(response.message);
        showError('Erro ao atualizar unidade', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao atualizar unidade';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const deleteUnit = useCallback(async (id: string) => {
    const unit = units.find(u => u.id === id);
    if (!unit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await unitService.deleteUnit(id);
      
      if (response.success) {
        setUnits(prevUnits => prevUnits.filter(u => u.id !== id));
        success('Unidade excluída', `Unidade ${unit.code} foi excluída com sucesso`);
      } else {
        setError(response.message);
        showError('Erro ao excluir unidade', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao excluir unidade';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [units, success, showError]);

  const getUnitById = useCallback((id: string) => {
    return units.find(unit => unit.id === id);
  }, [units]);

  const getUnitByCode = useCallback(async (code: string): Promise<Unit | null> => {
    try {
      const response = await unitService.getUnitByCode(code);
      return response.success ? response.data : null;
    } catch (err) {
      return null;
    }
  }, []);

  const bulkUpdateStatus = useCallback(async (unitIds: string[], status: UnitStatus) => {
    setLoading(true);
    setError(null);

    try {
      const response = await unitService.bulkUpdateStatus(unitIds, status);
      
      if (response.success) {
        // Update local state
        setUnits(prevUnits =>
          prevUnits.map(unit =>
            unitIds.includes(unit.id) ? { ...unit, status, updatedAt: new Date() } : unit
          )
        );
        success('Status atualizado', `${response.data.length} unidades foram atualizadas`);
      } else {
        setError(response.message);
        showError('Erro ao atualizar status', response.errors?.join(', ') || response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado ao atualizar status';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  const searchUnits = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchUnits({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await unitService.searchUnits(query);
      
      if (response.success) {
        setUnits(response.data);
        setMeta(null); // Search doesn't return pagination meta
      } else {
        setError(response.message);
        showError('Erro na busca', response.message);
      }
    } catch (err) {
      const errorMessage = 'Erro inesperado na busca';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchUnits, showError]);

  const filterUnits = useCallback((filter: UnitFilter) => {
    setCurrentFilter(filter);
    fetchUnits(filter);
  }, [fetchUnits]);

  const clearFilters = useCallback(() => {
    const emptyFilter: UnitFilter = {};
    setCurrentFilter(emptyFilter);
    fetchUnits(emptyFilter);
  }, [fetchUnits]);

  const getAvailableUnits = useCallback(() => {
    return units.filter(unit => unit.status === 'AVAILABLE');
  }, [units]);

  const getOccupiedUnits = useCallback(() => {
    return units.filter(unit => unit.status === 'OCCUPIED');
  }, [units]);

  const getUnitsByFloor = useCallback((floor: number) => {
    return units.filter(unit => unit.floor === floor);
  }, [units]);

  const getUnitsByStatus = useCallback((status: UnitStatus) => {
    return units.filter(unit => unit.status === status);
  }, [units]);

  const refreshUnits = useCallback(async () => {
    await fetchUnits(currentFilter);
  }, [fetchUnits, currentFilter]);

  const addUnitImage = useCallback(async (unitId: string, imageUrl: string) => {
    try {
      const response = await unitService.addUnitImage(unitId, imageUrl);
      
      if (response.success) {
        setUnits(prevUnits =>
          prevUnits.map(unit => unit.id === unitId ? response.data : unit)
        );
        success('Imagem adicionada', 'Imagem foi adicionada à unidade');
      } else {
        showError('Erro ao adicionar imagem', response.message);
      }
    } catch (err) {
      showError('Erro', 'Erro inesperado ao adicionar imagem');
    }
  }, [success, showError]);

  const removeUnitImage = useCallback(async (unitId: string, imageUrl: string) => {
    try {
      const response = await unitService.removeUnitImage(unitId, imageUrl);
      
      if (response.success) {
        setUnits(prevUnits =>
          prevUnits.map(unit => unit.id === unitId ? response.data : unit)
        );
        success('Imagem removida', 'Imagem foi removida da unidade');
      } else {
        showError('Erro ao remover imagem', response.message);
      }
    } catch (err) {
      showError('Erro', 'Erro inesperado ao remover imagem');
    }
  }, [success, showError]);

  const fetchUnitStats = useCallback(async () => {
    try {
      const response = await unitService.getUnitStats();
      
      if (response.success) {
        setUnitStats(response.data);
      } else {
        showError('Erro ao carregar estatísticas', response.message);
      }
    } catch (err) {
      showError('Erro', 'Erro inesperado ao carregar estatísticas');
    }
  }, [showError]);

  // Load units on mount
  useEffect(() => {
    fetchUnits(currentFilter);
  }, []); // Only run on mount

  // Load stats on mount
  useEffect(() => {
    fetchUnitStats();
  }, []);

  return {
    units,
    loading,
    error,
    meta,
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    getUnitById,
    getUnitByCode,
    bulkUpdateStatus,
    searchUnits,
    filterUnits,
    clearFilters,
    getAvailableUnits,
    getOccupiedUnits,
    getUnitsByFloor,
    getUnitsByStatus,
    refreshUnits,
    addUnitImage,
    removeUnitImage,
    unitStats,
    fetchUnitStats,
  };
};