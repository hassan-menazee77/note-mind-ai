/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Mail, Lock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NoteMindLogo } from './NoteMindLogo';

export const AuthPage: React.FC = () => {
  const { loginUser, setPage, lang } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const isAr = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate auth login
    const finalName = name || email.split('@')[0];
    loginUser(email, finalName);
  };

  const t = {
    back: isAr ? 'العودة للرئيسية' : 'Back to Home',
    welcomeTitle: isAr ? 'أهلاً بك في NoteMind AI' : 'Welcome to NoteMind AI',
    welcomeSub: isAr ? 'لوحة التحكم البحثية الذكية والمدعومة من Gemini 1.5 & 3.5' : 'Unlock premium knowledge management and citation grounded models.',
    name: isAr ? 'الاسم بالكامل' : 'Full Name',
    email: isAr ? 'البريد الإلكتروني' : 'Email Address',
    pass: isAr ? 'كلمة المرور' : 'Password',
    loginBtn: isAr ? 'تسجيل الدخول' : 'Sign In',
    registerBtn: isAr ? 'إنشاء حساب جديد' : 'Create Free Account',
    dontHave: isAr ? 'ليس لديك حساب؟' : "Don't have an account?",
    alreadyHave: isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    toggleReg: isAr ? 'أنشئ حساباً مجانياً' : 'Create an account',
    toggleLog: isAr ? 'سجل الدخول الآن' : 'Login instead'
  };

  return (
    <div className="min-h-screen animated-mesh-bg text-slate-100 flex flex-col justify-center items-center px-6 relative selection:bg-violet-500/30">
      
      {/* Decorative gradients */}
      <div className="absolute top-1/4 -right-32 w-72 h-72 bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-72 h-72 bg-cyan-600/15 blur-[130px] rounded-full pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => setPage('landing')}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-all cursor-pointer font-medium p-2 rounded-lg bg-slate-900 border border-[#1e1e2e]/80"
      >
        <ArrowLeft size={14} className={isAr ? "rotate-180" : ""} />
        <span>{t.back}</span>
      </button>

      {/* Main card panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden p-8 relative"
      >
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-violet-600/20 blur-2xl rounded-full" />
        
        {/* Brand logo header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <NoteMindLogo size={64} />
          </div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight mt-2">{t.welcomeTitle}</h2>
          <p className="text-[10px] text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">{t.welcomeSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">{t.name}</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Hassan Menazee"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-sans"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">{t.email}</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">{t.pass}</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-sm font-semibold py-3 mt-6 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-98 transition-all hover:scale-[1.01]"
          >
            {isLogin ? t.loginBtn : t.registerBtn}
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-slate-500">{isLogin ? t.dontHave : t.alreadyHave} </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-400 hover:text-cyan-400 font-semibold underline underline-offset-4 ml-1 transition-colors z-10 relative"
          >
            {isLogin ? t.toggleReg : t.toggleLog}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
