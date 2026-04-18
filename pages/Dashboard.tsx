
import React, { useState, useEffect } from 'react';
import { INITIAL_CATEGORIES } from '../constants';
import { CategoryInfo, ToolItem } from '../types';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'config'>('submissions');
  const [submissions, setSubmissions] = useState<ToolItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);
  
  // Submission form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    logo: '',
    link: '',
    source: 'Direct',
    tags: ''
  });

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Category management state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');

  useEffect(() => {
    const savedSubs = localStorage.getItem('saas_hub_submissions');
    if (savedSubs) setSubmissions(JSON.parse(savedSubs));

    const savedCats = localStorage.getItem('saas_hub_categories');
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      setCategories(parsed);
      if (!formData.category && parsed.length > 0) {
        setFormData(f => ({ ...f, category: parsed[0].id }));
      }
    } else {
      localStorage.setItem('saas_hub_categories', JSON.stringify(INITIAL_CATEGORIES));
      if (!formData.category) setFormData(f => ({ ...f, category: INITIAL_CATEGORIES[0].id }));
    }
  }, []);

  const fetchMetadata = async () => {
    if (!formData.link || !formData.link.startsWith('http')) {
      alert("Veuillez entrer une URL valide (commençant par http/https)");
      return;
    }

    setIsFetchingMetadata(true);
    try {
      const url = encodeURIComponent(formData.link);
      const response = await fetch(`https://api.microlink.io?url=${url}&screenshot=true`);
      const data = await response.json();

      if (data.status === 'success') {
        const metadata = data.data;
        const domain = new URL(formData.link).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        
        setFormData(prev => ({
          ...prev,
          name: prev.name || metadata.title || '',
          description: prev.description || metadata.description || '',
          logo: metadata.logo?.url || faviconUrl,
          tags: prev.tags || (metadata.publisher ? metadata.publisher : '')
        }));
      } else {
        const domain = new URL(formData.link).hostname;
        setFormData(prev => ({
          ...prev,
          logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des métadonnées:", error);
      try {
        const domain = new URL(formData.link).hostname;
        setFormData(prev => ({
          ...prev,
          logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        }));
      } catch(e) {}
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const saveCategories = (updated: CategoryInfo[]) => {
    setCategories(updated);
    localStorage.setItem('saas_hub_categories', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('categories-updated'));
  };

  const handleAddOrUpdateCategory = () => {
    if (!newCatLabel) return;

    if (editingCategoryId) {
      const updated = categories.map(c => {
        if (c.id === editingCategoryId) {
          return { ...c, label: newCatLabel, icon: newCatIcon, description: newCatDesc };
        }
        return c;
      });
      saveCategories(updated);
      setEditingCategoryId(null);
    } else {
      const newCat: CategoryInfo = {
        id: newCatLabel.toLowerCase().replace(/\s+/g, '-'),
        label: newCatLabel,
        icon: newCatIcon,
        description: newCatDesc,
        subCategories: []
      };
      saveCategories([...categories, newCat]);
    }

    setNewCatLabel('');
    setNewCatDesc('');
    setNewCatIcon('📦');
  };

  const startEditingCategory = (cat: CategoryInfo) => {
    setEditingCategoryId(cat.id);
    setNewCatLabel(cat.label);
    setNewCatIcon(cat.icon);
    setNewCatDesc(cat.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setNewCatLabel('');
    setNewCatIcon('📦');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      saveCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleAddSubCategory = (catId: string) => {
    if (!newSubName) return;
    const updated = categories.map(c => {
      if (c.id === catId) {
        if (c.subCategories.includes(newSubName)) return c;
        return { ...c, subCategories: [...c.subCategories, newSubName] };
      }
      return c;
    });
    saveCategories(updated);
    setNewSubName('');
    setEditingSubId(null);
  };

  const handleDeleteSubCategory = (catId: string, subName: string) => {
    const updated = categories.map(c => {
      if (c.id === catId) {
        return { ...c, subCategories: c.subCategories.filter(s => s !== subName) };
      }
      return c;
    });
    saveCategories(updated);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'category' ? { subCategory: '' } : {})
    }));
  };

  const handleSubmitSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      // Logic: If it's a "Deal" or has an interesting price, tag it as Top Deal
      const isLikelyDeal = formData.category.includes('deal') || formData.category.includes('discount');
      
      const newTool: ToolItem = {
        id: `sub-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        price: formData.price,
        logo: formData.logo || `https://picsum.photos/seed/${formData.name}/200/200`,
        link: formData.link,
        source: formData.source,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        isNew: true,
        isTopDeal: isLikelyDeal
      };
      
      const updated = [newTool, ...submissions];
      setSubmissions(updated);
      localStorage.setItem('saas_hub_submissions', JSON.stringify(updated));
      // Dispatch storage event manually for same-tab updates
      window.dispatchEvent(new Event('storage'));
      
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ 
        name: '', 
        description: '', 
        category: categories[0]?.id || '', 
        subCategory: '',
        price: '', 
        logo: '', 
        link: '', 
        source: 'Direct', 
        tags: '' 
      });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 800);
  };

  const selectedCategoryData = categories.find(c => c.id === formData.category);

  return (
    <div className="max-w-full mx-auto px-6 md:px-12 py-12 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Espace Administration</h1>
          <p className="text-slate-500 text-lg">Gérez vos produits, catégories et configurations répertoriées.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'submissions' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Soumissions
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Structure
          </button>
        </div>
      </div>

      {activeTab === 'submissions' ? (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/5 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">🚀 Répertorier un Outil</h2>
              {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl animate-pulse text-sm font-medium">
                  ✅ Outil ajouté au catalogue avec succès !
                </div>
              )}
              <form onSubmit={handleSubmitSubmission} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Lien direct / URL *</label>
                  <div className="flex gap-2">
                    <input 
                      required 
                      type="url" 
                      name="link" 
                      value={formData.link} 
                      onChange={handleInputChange} 
                      placeholder="https://mon-outil.com" 
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    />
                    <button 
                      type="button"
                      onClick={fetchMetadata}
                      disabled={isFetchingMetadata || !formData.link}
                      className={`px-4 py-2 rounded-xl text-white font-bold transition-all flex items-center gap-2 ${isFetchingMetadata ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                      title="Récupérer les infos"
                    >
                      {isFetchingMetadata ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                      <span className="hidden sm:inline">{isFetchingMetadata ? '...' : 'Fetch'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 border-dashed">
                  <div className="relative group w-16 h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-slate-300 text-xs text-center px-1 leading-none">Aperçu Logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Source / Logo URL</label>
                    <input 
                      type="text" 
                      name="logo" 
                      value={formData.logo} 
                      onChange={handleInputChange} 
                      placeholder="URL de l'image" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom de l'outil *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Canva" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Catégorie</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Sous-Catégorie</label>
                    <select name="subCategory" value={formData.subCategory} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Aucune</option>
                      {selectedCategoryData?.subCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Prix indicatif</label>
                  <input required type="text" name="price" value={formData.price} onChange={handleInputChange} placeholder="Ex: Gratuit / 29$" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Courte présentation répertoriée..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98]">
                  {isSubmitting ? 'Enregistrement...' : 'Répertorier maintenant'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:w-3/5">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dernières soumissions répertoriées</h2>
                <span className="text-xs font-bold text-slate-400">{submissions.length} outils persos</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-slate-50">
                    {submissions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden shadow-sm">
                              <img src={item.logo} className="w-full h-full object-contain" alt="" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">{item.name}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                           <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Catégorie</div>
                           <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{categories.find(c => c.id === item.category)?.label || item.category}</span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-wider">
                            Répertorié
                          </span>
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td className="text-center py-24 text-slate-400">
                          <div className="text-5xl mb-4 grayscale opacity-20">📂</div>
                          <p className="font-medium">Aucun outil personnel dans le catalogue.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {editingCategoryId ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Icon</label>
                    <input type="text" value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom (Texte)</label>
                    <input type="text" value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} placeholder="Ex: Marketing" className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description (Texte)</label>
                  <textarea value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-28 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Présentation textuelle de la catégorie..."></textarea>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddOrUpdateCategory} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md">
                    {editingCategoryId ? 'Sauvegarder' : 'Créer'}
                  </button>
                  {editingCategoryId && (
                    <button onClick={cancelEditCategory} className="px-4 py-3 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 transition-all">
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-full">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Structure des catégories répertoriées</h2>
              <p className="text-slate-500 mb-6 text-sm">Survolez une catégorie pour la modifier ou la supprimer du catalogue.</p>
              <div className="space-y-6">
                {categories.map((cat) => (
                  <div key={cat.id} className={`p-6 bg-slate-50 rounded-2xl border transition-all group ${editingCategoryId === cat.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-slate-100'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">{cat.icon}</span>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 truncate">{cat.label}</h3>
                          <p className="text-sm text-slate-500 line-clamp-1">{cat.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditingCategory(cat)} 
                          title="Modifier le texte"
                          className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-600 hover:text-white transition-all bg-white rounded-lg shadow-sm border border-blue-100 text-xs font-bold"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          Éditer
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id)} 
                          title="Supprimer"
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg shadow-sm border border-slate-100"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200/50">
                      <div className="flex flex-wrap gap-2 items-center">
                        {cat.subCategories.map((sub) => (
                          <span key={sub} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl shadow-sm">
                            {sub}
                            <button onClick={() => handleDeleteSubCategory(cat.id, sub)} className="text-slate-300 hover:text-red-500 transition-colors ml-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </span>
                        ))}
                        {editingSubId === cat.id ? (
                          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border-2 border-blue-500 shadow-md">
                            <input autoFocus type="text" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSubCategory(cat.id)} onBlur={() => !newSubName && setEditingSubId(null)} className="px-3 py-1 outline-none text-sm w-40 font-medium" placeholder="Sous-catégorie..." />
                            <button onMouseDown={() => handleAddSubCategory(cat.id)} className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">OK</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingSubId(cat.id); setNewSubName(''); }} className="inline-flex items-center px-4 py-1.5 border border-dashed border-slate-300 text-slate-400 text-sm font-bold rounded-xl hover:border-blue-500 hover:text-blue-500 hover:bg-white transition-all">
                            + Ajouter une sous-catégorie
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
