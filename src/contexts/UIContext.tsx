import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LoadingState } from '@/types';

interface ModalState {
  isOpen: boolean;
  type: string | null;
  props: Record<string, any>;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebar: {
    isOpen: boolean;
    isCollapsed: boolean;
  };
  modal: ModalState;
  drawer: {
    isOpen: boolean;
    type: string | null;
    props: Record<string, any>;
  };
  loading: {
    global: LoadingState;
    components: Record<string, LoadingState>;
  };
  filters: {
    [key: string]: Record<string, any>;
  };
  preferences: {
    tablePageSize: number;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    compactMode: boolean;
  };
}

type UIAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'OPEN_MODAL'; payload: { type: string; props?: Record<string, any> } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'OPEN_DRAWER'; payload: { type: string; props?: Record<string, any> } }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'SET_GLOBAL_LOADING'; payload: LoadingState }
  | { type: 'SET_COMPONENT_LOADING'; payload: { component: string; state: LoadingState } }
  | { type: 'SET_FILTER'; payload: { key: string; filter: Record<string, any> } }
  | { type: 'CLEAR_FILTER'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UIState['preferences']> };

const initialState: UIState = {
  theme: 'system',
  sidebar: {
    isOpen: true,
    isCollapsed: false,
  },
  modal: {
    isOpen: false,
    type: null,
    props: {},
  },
  drawer: {
    isOpen: false,
    type: null,
    props: {},
  },
  loading: {
    global: { isLoading: false },
    components: {},
  },
  filters: {},
  preferences: {
    tablePageSize: 10,
    currency: 'BRL',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '24h',
    compactMode: false,
  },
};

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen },
      };
    case 'SET_SIDEBAR_COLLAPSED':
      return {
        ...state,
        sidebar: { ...state.sidebar, isCollapsed: action.payload },
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        modal: {
          isOpen: true,
          type: action.payload.type,
          props: action.payload.props || {},
        },
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: { isOpen: false, type: null, props: {} },
      };
    case 'OPEN_DRAWER':
      return {
        ...state,
        drawer: {
          isOpen: true,
          type: action.payload.type,
          props: action.payload.props || {},
        },
      };
    case 'CLOSE_DRAWER':
      return {
        ...state,
        drawer: { isOpen: false, type: null, props: {} },
      };
    case 'SET_GLOBAL_LOADING':
      return {
        ...state,
        loading: { ...state.loading, global: action.payload },
      };
    case 'SET_COMPONENT_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          components: {
            ...state.loading.components,
            [action.payload.component]: action.payload.state,
          },
        },
      };
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.filter,
        },
      };
    case 'CLEAR_FILTER':
      const newFilters = { ...state.filters };
      delete newFilters[action.payload];
      return { ...state, filters: newFilters };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    default:
      return state;
  }
};

interface UIContextType extends UIState {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (type: string, props?: Record<string, any>) => void;
  closeModal: () => void;
  openDrawer: (type: string, props?: Record<string, any>) => void;
  closeDrawer: () => void;
  setGlobalLoading: (state: LoadingState) => void;
  setComponentLoading: (component: string, state: LoadingState) => void;
  isComponentLoading: (component: string) => boolean;
  setFilter: (key: string, filter: Record<string, any>) => void;
  getFilter: (key: string) => Record<string, any> | undefined;
  clearFilter: (key: string) => void;
  updatePreferences: (preferences: Partial<UIState['preferences']>) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('ui_theme', theme);
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
    localStorage.setItem('sidebar_collapsed', JSON.stringify(collapsed));
  };

  const openModal = (type: string, props?: Record<string, any>) => {
    dispatch({ type: 'OPEN_MODAL', payload: { type, props } });
  };

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const openDrawer = (type: string, props?: Record<string, any>) => {
    dispatch({ type: 'OPEN_DRAWER', payload: { type, props } });
  };

  const closeDrawer = () => {
    dispatch({ type: 'CLOSE_DRAWER' });
  };

  const setGlobalLoading = (loadingState: LoadingState) => {
    dispatch({ type: 'SET_GLOBAL_LOADING', payload: loadingState });
  };

  const setComponentLoading = (component: string, loadingState: LoadingState) => {
    dispatch({ type: 'SET_COMPONENT_LOADING', payload: { component, state: loadingState } });
  };

  const isComponentLoading = (component: string): boolean => {
    return state.loading.components[component]?.isLoading || false;
  };

  const setFilter = (key: string, filter: Record<string, any>) => {
    dispatch({ type: 'SET_FILTER', payload: { key, filter } });
    localStorage.setItem(`filter_${key}`, JSON.stringify(filter));
  };

  const getFilter = (key: string): Record<string, any> | undefined => {
    return state.filters[key];
  };

  const clearFilter = (key: string) => {
    dispatch({ type: 'CLEAR_FILTER', payload: key });
    localStorage.removeItem(`filter_${key}`);
  };

  const updatePreferences = (preferences: Partial<UIState['preferences']>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    localStorage.setItem('ui_preferences', JSON.stringify({ ...state.preferences, ...preferences }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: state.preferences.currency,
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (state.preferences.dateFormat) {
      case 'dd/MM/yyyy':
        options.day = '2-digit';
        options.month = '2-digit';
        options.year = 'numeric';
        break;
      case 'MM/dd/yyyy':
        options.month = '2-digit';
        options.day = '2-digit';
        options.year = 'numeric';
        break;
      case 'yyyy-MM-dd':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      default:
        options.day = '2-digit';
        options.month = '2-digit';
        options.year = 'numeric';
    }

    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: state.preferences.timeFormat === '12h',
    }).format(date);
  };

  // Initialize from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('ui_theme') as 'light' | 'dark' | 'system';
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }

    const savedCollapsed = localStorage.getItem('sidebar_collapsed');
    if (savedCollapsed) {
      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: JSON.parse(savedCollapsed) });
    }

    const savedPreferences = localStorage.getItem('ui_preferences');
    if (savedPreferences) {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: JSON.parse(savedPreferences) });
    }

    // Load saved filters
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        const filter = JSON.parse(localStorage.getItem(key) || '{}');
        dispatch({ type: 'SET_FILTER', payload: { key: filterKey, filter } });
      }
    });
  }, []);

  const value: UIContextType = {
    ...state,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    openModal,
    closeModal,
    openDrawer,
    closeDrawer,
    setGlobalLoading,
    setComponentLoading,
    isComponentLoading,
    setFilter,
    getFilter,
    clearFilter,
    updatePreferences,
    formatCurrency,
    formatDate,
    formatTime,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};