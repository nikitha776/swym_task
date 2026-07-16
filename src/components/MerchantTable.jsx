import React, { useState } from 'react';
import { evaluateMerchantRisk } from '../utils/churnRules';

export default function MerchantTable({ merchants, onViewDetails, onEdit, onDelete }) {
  const [sortField, setSortField] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to high-to-low
    }
  };

  // Pre-calculate evaluation data for sorting
  const evaluatedMerchants = merchants.map(merchant => {
    const riskData = evaluateMerchantRisk(merchant);
    return {
      ...merchant,
      riskLevel: riskData.riskLevel,
      riskScore: riskData.totalScore,
      riskColor: riskData.riskColor,
      signals: riskData.signals,
      recommendedAction: riskData.recommendedAction
    };
  });

  // Sort merchants
  const sortedMerchants = [...evaluatedMerchants].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.businessName.localeCompare(b.businessName);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === 'score') {
      comparison = a.riskScore - b.riskScore;
    } else if (sortField === 'lastActive') {
      const dateA = new Date(a.engagement?.lastLoginDate || 0);
      const dateB = new Date(b.engagement?.lastLoginDate || 0);
      comparison = dateA - dateB;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getPrimaryReason = (signals) => {
    // Find active signals (points > 0)
    const activeSignals = signals.filter(s => s.points > 0);
    if (activeSignals.length === 0) return 'Healthy (No risks)';
    
    // Sort descending by weightedPoints
    const topSignal = [...activeSignals].sort((a, b) => b.weightedPoints - a.weightedPoints)[0];
    return `${topSignal.name} (${topSignal.value})`;
  };

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden mb-12">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-950/20 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th onClick={() => handleSort('name')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors select-none">
                Merchant <span className="text-[10px] ml-1">{getSortIcon('name')}</span>
              </th>
              <th onClick={() => handleSort('category')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors select-none">
                Category <span className="text-[10px] ml-1">{getSortIcon('category')}</span>
              </th>
              <th className="px-6 py-4">Risk Level</th>
              <th onClick={() => handleSort('score')} className="px-6 py-4 cursor-pointer hover:text-white transition-colors select-none">
                Risk Score <span className="text-[10px] ml-1">{getSortIcon('score')}</span>
              </th>
              <th className="px-6 py-4">Primary Driver</th>
              <th className="px-6 py-4">Recommended Action</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
            {sortedMerchants.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-950/10">
                  No merchants found matching the filters.
                </td>
              </tr>
            ) : (
              sortedMerchants.map((merchant) => {
                let badgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                let progressColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                if (merchant.riskLevel === 'High') {
                  badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                  progressColor = 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
                } else if (merchant.riskLevel === 'Medium') {
                  badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                  progressColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
                }

                return (
                  <tr key={merchant.id} className="hover:bg-slate-800/20 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {merchant.businessName}
                        </span>
                        <span className="text-xs text-slate-500">{merchant.primaryEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-300 font-medium">{merchant.category}</span>
                        <span className="text-[10px] text-slate-500">{merchant.planName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                        {merchant.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 w-40">
                        <span className="font-bold text-white w-12">{merchant.riskScore}%</span>
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                            style={{ width: `${merchant.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 font-medium line-clamp-1" title={getPrimaryReason(merchant.signals)}>
                        {getPrimaryReason(merchant.signals)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-xs max-w-xs truncate" title={merchant.recommendedAction}>
                        {merchant.recommendedAction}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-lg border border-indigo-500/20 hover:border-transparent transition-all cursor-pointer"
                          onClick={() => onViewDetails(merchant)}
                          title="View Explanations"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                          <span>Why?</span>
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg border border-transparent hover:border-amber-500/20 transition-all cursor-pointer"
                          onClick={() => onEdit(merchant)}
                          title="Edit Merchant"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                          onClick={() => onDelete(merchant.id)}
                          title="Delete Merchant"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
