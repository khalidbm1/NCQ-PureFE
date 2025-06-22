'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'map' | 'custom';
  title: string;
  dataSource: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isVisible: boolean;
  refreshInterval?: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'date' | 'select' | 'multiselect' | 'text' | 'number';
  value: any;
  options?: Array<{ label: string; value: any }>;
}

interface DashboardContextType {
  currentLayout: DashboardLayout | null;
  layouts: DashboardLayout[];
  filters: DashboardFilter[];
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Layout management
  loadLayout: (layoutId: string) => Promise<void>;
  saveLayout: (layout: DashboardLayout) => Promise<void>;
  createLayout: (name: string, description?: string) => Promise<string>;
  deleteLayout: (layoutId: string) => Promise<void>;
  duplicateLayout: (layoutId: string, newName: string) => Promise<string>;
  
  // Widget management
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (widgetId: string) => void;
  moveWidget: (widgetId: string, position: DashboardWidget['position']) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  
  // Filter management
  updateFilter: (filterId: string, value: any) => void;
  addFilter: (filter: Omit<DashboardFilter, 'id'>) => void;
  removeFilter: (filterId: string) => void;
  clearAllFilters: () => void;
  getFilterValue: (filterId: string) => any;
  
  // UI state
  setEditMode: (enabled: boolean) => void;
  refreshDashboard: () => Promise<void>;
  exportDashboard: (format: 'pdf' | 'png' | 'json') => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Default dashboard layout
const defaultLayout: DashboardLayout = {
  id: 'default',
  name: 'Overview Dashboard',
  description: 'Main overview dashboard with key metrics and charts',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  widgets: [
    {
      id: 'total-users',
      type: 'metric',
      title: 'Total Users',
      dataSource: 'total_users',
      config: {
        format: 'number',
        showChange: true,
        color: 'blue',
      },
      position: { x: 0, y: 0, width: 3, height: 2 },
      isVisible: true,
    },
    {
      id: 'active-sessions',
      type: 'metric',
      title: 'Active Sessions',
      dataSource: 'active_sessions',
      config: {
        format: 'number',
        showChange: true,
        color: 'green',
      },
      position: { x: 3, y: 0, width: 3, height: 2 },
      isVisible: true,
    },
    {
      id: 'total-revenue',
      type: 'metric',
      title: 'Total Revenue',
      dataSource: 'total_revenue',
      config: {
        format: 'currency',
        showChange: true,
        color: 'purple',
      },
      position: { x: 6, y: 0, width: 3, height: 2 },
      isVisible: true,
    },
    {
      id: 'conversion-rate',
      type: 'metric',
      title: 'Conversion Rate',
      dataSource: 'conversion_rate',
      config: {
        format: 'percentage',
        showChange: true,
        color: 'orange',
      },
      position: { x: 9, y: 0, width: 3, height: 2 },
      isVisible: true,
    },
    {
      id: 'user-trend-chart',
      type: 'chart',
      title: 'User Growth Trend',
      dataSource: 'total_users',
      config: {
        chartType: 'line',
        timeRange: '30d',
        showPoints: true,
        color: '#3b82f6',
      },
      position: { x: 0, y: 2, width: 6, height: 4 },
      isVisible: true,
    },
    {
      id: 'revenue-chart',
      type: 'chart',
      title: 'Revenue Over Time',
      dataSource: 'total_revenue',
      config: {
        chartType: 'area',
        timeRange: '30d',
        gradient: true,
        color: '#10b981',
      },
      position: { x: 6, y: 2, width: 6, height: 4 },
      isVisible: true,
    },
    {
      id: 'service-status',
      type: 'table',
      title: 'Service Status',
      dataSource: 'services',
      config: {
        columns: ['name', 'status', 'uptime', 'errorRate'],
        sortBy: 'status',
        showSearch: true,
      },
      position: { x: 0, y: 6, width: 8, height: 4 },
      isVisible: true,
    },
    {
      id: 'performance-metrics',
      type: 'metric',
      title: 'Performance Metrics',
      dataSource: 'performance',
      config: {
        metrics: ['avg_response_time', 'api_requests'],
        layout: 'vertical',
      },
      position: { x: 8, y: 6, width: 4, height: 4 },
      isVisible: true,
    },
  ],
};

const defaultFilters: DashboardFilter[] = [
  {
    id: 'date-range',
    name: 'Date Range',
    type: 'date',
    value: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
  },
  {
    id: 'service-filter',
    name: 'Service',
    type: 'multiselect',
    value: [],
    options: [
      { label: 'Authentication', value: 'auth' },
      { label: 'Payment Gateway', value: 'payment' },
      { label: 'IoT Platform', value: 'iot' },
      { label: 'Hospital Management', value: 'hospital' },
      { label: 'Blockchain', value: 'blockchain' },
      { label: 'Smart Hospitality', value: 'hospitality' },
    ],
  },
];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [filters, setFilters] = useState<DashboardFilter[]>(defaultFilters);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with default layout
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        
        // Load saved layouts from localStorage or API
        const savedLayouts = localStorage.getItem('ncq_dashboard_layouts');
        if (savedLayouts) {
          const parsedLayouts = JSON.parse(savedLayouts);
          setLayouts(parsedLayouts);
          
          // Load the last used layout or default
          const lastUsedLayoutId = localStorage.getItem('ncq_last_layout_id');
          const layoutToLoad = parsedLayouts.find((l: DashboardLayout) => l.id === lastUsedLayoutId) || parsedLayouts[0];
          setCurrentLayout(layoutToLoad);
        } else {
          // First time, use default layout
          setLayouts([defaultLayout]);
          setCurrentLayout(defaultLayout);
          localStorage.setItem('ncq_dashboard_layouts', JSON.stringify([defaultLayout]));
        }
      } catch (err) {
        setError('Failed to load dashboard layouts');
        console.error('Dashboard initialization error:', err);
        // Fallback to default
        setLayouts([defaultLayout]);
        setCurrentLayout(defaultLayout);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Save layouts to localStorage whenever they change
  useEffect(() => {
    if (layouts.length > 0) {
      localStorage.setItem('ncq_dashboard_layouts', JSON.stringify(layouts));
    }
  }, [layouts]);

  // Save current layout ID whenever it changes
  useEffect(() => {
    if (currentLayout) {
      localStorage.setItem('ncq_last_layout_id', currentLayout.id);
    }
  }, [currentLayout]);

  const loadLayout = async (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setCurrentLayout(layout);
    } else {
      throw new Error(`Layout with ID ${layoutId} not found`);
    }
  };

  const saveLayout = async (layout: DashboardLayout) => {
    const updatedLayout = {
      ...layout,
      updatedAt: new Date().toISOString(),
    };

    setLayouts(prev => {
      const index = prev.findIndex(l => l.id === layout.id);
      if (index >= 0) {
        const newLayouts = [...prev];
        newLayouts[index] = updatedLayout;
        return newLayouts;
      } else {
        return [...prev, updatedLayout];
      }
    });

    if (currentLayout?.id === layout.id) {
      setCurrentLayout(updatedLayout);
    }
  };

  const createLayout = async (name: string, description?: string): Promise<string> => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name,
      description,
      widgets: [],
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLayouts(prev => [...prev, newLayout]);
    return newLayout.id;
  };

  const deleteLayout = async (layoutId: string) => {
    if (layouts.length <= 1) {
      throw new Error('Cannot delete the last remaining layout');
    }

    setLayouts(prev => prev.filter(l => l.id !== layoutId));
    
    if (currentLayout?.id === layoutId) {
      // Switch to the first available layout
      const remainingLayouts = layouts.filter(l => l.id !== layoutId);
      setCurrentLayout(remainingLayouts[0]);
    }
  };

  const duplicateLayout = async (layoutId: string, newName: string): Promise<string> => {
    const sourceLayout = layouts.find(l => l.id === layoutId);
    if (!sourceLayout) {
      throw new Error(`Layout with ID ${layoutId} not found`);
    }

    const newLayout: DashboardLayout = {
      ...sourceLayout,
      id: `layout-${Date.now()}`,
      name: newName,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      widgets: sourceLayout.widgets.map(widget => ({
        ...widget,
        id: `${widget.id}-${Date.now()}`,
      })),
    };

    setLayouts(prev => [...prev, newLayout]);
    return newLayout.id;
  };

  const addWidget = (widget: Omit<DashboardWidget, 'id'>) => {
    if (!currentLayout) return;

    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
    };

    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget],
    };

    saveLayout(updatedLayout);
  };

  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      ),
    };

    saveLayout(updatedLayout);
  };

  const removeWidget = (widgetId: string) => {
    if (!currentLayout) return;

    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(widget => widget.id !== widgetId),
    };

    saveLayout(updatedLayout);
  };

  const moveWidget = (widgetId: string, position: DashboardWidget['position']) => {
    updateWidget(widgetId, { position });
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    if (!currentLayout) return;

    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { isVisible: !widget.isVisible });
    }
  };

  const updateFilter = (filterId: string, value: any) => {
    setFilters(prev =>
      prev.map(filter =>
        filter.id === filterId ? { ...filter, value } : filter
      )
    );
  };

  const addFilter = (filter: Omit<DashboardFilter, 'id'>) => {
    const newFilter: DashboardFilter = {
      ...filter,
      id: `filter-${Date.now()}`,
    };

    setFilters(prev => [...prev, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== filterId));
  };

  const clearAllFilters = () => {
    setFilters(prev =>
      prev.map(filter => ({
        ...filter,
        value: filter.type === 'multiselect' ? [] : null,
      }))
    );
  };

  const getFilterValue = (filterId: string): any => {
    const filter = filters.find(f => f.id === filterId);
    return filter?.value;
  };

  const refreshDashboard = async () => {
    if (currentLayout) {
      // Trigger refresh of all widgets
      const updatedLayout = {
        ...currentLayout,
        updatedAt: new Date().toISOString(),
      };
      setCurrentLayout(updatedLayout);
    }
  };

  const exportDashboard = async (format: 'pdf' | 'png' | 'json') => {
    if (!currentLayout) return;

    switch (format) {
      case 'json':
        const dataStr = JSON.stringify(currentLayout, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${currentLayout.name}-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        break;
        
      case 'pdf':
      case 'png':
        // These would use html2canvas and jsPDF in a real implementation
        console.log(`Exporting dashboard as ${format}`);
        break;
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        currentLayout,
        layouts,
        filters,
        isEditMode,
        isLoading,
        error,
        loadLayout,
        saveLayout,
        createLayout,
        deleteLayout,
        duplicateLayout,
        addWidget,
        updateWidget,
        removeWidget,
        moveWidget,
        toggleWidgetVisibility,
        updateFilter,
        addFilter,
        removeFilter,
        clearAllFilters,
        getFilterValue,
        setEditMode,
        refreshDashboard,
        exportDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}