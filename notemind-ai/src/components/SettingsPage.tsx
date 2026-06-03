/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, ShieldAlert, Sparkles, Check, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, loginUser, setPage, setShowPaywall, lang } = useApp();
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [savedStatus, setSavedStatus] = useState(false);

  const isAr = lang === 'ar';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    // Save locally
    loginUser(email, name);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Header bar */}
      <header className="glass-panel sticky top-0 z-30 border-b border-[#1e1e2e]/70 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => setPage('dashboard')}
          className="p-1.5 rounded-lg bg-slate-900 border border-[#1e1e2e] text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={14} className={isAr ? "rotate-180" : ""} />
        </button>
        <h2 className="text-sm font-bold text-white tracking-tight font-display">{isAr ? 'الإعدادات الشخصية والاشتراك' : 'Profile & subscription plans'}</h2>
      </header>

      {/* Settings Panel Grid */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-xs">
        
        {/* Core fields cards form */}
        <div className="rounded-xl bg-[#111118]/85 border border-[#1e1e2e] p-6">
          <h3 className="text-sm font-bold font-display text-white mb-4">{isAr ? 'الملف الشخصي للباحث' : 'Researcher Profile Details'}</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">{isAr ? 'الاسم بالكامل' : 'Researcher Name'}</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">{isAr ? 'البريد الإلكتروني' : 'Registered Email Address'}</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              {savedStatus && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[10px]">
                  <Check size={12} />
                  <span>{isAr ? 'تم حفظ التحديثات بنجاح!' : 'Profile details saved!'}</span>
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
              >
                {isAr ? 'حفظ التغييرات' : 'Save Profiles'}
              </button>
            </div>
          </form>
        </div>

        {/* Quota detailed card */}
        <div className="rounded-xl bg-[#111118]/85 border border-[#1e1e2e] p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-violet-600/10 blur-2xl rounded-full" />
          
          <h3 className="text-sm font-bold font-display text-white mb-2">{isAr ? 'حالة الباقة الحالية' : 'Subscription & Resource Limits'}</h3>
          <p className="text-slate-400 text-[11px] mb-6 leading-relaxed">
            {user?.tier === 'pro' 
              ? (isAr ? 'أنت تستخدم باقة الميزات الكاملة Pro غير المحدودة.' : 'You have currently upgraded to the full-unlocked Pro scale details.') 
              : (isAr ? 'أنت تستخدم الباقة المجانية القياسية. قم بالترقية الآن لتفعيل إمكانيات البحث المعمق وبناء البودكاست الثنائي.' : 'You are cataloging on a standard tier. Elevate your limit quotas to release full podcast, deep research filters now.')
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-grow p-4 bg-slate-950 border border-slate-900 rounded-xl w-full text-center sm:text-left select-none">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Plan Charge</span>
              <p className="text-white font-bold text-lg font-display">{user?.tier === 'pro' ? '$15/month' : '$0 Free limited'}</p>
            </div>

            {user?.tier !== 'pro' ? (
              <button
                onClick={() => setShowPaywall(true)}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl text-center shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles size={13} className="animate-pulse" />
                <span>{isAr ? 'ترقية لـ Pro الآن' : 'Upgrade to Pro'}</span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold px-4 py-2 bg-cyan-950/20 border border-cyan-500/20 rounded-xl">
                <CheckCircle size={14} />
                <span>{isAr ? 'مشترك بالباقة الاحترافية Pro' : 'Active Pro Subscription'}</span>
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
