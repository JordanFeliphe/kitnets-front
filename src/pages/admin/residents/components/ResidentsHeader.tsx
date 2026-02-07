import React, { useState } from 'react';
import { Plus, Download, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu';
import CreateResidentModal from './CreateResidentModal';
import { useExportResidents } from '../hooks/useResidents';
import { ResidentsFilters } from '../types/residents.types';

interface ResidentsHeaderProps {
  totalResidents?: number;
  filters: ResidentsFilters;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const ResidentsHeader: React.FC<ResidentsHeaderProps> = ({
  totalResidents = 0,
  filters,
  onRefresh,
  refreshing = false,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const exportMutation = useExportResidents();

  const handleExport = () => {
    exportMutation.mutate(filters);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Residents</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage building residents and their access permissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}

          {/* Export Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={exportMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                {exportMutation.isPending ? 'Exporting...' : 'Export'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                Export Current View (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Export All Residents (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Resident Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resident
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Total Residents:</span>
          <span className="font-medium text-foreground">{totalResidents.toLocaleString()}</span>
        </div>

        {(filters.search || filters.status) && (
          <>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span>Filtered results</span>
              {filters.search && (
                <span className="px-2 py-1 bg-muted rounded text-xs">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.status && (
                <span className="px-2 py-1 bg-muted rounded text-xs">
                  Status: {filters.status}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Resident Modal */}
      <CreateResidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ResidentsHeader;