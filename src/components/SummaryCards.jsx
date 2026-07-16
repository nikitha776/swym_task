import React from 'react';
import { evaluateMerchantRisk } from '../utils/churnRules';

export default function SummaryCards({ merchants, onFilterChange, activeFilter }) {
  const total = merchants.length;
  
  // Evaluate each merchant to count risk categories
  const evaluated = merchants.map(m => evaluateMerchantRisk(m));
  const highRisk = evaluated.filter(m => m.riskLevel === 'High').length;
  const mediumRisk = evaluated.filter(m => m.riskLevel === 'Medium').length;
  const lowRisk = evaluated.filter(m => m.riskLevel === 'Low').length;

  const cards = [
    {
      title: 'Total Merchants',
      count: total,
      percentage: '100%',
      type: 'all',
      bgGlow: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-slate-700/50 hover:border-indigo-500/50',
      activeBorder: 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
      textColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: 'High Churn Risk',
      count: highRisk,
      percentage: total > 0 ? `${Math.round((highRisk / total) * 100)}%` : '0%',
      type: 'High',
      bgGlow: 'from-rose-500/10 to-transparent',
      borderColor: 'border-slate-700/50 hover:border-rose-500/50',
      activeBorder: 'border-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    {
      title: 'Medium Churn Risk',
      count: mediumRisk,
      percentage: total > 0 ? `${Math.round((mediumRisk / total) * 100)}%` : '0%',
      type: 'Medium',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'border-slate-700/50 hover:border-amber-500/50',
      activeBorder: 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    {
      title: 'Low Churn Risk',
      count: lowRisk,
      percentage: total > 0 ? `${Math.round((lowRisk / total) * 100)}%` : '0%',
      type: 'Low',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-slate-700/50 hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const isActive = activeFilter === card.type;
        return (
          <button
            key={card.title}
            className={`relative overflow-hidden text-left bg-slate-900/40 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
              isActive ? card.activeBorder : card.borderColor
            }`}
            onClick={() => onFilterChange(card.type)}
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGlow} opacity-50 group-hover:opacity-80 transition-opacity`} />
            
            <div className="relative flex items-start justify-between z-10">
              <div>
                <span className="text-sm font-medium text-slate-400 tracking-wide uppercase">{card.title}</span>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-3xl font-bold text-white tracking-tight">{card.count}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${card.badgeBg}`}>
                    {card.percentage}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/30 ${card.textColor} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
            
            {/* Bottom Accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.textColor.replace('text-', 'from-').replace('text-', 'to-')} opacity-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-50'} transition-opacity`} />
          </button>
        );
      })}
    </div>
  );
}
