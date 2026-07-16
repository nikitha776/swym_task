import React from 'react';
import { evaluateMerchantRisk } from '../utils/churnRules.js';
import { getMerchantDisplayName, getMerchantEmail, getMerchantCategory } from '../utils/merchantDisplay.js';

export default function MerchantModal({ merchant, onClose }) {
  if (!merchant) return null;

  const riskData = evaluateMerchantRisk(merchant);

  let bannerBg = 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-400';
  let gaugeColor = 'stroke-emerald-500';
  let gaugeGlow = 'rgba(16,185,129,0.3)';
  if (riskData.riskLevel === 'High') {
    bannerBg = 'from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20 text-rose-400';
    gaugeColor = 'stroke-rose-500';
    gaugeGlow = 'rgba(239,68,68,0.3)';
  } else if (riskData.riskLevel === 'Medium') {
    bannerBg = 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20 text-amber-400';
    gaugeColor = 'stroke-amber-500';
    gaugeGlow = 'rgba(245,158,11,0.3)';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start px-8 py-6 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Explainable Risk Breakdown</span>
            <h2 className="text-2xl font-bold text-white mt-1">{getMerchantDisplayName(merchant)}</h2>
          </div>
          <button className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-xl border border-slate-700/30 transition-colors cursor-pointer" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Summary Banner */}
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border bg-gradient-to-r ${bannerBg}`}>
            <div className="flex flex-col text-center md:text-left">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall Risk Profile</span>
              <span className="text-3xl font-extrabold tracking-tight mt-1">{riskData.riskLevel} Risk</span>
              <span className="text-xs text-slate-500 mt-1">Country: {merchant.country || 'Unknown'} • Plan: {merchant.planName || 'Basic Shopify'} • Category: {getMerchantCategory(merchant)}</span>
            </div>

            {/* Gauge */}
            <div className="relative w-32 h-20 flex justify-center overflow-hidden">
              <svg viewBox="0 0 100 50" className="w-28 h-14">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  className={`${gaugeColor} transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * riskData.totalScore) / 100}
                  style={{ filter: `drop-shadow(0 0 4px ${gaugeGlow})` }}
                />
              </svg>
              <div className="absolute bottom-0 text-center flex flex-col">
                <span className="text-2xl font-black text-white leading-none">{riskData.totalScore}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Score / 100</span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-950/40 border border-slate-800/50 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Merchant ID</span>
              <span className="text-sm font-semibold text-slate-300 truncate mt-1">{merchant.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Contact Email</span>
              <span className="text-sm font-semibold text-slate-300 truncate mt-1">{getMerchantEmail(merchant)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Last Active Date</span>
              <span className="text-sm font-semibold text-slate-300 truncate mt-1">
                {merchant.engagement?.lastLoginDate ? new Date(merchant.engagement.lastLoginDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Signup Date</span>
              <span className="text-sm font-semibold text-slate-300 truncate mt-1">
                {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Signals Analysis */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Signals Analysis</h3>
            <div className="space-y-4">
              {riskData.signals.map((signal) => {
                let cardBorder = 'border-slate-800 hover:border-slate-700/60';
                let indicatorColor = 'bg-slate-700 text-slate-300';
                let fillBarColor = 'bg-slate-700';
                
                if (signal.badgeType === 'danger') {
                  cardBorder = 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40';
                  indicatorColor = 'bg-rose-500/10 text-rose-400';
                  fillBarColor = 'bg-rose-500';
                } else if (signal.badgeType === 'warning') {
                  cardBorder = 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40';
                  indicatorColor = 'bg-amber-500/10 text-amber-400';
                  fillBarColor = 'bg-amber-500';
                } else if (signal.badgeType === 'success') {
                  cardBorder = 'border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/20';
                  indicatorColor = 'bg-emerald-500/10 text-emerald-400';
                  fillBarColor = 'bg-emerald-500';
                }

                return (
                  <div key={signal.name} className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 ${cardBorder}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-white">{signal.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${indicatorColor}`}>
                          {signal.value}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-white">+{signal.weightedPoints.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-500 font-semibold ml-1">pts contribution</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">{signal.explanation}</p>
                    
                    {/* Dimension score bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-800 rounded-full h-1">
                        <div className={`h-full rounded-full transition-all duration-700 ${fillBarColor}`} style={{ width: `${signal.points}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold w-12 text-right">Score: {signal.points}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Next Step */}
          <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="flex items-center gap-3 text-indigo-400 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <h4 className="font-bold uppercase text-xs tracking-wider">Recommended Next Step</h4>
            </div>
            <p className="text-slate-300 text-sm font-semibold mt-3 relative z-10 leading-relaxed">
              {riskData.recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-800/80 flex justify-end bg-slate-950/20">
          <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer" onClick={onClose}>
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
