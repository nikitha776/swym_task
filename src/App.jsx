import React, { useState, useEffect } from 'react';
import { initialMerchants } from './utils/sampleData';
import { evaluateMerchantRisk, ANCHOR_DATE_STR } from './utils/churnRules.js';
import { getMerchantDisplayName, getMerchantEmail, getMerchantCategory } from './utils/merchantDisplay.js';
import SummaryCards from './components/SummaryCards';
import MerchantTable from './components/MerchantTable';
import MerchantModal from './components/MerchantModal';
import MerchantFormModal from './components/MerchantFormModal';

const LOCAL_STORAGE_KEY = 'merchant_churn_data';

export default function App() {
  const [merchants, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all'); // 'all', 'High', 'Medium', 'Low'
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [formMerchant, setFormMerchant] = useState(null); // null if closed
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load data from localStorage or initial sample data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        setMerchants(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse localStorage merchant data. Falling back to sample data.', e);
        setMerchants(initialMerchants);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMerchants));
      }
    } else {
      setMerchants(initialMerchants);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMerchants));
    }
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = (updatedList) => {
    setMerchants(updatedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Create or Update merchant
  const handleSaveMerchant = (formData) => {
    let updatedMerchants;
    if (formMerchant && formMerchant.id !== 'new') {
      // Edit mode
      updatedMerchants = merchants.map((m) =>
        m.id === formMerchant.id ? { ...m, ...formData } : m
      );
    } else {
      // Add mode
      const newMerchant = {
        ...formData,
        id: `merch-${Date.now()}`
      };
      updatedMerchants = [newMerchant, ...merchants];
    }
    saveToLocalStorage(updatedMerchants);
    setIsFormOpen(false);
    setFormMerchant(null);
  };

  // Delete merchant
  const handleDeleteMerchant = (id) => {
    if (window.confirm('Are you sure you want to delete this merchant from the ledger?')) {
      const updatedMerchants = merchants.filter((m) => m.id !== id);
      saveToLocalStorage(updatedMerchants);
    }
  };

  // Open add form
  const handleAddClick = () => {
    setFormMerchant({ id: 'new' });
    setIsFormOpen(true);
  };

  // Open edit form
  const handleEditClick = (merchant) => {
    setFormMerchant(merchant);
    setIsFormOpen(true);
  };

  // Filter merchants based on search query and risk levels
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMerchants = merchants.filter((merchant) => {
    const businessName = getMerchantDisplayName(merchant);
    const primaryEmail = getMerchantEmail(merchant);
    const category = getMerchantCategory(merchant);
    const matchesSearch =
      businessName.toLowerCase().includes(normalizedQuery) ||
      primaryEmail.toLowerCase().includes(normalizedQuery) ||
      category.toLowerCase().includes(normalizedQuery);

    if (riskFilter === 'all') return matchesSearch;
    const evaluated = evaluateMerchantRisk(merchant);
    return matchesSearch && evaluated.riskLevel === riskFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-indigo-500/30 selection:text-white relative pb-16">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/10 via-slate-950 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 mb-8 border-b border-slate-900">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                SentryChurn
                <span className="text-xs px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 font-semibold rounded-md">v2.0.0</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">Explainable Merchant Churn-Risk Monitor • Reference Date: {ANCHOR_DATE_STR}</p>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 -translate-y-0.5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={handleAddClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Merchant</span>
          </button>
        </header>

        {/* Dashboard Main Content */}
        <main>
          {/* Summary Cards */}
          <SummaryCards
            merchants={merchants}
            activeFilter={riskFilter}
            onFilterChange={setRiskFilter}
          />

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-slate-900/40 backdrop-blur-xl border border-slate-850 rounded-2xl mb-8">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by merchant name, email, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer text-lg font-bold"
                  onClick={() => setSearchQuery('')}
                >
                  &times;
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Filter Risk:</span>
              <div className="inline-flex p-1 bg-slate-950/80 border border-slate-850 rounded-xl">
                {[
                  { name: 'All', value: 'all' },
                  { name: 'High Risk', value: 'High' },
                  { name: 'Medium Risk', value: 'Medium' },
                  { name: 'Low Risk', value: 'Low' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setRiskFilter(opt.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      riskFilter === opt.value
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ledger Title Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Active Merchants Risk Ledger</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-900 border border-slate-850 px-3 py-1 rounded-full">
              Showing {filteredMerchants.length} of {merchants.length} merchants
            </span>
          </div>

          {/* Ledger Table */}
          <MerchantTable
            merchants={filteredMerchants}
            onViewDetails={setSelectedMerchant}
            onEdit={handleEditClick}
            onDelete={handleDeleteMerchant}
          />
        </main>
        
        {/* Modals */}
        {selectedMerchant && (
          <MerchantModal
            merchant={selectedMerchant}
            onClose={() => setSelectedMerchant(null)}
          />
        )}

        {isFormOpen && (
          <MerchantFormModal
            merchant={formMerchant.id === 'new' ? null : formMerchant}
            onClose={() => {
              setIsFormOpen(false);
              setFormMerchant(null);
            }}
            onSave={handleSaveMerchant}
          />
        )}

        {/* Footer info */}
        <footer className="text-center text-slate-600 text-xs mt-12 py-6 border-t border-slate-900">
          <p>SentryChurn v2.0.0 • Designed for Razorpay & Shopify Integration Assessments</p>
        </footer>

      </div>
    </div>
  );
}
