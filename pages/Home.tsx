
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_CATEGORIES, MOCK_DATA } from '../constants';
import { CategoryInfo, ToolItem } from '../types';
import ToolCard from '../components/ToolCard';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);
  const [allTools, setAllTools] = useState<ToolItem[]>(MOCK_DATA);

  useEffect(() => {
    // Load dynamic categories
    const savedCats = localStorage.getItem('saas_hub_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    }

    // Load and merge tools
    const loadTools = () => {
      const savedSubs = localStorage.getItem('saas_hub_submissions');
      const userTools: ToolItem[] = savedSubs ? JSON.parse(savedSubs) : [];
      // Combine mock and user tools, removing duplicates by ID if any
      const combined = [...MOCK_DATA, ...userTools];
      setAllTools(combined);
    };

    loadTools();
    
    // Listen for updates from the dashboard
    window.addEventListener('storage', loadTools);
    return () => window.removeEventListener('storage', loadTools);
  }, []);

  const topDeals = useMemo(() => 
    allTools.filter(t => t.isTopDeal).slice(0, 8), 
  [allTools]);

  const newSaaS = useMemo(() => 
    allTools.filter(t => t.isNew).sort((a, b) => b.id.localeCompare(a.id)).slice(0, 8), 
  [allTools]);

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40 border-b border-slate-100">
        <div className="max-w-full mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Trouvez les meilleurs <span className="text-blue-600">SaaS & Outils</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            L'agrégateur ultime d'IA, de deals à vie et d'opportunités business. Plus de visibilité, plus d'outils, moins de coûts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/category/ai-tools" className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 text-lg">
              Explorer les Outils IA
            </Link>
            <Link to="/category/lifetime-deals" className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 font-bold rounded-2xl hover:border-slate-900 transition-all text-lg">
              Voir les Top Deals
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] opacity-60 -z-0"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-60 -z-0"></div>
      </section>

      <section className="max-w-full mx-auto px-6 md:px-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Catégories populaires</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-center flex flex-col items-center group h-full justify-center"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-semibold text-slate-800">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-full mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">🔥 Top Deals du moment</h2>
            <p className="text-slate-500">Les meilleures réductions sélectionnées pour vous.</p>
          </div>
          <Link to="/category/lifetime-deals" className="text-blue-600 font-semibold hover:underline flex items-center text-lg">
            Tout voir
            <svg className="ml-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
          {topDeals.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      <section className="max-w-full mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">🚀 Nouveaux SaaS & Startups</h2>
            <p className="text-slate-500">Les derniers lancements catalogués sur le hub.</p>
          </div>
          <Link to="/category/new-saas" className="text-blue-600 font-semibold hover:underline flex items-center text-lg">
            Explorer
            <svg className="ml-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
          {newSaaS.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      <section className="max-w-full mx-auto px-6 md:px-12">
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-[2.5rem] p-16 text-center text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Prêt à faire décoller votre projet ?</h2>
            <p className="max-w-2xl mx-auto mb-10 text-xl text-blue-100/80 leading-relaxed">
              Soumettez votre SaaS dès aujourd'hui et rejoignez notre catalogue d'outils digitaux.
            </p>
            <Link to="/dashboard" className="inline-block px-10 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-lg hover:scale-105 active:scale-95 text-lg">
              Soumettre mon SaaS gratuitement
            </Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px]"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
