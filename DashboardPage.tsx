/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { Notebook } from '../types';
import { NoteMindLogo } from './NoteMindLogo';
import { 
  Pin, 
  Trash2, 
  Plus, 
  Search, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  FileText, 
  Sparkles, 
  LogOut, 
  Calendar, 
  Languages, 
  Sun, 
  Moon, 
  TrendingUp, 
  X, 
  Check, 
  Bookmark,
  BookMarked,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Design System component documentation page render helper
const DesignSystemModal: React.FC<{ isOpen: boolean; onClose: () => void; isAr: boolean }> = ({ isOpen, onClose, isAr }) => {
  if (!isOpen) return null;
  const { designTokens, updateDesignTokens, resetDesignTokens } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-2xl glass-card-premium rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto text-right"
      >
        <button title="close" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>
        <h3 className="text-xl md:text-2xl font-display font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-6 text-left ltr:text-left rtl:text-right">
          {isAr ? 'نظام التصميم التفاعلي - لوحة التحكم الفاخرة' : 'NoteMind AI Premium Interactive Theme Workspace'}
        </h3>
        <div className={`space-y-6 text-xs text-slate-300 leading-relaxed font-sans ${isAr ? 'text-right' : 'text-left'}`}>
          
          <div>
            <h4 className="text-[11px] font-mono tracking-wider uppercase text-violet-400 mb-2">
              {isAr ? '١. تخصيص درجات الألوان الحية (اضغط أو اكتب الكود لتعديله)' : '1. Manage Live Color Tokens (Touch color or type HEX code)'}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#08080c]/80 p-4 rounded-xl border border-slate-900 mb-4">
              {/* Token 1: Background Color */}
              <div className="p-3 bg-black/40 border rounded text-left flex flex-col justify-between transition-all duration-200" style={{ borderColor: designTokens.border }}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{isAr ? 'الخلفية' : 'Background'}</p>
                    <input 
                      type="color" 
                      value={designTokens.bg} 
                      onChange={(e) => updateDesignTokens({ bg: e.target.value })}
                      className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent shrink-0"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={designTokens.bg} 
                    onChange={(e) => updateDesignTokens({ bg: e.target.value })}
                    className="w-full text-[10px] font-mono bg-black/50 border border-white/5 rounded p-1 text-white focus:outline-none focus:border-violet-500 uppercase"
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-2">{isAr ? 'الخلفية الافتراضية' : 'Default BG'}</p>
              </div>

              {/* Token 2: Surface Card Color */}
              <div className="p-3 bg-black/40 border rounded text-left flex flex-col justify-between transition-all duration-200" style={{ borderColor: designTokens.border }}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{isAr ? 'الأسطح والبطاقات' : 'Surface Card'}</p>
                    <input 
                      type="color" 
                      value={designTokens.surface} 
                      onChange={(e) => updateDesignTokens({ surface: e.target.value })}
                      className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent shrink-0"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={designTokens.surface} 
                    onChange={(e) => updateDesignTokens({ surface: e.target.value })}
                    className="w-full text-[10px] font-mono bg-black/50 border border-white/5 rounded p-1 text-white focus:outline-none focus:border-violet-500 uppercase"
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-2">{isAr ? 'الأسطح والبطاقات' : 'Surface Card'}</p>
              </div>

              {/* Token 3: Gradient Accent */}
              <div className="p-3 bg-black/40 border rounded text-left flex flex-col justify-between transition-all duration-200" style={{ borderColor: designTokens.border }}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{isAr ? 'التدرج اللوني' : 'Accent'}</p>
                    <div className="flex gap-1">
                      <input 
                        type="color" 
                        value={designTokens.gradStart} 
                        onChange={(e) => updateDesignTokens({ gradStart: e.target.value })}
                        className="w-4 h-4 border-0 rounded cursor-pointer p-0 bg-transparent"
                      />
                      <input 
                        type="color" 
                        value={designTokens.gradEnd} 
                        onChange={(e) => updateDesignTokens({ gradEnd: e.target.value })}
                        className="w-4 h-4 border-0 rounded cursor-pointer p-0 bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <input 
                      type="text" 
                      value={designTokens.gradStart} 
                      onChange={(e) => updateDesignTokens({ gradStart: e.target.value })}
                      className="w-1/2 text-[9px] font-mono bg-black/50 border border-white/5 rounded p-0.5 text-white focus:outline-none focus:border-violet-500 uppercase text-center"
                    />
                    <input 
                      type="text" 
                      value={designTokens.gradEnd} 
                      onChange={(e) => updateDesignTokens({ gradEnd: e.target.value })}
                      className="w-1/2 text-[9px] font-mono bg-black/50 border border-white/5 rounded p-0.5 text-white focus:outline-none focus:border-violet-500 uppercase text-center"
                    />
                  </div>
                </div>
                <div 
                  className="h-2 rounded mt-2" 
                  style={{ background: `linear-gradient(to right, ${designTokens.gradStart}, ${designTokens.gradEnd})` }}
                />
              </div>

              {/* Token 4: Borders Color */}
              <div className="p-3 bg-black/40 border rounded text-left flex flex-col justify-between transition-all duration-200" style={{ borderColor: designTokens.border }}>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{isAr ? 'الحدود والأطراف' : 'Borders'}</p>
                    <input 
                      type="color" 
                      value={designTokens.border} 
                      onChange={(e) => updateDesignTokens({ border: e.target.value })}
                      className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent shrink-0"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={designTokens.border} 
                    onChange={(e) => updateDesignTokens({ border: e.target.value })}
                    className="w-full text-[10px] font-mono bg-black/50 border border-white/5 rounded p-1 text-white focus:outline-none focus:border-violet-500 uppercase"
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-2">{isAr ? 'الحدود الدقيقة' : 'Borders'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button 
                onClick={resetDesignTokens}
                className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:shadow-[0_0_12px_rgba(124,58,237,0.3)] text-white text-[10px] font-semibold rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{isAr ? 'إعادة تعيين للتصميم الافتراضي المميز' : 'Reset to Default Premium Theme'}</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 mb-2">
              {isAr ? '٢. تكامل الخطوط ومقاييس العرض' : '2. Typography Pairings'}
            </h4>
            <ul className="space-y-2 bg-[#0d0d14] p-3 rounded border border-slate-900 list-none">
              {isAr ? (
                <>
                  <li><strong className="text-white">عناوين العرض الرئيسية:</strong> <code>Space Grotesk</code> (عريض مع تباعد أحرف مكثف لأسلوب تقني مميز)</li>
                  <li><strong className="text-white">متن الواجهة العام:</strong> <code>Inter</code> (مقروئية عالية وواضحة جداً وتصميم سلس)</li>
                  <li><strong className="text-white">أكواد وسجلات تقنية:</strong> <code>JetBrains Mono</code> (لكتل الاقتباس، مراجع الاستقراء، وسجلات النظام)</li>
                </>
              ) : (
                <>
                  <li><strong className="text-white">Display Headings:</strong> <code>Space Grotesk</code> (Bold, Tight tracking for linear tech style)</li>
                  <li><strong className="text-white">General UI/Body:</strong> <code>Inter</code> (Clear readability, multiple weights)</li>
                  <li><strong className="text-white">Technical logs / Codes:</strong> <code>JetBrains Mono</code> (For citation blocks, file logs, counters)</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-mono tracking-wider uppercase text-violet-400 mb-2">
              {isAr ? '٣. إرشادات التصميم المتجاوب والأبعاد الحرة' : '3. Responsive Layout Guidelines'}
            </h4>
            <p className="text-slate-400">
              {isAr 
                ? 'تعتمد لوحة عمل مكتبة الملاحظات ثلاثية الأقسام على تصميم مرن متجاوب. في شاشات الجوال يتم تقديم لوحة منفردة سهلة التمرير، بينما في العرض المكتبي نعتمد على شبكة منظمة ذات أبعاد محددة ومحكمة لراحة العين.'
                : 'Our 3-panel notebook workspace layout leverages responsive fluid resizing. Under mobile view scales, screens collapse cleanly into swipeable single panels. Desktop views feature grid configurations with lock sizes.'
              }
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 mb-2">
              {isAr ? '٤. الحركات والتفاعلات الدقيقة المبهجة' : '4. Motion & Micro-Interactions'}
            </h4>
            <p className="text-slate-400">
              {isAr
                ? 'تستعمل البطاقات التفاعلية حركات انتقال سلسة وذكية. تشتمل الأقسام النشطة على تأثيرات تكبير وتصغير إطار الحدود عند التحديد، بينما يضيف التمرير فوق العناصر توهجًا ناعمًا كوهج النيون.'
                : 'Interactive cards employ smooth framer-motion micro-animations. Active tabs contain layout scale transitions on border outlines. Hover prompts trigger a soft box-shadow neon glow.'
              }
            </p>
          </div>

        </div>
        <div className="mt-8 pt-4 border-t border-[#1e1e2e] text-center">
          <button onClick={onClose} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg text-xs font-semibold cursor-pointer">
            {isAr ? 'حسناً، فهمت' : 'Close System Documentation'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { 
    notebooks, 
    createNotebook, 
    deleteNotebook, 
    pinNotebook, 
    setActiveNotebookId, 
    setPage, 
    user, 
    logoutUser,
    setShowPaywall,
    lang,
    toggleLang,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState('from-violet-600 to-indigo-700');
  const [showCreate, setShowCreate] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);

  const isAr = lang === 'ar';

  const t = {
    title: isAr ? 'أبحاثك ودفاترك الحالية' : 'Deep Private Repositories',
    searchPlh: isAr ? 'البحث عن ملف، عنوان أو مصدر... (CMD+K)' : 'Search anything... (CMD+K)',
    pinned: isAr ? 'الدفاتر المثبتة' : 'Pinned Libraries',
    all: isAr ? 'جميع دفاتر الملاحظات' : 'All Notebooks',
    newBtn: isAr ? 'إنشاء دفتر ملاحظات' : 'Create Library',
    descPlh: isAr ? 'وصف موجز للمكتبة مخصص لذكاء Gemini...' : 'Describe notebook context (e.g. quantum mechanics semester notes)...',
    cancel: isAr ? 'إلغاء' : 'Cancel',
    create: isAr ? 'إنشاء' : 'Create Library',
    limit: isAr ? 'الباقة المجانية: ٢/٣ دفتر ملاحظات مفعّل' : 'Free tier: 3 Max. Upgrading releases limit.',
    empty: isAr ? 'لا يوجد دفاتر ملاحظات تطابق بحثك.' : 'No active notebooks generated.',
    emptySub: isAr ? 'أضف أول دفاتر ملاحظاتك الذكية للبدء بحفظ المستندات والتفاعل الصوتي.' : 'Generate an expert library to upload custom transcripts and run autonomous web crawls.',
    welcome: isAr ? 'أهلاً بك، ' : 'Welcome, ',
    proBadge: isAr ? 'برو' : 'PRO MEMBER',
    freeBadge: isAr ? 'مجاني' : 'FREE USER',
    upgradeBtn: isAr ? 'الترقية للميزات الكاملة' : 'Upgrade Standard Account',
    usageTitle: isAr ? 'استهلاك خطتك الحالية' : 'Resources quota status',
    sysDocBtn: isAr ? 'تخصيص الألوان والسمات (مباشر)' : 'Live Theme Customizer'
  };

  const GRADIENTS = [
    { label: 'Violet Glow', value: 'from-violet-600 to-indigo-700' },
    { label: 'Cyan Ocean', value: 'from-cyan-600 to-indigo-700' },
    { label: 'Pink Horizon', value: 'from-fuchsia-600 to-pink-700' },
    { label: 'Green Emerald', value: 'from-emerald-600 to-teal-700' },
    { label: 'Crimson Flame', value: 'from-rose-600 to-red-700' }
  ];

  // CDM+K keyboard trigger listener 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSpotlight(prev => !prev);
      }
      if (showSpotlight) {
        if (e.key === 'Escape') {
          setShowSpotlight(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSpotlight]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const created = createNotebook(title, desc, color);
      setTitle('');
      setDesc('');
      setShowCreate(false);
      // Select newly created notebook
      setActiveNotebookId(created.id);
      setPage('notebook');
    } catch (err: any) {
      console.warn("Failed creating notebook:", err.message);
    }
  };

  // Filter notebooks based on search
  const filteredNotebooks = notebooks.filter(nb => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const hasInTitle = nb.title.toLowerCase().includes(q) || (nb.description && nb.description.toLowerCase().includes(q));
    const hasInSource = nb.sources.some(s => s.name.toLowerCase().includes(q) || s.content.toLowerCase().includes(q));
    return hasInTitle || hasInSource;
  });

  const pinnedNotebooks = filteredNotebooks.filter(nb => nb.pinned);
  const otherNotebooks = filteredNotebooks.filter(nb => !nb.pinned);

  // Spot light search items list
  const spotlightResults = searchQuery ? filteredNotebooks.slice(0, 5) : notebooks.slice(0, 5);

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans relative pb-12 selection:bg-cyan-500/30"
      style={{ backgroundColor: 'var(--theme-bg, #0a0a0f)' }}
    >
      
      {/* Header Panel */}
      <header className="glass-panel sticky top-0 z-30 border-b border-[#1e1e2e]/70 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setPage('landing')}>
            <NoteMindLogo size={32} />
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white">NoteMind</span>
              <span className="text-[9px] font-mono bg-cyan-500/15 text-cyan-400 px-1 py-0.2 rounded ml-1">AI</span>
            </div>
          </div>
        </div>

        {/* Navigation Search Bar */}
        <div className="relative w-full md:max-w-xs lg:max-w-md">
          <Search size={14} className="absolute left-3.5 top-2.5 text-slate-500" />
          <input
            id="nav-search-notebooks"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'البحث في دفاتر الملاحظات من العنوان...' : 'Search notebooks by title...'}
            className="w-full bg-slate-950/60 border border-[#1e1e2e]/90 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Global actions toolbar */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setIsDesignSystemOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[#1e1e2e] text-[11px] text-slate-400 hover:text-white"
          >
            <Sliders size={12} />
            <span>
              <span className="hidden sm:inline">{t.sysDocBtn}</span>
              <span className="sm:hidden">{isAr ? 'الألوان' : 'Theme'}</span>
            </span>
          </button>

          <button 
            title="toggle lang"
            onClick={toggleLang}
            className="p-1.5 rounded bg-slate-900 border border-[#1e1e2e] text-slate-400 hover:text-white text-xs"
          >
            {isAr ? 'EN' : 'AR'}
          </button>

          <button 
            title="toggle theme"
            onClick={toggleTheme}
            className="p-1.5 rounded bg-slate-900 border border-[#1e1e2e] text-slate-400 hover:text-white"
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          <div className="h-4 w-[1px] bg-[#1e1e2e]" />

          <button
            onClick={() => setPage('settings')}
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[11px] border border-slate-700">
              {user ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span className="hidden md:inline text-xs text-slate-400">{user ? user.name : 'User'}</span>
          </button>

          <button 
            title="logout"
            onClick={logoutUser}
            className="p-1.5 rounded bg-slate-900 border border-red-900/40 text-rose-500 hover:bg-rose-950/20"
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* Main Grid View Dashboard content */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: User details sidebar & quota tracking */}
        <div className="space-y-6">
          <div className="rounded-xl glass-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-mono text-slate-500">{t.welcome}</p>
                <h3 className="text-md font-bold text-white mt-1 font-display">{user ? user.name : 'Researcher'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{user ? user.email : 'user@notemind.ai'}</p>
              </div>

              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${user?.tier === 'pro' ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-700'}`}>
                {user?.tier === 'pro' ? t.proBadge : t.freeBadge}
              </span>
            </div>

            {user?.tier !== 'pro' && (
              <button
                onClick={() => setShowPaywall(true)}
                className="w-full text-[11px] font-semibold tracking-wide py-2 mt-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {t.upgradeBtn}
              </button>
            )}
          </div>

          {/* Core Quotas Progress Indicators */}
          <div className="rounded-xl glass-card p-5 space-y-4">
            <h4 className="text-[11px] uppercase tracking-wider font-mono text-slate-500 font-bold flex items-center gap-1.5">
              <TrendingUp size={12} className="text-cyan-400" />
              <span>{t.usageTitle}</span>
            </h4>

            {/* Notebooks progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{isAr ? 'عدد المكتبات ودفاتر الملاحظات' : 'Notebooks active'}</span>
                <span>{notebooks.length} / {user?.tier === 'pro' ? '∞' : '3'}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-violet-600 to-cyan-400 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (notebooks.length / (user?.tier === 'pro' ? 20 : 3)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Total context sources uploaded across active catalog */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>{isAr ? 'الملفات المرفوعة الكلية' : 'Documents Context'}</span>
                <span>{notebooks.reduce((acc, nb) => acc + nb.sources.length, 0)} / {user?.tier === 'pro' ? '500' : '30'}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-violet-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (notebooks.reduce((acc, nb) => acc + nb.sources.length, 0) / (user?.tier === 'pro' ? 500 : 30)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Small static research tip card */}
          <div className="rounded-xl bg-violet-950/10 border border-violet-500/20 p-4 font-sans text-xs text-violet-300">
            <p className="font-semibold flex items-center gap-1 mb-1 text-white">
              <HelpCircle size={14} className="text-cyan-400" />
              <span>{isAr ? 'نصيحة البحث السريع' : 'Pro Tip: Citations'}</span>
            </p>
            {isAr ? 'اضغط على بطاقات مراجع الاقتباس الملحقة بالرسائل للانتقال تلقائياً لمصدر الفقرة والتحقق منها.' : 'Clicking the index citation chips in AI responses highlights the source article excerpt instantaneously.'}
          </div>
        </div>

        {/* RIGHT COLUMN: Rich library repository and grids */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main search input bar paired with CMD+K Spotlight indicator */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlh}
                className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-sans"
              />
              <span className="absolute right-3.5 top-3.5 px-1.5 py-0.5 rounded border border-white/5 bg-[#0a0a0f]/50 text-[9px] text-slate-500 font-mono tracking-wide">
                ⌘K
              </span>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
            >
              <Plus size={14} />
              <span>{t.newBtn}</span>
            </button>
          </div>

          <DesignSystemModal 
            isOpen={isDesignSystemOpen} 
            onClose={() => setIsDesignSystemOpen(false)} 
            isAr={isAr} 
          />

          {/* Creation modal card overlay */}
          <AnimatePresence>
            {showCreate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCreate(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative z-10 w-full max-w-md glass-card-premium rounded-2xl p-6 shadow-2xl"
                >
                  <button title="close dialog" onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                    <X size={16} />
                  </button>

                  <h3 className="text-lg font-display font-bold text-white mb-4">
                    {isAr ? 'إنشاء دفتر ملاحظات ومستودع جديد' : 'Assemble New Research Notebook'}
                  </h3>

                  <form onSubmit={handleCreate} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        {isAr ? 'عنوان المكتبة' : 'Notebook Title'}
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Superconducting Qubit design"
                        className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        {isAr ? 'وصف أو سياق البحث' : 'Semantic DescriptionContext'}
                      </label>
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder={t.descPlh}
                        rows={3}
                        className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none"
                      />
                    </div>

                    {/* Gradient theme selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        {isAr ? 'سمة لون الغلاف التفاعلي' : 'Cover Visual Gradient Theme'}
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {GRADIENTS.map((g, idx) => (
                          <button
                            title={g.label}
                            type="button"
                            key={idx}
                            onClick={() => setColor(g.value)}
                            className={`h-10 rounded-lg bg-gradient-to-br ${g.value} relative border-2 transition-all ${color === g.value ? 'border-cyan-400 scale-105 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            {color === g.value && <Check size={14} className="text-white absolute inset-0 m-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreate(false)}
                        className="px-4 py-2 bg-slate-900 border border-[#1e1e2e] text-slate-400 rounded-lg hover:text-white transition-colors"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all"
                      >
                        {t.create}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Spotlight overlay (CMD+K) */}
          <AnimatePresence>
            {showSpotlight && (
              <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowSpotlight(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10 w-full max-w-lg glass-card rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-[#1e1e2e] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-violet-400">
                      <Search size={15} />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Spotlight Launcher</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">ESC to Exit</span>
                  </div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type name to discover libraries..."
                    className="w-full bg-slate-950 p-4 text-sm border-none focus:outline-none text-white font-sans"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                    {spotlightResults.length > 0 ? (
                      spotlightResults.map((nb, i) => (
                        <div
                          key={nb.id}
                          onClick={() => {
                            setActiveNotebookId(nb.id);
                            setPage('notebook');
                            setShowSpotlight(false);
                          }}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1a26]/70 cursor-pointer border border-transparent hover:border-[#1e1e2e] text-xs transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${nb.color}`} />
                            <span className="font-semibold text-white">{nb.title}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                            <BookOpen size={10} />
                            {nb.sources.length} sources
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs text-slate-500 py-4">No libraries align with keyword query.</p>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Grids lists grouped by Pinned cards first */}
          {filteredNotebooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 glass-card p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#111118] border border-[#1e1e2e] text-slate-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <FileText size={20} />
              </div>
              <h3 className="text-md font-bold text-slate-300 font-display">{t.empty}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                {t.emptySub}
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-6 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-xs rounded-xl"
              >
                {isAr ? 'أنشئ أول دفتر الآن' : 'Construct First Notebook'}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* PINNED SECTION */}
              {pinnedNotebooks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                    <Bookmark size={13} className="text-violet-400" />
                    <span>{t.pinned}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {pinnedNotebooks.map(nb => (
                      <NotebookCard key={nb.id} notebook={nb} />
                    ))}
                  </div>
                </div>
              )}

              {/* ALL LAPTOPS SECTIONS */}
              {otherNotebooks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                    <BookMarked size={13} className="text-cyan-400" />
                    <span>{t.all}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {otherNotebooks.map(nb => (
                      <NotebookCard key={nb.id} notebook={nb} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// Subcomponent: Notebook card grid item
const NotebookCard: React.FC<{ notebook: Notebook }> = ({ notebook }) => {
  const { setActiveNotebookId, setPage, pinNotebook, deleteNotebook, lang } = useApp();
  const isAr = lang === 'ar';
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleClick = () => {
    if (isConfirmingDelete) return; // Prevent accidental opening while deleting
    setActiveNotebookId(notebook.id);
    setPage('notebook');
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    pinNotebook(notebook.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotebook(notebook.id);
    setIsConfirmingDelete(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-xl glass-card p-5 overflow-hidden shadow-sm cursor-pointer hover:border-violet-500/40 hover:scale-[1.015] hover:shadow-[0_10px_30px_rgba(20,20,35,0.5)] active:scale-[0.99] transition-all flex flex-col justify-between min-h-[160px]"
    >
      {/* Absolute delete confirmation overlay */}
      <AnimatePresence>
        {isConfirmingDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-[#0d0d15] border border-rose-500/50 rounded-xl z-20 flex flex-col justify-center items-center p-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="text-rose-500 mb-2 animate-bounce animate-duration-1000" size={24} />
            <p className="text-[11px] font-bold text-slate-100 mb-3 leading-relaxed">
              {isAr ? 'هل أنت متأكد من حذف هذا الدفتر بجميع ملفاته؟' : 'Are you sure you want to completely erase this library?'}
            </p>
            <div className="flex gap-2 w-full justify-center">
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[10px] rounded-lg transition-colors cursor-pointer"
              >
                {isAr ? 'مسح نهائي' : 'Erase Forever'}
              </button>
              <button
                onClick={cancelDelete}
                className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 font-semibold text-[10px] rounded-lg transition-colors cursor-pointer"
              >
                {isAr ? 'تراجع' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual cover gradient bar */}
      <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${notebook.color} opacity-85 group-hover:opacity-100 transition-opacity`} />
      
      {/* Actions Toolbar */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 select-none">
          <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-400 tracking-tight font-display transition-colors">
            {notebook.title}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {notebook.description || 'No description provided.'}
          </p>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={handlePin}
            title={notebook.pinned ? "Unpin Library" : "Pin Library"}
            className={`p-1.5 rounded bg-slate-950/60 border border-slate-900 text-slate-500 hover:text-amber-400 transition-colors`}
          >
            <Pin size={11} className={notebook.pinned ? "fill-amber-400 text-amber-500" : ""} />
          </button>
          <button
            onClick={handleDeleteClick}
            title="Erase Notebook"
            className="p-1.5 rounded bg-slate-950/60 border border-slate-900 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Footer stats metadata */}
      <div className="mt-8 pt-3 border-t border-[#1e1e2e]/45 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <FileText size={12} />
          {notebook.sources.length} {notebook.sources.length === 1 ? 'source' : 'sources'}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(notebook.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};
