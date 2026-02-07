import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/app/shared/components/ui/input';
import { Button } from '@/app/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/components/ui/select';
import { Card, CardContent } from '@/app/shared/components/ui/card';
import { ResidentsFiltersProps } from '../types/residents.types';

const ResidentsFilters: React.FC<ResidentsFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false,
}) => {
  const hasActiveFilters = filters.search || filters.status;

  const handleClearFilters = () => {
    onFiltersChange({
      ...filters,
      search: '',
      status: '',
      page: 1, // Reset to first page when clearing filters
    });
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value,
      page: 1, // Reset to first page when searching
    });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? '' : value,
      page: 1, // Reset to first page when filtering
    });
  };

  const handleLimitChange = (value: string) => {
    onFiltersChange({
      ...filters,
      limit: parseInt(value),
      page: 1, // Reset to first page when changing limit
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Top row: Search and Clear button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter Residents</span>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or CPF..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select
                value={filters.status || 'all'}
                onValueChange={handleStatusChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="INACTIVE">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      Inactive
                    </div>
                  </SelectItem>
                  <SelectItem value="BLOCKED">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Blocked
                    </div>
                  </SelectItem>
                  <SelectItem value="TRASH">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Deleted
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items per page */}
            <div>
              <Select
                value={filters.limit.toString()}
                onValueChange={handleLimitChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-muted-foreground">Active filters:</span>
              {filters.search && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.status && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                  Status: {filters.status}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResidentsFilters;