
import React from 'react';

interface FiltersProps {
  onSearchChange: (val: string) => void;
  onSourceChange: (val: string) => void;
  onSubCategoryChange: (val: string) => void;
  sources: string[];
  subCategories: string[];
}

const Filters: React.FC<FiltersProps> = ({ 
  onSearchChange, 
  onSourceChange, 
  onSubCategoryChange, 
  sources, 
  subCategories 
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-grow w-full">
        <input
          type="text"
          placeholder="Rechercher un outil, SaaS..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <select 
          onChange={(e) => onSourceChange(e.target.value)}
          className="bg-white border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer"
        >
          <option value="">Toutes les sources</option>
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {subCategories.length > 0 && (
          <select 
            onChange={(e) => onSubCategoryChange(e.target.value)}
            className="bg-white border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer"
          >
            <option value="">Type d'outil</option>
            {subCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </select>
        )}
      </div>
    </div>
  );
};

export default Filters;
