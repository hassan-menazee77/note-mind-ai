/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Cpu, FileText, Globe, MessageSquare, Sparkles, Languages, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { SimpleMarkdown } from './NotebookPage'; // can import SimpleMarkdown or copy mini version

export const SharedPage: React.FC = () => {
  const { notebooks, setPage, lang } = useApp();
  const [testQuestion, setTestQuestion] = useState('');
  const [testHistory, setTestHistory] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const isAr = lang === 'ar';

  // For public shared preview, let's just pick the first notebook or simulate lookups
  const notebook = notebooks[0];

  if (!notebook) {
    return (
      <div className="min-h-screen animated-mesh-bg text-slate-400 flex flex-col justify-center items-center font-sans">
        <p className="text-sm">Public shared notebook was not found or has been made private.</p>
        <button onClick={() => setPage('landing')} className="mt-4 px-4 py-2 bg-slate-900 border border-[#1e1e2e] text-white text-xs rounded-lg">
          Back to Home
        </button>
      </div>
    );
  }

  const handleTestAsk = async () => {
    if (!testQuestion || loading) return;
    const qCopy = testQuestion;
    setTestQuestion('');
    setTestHistory(prev => [...prev, { sender: 'user', text: qCopy }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: notebook.sources,
          messageHistory: [],
          userPrompt: qCopy
        })
      });

      if (!response.ok) throw new Error("Grounded sandbox offline.");
      const block = await response.json();
      setTestHistory(prev => [...prev, { sender: 'assistant', text: block.text }]);
    } catch (err: any) {
      setTestHistory(prev => [...prev, { sender: 'assistant', text: `Public grounded response error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Header element */}
      <header className="glass-panel border-b border-[#1e1e2e]/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[6px] flex items-center justify-center">
              <Cpu className="text-cyan-400 w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display font-semibold text-xs text-slate-400">{isAr ? 'روابط مشاركة عامة' : 'PUBLIC SHARED NOTEBOOK'}</span>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none font-display mt-0.5">{notebook.title}</h1>
          </div>
        </div>

        <button
          onClick={() => setPage('landing')}
          className="px-4 py-1.8 border border-[#1e1e2e] bg-slate-900 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all transform active:scale-95 cursor-pointer"
        >
          {isAr ? 'أنشئ دفتر خاص بك' : 'Create Your Private Notebook'}
        </button>
      </header>

      {/* Main split preview layout grids */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left side info cards */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-xl bg-[#111118]/85 border border-[#1e1e2e] p-6">
            <span className="text-[9px] font-mono font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">Verified Public Share</span>
            <h2 className="text-lg font-bold font-display text-white mt-3 leading-tight">{notebook.title}</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{notebook.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">{isAr ? 'المصادر المتضمنة المشاركة' : 'Priced Sources catalog'}</h3>
            <div className="space-y-2">
              {notebook.sources.map(src => (
                <div key={src.id} className="p-3 bg-slate-900/50 rounded-lg border border-[#1e1e2e] flex items-center gap-3">
                  <FileText size={14} className="text-cyan-400" />
                  <div className="text-left font-sans text-xs">
                    <p className="font-semibold text-white">{src.name}</p>
                    <p className="text-[9px] text-slate-500 capitalize">{src.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side interactive playground sandbox */}
        <div className="md:col-span-7 bg-[#111118]/60 p-6 rounded-xl border border-[#1e1e2e] flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5 font-bold">
              <MessageSquare size={14} className="text-violet-400" />
              <span>{isAr ? 'مستودع تجريب تفاعلي عام' : 'Grounded Sandbox Playground'}</span>
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {testHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
                  <Sparkles size={20} className="text-violet-500 mx-auto mb-2.5 animate-pulse" />
                  <p>{isAr ? 'جرب طرح أي سؤال واختبر ميزة الـ RAG الخاصة بنا!' : 'Test simple queries to retrieve verified grounded answers from these shared repositories.'}</p>
                </div>
              ) : (
                testHistory.map((m, mIdx) => (
                  <div key={mIdx} className={`p-3 rounded-lg border ${m.sender === 'user' ? 'bg-slate-900 border-[#1e1e2e] text-slate-200' : 'bg-slate-950/60 border-slate-900/80 text-cyan-100'} text-xs font-sans`}>
                    <p className="text-[9px] font-mono text-slate-500 mb-1 uppercase tracking-wider">{m.sender === 'user' ? 'GUEST' : 'NOTEMIND SYSTEM'}</p>
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                ))
              )}

              {loading && (
                <div className="p-3 rounded-lg bg-slate-950/60 text-slate-500 text-xs animate-pulse">
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#1e1e2e]/45 flex gap-2">
            <input
              type="text"
              value={testQuestion}
              onChange={(e) => setTestQuestion(e.target.value)}
              placeholder={isAr ? 'اطرح سؤالاً للتجربة السريعة...' : 'Ask a test question...'}
              onKeyDown={(e) => e.key === 'Enter' && handleTestAsk()}
              className="flex-grow bg-slate-950 border border-[#1e1e2e] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={handleTestAsk}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg text-xs font-semibold"
            >
              Ask
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
