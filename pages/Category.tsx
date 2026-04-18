
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INITIAL_CATEGORIES, MOCK_DATA } from '../constants';
import { CategoryInfo, ToolItem } from '../types';
import ToolCard from '../components/ToolCard';
import Filters from '../components/Filters';

const Category: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);
  const [allTools, setAllTools] = useState<ToolItem[]>(MOCK_DATA);

  useEffect(() => {
    // Load categories
    const savedCats = localStorage.getItem('saas_hub_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    }

    // Load and merge tools from all sources
    const loadTools = () => {
      const savedSubs = localStorage.getItem('saas_hub_submissions');
      const userTools: ToolItem[] = savedSubs ? JSON.parse(savedSubs) : [];
      setAllTools([...MOCK_DATA, ...userTools]);
    };

    loadTools();
    window.addEventListener('storage', loadTools);
    return () => window.removeEventListener('storage', loadTools);
  }, []);

  const category = useMemo(() => 
    categories.find(c => c.id === id) || categories[0], 
  [id, categories]);

  useEffect(() => {
    setSearch('');
    setSource('');
    setSubCategory('');
    window.scrollTo(0, 0);
    document.title = `${category?.label || 'Catégorie'} | SaaS Hub Aggregator`;
  }, [id, category?.label]);

  const filteredData = useMemo(() => {
    return allTools.filter(item => {
      const matchCategory = item.category === id;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
      const matchSource = source === '' || item.source === source;
      const matchSub = subCategory === '' || item.subCategory === subCategory;
      return matchCategory && matchSearch && matchSource && matchSub;
    });
  }, [id, search, source, subCategory, allTools]);

  const sources = useMemo(() => {
    const s = new Set(allTools.filter(i => i.category === id).map(i => i.source));
    return Array.from(s);
  }, [id, allTools]);

  const availableSubCategories = useMemo(() => {
    return category?.subCategories || [];
  }, [category]);

  if (!category) return null;

  return (
    <div className="max-w-full mx-auto px-6 md:px-12 py-12 min-h-screen">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{category.icon}</span>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{category.label}</h1>
            <p className="text-lg text-slate-500 mt-2">{filteredData.length} outils répertoriés</p>
          </div>
        </div>
        <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">{category.description}</p>
      </header>

      <section className="mb-10">
        <Filters 
          onSearchChange={setSearch}
          onSourceChange={setSource}
          onSubCategoryChange={setSubCategory}
          sources={sources}
          subCategories={availableSubCategories}
        />
      </section>

      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-8">
          {filteredData.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-slate-300">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Aucun outil trouvé</h3>
          <p className="mt-2 text-slate-500 text-lg max-w-md mx-auto">Nous n'avons trouvé aucun résultat répertorié pour vos critères. Essayez de réinitialiser les filtres.</p>
          <button 
            onClick={() => {setSearch(''); setSource(''); setSubCategory('');}}
            className="mt-8 px-6 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
