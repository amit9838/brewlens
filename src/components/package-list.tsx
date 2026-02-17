'use client';

import { useState, useMemo } from 'react';
import { PackageType, Formula, Cask } from '@/src/types/homebrew';
import { SearchBar } from './search-bar';
import PackageCard  from './package-card';
import { Switch } from './ui/switch';
import { Pagination } from './ui/pagination';

const ITEMS_PER_PAGE = 20;

interface PackageListProps {
  initialFormulae: Formula[];
  initialCasks: Cask[];
}

export function PackageList({ initialFormulae, initialCasks }: PackageListProps) {
  const [type, setType] = useState<PackageType>('formula');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = type === 'formula' ? initialFormulae : initialCasks;

  // Filter by search term (token/name/description)
  const filteredData = useMemo(() => {
    if (!search) return currentData;
    const lowerSearch = search.toLowerCase();
    return currentData.filter(item => {
      if (type === 'formula') {
        const f = item as Formula;
        return f.name.toLowerCase().includes(lowerSearch) ||
          (f.desc?.toLowerCase().includes(lowerSearch) ?? false);
      } else {
        const c = item as Cask;
        return c.token.toLowerCase().includes(lowerSearch) ||
          c.name.some(n => n.toLowerCase().includes(lowerSearch)) ||
          (c.desc?.toLowerCase().includes(lowerSearch) ?? false);
      }
    });
  }, [currentData, search, type]);

  // Paginate
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset page when search or type changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (newType: PackageType) => {
    setType(newType);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with switcher and search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {type === 'formula' ? 'Formulae' : 'Casks'}
          </span>
          <Switch
            checked={type === 'cask'}
            onCheckedChange={(checked) => handleTypeChange(checked ? 'cask' : 'formula')}
            aria-label="Toggle between formulae and casks"
          />
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedData.length} of {filteredData.length} packages
      </div>

      {/* Package grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((item) => (
          <PackageCard key={type === 'formula' ? (item as Formula).name : (item as Cask).token}
            data={item}
            type={type} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}