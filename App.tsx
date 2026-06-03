/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { NotebookPage } from './components/NotebookPage';
import { SharedPage } from './components/SharedPage';
import { SettingsPage } from './components/SettingsPage';
import { PaywallModal } from './components/PaywallModal';
import { Sparkles, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom CSS / SVG Confetti overlay
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };
  props: { children: React.ReactNode };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Critical Render Error caught in Boundary:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07070a] flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
          <div className="w-full max-w-md p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center space-y-4 shadow-2xl">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">حدث خطأ غير متوقع / App Error</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              تعذر تحميل بعض عناصر واجهة المستخدم بسبب تعارض في البيانات المحلية أو استجابة معالجة خاطئة.
            </p>
            <div className="p-3 bg-black/40 rounded-lg text-left text-[10px] font-mono border border-white/5 text-rose-300 max-h-36 overflow-y-auto whitespace-pre-wrap select-text">
              {this.state.error?.stack || this.state.error?.message}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xs font-semibold text-white border border-white/5"
              >
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-95 transition-all text-xs font-semibold text-white shadow-lg"
              >
                إعادة ضبط التطبيق بالكامل
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ConfettiOverlay: React.FC = () => {
  const { triggerConfetti, setTriggerConfetti, lang } = useApp();
  const [visible, setVisible] = useState(false);
  
  const isAr = lang === 'ar';

  useEffect(() => {
    if (triggerConfetti) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTriggerConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [triggerConfetti, setTriggerConfetti]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {/* Spawn floating confetti pieces */}
      {Array.from({ length: 45 }).map((_, i) => {
        const leftVal = Math.random() * 100;
        const delayVal = Math.random() * 3;
        const colorVal = ['bg-violet-500', 'bg-cyan-400', 'bg-pink-500', 'bg-emerald-400', 'bg-amber-400'][Math.floor(Math.random() * 5)];
        const scaleVal = Math.random() * 0.8 + 0.4;
        
        return (
          <div
            key={i}
            className={`absolute top-0 w-3 h-3 rounded-full ${colorVal} opacity-85`}
            style={{
              left: `${leftVal}%`,
              animation: `fall 4s linear infinite`,
              animationDelay: `${delayVal}s`,
              transform: `scale(${scaleVal})`,
            }}
          />
        );
      })}

      {/* Styled toast banner */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="absolute bottom-10 right-10 z-50 bg-[#111118] border border-[#1e1e2e] p-5 rounded-xl shadow-2xl flex items-center gap-4.5 pointer-events-auto"
      >
        <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-lg text-white">
          <Star size={18} className="animate-spin" />
        </div>
        <div className="text-left text-xs font-sans">
          <p className="font-bold text-white">{isAr ? 'تمت الترقية بنجاح!' : 'Upgrade Successful!'}</p>
          <p className="text-slate-400 mt-0.5">{isAr ? 'أنت الآن مشترك في NoteMind Pro ومستعد لتجربة الميزات غير المحدودة.' : 'Enjoy unlimited notebooks, deeper models, and 2-person podcast audio.'}</p>
        </div>
        <button title="close toast" onClick={() => setVisible(false)} className="text-slate-500 hover:text-white shrink-0 ml-3">
          <X size={15} />
        </button>
      </motion.div>

      {/* Embedded CSS animations for confetti falling */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'notebook':
        return <NotebookPage />;
      case 'shared':
        return <SharedPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div 
      className="relative min-h-screen text-slate-100 transition-all duration-300 overflow-x-hidden"
      style={{ backgroundColor: 'var(--theme-bg, #0a0a0f)' }}
    >
      {/* Decorative glass elements in background */}
      <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-violet-600/10 dark:bg-violet-600/10 bg-violet-500/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-cyan-500/10 dark:bg-cyan-500/10 bg-cyan-400/20 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="min-h-screen"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Paywalls */}
      <PaywallModal />
      <ConfettiOverlay />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </ErrorBoundary>
  );
}
