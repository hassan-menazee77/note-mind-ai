/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notebook, Source, Message } from '../types';

export type PageType = 'landing' | 'auth' | 'dashboard' | 'notebook' | 'shared' | 'settings';

export interface DesignTokens {
  bg: string;
  surface: string;
  border: string;
  gradStart: string;
  gradEnd: string;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: 'en' | 'ar';
  toggleLang: () => void;
  currentPage: PageType;
  setPage: (page: PageType) => void;
  user: { email: string; name: string; tier: 'free' | 'pro' } | null;
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;
  notebooks: Notebook[];
  activeNotebookId: string | null;
  setActiveNotebookId: (id: string | null) => void;
  createNotebook: (title: string, description?: string, color?: string) => Notebook;
  deleteNotebook: (id: string) => void;
  renameNotebook: (id: string, newTitle: string) => void;
  pinNotebook: (id: string) => void;
  addSourceToNotebook: (notebookId: string, source: Omit<Source, 'id' | 'addedAt'>) => void;
  removeSourceFromNotebook: (notebookId: string, sourceId: string) => void;
  addChatMessage: (notebookId: string, sender: 'user' | 'assistant', text: string, citations?: any[]) => void;
  updateStudioOutput: (notebookId: string, key: string, val: any) => void;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  triggerConfetti: boolean;
  setTriggerConfetti: (trigger: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  designTokens: DesignTokens;
  updateDesignTokens: (tokens: Partial<DesignTokens>) => void;
  resetDesignTokens: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTEBOOKS: Notebook[] = [
  {
    id: 'nb-quantum',
    title: 'Quantum Computing Fundamentals',
    description: 'Literature reviews, course slides and equations on superconducting qubits.',
    color: 'from-violet-600 to-indigo-700',
    pinned: true,
    createdAt: '2026-05-15T10:00:00Z',
    sources: [
      {
        id: 'src-1',
        name: 'Quantum computing brief.txt',
        type: 'txt',
        content: `Superconducting qubits are artificial macroscopic atoms made from Josephson junctions and capacitors. 
They operate at sub-Kelvin temperatures (typically 10-20 millikelvins) inside dilution refrigerators to preserve quantum coherence. 
The Josephson junction acts as a non-linear inductor, which creates an anharmonic potential. 
This anharmonicity isolates the ground state |0> and first excited state |1> from higher states, creating a viable two-level qubit system.
Decoherence is caused by material defects, thermal fluctuation, magnetic impurities, and radiative losses. 
Mitigating these factors via purified material growth and quantum error correction (QEC) is the main development goal for fault-tolerant logical systems.`,
        addedAt: '2026-05-15T11:00:00Z'
      },
      {
        id: 'src-2',
        name: 'Vercel Scalability Article.web',
        type: 'web',
        url: 'https://vercel.com/blog/scalability',
        content: `Scaling cloud systems requires decentralized gateway routing, intelligent edge-caching networks, and serverless compute models. 
By utilizing regional Edge Networks, static assets are delivered in sub-millisecond times, whilst dynamic operations are proxied via Node.js or edge functions. 
A highly-available architecture requires load balancing, auto-failover database nodes (such as modern Supabase or CockroachDB clusters), and rate-limiting rules.`,
        addedAt: '2026-05-16T09:20:00Z'
      }
    ],
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'What are the main causes of decoherence in superconducting qubits?',
        timestamp: '2026-05-15T11:05:00Z'
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        text: 'According to the uploaded material, decoherence in superconducting qubits is primarily caused by several persistent environmental and physical factors:\n\n1. **Material Defects**: Imperfections in the qubit substrates or junction interfaces.\n2. **Thermal Fluctuation**: Infinitesimal thermal levels triggering state leaks.\n3. **Magnetic Impurities**: Extraneous magnetic vectors interrupting phase accuracy [src-1].\n4. **Radiative Losses**: Stray photon radiation leaking through the dilution refrigerator setup [src-1].\n\nTo mitigate these issues, researchers are developing highly purified material growth technologies and logical networks with full Quantum Error Correction (QEC) protocols [src-1].',
        timestamp: '2026-05-15T11:05:15Z',
        citations: [
          {
            id: 'c-1',
            sourceId: 'src-1',
            sourceName: 'Quantum computing brief.txt',
            snippet: 'Decoherence is caused by material defects, thermal fluctuation, magnetic impurities, and radiative losses.'
          }
        ]
      }
    ]
  },
  {
    id: 'nb-growth',
    title: 'SaaS Expansion & Growth Playbook',
    description: 'Metrics templates, pricing model strategies and conversion optimizations.',
    color: 'from-cyan-600 to-indigo-700',
    pinned: false,
    createdAt: '2026-05-20T14:30:00Z',
    sources: [
      {
        id: 'src-3',
        name: 'Growth playbook notes.txt',
        type: 'txt',
        content: `LTV to CAC ratio is the holy grail for measuring SaaS health. A ratio of 3x is standard, while 5x+ is world-class.
To calculate LTV: Average Revenue Per Account (ARPU) * gross margin % / Churn rate.
CAC is total sales and marketing spend divided by new customers acquired in that period.
Net Revenue Retention (NRR) should exceed 110% for high quality enterprise motions. Expand accounts via feature gating, user expansion, and custom data processing limits.`,
        addedAt: '2026-05-20T14:45:00Z'
      }
    ],
    chatHistory: []
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('notemind_theme') as 'dark' | 'light') || 'dark';
  });
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('notemind_lang') as 'en' | 'ar') || 'en';
  });
  const [currentPage, setPage] = useState<PageType>('landing');
  const [user, setUser] = useState<{ email: string; name: string; tier: 'free' | 'pro' } | null>(() => {
    const savedUser = localStorage.getItem('notemind_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
    const savedUser = localStorage.getItem('notemind_user');
    const email = savedUser ? JSON.parse(savedUser).email : 'guest';
    const saved = localStorage.getItem(`notemind_notebooks_${email}`);
    return saved ? JSON.parse(saved) : INITIAL_NOTEBOOKS;
  });

  const DEFAULT_TOKENS: DesignTokens = {
    bg: '#0a0a0f',
    surface: '#111118',
    border: '#1e1e2e',
    gradStart: '#7c3aed',
    gradEnd: '#06b6d4',
  };

  const [designTokens, setDesignTokens] = useState<DesignTokens>(() => {
    const savedUser = localStorage.getItem('notemind_user');
    const email = savedUser ? JSON.parse(savedUser).email : 'guest';
    const saved = localStorage.getItem(`notemind_design_tokens_${email}`);
    return saved ? JSON.parse(saved) : DEFAULT_TOKENS;
  });

  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize CSS variables with tokens
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', designTokens.bg);
    root.style.setProperty('--theme-surface', designTokens.surface);
    root.style.setProperty('--theme-border', designTokens.border);
    root.style.setProperty('--theme-gradient-start', designTokens.gradStart);
    root.style.setProperty('--theme-gradient-end', designTokens.gradEnd);
  }, [designTokens]);

  // Synchronize theme state with DOM element classes & local storage
  useEffect(() => {
    localStorage.setItem('notemind_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  // Synchronize language state with DOM dir attributes & local storage
  useEffect(() => {
    localStorage.setItem('notemind_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Persist notebooks based on current logged in user
  useEffect(() => {
    const email = user ? user.email : 'guest';
    localStorage.setItem(`notemind_notebooks_${email}`, JSON.stringify(notebooks));
  }, [notebooks, user]);

  // Persist custom designs based on current logged in user
  useEffect(() => {
    const email = user ? user.email : 'guest';
    localStorage.setItem(`notemind_design_tokens_${email}`, JSON.stringify(designTokens));
  }, [designTokens, user]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const loginUser = (email: string, name: string) => {
    let profile = { email, name, tier: 'free' as const };
    const savedProfileStr = localStorage.getItem(`notemind_user_profile_${email}`);
    if (savedProfileStr) {
      try {
        const parsed = JSON.parse(savedProfileStr);
        if (parsed && typeof parsed === 'object' && parsed.email === email) {
          profile = parsed;
        }
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    } else {
      localStorage.setItem(`notemind_user_profile_${email}`, JSON.stringify(profile));
    }

    setUser(profile);
    localStorage.setItem('notemind_user', JSON.stringify(profile));
    
    // Switch to logging-in user's stored notebooks
    const savedNBs = localStorage.getItem(`notemind_notebooks_${email}`);
    setNotebooks(savedNBs ? JSON.parse(savedNBs) : INITIAL_NOTEBOOKS);

    // Switch to logging-in user's design tokens
    const savedTokens = localStorage.getItem(`notemind_design_tokens_${email}`);
    setDesignTokens(savedTokens ? JSON.parse(savedTokens) : DEFAULT_TOKENS);

    setActiveNotebookId(null);
    setPage('dashboard');
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('notemind_user');
    
    // Switch back to guest notebooks
    const savedNBs = localStorage.getItem('notemind_notebooks_guest');
    setNotebooks(savedNBs ? JSON.parse(savedNBs) : INITIAL_NOTEBOOKS);

    // Switch back to guest design tokens
    const savedTokens = localStorage.getItem('notemind_design_tokens_guest');
    setDesignTokens(savedTokens ? JSON.parse(savedTokens) : DEFAULT_TOKENS);

    setActiveNotebookId(null);
    setPage('landing');
  };

  const updateDesignTokens = (tokens: Partial<DesignTokens>) => {
    setDesignTokens(prev => ({
      ...prev,
      ...tokens
    }));
  };

  const resetDesignTokens = () => {
    setDesignTokens(DEFAULT_TOKENS);
  };

  const createNotebook = (title: string, description?: string, color?: string) => {
    // Check limits for free user (free gets 3 notebooks only)
    if (!user || user.tier === 'free') {
      if (notebooks.length >= 3) {
        setShowPaywall(true);
        throw new Error('Notebook limit reached. Upgrade to Pro.');
      }
    }

    const gradients = [
      'from-violet-600 to-indigo-700',
      'from-cyan-600 to-indigo-700',
      'from-fuchsia-600 to-pink-700',
      'from-emerald-600 to-teal-700',
      'from-rose-600 to-red-700'
    ];

    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newNotebook: Notebook = {
      id: 'nb-' + Math.random().toString(36).substring(2, 9),
      title,
      description: description || 'No summary description supplied yet.',
      color: color || randomGradient,
      pinned: false,
      sources: [],
      chatHistory: [],
      createdAt: new Date().toISOString()
    };

    setNotebooks(prev => [newNotebook, ...prev]);
    return newNotebook;
  };

  const deleteNotebook = (id: string) => {
    setNotebooks(prev => prev.filter(nb => nb.id !== id));
    if (activeNotebookId === id) setActiveNotebookId(null);
  };

  const renameNotebook = (id: string, newTitle: string) => {
    setNotebooks(prev => prev.map(nb => nb.id === id ? { ...nb, title: newTitle } : nb));
  };

  const pinNotebook = (id: string) => {
    setNotebooks(prev => prev.map(nb => nb.id === id ? { ...nb, pinned: !nb.pinned } : nb));
  };

  const addSourceToNotebook = (notebookId: string, s: Omit<Source, 'id' | 'addedAt'>) => {
    const notebook = notebooks.find(nb => nb.id === notebookId);
    if (!notebook) return;

    if (!user || user.tier === 'free') {
      if (notebook.sources.length >= 10) {
        setShowPaywall(true);
        throw new Error('Free users can upload up to 10 sources per notebook.');
      }
    } else {
      if (notebook.sources.length >= 50) {
        throw new Error('Max 50 sources reached for this notebook.');
      }
    }

    const newSource: Source = {
      ...s,
      id: 'src-' + Math.random().toString(36).substring(2, 9),
      addedAt: new Date().toISOString()
    };

    setNotebooks(prev => prev.map(nb => {
      if (nb.id === notebookId) {
        return { ...nb, sources: [...nb.sources, newSource] };
      }
      return nb;
    }));
  };

  const removeSourceFromNotebook = (notebookId: string, sourceId: string) => {
    setNotebooks(prev => prev.map(nb => {
      if (nb.id === notebookId) {
        return { ...nb, sources: nb.sources.filter(s => s.id !== sourceId) };
      }
      return nb;
    }));
  };

  const addChatMessage = (notebookId: string, sender: 'user' | 'assistant', text: string, citations?: any[]) => {
    const newMessage: Message = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      sender,
      text,
      timestamp: new Date().toISOString(),
      citations
    };

    setNotebooks(prev => prev.map(nb => {
      if (nb.id === notebookId) {
        return { ...nb, chatHistory: [...nb.chatHistory, newMessage] };
      }
      return nb;
    }));
  };

  const updateStudioOutput = (notebookId: string, key: string, val: any) => {
    setNotebooks(prev => prev.map(nb => {
      if (nb.id === notebookId) {
        return {
          ...nb,
          studioOutput: {
            ...nb.studioOutput,
            [key]: val
          }
        };
      }
      return nb;
    }));
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      lang, toggleLang,
      currentPage, setPage,
      user, loginUser, logoutUser,
      notebooks, activeNotebookId, setActiveNotebookId,
      createNotebook, deleteNotebook, renameNotebook, pinNotebook,
      addSourceToNotebook, removeSourceFromNotebook,
      addChatMessage, updateStudioOutput,
      showPaywall, setShowPaywall,
      triggerConfetti, setTriggerConfetti,
      searchQuery, setSearchQuery,
      designTokens, updateDesignTokens, resetDesignTokens
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside an AppProvider');
  return context;
};
