'use client';

import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  const debouncedSearch = useDebouncedCallback((val: string) => {
    onSearch(val);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    debouncedSearch(val);
  };

  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500  dark:text-gray-400" />
      <Input
        type="search"
        placeholder="Search packages..."
        className="pl-8 bg-zinc-100 border border-zinc-500 ring-0 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}