import React, { useState, useEffect } from 'react';
import { ANCHOR_DATE_STR } from '../utils/churnRules.js';
import { getMerchantDisplayName, getMerchantEmail } from '../utils/merchantDisplay.js';

export default function MerchantFormModal({ merchant, onClose, onSave }) {
  const [formData, setFormData] = useState({
    businessName: '',
    primaryEmail: '',
    category: 'Retail',
    country: 'US',
    planName: 'Basic Shopify',
    createdAt: new Date().toISOString().split('T')[0],
    metrics: {
      gmv: 0,
      gmvDeclineRate: 0,
      transactionCount: 0,
      averageOrderValue: 0,
      failedTransactionRate: 0
    },
    riskAndDisputes: {
      chargebackRate: 0,
      refundRate: 0,
      disputedAmount: 0
    },
    ecosystem: {
      activeAppCount: 0,
      webhookDeliverySuccessRate: 100,
      apiErrorCount: 0
    },
    engagement: {
      lastLoginDate: ANCHOR_DATE_STR,
      supportTickets30d: 0,
      avgResolutionTimeHrs: 0,
      csatScore: 5
    }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (merchant) {
      setFormData({
        businessName: getMerchantDisplayName(merchant),
        primaryEmail: getMerchantEmail(merchant),
        category: merchant.category || 'Retail',
        country: merchant.country || 'US',
        planName: merchant.planName || 'Basic Shopify',
        createdAt: merchant.createdAt ? merchant.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        metrics: {
          gmv: merchant.metrics?.gmv || 0,
          gmvDeclineRate: merchant.metrics?.gmvDeclineRate || 0,
          transactionCount: merchant.metrics?.transactionCount || 0,
          averageOrderValue: merchant.metrics?.averageOrderValue || 0,
          failedTransactionRate: merchant.metrics?.failedTransactionRate || 0
        },
        riskAndDisputes: {
          chargebackRate: merchant.riskAndDisputes?.chargebackRate || 0,
          refundRate: merchant.riskAndDisputes?.refundRate || 0,
          disputedAmount: merchant.riskAndDisputes?.disputedAmount || 0
        },
        ecosystem: {
          activeAppCount: merchant.ecosystem?.activeAppCount || 0,
          webhookDeliverySuccessRate: merchant.ecosystem?.webhookDeliverySuccessRate || 100,
          apiErrorCount: merchant.ecosystem?.apiErrorCount || 0
        },
        engagement: {
          lastLoginDate: merchant.engagement?.lastLoginDate ? merchant.engagement.lastLoginDate.split('T')[0] : ANCHOR_DATE_STR,
          supportTickets30d: merchant.engagement?.supportTickets30d || 0,
          avgResolutionTimeHrs: merchant.engagement?.avgResolutionTimeHrs || 0,
          csatScore: merchant.engagement?.csatScore || 5
        }
      });
    }
  }, [merchant]);

  const handleRootChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleNestedChange = (category, field, value, isNumeric = true) => {
    setFormData(prev => {
      let cleanVal = value;
      if (isNumeric) {
        cleanVal = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
      }
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: cleanVal
        }
      };
    });

    const errorKey = `${category}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.primaryEmail.trim()) {
      newErrors.primaryEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.primaryEmail)) {
      newErrors.primaryEmail = 'Email address is invalid';
    }
    if (!formData.engagement.lastLoginDate) {
      newErrors['engagement.lastLoginDate'] = 'Last login date is required';
    } else if (new Date(formData.engagement.lastLoginDate) > new Date(ANCHOR_DATE_STR)) {
      newErrors['engagement.lastLoginDate'] = `Date cannot be in the future (after ${ANCHOR_DATE_STR})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Sanitize numeric inputs (convert empty string to 0 or defaults)
    const sanitizedData = {
      ...formData,
      metrics: {
        gmv: Number(formData.metrics.gmv) || 0,
        gmvDeclineRate: Number(formData.metrics.gmvDeclineRate) || 0,
        transactionCount: Number(formData.metrics.transactionCount) || 0,
        failedTransactionRate: Number(formData.metrics.failedTransactionRate) || 0,
        averageOrderValue: Number(formData.metrics.transactionCount) > 0 
          ? Number((Number(formData.metrics.gmv) / Number(formData.metrics.transactionCount)).toFixed(2)) 
          : 0
      },
      riskAndDisputes: {
        chargebackRate: Number(formData.riskAndDisputes.chargebackRate) || 0,
        refundRate: Number(formData.riskAndDisputes.refundRate) || 0,
        disputedAmount: Number(formData.riskAndDisputes.disputedAmount) || 0
      },
      ecosystem: {
        activeAppCount: Number(formData.ecosystem.activeAppCount) || 0,
        webhookDeliverySuccessRate: Number(formData.ecosystem.webhookDeliverySuccessRate) || 0,
        apiErrorCount: Number(formData.ecosystem.apiErrorCount) || 0
      },
      engagement: {
        lastLoginDate: formData.engagement.lastLoginDate,
        supportTickets30d: Number(formData.engagement.supportTickets30d) || 0,
        avgResolutionTimeHrs: Number(formData.engagement.avgResolutionTimeHrs) || 0,
        csatScore: Number(formData.engagement.csatScore) || 5
      }
    };

    onSave(sanitizedData);
  };

  const categories = ['Retail', 'Fashion', 'Food & Beverage', 'Home & Living', 'Electronics', 'Services', 'SaaS', 'Other'];
  const plans = ['Basic Shopify', 'Shopify Pro', 'Shopify Plus', 'Razorpay Pro', 'Razorpay Enterprise'];
  const countries = ['US', 'IN', 'CA', 'UK', 'IE', 'IT', 'DE', 'FR', 'JP', 'AU'];

  const isEdit = !!merchant;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-800/80">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Merchant details' : 'Add new Merchant'}</h2>
          <button className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-xl border border-slate-700/30 transition-colors cursor-pointer" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Form Fields */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            
            {/* SECTION 1: Identity & Plan Profile */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">1. Merchant profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleRootChange}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors.businessName ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="e.g. Acme Retail"
                  />
                  {errors.businessName && <span className="text-[10px] text-rose-500 font-semibold mt-1 block">{errors.businessName}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Primary Email *</label>
                  <input
                    type="email"
                    name="primaryEmail"
                    value={formData.primaryEmail}
                    onChange={handleRootChange}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors.primaryEmail ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="e.g. operations@acme.com"
                  />
                  {errors.primaryEmail && <span className="text-[10px] text-rose-500 font-semibold mt-1 block">{errors.primaryEmail}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleRootChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleRootChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Platform Subscription Plan</label>
                  <select
                    name="planName"
                    value={formData.planName}
                    onChange={handleRootChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {plans.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Merchant Since</label>
                  <input
                    type="date"
                    name="createdAt"
                    value={formData.createdAt}
                    onChange={handleRootChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Financial Performance Metrics */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">2. Transactional & Financial Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Current Month GMV ($)</label>
                  <input
                    type="number"
                    value={formData.metrics.gmv}
                    onChange={(e) => handleNestedChange('metrics', 'gmv', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">MoM GMV Decline Rate (%)</label>
                  <input
                    type="number"
                    value={formData.metrics.gmvDeclineRate}
                    onChange={(e) => handleNestedChange('metrics', 'gmvDeclineRate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Successful Orders Count</label>
                  <input
                    type="number"
                    value={formData.metrics.transactionCount}
                    onChange={(e) => handleNestedChange('metrics', 'transactionCount', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Failed Transaction Rate (%)</label>
                  <input
                    type="number"
                    value={formData.metrics.failedTransactionRate}
                    onChange={(e) => handleNestedChange('metrics', 'failedTransactionRate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Disputes, Compliance, & Ecosystem */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">3. Disputes & Platform Ecosystem</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Chargeback Rate (%)</label>
                  <input
                    type="number"
                    value={formData.riskAndDisputes.chargebackRate}
                    onChange={(e) => handleNestedChange('riskAndDisputes', 'chargebackRate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Refund Rate (%)</label>
                  <input
                    type="number"
                    value={formData.riskAndDisputes.refundRate}
                    onChange={(e) => handleNestedChange('riskAndDisputes', 'refundRate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Active Plugins/Apps Installed</label>
                  <input
                    type="number"
                    value={formData.ecosystem.activeAppCount}
                    onChange={(e) => handleNestedChange('ecosystem', 'activeAppCount', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Webhook Success Rate (%)</label>
                  <input
                    type="number"
                    value={formData.ecosystem.webhookDeliverySuccessRate}
                    onChange={(e) => handleNestedChange('ecosystem', 'webhookDeliverySuccessRate', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Platform Engagement & Feedback */}
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">4. Engagement & Service History</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Last Active Login Date *</label>
                  <input
                    type="date"
                    value={formData.engagement.lastLoginDate}
                    onChange={(e) => handleNestedChange('engagement', 'lastLoginDate', e.target.value, false)}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors['engagement.lastLoginDate'] ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    max={ANCHOR_DATE_STR}
                  />
                  {errors['engagement.lastLoginDate'] && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">{errors['engagement.lastLoginDate']}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Support Tickets (30 Days)</label>
                  <input
                    type="number"
                    value={formData.engagement.supportTickets30d}
                    onChange={(e) => handleNestedChange('engagement', 'supportTickets30d', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Avg Issue Resolve Time (Hrs)</label>
                  <input
                    type="number"
                    value={formData.engagement.avgResolutionTimeHrs}
                    onChange={(e) => handleNestedChange('engagement', 'avgResolutionTimeHrs', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">CSAT Rating (1-5)</label>
                  <select
                    value={formData.engagement.csatScore}
                    onChange={(e) => handleNestedChange('engagement', 'csatScore', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {[5, 4, 3, 2, 1].map(score => (
                      <option key={score} value={score}>{score} ★</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 border-t border-slate-800/80 flex justify-end gap-3 bg-slate-950/20">
            <button type="button" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer">
              {isEdit ? 'Save Changes' : 'Add Merchant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
