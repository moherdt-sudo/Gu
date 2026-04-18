
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { INITIAL_CATEGORIES } from '../constants';
import { CategoryInfo } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('saas_hub_categories');
    if (saved) {
      setCategories(JSON.parse(saved));
    }

    // Listen for custom category updates
    const handleUpdate = () => {
      const updated = localStorage.getItem('saas_hub_categories');
      if (updated) setCategories(JSON.parse(updated));
    };
    window.addEventListener('categories-updated', handleUpdate);
    return () => window.removeEventListener('categories-updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-full mx-auto px-4 md:px-10">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SaaS Hub
              </span>
            </Link>

            <nav className="hidden lg:flex space-x-6 items-center">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap ${
                    location.pathname === `/category/${cat.id}` ? 'text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
              >
                Soumettre un outil
              </Link>
            </nav>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 max-h-[70vh] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                >
                  {cat.icon} {cat.label}
                </Link>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-bold text-blue-600 bg-blue-50"
              >
                🚀 Soumettre un outil
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-full mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="text-xl font-bold text-white mb-4 block">SaaS Hub</span>
              <p className="max-w-xs">
                La plateforme de référence pour découvrir, comparer et acheter les meilleurs outils digitaux et SaaS du moment.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map(c => (
                  <li key={c.id}><Link to={`/category/${c.id}`} className="hover:text-blue-400">{c.label}</Link></li>
                ))}
                <li><Link to="/dashboard" className="text-blue-400 font-bold underline">Tableau de bord</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400">Mentions Légales</a></li>
                <li><a href="#" className="hover:text-blue-400">Confidentialité</a></li>
                <li><a href="#" className="hover:text-blue-400">Partenaires</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} SaaS Hub. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
