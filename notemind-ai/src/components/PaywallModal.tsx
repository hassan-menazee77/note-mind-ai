/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Check, ShieldAlert, Sparkles, X, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PaywallModal: React.FC = () => {
  const { showPaywall, setShowPaywall, user, loginUser, lang, setTriggerConfetti } = useApp();
  const [loading, setLoading] = useState(false);

  if (!showPaywall) return null;

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (user) {
        // Upgrade current cached user
        const upgraded = { ...user, tier: 'pro' as const };
        localStorage.setItem(`notemind_user_profile_${user.email}`, JSON.stringify(upgraded));
        localStorage.setItem('notemind_user', JSON.stringify(upgraded));
        // Force state update by logging in with exact details
        loginUser(user.email, user.name);
      }
      setTriggerConfetti(true);
      setShowPaywall(false);
    }, 1500);
  };

  const isAr = lang === 'ar';

  const t = {
    title: isAr ? 'ترقية إلى NoteMind Pro' : 'Upgrade to NoteMind Pro',
    sub: isAr ? 'أطلق العنان للقوة الكاملة لأبحاثك المدعومة بالذكاء الاصطناعي' : 'Unlock the ultimate power of AI-assisted research and summaries.',
    billed: isAr ? '15$ شهرياً، إلغاء في أي وقت' : '$15/month, cancel anytime.',
    features: isAr ? [
      'دفاتر ملاحظات غير محدودة (المجاني حد أقصى 3)',
      'ما يصل إلى 50 مصدراً لكل دفتر ملاحظات',
      'البحث العميق المستقل غير المحدود',
      'توليد استوديو اللقطة الواحدة (ملخصات، أسئلة، جداول)',
      'توليد البودكاست الصوتي ثنائي المتحدثين بالذكاء الاصطناعي',
      'ردود مخصصة فائقة السرعة مع GPT/Gemini Pro',
      'أولوية الوصول إلى الميزات الجديدة'
    ] : [
      'Unlimited notebooks (Free is limited to 3)',
      'Up to 50 sources per notebook (Free is limited to 10)',
      'Unlimited autonomous Deep Research queries',
      'Full Studio generation (summaries, study guides, Q&A)',
      '2-person AI Voice Podcast conversation generation',
      'Faster grounded reasoning backed by premium model',
      'Priority access to future features'
    ],
    btn: isAr ? 'ترقية الآن مجاناً لمدة 7 أيام' : 'Upgrade Now — 7 Days Free Trial',
    secure: isAr ? 'دفع آمن مشفر' : 'Secure Encrypted checkout',
    cancel: isAr ? 'إلغاء' : 'Close'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={() => setShowPaywall(false)}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-[#111118] border border-[#1e1e2e] shadow-2xl p-6 md:p-8"
      >
        {/* Glow corner decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-600/20 blur-3xl rounded-full" />

        <button 
          title={t.cancel}
          onClick={() => setShowPaywall(false)}
          className="absolute top-4 right-4 text-violet-400 hover:text-cyan-400 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-full border border-violet-500/20 text-violet-400 mb-4">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-semibold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            {t.title}
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            {t.sub}
          </p>
        </div>

        {/* Pricing tag */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-[#1e1e2e] text-center mb-6 relative">
          <span className="absolute -top-3 right-4 px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-gradient-to-r from-violet-600 to-cyan-600 rounded text-white">
            {isAr ? 'العرض الأفضل' : 'Popular'}
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-display font-bold text-white">$15</span>
            <span className="text-sm text-slate-400">/{isAr ? 'شهرياً' : 'month'}</span>
          </div>
          <p className="text-xs text-violet-400 mt-1 font-medium">{t.billed}</p>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          {t.features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 text-slate-300">
              <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-cyan-900/40 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Check size={10} />
              </div>
              <span className="text-xs md:text-sm">{f}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full relative group overflow-hidden rounded-xl p-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium text-sm hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isAr ? 'جاري الترقية...' : 'Upgrading...'}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CreditCard size={16} />
              {t.btn}
            </span>
          )}
          <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 mt-4 text-center">
          <ShieldAlert size={12} />
          <span>{t.secure}</span>
        </div>
      </motion.div>
    </div>
  );
};
