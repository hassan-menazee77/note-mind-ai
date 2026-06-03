/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { motion } from 'motion/react';
import { NoteMindLogo } from './NoteMindLogo';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  BookOpen, 
  Search, 
  Layers, 
  ChevronRight, 
  Check, 
  Star, 
  Languages, 
  Moon, 
  Sun,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Dr. Sarah Jenkins',
    role: 'Principal Biotech Researcher at MIT',
    text: 'NoteMind AI has completely replaced my research catalog. The ability to upload 50 custom paper PDFs, immediately parse them, and run grounded, citation-rich Q&A is a game-changer.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Marc Levinson',
    role: 'Tech Lead at Vercel',
    text: 'The UI/UX is exceptionally polished—reminds me of Linear or Stripe Dashboard. The autonomous Deep Research mode feels like magic. It crawls, extracts, and summarizes topic reports beautifully.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Ahmed Al-Masri',
    role: 'PhD Scholar in Quantum Computing',
    text: 'مذهل جداً! دعم اللغة العربية RTL والمظاهر الداكنة يعطي تجربة مستخدم لا مثيل لها. الذكاء الاصطناعي دقيق للغاية في استنباط الإجابات المدعومة بالمصادر.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  }
];

export const LandingPage: React.FC = () => {
  const { setPage, theme, toggleTheme, lang, toggleLang, user } = useApp();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  const isAr = lang === 'ar';

  const t = {
    badge: isAr ? 'نقدّم لك الجيل القادم NoteMind AI' : 'Introducing Next-Generation NoteMind AI',
    titleMain: isAr ? 'المقر الرئيسي لأبحاثك المدعومة' : 'The Intelligent Headquarters',
    titleGradient: isAr ? 'بالذكاء الاصطناعي الفائق' : 'For Your Knowledge & Research',
    desc: isAr ? 'قم بتحميل ملفات PDF ،مواقع الويب، مقاطع YouTube وتفاعل معها باستخدام RAG فائق الدقة ومصادر حقيقية مفعّلة. بديلك المفضل لـ NotebookLM بتصميم مذهل.' : 'Upload PDFs, web documents, YouTube logs, or text. Ground a private Gemini brain with custom sources to query, summarize, podcast, and research with absolute precision.',
    getStarted: isAr ? 'ابدأ الآن مجاناً' : 'Get Started Free',
    demo: isAr ? 'الذهاب للوحة التحكم' : 'Go to Dashboard',
    featuresTitle: isAr ? 'قوة لا تضاهى. تصميم لا ينسى.' : 'Sought-after features. Beautiful outcomes.',
    freeTier: isAr ? 'الباقة المجانية' : 'Free Tier',
    proTier: isAr ? 'باقة برو الاحترافية' : 'Pro Research Tier',
  };

  const TYPE_PHRASES = isAr ? [
    'ملفات PDF ودراساتك الخاصة...',
    'روابط ويب ومقاطع يوتيوب...',
    'بحث معمق مستقل ومستندات ذكية...'
  ] : [
    'private document libraries with precision...',
    'YouTube transcripts & complex websites...',
    'autonomous web crawls & comprehensive reports...'
  ];

  // Self Typewriter effect
  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = 0;
    let typing = true;
    let timer: NodeJS.Timeout;

    const tick = () => {
      const currentPhrase = TYPE_PHRASES[phraseIdx];
      if (typing) {
        setTypedText(currentPhrase.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentPhrase.length) {
          typing = false;
          timer = setTimeout(tick, 2000); // Wait on full phrase
        } else {
          timer = setTimeout(tick, 60);
        }
      } else {
        setTypedText(currentPhrase.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          typing = true;
          phraseIdx = (phraseIdx + 1) % TYPE_PHRASES.length;
          timer = setTimeout(tick, 500); // Pause before next phrase
        } else {
          timer = setTimeout(tick, 45);
        }
      }
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [lang]);

  // Rotate testimonials
  useEffect(() => {
    const cancel = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(cancel);
  }, []);

  return (
    <div className="min-h-screen animated-mesh-bg text-slate-100 flex flex-col selection:bg-violet-500/30 selection:text-white transition-colors duration-300">
      
      {/* Header navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#1e1e2e]/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setPage('landing')}>
          <NoteMindLogo size={38} />
          <div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">NoteMind</span>
            <span className="text-xs ml-1.5 px-1.5 py-0.5 font-mono text-[9px] font-semibold bg-cyan-500/15 text-cyan-400 rounded-md border border-cyan-500/25">AI</span>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            title={isAr ? "تحويل اللغة" : "Toggle Language"}
            onClick={toggleLang}
            className="p-2 rounded-lg bg-slate-900 border border-[#1e1e2e] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold px-3"
          >
            <Languages size={14} />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>

          <button 
            title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900 border border-[#1e1e2e] text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition-all"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {user ? (
            <button
              onClick={() => setPage('dashboard')}
              className="px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-[#111118] border border-[#1e1e2e] rounded-lg transition-all"
            >
              {t.demo}
            </button>
          ) : (
            <button
              onClick={() => setPage('auth')}
              className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all transform active:scale-95"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col justify-center items-center px-6 pt-16 md:pt-24 text-center max-w-6xl mx-auto relative overflow-hidden">
        {/* Decorative glass elements */}
        <div className="absolute top-1/4 -left-32 w-72 h-72 bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-cyan-600/15 blur-[130px] rounded-full pointer-events-none" />

        {/* Dynamic Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-violet-500/20 text-xs text-violet-400 font-medium mb-8 select-none hover:border-violet-500/40 transition-colors"
        >
          <Sparkles size={12} className="animate-spin text-cyan-400" />
          <span>{t.badge}</span>
        </motion.div>

        {/* Big Display Headings */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          {t.titleMain} <br />
          <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent text-glow">
            {t.titleGradient}
          </span>
        </h1>

        {/* Self Typing Container */}
        <div className="h-8 md:h-10 mb-8 flex items-center justify-center font-mono text-sm md:text-base text-cyan-400">
          <span>{isAr ? 'ذكاء NoteMind مخصص لتحليل ' : 'Empowering you to process '}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-white font-semibold">
            {typedText}
          </span>
          <span className="animate-pulse font-normal ml-0.5">|</span>
        </div>

        {/* Body Text */}
        <p className="max-w-2xl text-sm md:text-base text-slate-400 leading-relaxed mb-10">
          {t.desc}
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <button
            onClick={() => setPage(user ? 'dashboard' : 'auth')}
            className="w-full sm:w-auto px-8 py-3.3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            <span>{user ? t.demo : t.getStarted}</span>
            <ArrowRight size={16} className={isAr ? "rotate-180" : ""} />
          </button>
        </div>

        {/* Used By Social Proof */}
        <div className="w-full mb-16 py-6 border-y border-[#1e1e2e]/40">
          <p className="text-xs uppercase font-mono tracking-widest text-slate-500 text-center mb-6">
            {isAr ? 'الخيار الأول لأكثر من 10k+ من الباحثين والعلماء' : 'Trusted by 10,000+ top scholars & research engineers'}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 select-none grayscale invert dark:invert-0">
            <span className="text-lg font-bold font-display">STANFORD</span>
            <span className="text-lg font-bold font-display">MIT BIOTECH</span>
            <span className="text-lg font-bold font-display">MICROSOFT AI</span>
            <span className="text-lg font-semibold font-display">VERCEL EDGE</span>
            <span className="text-lg font-bold font-display">HARVARD</span>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="bg-[#111118]/40 border-t border-[#1e1e2e] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
              {t.featuresTitle}
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-600 to-cyan-400 mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 hover:border-violet-500/30 hover:shadow-[0_8px_30px_rgb(20,20,35)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={18} />
              </div>
              <h3 className="text-lg font-semibold font-display text-white mb-2">
                {isAr ? '١. إدارة ذبيحة مخصصة' : '1. Multi-Format Sources'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr ? 'بسهولة قم بسحب وإسقاط ملفات PDF والملفات النصية، قراءة مواقع الويب تلقائياً، واستخراج نصوص مقاطع يوتيوب.' : 'Import PDF papers, text notes, web scraps, and extracts transcripts of full YouTube clips flawlessly.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 hover:border-cyan-500/30 hover:shadow-[0_8px_30px_rgb(20,20,35)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Search size={18} />
              </div>
              <h3 className="text-lg font-semibold font-display text-white mb-2">
                {isAr ? '٢. الذكاء الاصطناعي بدقة المصادر' : '2. Grounded RAG Chat'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr ? 'إجابات دقيقة تستند بالكامل على مصداقية مستنداتك المرفقة فقط مع رقاقات مراجع تفاعلية تبرز الاقتباسات بوضوح.' : 'Query your files with absolute semantic context filters. Click citations to trigger direct highlights of referenced paragraphs.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 hover:border-violet-500/30 hover:shadow-[0_8px_30px_rgb(20,20,35)] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Layers size={18} />
              </div>
              <h3 className="text-lg font-semibold font-display text-white mb-2">
                {isAr ? '٣. لوحة الاستوديو المتكاملة' : '3. Studio Co-Producer'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr ? 'أنشئ بنقرة واحدة ملخصات، أدلة دراسة غنية بالأسئلة، خطط زمنية، نصوص وجداول بيانات مخصصة للحفظ والطباعة.' : 'Generate briefings, study guides, chronologies, FAQs, data sheets, and fully functional 2-person audio podcasts at a single key click.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Star size={400} className="text-cyan-500 fill-cyan-400" />
        </div>

        <h2 className="text-xs uppercase font-mono tracking-widest text-slate-500 mb-8">
          {isAr ? 'آراء الخبراء' : 'What scholars are explaining'}
        </h2>

        <div className="min-h-[220px] flex flex-col justify-center items-center">
          <span className="text-5xl text-violet-500 font-serif leading-none h-4">“</span>
          <p className="text-md md:text-xl text-slate-300 italic tracking-wide leading-relaxed px-4 md:px-12">
            {TESTIMONIALS[activeTestimonial].text}
          </p>
          <div className="flex items-center gap-3 mt-8">
            <img 
              src={TESTIMONIALS[activeTestimonial].avatar} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border border-violet-500/40 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <h4 className="text-xs font-semibold text-white">{TESTIMONIALS[activeTestimonial].name}</h4>
              <p className="text-[10px] text-slate-500">{TESTIMONIALS[activeTestimonial].role}</p>
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              title={`Testimonial ${i}`}
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${activeTestimonial === i ? 'bg-cyan-400 w-6' : 'bg-[#1e1e2e]'}`}
            />
          ))}
        </div>
      </section>

      {/* Structured Pricing Deck */}
      <section className="bg-[#111118]/30 py-20 px-6 border-t border-[#1e1e2e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-medium text-white">
              {isAr ? 'نموذج تسعير مبسط للجميع' : 'Transparent Pricing for Global Minds'}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              {isAr ? 'ابدأ مجاناً وقم بالترقية عند الحاجة لدعم مستنداتك بالكامل.' : 'Start exploring completely free. Elevate capabilities to support unlimited research volumes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-8 flex flex-col hover:border-slate-700/60 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">{t.freeTier}</h3>
              <p className="text-xs text-slate-500 mb-6">
                {isAr ? 'مثالي للطلاب والباحثين المستقلين' : 'Perfect for students or casual research cataloging.'}
              </p>
              <div className="text-3xl font-display font-bold text-white mb-6">
                $0 <span className="text-xs text-slate-500 font-normal">/{isAr ? 'أبدياً' : 'forever'}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {isAr ? (
                  <>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> ٣ دفاتر ملاحظات فقط</li>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> ١٠ مصادر كحد أقصى لكل دفتر</li>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> ٥٠ محادثة شهرياً</li>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> ملخصات الاستوديو الأساسية</li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> 3 Notebooks maximum</li>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> 10 Document sources per notebook</li>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> 50 Core chats/month quota</li>
                    <li className="flex gap-2 text-xs text-slate-300"><CheckCircle size={14} className="text-cyan-400" /> Standard Studio summaries</li>
                  </>
                )}
              </ul>
              <button
                onClick={() => setPage(user ? 'dashboard' : 'auth')}
                className="w-full py-2.5 rounded-lg border border-[#1e1e2e] hover:bg-[#111118]/40 hover:border-slate-600 font-medium text-xs text-white text-center transition-all"
              >
                {isAr ? 'سجل مجاناً' : 'Join Free'}
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl bg-[#111118] border-2 border-violet-500 p-8 flex flex-col hover:shadow-2xl hover:shadow-violet-600/10 relative overflow-hidden transition-all">
              <span className="absolute top-3 right-3 bg-gradient-to-r from-violet-600 to-cyan-400 px-2.5 py-0.5 rounded text-[9px] font-bold text-white tracking-wider uppercase">
                {isAr ? 'شائع' : 'POPULAR'}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2">{t.proTier}</h3>
              <p className="text-xs text-slate-400 mb-6">
                {isAr ? 'للاحترافيين، فرق البحث، والنمو اللامتناهي' : 'For professional scholars, tech leads, and high scale data processing.'}
              </p>
              <div className="text-3xl font-display font-bold text-white mb-6">
                $15 <span className="text-xs text-slate-500 font-normal">/{isAr ? 'شهرياً' : 'month'}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {isAr ? (
                  <>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> دفاتر ملاحظات مخصصة غير محدودة</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> ٥٠ مصدراً لكل دفتر ملاحظات</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> توليد البودكاست الصوتي ثنائي المتحدثين بالكامل</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> البحث العميق المستقل غير المحدود</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> استوديو كامل مع الذكاء الاصطناعي الأسرع</li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> Unlimited notebooks creation</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> Up to 50 sources per notebook</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> 2-person AI conversation voice podcast generator</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> Autonomous Search & Deep Research reporting</li>
                    <li className="flex gap-2 text-xs text-slate-200"><CheckCircle size={14} className="text-violet-400" /> Advanced citation support & highlights</li>
                  </>
                )}
              </ul>
              <button
                onClick={() => setPage(user ? 'dashboard' : 'auth')}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] font-medium text-xs text-white text-center transition-all"
              >
                {isAr ? 'ابدأ كـ برو مجاناً' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1e1e2e] py-8 text-center text-xs text-slate-600 px-6 flex flex-col sm:flex-row justify-between items-center max-w-6xl w-full mx-auto gap-4">
        <div>
          <span>&copy; 2026 NoteMind AI Inc. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-violet-400 transition-colors">{isAr ? 'الشروط والأحكام' : 'Terms'}</a>
          <a href="#" className="hover:text-violet-400 transition-colors">{isAr ? 'سياسة الخصوصية' : 'Privacy'}</a>
          <a href="#" className="hover:text-violet-400 transition-colors">{isAr ? 'الدعم الفني' : 'Support'}</a>
        </div>
      </footer>
    </div>
  );
};
