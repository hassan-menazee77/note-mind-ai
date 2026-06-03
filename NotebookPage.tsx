/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from './AppContext';
import { Source, Message } from '../types';
import { 
  ArrowLeft, 
  FileText, 
  Youtube, 
  Globe, 
  Copy, 
  Upload, 
  Send, 
  Sparkles, 
  FileCode, 
  ExternalLink, 
  Trash2, 
  X, 
  Plus, 
  Headphones, 
  Play, 
  Pause, 
  Download, 
  Compass, 
  FileSpreadsheet, 
  Layers, 
  Check, 
  Share2, 
  ChevronRight, 
  Loader2, 
  Volume2,
  Calendar,
  Eye,
  Settings,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initAuth, googleSignIn, getAccessToken, auth } from '../lib/firebaseAuth';

// Simple direct markdown parser since we have a custom monospace styling
export const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  // Simple regex parser to safely convert bold, headers and inline codes/lists
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-xs md:text-sm font-sans leading-relaxed text-slate-200">
      {lines.map((line, i) => {
        let boldLine = line;
        
        // Headers
        if (line.startsWith('### ')) {
          return <h5 key={i} className="text-sm font-bold text-white mt-4 font-display">{line.replace('### ', '')}</h5>;
        }
        if (line.startsWith('## ')) {
          return <h4 key={i} className="text-md font-bold text-cyan-400 mt-5 font-display">{line.replace('## ', '')}</h4>;
        }
        if (line.startsWith('# ')) {
          return <h3 key={i} className="text-lg font-bold text-violet-400 mt-5 font-display">{line.replace('# ', '')}</h3>;
        }

        // Bullet lists
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const content = line.trim().substring(2);
          return (
            <div key={i} className="flex items-start gap-2 ml-3">
              <span className="text-cyan-400 mt-1.5">•</span>
              <span>{content}</span>
            </div>
          );
        }

        // Bold text formatting **text**
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(boldLine)) !== null) {
          if (match.index > lastIndex) {
            parts.push(boldLine.substring(lastIndex, match.index));
          }
          parts.push(<strong key={match.index} className="text-white font-semibold">{match[1]}</strong>);
          lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < boldLine.length) {
          parts.push(boldLine.substring(lastIndex));
        }

        return <p key={i} className="min-h-[1em]">{parts.length > 0 ? parts : boldLine}</p>;
      })}
    </div>
  );
};

const parseMarkdownToHTML = (md: string, isAr: boolean): string => {
  if (!md) return "";
  
  let html = md.replace(/\r\n/g, "\n");
  
  const lines = html.split('\n');
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
        if (i + 1 < lines.length && lines[i + 1].trim().includes('|-')) {
          i++;
        }
      } else {
        tableRows.push(cells);
      }
    } else {
      if (inTable) {
        let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;"><thead><tr style="background-color: #f8f8fa;">`;
        tableHeader.forEach(h => {
          tableHtml += `<th style="border: 1px solid #e0e0e0; padding: 10px 12px; font-weight: 600; text-align: ${isAr ? 'right' : 'left'};">${h}</th>`;
        });
        tableHtml += "</tr></thead><tbody>";
        tableRows.forEach((row, rIdx) => {
          const bg = rIdx % 2 === 0 ? '#ffffff' : '#fbfbfd';
          tableHtml += `<tr style="background-color: ${bg};">`;
          row.forEach(cell => {
            tableHtml += `<td style="border: 1px solid #e0e0e0; padding: 10px 12px; text-align: ${isAr ? 'right' : 'left'};">${cell}</td>`;
          });
          tableHtml += "</tr>";
        });
        tableHtml += "</tbody></table>";
        processedLines.push(tableHtml);
        
        inTable = false;
        tableHeader = [];
        tableRows = [];
      }
      processedLines.push(lines[i]);
    }
  }
  if (inTable) {
    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;"><thead><tr style="background-color: #f8f8fa;">`;
    tableHeader.forEach(h => {
      tableHtml += `<th style="border: 1px solid #e0e0e0; padding: 10px 12px; font-weight: 600; text-align: ${isAr ? 'right' : 'left'};">${h}</th>`;
    });
    tableHtml += "</tr></thead><tbody>";
    tableRows.forEach((row, rIdx) => {
      const bg = rIdx % 2 === 0 ? '#ffffff' : '#fbfbfd';
      tableHtml += `<tr style="background-color: ${bg};">`;
      row.forEach(cell => {
        tableHtml += `<td style="border: 1px solid #e0e0e0; padding: 10px 12px; text-align: ${isAr ? 'right' : 'left'};">${cell}</td>`;
      });
      tableHtml += "</tr>";
    });
    tableHtml += "</tbody></table>";
    processedLines.push(tableHtml);
  }

  html = processedLines.join('\n');

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li>$1</li>');
  
  html = html.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');
  
  html = html.replace(/<\/li>\n<li>/g, '</li><li>');

  const blocks = html.split('\n\n');
  const wrappedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith('<h') || trimmed.startsWith('<table') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<ul') || trimmed.startsWith('<li')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  });

  return wrappedBlocks.join('\n');
};

const handleExportToPDF = (title: string, markdownContent: string, isAr: boolean) => {
  const htmlContent = parseMarkdownToHTML(markdownContent, isAr);
  const rtlAttribute = isAr ? 'dir="rtl"' : 'dir="ltr"';
  
  // Create off-screen iframe to host the print workflow
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);
  
  const printHtml = `
    <!DOCTYPE html>
    <html ${rtlAttribute}>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: ${isAr ? "'Cairo', 'Inter'" : "'Inter'"}, sans-serif;
          line-height: 1.6;
          color: #1a1a24;
          padding: 30px;
          background: #fff;
          margin: 0;
          direction: ${isAr ? 'rtl' : 'ltr'};
          text-align: ${isAr ? 'right' : 'left'};
        }
        h1, h2, h3, h4 {
          color: #0f0f14;
          margin-top: 20px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        h1 {
          font-size: 24px;
          border-bottom: 2px solid #7c3aed;
          padding-bottom: 8px;
          margin-top: 0;
        }
        h2 {
          font-size: 18px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        h3 {
          font-size: 15px;
        }
        p {
          font-size: 13px;
          margin-bottom: 14px;
          color: #2e2e38;
        }
        ul, ol {
          margin-bottom: 14px;
          padding-left: ${isAr ? '0' : '20px'};
          padding-right: ${isAr ? '20px' : '0'};
        }
        li {
          font-size: 13px;
          margin-bottom: 5px;
          color: #2e2e38;
        }
        blockquote {
          border-left: ${isAr ? 'none' : '4px solid #7c3aed'};
          border-right: ${isAr ? '4px solid #7c3aed' : 'none'};
          padding-left: ${isAr ? '0' : '12px'};
          padding-right: ${isAr ? '12px' : '0'};
          margin: 14px 0;
          font-style: italic;
          color: #4b5563;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #eaeaea;
          padding-top: 10px;
          font-size: 10px;
          color: #9ca3af;
          text-align: center;
          font-family: monospace;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          @page {
            margin: 1.5cm;
          }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="content">
        ${htmlContent}
      </div>
      <div class="footer">
        NoteMind Smart Intelligence - ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;
  
  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(printHtml);
    doc.close();
    
    // Cache the original document title
    const originalTitle = document.title;
    // Set document title to the file title so it pre-populates inside the Save PDF dialog
    document.title = title.replace(/[^a-zA-Z0-9\u0600-\u06FF\s-_]/g, '');
    
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("PDF Print execution failed:", err);
      } finally {
        // Restore parent page title
        document.title = originalTitle;
        // Clean up
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 500);
      }
    }, 600);
  }
};

export const NotebookPage: React.FC = () => {
  const { 
    notebooks, 
    activeNotebookId, 
    setActiveNotebookId, 
    setPage, 
    addSourceToNotebook, 
    removeSourceFromNotebook,
    addChatMessage,
    updateStudioOutput,
    user,
    setShowPaywall,
    lang
  } = useApp();

  const isAr = lang === 'ar';
  
  // Find current notebook
  const notebook = notebooks.find(nb => nb.id === activeNotebookId);
  
  if (!notebook) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-400" style={{ backgroundColor: 'var(--theme-bg, #0a0a0f)' }}>
        <p>Notebook not found or selected.</p>
        <button onClick={() => setPage('dashboard')} className="mt-4 px-4 py-2 bg-slate-900 border border-[#1e1e2e] text-white text-xs rounded-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Panel state references
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [studioLoading, setStudioLoading] = useState(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'summarize' | 'questions' | 'flashcards' | 'infographic' | 'research'>('summarize');
  const [activeStudioSubTab, setActiveStudioSubTab] = useState<'summary' | 'studyGuide' | 'faq' | 'tables'>('summary');
  
  // Scraper & Input Modals Modifiers
  const [showWebModal, setShowWebModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [scrapedUrl, setScrapedUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [scrapedTitle, setScrapedTitle] = useState('');
  const [rawTextName, setRawTextName] = useState('');
  const [rawTextContent, setRawTextContent] = useState('');
  
  // Scraper loader states
  const [scraping, setScraping] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [uploadProgressShow, setUploadProgressShow] = useState(false);

  // New deletion state to fix blocking iframe alerts
  const [deletingSourceId, setDeletingSourceId] = useState<string | null>(null);

  // Drag and Drop interactive states
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // New AI Questions states
  const [quizQuestions, setQuizQuestions] = useState<any[]>(notebook.studioOutput?.aiQuestions || []);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [quizType, setQuizType] = useState<'multiple-choice' | 'true-false'>('multiple-choice');

  // New AI Flashcards states
  const [flashcards, setFlashcards] = useState<any[]>(notebook.studioOutput?.aiFlashcards || []);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [flashcardLoading, setFlashcardLoading] = useState(false);
  const [cardKnowState, setCardKnowState] = useState<Record<string, 'know' | 'learn'>>({});

  // New AI Infographic states
  const [infographicLoading, setInfographicLoading] = useState(false);
  const [infographicData, setInfographicData] = useState<any>(notebook.studioOutput?.aiInfographic || null);

  // Sync state structures when active notebook resets
  useEffect(() => {
    setQuizQuestions(notebook.studioOutput?.aiQuestions || []);
    setFlashcards(notebook.studioOutput?.aiFlashcards || []);
    setInfographicData(notebook.studioOutput?.aiInfographic || null);
    setResearchReport(notebook.studioOutput?.deepResearchReport || '');
    setSelectedAnswers({});
    setRevealedAnswers({});
    setCurrentCardIdx(0);
    setFlippedCards({});
    setDeletingSourceId(null);
  }, [notebook.id]);

  // Deep research topic states
  const [researchTopic, setResearchTopic] = useState('');
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchReport, setResearchReport] = useState(notebook.studioOutput?.deepResearchReport || '');

  // Source preview and selection references
  const [hoveredSourceId, setHoveredSourceId] = useState<string | null>(null);
  const [previewingSource, setPreviewingSource] = useState<Source | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Firebase auth state tracking
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveUser, setDriveUser] = useState<any>(null);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [driveFilter, setDriveFilter] = useState<'all' | 'pdf' | 'doc' | 'txt'>('all');
  const [driveStep, setDriveStep] = useState<'login' | 'browser'>('login');
  const [driveError, setDriveError] = useState<string | null>(null);
  const [importingFileId, setImportingFileId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Auth state
  useEffect(() => {
    initAuth(
      (u, t) => {
        setDriveUser(u);
        setDriveToken(t);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );
  }, []);

  // Sync / query Drive files once Drive Modal is active and authenticated
  const loadDriveFiles = async (token: string) => {
    setDriveLoading(true);
    setDriveError(null);
    try {
      const q = encodeURIComponent(
        "(mimeType='application/pdf' or mimeType='text/plain' or mimeType='application/vnd.google-apps.document') and trashed=false"
      );
      const url = `https://www.googleapis.com/drive/v3/files?pageSize=100&fields=files(id,name,mimeType,size,modifiedTime)&q=${q}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setDriveToken(null);
          setDriveStep('login');
          throw new Error('Google Drive session expired. Please sign in again.');
        }
        throw new Error(`Google Drive API returned error code ${response.status}`);
      }
      
      const data = await response.json();
      setDriveFiles(data.files || []);
      setDriveStep('browser');
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message || 'Failed to load files from Google Drive.');
    } finally {
      setDriveLoading(false);
    }
  };

  useEffect(() => {
    if (showDriveModal) {
      getAccessToken().then(token => {
        if (token) {
          setDriveToken(token);
          setDriveUser(auth.currentUser);
          loadDriveFiles(token);
        } else {
          setDriveStep('login');
        }
      });
    }
  }, [showDriveModal]);

  const handleDriveSignIn = async () => {
    setDriveLoading(true);
    setDriveError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setDriveToken(result.accessToken);
        setDriveUser(result.user);
        await loadDriveFiles(result.accessToken);
      }
    } catch (err: any) {
      setDriveError(err.message || 'Google Drive authentication failed.');
    } finally {
      setDriveLoading(false);
    }
  };

  const importDriveFile = async (fileId: string, name: string, mimeType: string) => {
    if (!driveToken) return;
    setImportingFileId(fileId);
    try {
      let content = "";
      
      if (mimeType === 'application/vnd.google-apps.document') {
        const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
        const res = await fetch(exportUrl, {
          headers: { 'Authorization': `Bearer ${driveToken}` }
        });
        if (!res.ok) throw new Error(isAr ? 'فشل تصدير مستند Google.' : 'Failed to export Google Doc.');
        content = await res.text();
        
        addSourceToNotebook(notebook.id, {
          name: name.endsWith('.txt') ? name : `${name}.txt`,
          type: 'txt',
          content: content || 'Empty Google Doc content.'
        });
        
      } else if (mimeType === 'application/pdf') {
        const mediaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        const res = await fetch(mediaUrl, {
          headers: { 'Authorization': `Bearer ${driveToken}` }
        });
        if (!res.ok) throw new Error(isAr ? 'فشل تحميل ملف الـ PDF من درايف.' : 'Failed to fetch PDF file media.');
        
        const blob = await res.blob();
        
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            
            const parseRes = await fetch('/api/parse-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ base64: base64Data, name })
            });
            
            if (!parseRes.ok) throw new Error(isAr ? 'فشل خادم تحليل الـ PDF في معالجة المستند.' : 'PDF Parse server failed.');
            
            const parseResult = await parseRes.json();
            
            addSourceToNotebook(notebook.id, {
              name,
              type: 'pdf',
              content: parseResult.text
            });
            
            setImportingFileId(null);
            setShowDriveModal(false);
          } catch (err: any) {
            alert(isAr ? `فشل تحليل الـ PDF: ${err.message}` : `PDF parsing error: ${err.message}`);
            setImportingFileId(null);
          }
        };
        reader.readAsDataURL(blob);
        return; // wait for file reader completion
        
      } else {
        const mediaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        const res = await fetch(mediaUrl, {
          headers: { 'Authorization': `Bearer ${driveToken}` }
        });
        if (!res.ok) throw new Error(isAr ? 'فشل تحميل محتوى الملف.' : 'Failed to fetch file content.');
        content = await res.text();
        
        addSourceToNotebook(notebook.id, {
          name,
          type: 'txt',
          content: content || 'Empty file content.'
        });
      }
      
      setShowDriveModal(false);
    } catch (err: any) {
      console.error(err);
      alert(isAr ? `خلل أثناء الاستيراد: ${err.message}` : `Import failed: ${err.message}`);
    } finally {
      setImportingFileId(null);
    }
  };

  // Process manual local file upload or drops
  const processUploadedFile = (file: File) => {
    setUploadProgressShow(true);
    setProgressVal(10);
    
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'pdf') {
      setProgressVal(30);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          setProgressVal(60);
          
          const response = await fetch('/api/parse-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: base64Data, name: file.name })
          });
          
          if (!response.ok) {
            throw new Error(isAr ? 'فشل خادم تحليل الـ PDF في معالجة الملف.' : 'PDF parsing engine returned error');
          }
          
          const result = await response.json();
          setProgressVal(100);
          setTimeout(() => {
            setUploadProgressShow(false);
            addSourceToNotebook(notebook.id, {
              name: file.name,
              type: 'pdf',
              content: result.text
            });
          }, 400);
          
        } catch (error: any) {
          console.error(error);
          alert(isAr ? `خطأ أثناء قراءة ملف PDF: ${error.message}` : `Error parsing PDF: ${error.message}`);
          setUploadProgressShow(false);
        }
      };
      reader.onerror = () => {
        alert('File reading failed');
        setUploadProgressShow(false);
      };
      reader.readAsDataURL(file);
      
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          setProgressVal(100);
          setTimeout(() => {
            setUploadProgressShow(false);
            addSourceToNotebook(notebook.id, {
              name: file.name,
              type: 'txt',
              content: content || 'Empty file content.'
            });
          }, 400);
        } catch (error: any) {
          alert('Failed to save source data.');
          setUploadProgressShow(false);
        }
      };
      reader.onerror = () => {
        alert('File reading failed');
        setUploadProgressShow(false);
      };
      reader.readAsText(file);
    }
  };

  // Auto scroll to chat bot history end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notebook.chatHistory, chatLoading]);



  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleDropAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  // Generate AI Questions from material
  const handleGenerateQuestions = async () => {
    if (notebook.sources.length === 0) return;
    setQuizLoading(true);
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: notebook.sources.map(s => ({ name: s.name, content: s.content })),
          difficulty: quizDifficulty,
          type: quizType,
          language: isAr ? 'ar' : 'en'
        })
      });
      if (!response.ok) throw new Error(isAr ? 'تعذر إنشاء ورقة الأسئلة' : 'Failed to generate questions');
      const data = await response.json();
      setQuizQuestions(data.questions || []);
      updateStudioOutput(notebook.id, 'aiQuestions', data.questions);
      setSelectedAnswers({});
      setRevealedAnswers({});
    } catch (err) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
  };

  // Generate Spaced Repetition Flashcards from material
  const handleGenerateFlashcards = async () => {
    if (notebook.sources.length === 0) return;
    setFlashcardLoading(true);
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: notebook.sources.map(s => ({ name: s.name, content: s.content })),
          language: isAr ? 'ar' : 'en'
        })
      });
      if (!response.ok) throw new Error(isAr ? 'تعذر إنشاء بطاقات الذاكرة' : 'Failed to generate flashcards');
      const data = await response.json();
      setFlashcards(data.flashcards || []);
      updateStudioOutput(notebook.id, 'aiFlashcards', data.flashcards);
      setCurrentCardIdx(0);
      setFlippedCards({});
    } catch (err) {
      console.error(err);
    } finally {
      setFlashcardLoading(false);
    }
  };

  // Generate Interactive "Nano Banana Limitless" Infographic
  const handleGenerateInfographic = async () => {
    if (notebook.sources.length === 0) return;
    setInfographicLoading(true);
    try {
      const response = await fetch("/api/generate-infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: notebook.sources.map(s => ({ name: s.name, content: s.content })),
          language: isAr ? 'ar' : 'en'
        })
      });
      if (!response.ok) throw new Error(isAr ? 'تعذر إنشاء المفهوم البياني' : 'Failed to generate infographic');
      const data = await response.json();
      setInfographicData(data || null);
      updateStudioOutput(notebook.id, 'aiInfographic', data);
    } catch (err) {
      console.error(err);
    } finally {
      setInfographicLoading(false);
    }
  };

  // Perform Scrape Website URL (or YouTube)
  const handleScrapeUrl = async () => {
    if (!scrapedUrl) return;
    setScraping(true);
    setProgressVal(15);
    
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapedUrl })
      });

      if (!response.ok) {
        throw new Error("Target url cannot be retrieved.");
      }

      const resData = await response.json();
      
      setProgressVal(85);
      
      addSourceToNotebook(notebook.id, {
        name: resData.title || scrapedUrl,
        type: resData.type as any || 'web',
        url: scrapedUrl,
        content: resData.content
      });

      setScrapedUrl('');
      setShowWebModal(false);
    } catch (err: any) {
      alert(`Scraper error: ${err.message || 'Verification details missing.'}`);
    } finally {
      setScraping(false);
    }
  };

  // Perform Scrape YouTube URL and fetch transcript using Gemini + live noembed API
  const handleScrapeYoutubeUrl = async () => {
    if (!youtubeUrl) return;
    
    // Check if it's a valid YouTube link
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const videoMatch = youtubeUrl.match(ytRegex);
    if (!videoMatch) {
      alert(isAr ? 'برجاء إدخال رابط يوتيوب صحيح.' : 'Please enter a valid YouTube URL.');
      return;
    }

    setScraping(true);
    setProgressVal(20);
    
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl })
      });

      if (!response.ok) {
        throw new Error(isAr ? "فشل جلب وتفريغ محتوى يوتيوب." : "Target YouTube transcript cannot be retrieved.");
      }

      const resData = await response.json();
      setProgressVal(90);
      
      addSourceToNotebook(notebook.id, {
        name: resData.title || `YouTube Transcript (${videoMatch[1]})`,
        type: 'youtube',
        url: youtubeUrl,
        content: resData.content
      });

      setYoutubeUrl('');
      setShowYoutubeModal(false);
    } catch (err: any) {
      alert(`YouTube Scraper error: ${err.message || 'Verification failed.'}`);
    } finally {
      setScraping(false);
    }
  };

  // Custom Raw text write source 
  const handleAddTextSource = () => {
    if (!rawTextName || !rawTextContent) return;
    addSourceToNotebook(notebook.id, {
      name: rawTextName.endsWith('.txt') ? rawTextName : `${rawTextName}.txt`,
      type: 'txt',
      content: rawTextContent
    });
    setRawTextName('');
    setRawTextContent('');
    setShowTextModal(false);
  };

  // Perform AI RAG grounded chatting
  const handleSendQuery = async () => {
    if (!chatMessage || chatLoading) return;
    const queryCopy = chatMessage;
    setChatMessage('');
    
    // Add user message to local state first
    addChatMessage(notebook.id, 'user', queryCopy);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: notebook.sources,
          messageHistory: notebook.chatHistory,
          userPrompt: queryCopy
        })
      });

      if (!response.ok) {
        throw new Error("Chat engine failed responding.");
      }

      const block = await response.json();
      addChatMessage(notebook.id, 'assistant', block.text, block.citations);
    } catch (err: any) {
      addChatMessage(notebook.id, 'assistant', `Error triggering grounded assistant model: ${err.message || 'Key configuration details needed.'}`);
    } finally {
      setChatLoading(false);
    }
  };

  // Preset question template triggers 
  const triggerSuggestedQuestion = (qst: string) => {
    setChatMessage(qst);
  };

  // Perform One-click Studio Summary & Material builds
  const handleGenerateStudio = async (tooltype: string) => {
    if (notebook.sources.length === 0) {
      alert(isAr ? 'برجاء تحميل مصدر واحد على الأقل أولاً.' : 'Please add at least one source document to analyze material.');
      return;
    }
    setActiveStudioSubTab(tooltype as any);
    setStudioLoading(true);
    try {
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: notebook.sources,
          toolType: tooltype
        })
      });

      if (!response.ok) {
        throw new Error("Studio pipeline failed compiling.");
      }

      const res = await response.json();
      updateStudioOutput(notebook.id, tooltype, res.output);
    } catch (err: any) {
      alert(`Studio Error: ${err.message || 'Configuration error.'}`);
    } finally {
      setStudioLoading(false);
    }
  };



  // Autonomous Deep Research Mode 
  const handleDeepResearch = async () => {
    if (!researchTopic) return;
    setResearchLoading(true);
    try {
      const response = await fetch("/api/deep-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: researchTopic })
      });

      if (!response.ok) {
        let errorMsg = isAr ? "فشل البحث العميق المستقل." : "Autonomous Deep Research crawler encountered an error.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const resData = await response.json();
      setResearchReport(resData.report);
      updateStudioOutput(notebook.id, 'deepResearchReport', resData.report);

      // Automatically add matched web sources directly into libraries bucket!
      resData.sources.forEach((s: any) => {
        addSourceToNotebook(notebook.id, {
          name: `${s.title} (Grounded Search)`,
          type: 'web',
          url: s.url,
          content: s.snippet + "\n\nFull Research Data content crawled autonomously. Matches topic: " + researchTopic
        });
      });

      setResearchTopic('');
    } catch (err: any) {
      alert(`Deep Research model error: ${err.message}`);
    } finally {
      setResearchLoading(false);
    }
  };



  const [shareCopied, setShareCopied] = useState(false);

  // Copy Public / Shared dashboard URLs
  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/shared/${notebook.id}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Handle deletion of document context source
  const handleDeleteSource = (srcId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSourceFromNotebook(notebook.id, srcId);
    if (previewingSource?.id === srcId) setPreviewingSource(null);
  };

  const SUGGESTED_QST = isAr ? [
    'لخص المستندات المرفقة بتقرير موجز.',
    'ما هي النقاط والتطبيقات الرئيسية؟',
    'استخرج الأسئلة الصعبة وأجوبتها المفصلة.'
  ] : [
    'Summarize superconducting qubit materials.',
    'Show scaling laws from SaaS expansion.',
    'Formulate potential FAQs with detailed answers.'
  ];

  const placeholderLogo = notebook.color;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans select-none selection:bg-violet-500/30" style={{ backgroundColor: 'var(--theme-bg, #0a0a0f)' }}>
      
      {/* TOP NAVIGATION NAV */}
      <header className="glass-panel sticky top-0 z-40 border-b border-[#1e1e2e]/45 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage('dashboard')}
            className="p-1.5 rounded-lg bg-slate-900 border border-[#1e1e2e] text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={14} className={isAr ? "rotate-180" : ""} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-md bg-gradient-to-r ${notebook.color} shadow`} />
            <h2 className="text-sm font-bold text-white tracking-tight font-display">{notebook.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Public Link Share */}
          <button
            onClick={handleCopyShareLink}
            className={`px-3.5 py-1.5 rounded-lg border text-[11px] hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
              shareCopied 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                : 'bg-slate-900 border-[#1e1e2e] text-slate-300 hover:text-white'
            }`}
          >
            {shareCopied ? (
              <>
                <Check size={12} className="text-emerald-400 animate-pulse" />
                <span>{isAr ? 'تم نسخ الرابط!' : 'URL Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 size={12} className="text-cyan-400" />
                <span>{isAr ? 'مشاركة عامة' : 'Share URL'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* CORE 3-PANEL RESPONSIVE CONTAINER WORKSPACE */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 xl:divide-x xl:divide-[#1e1e2e]/40 overflow-hidden min-h-[calc(100vh-68px)]">
        
        {/* PANEL A (LEFT): Sources and file management (grid columns 1 to 3) */}
        <section className="lg:col-span-1 xl:col-span-3 p-5 flex flex-col justify-between max-h-[calc(100vh-68px)] lg:overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
                <Layers size={13} className="text-cyan-400 animate-spin" />
                <span>{isAr ? 'المصادر والملفات' : 'Library Sources'}</span>
              </h3>
              
              <span className="text-[10px] font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 border border-[#1e1e2e]">
                {notebook.sources.length} / {user?.tier === 'pro' ? '50' : '10'}
              </span>
            </div>

            {/* Custom Drag Drop Zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDraggingOver(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  processUploadedFile(files[0]);
                }
              }}
              onClick={handleDropAreaClick}
              className={`rounded-xl border border-dashed glass-card p-6 text-center transition-all group flex flex-col items-center cursor-pointer relative ${
                isDraggingOver 
                  ? 'border-cyan-400 bg-cyan-950/20 scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.35)]' 
                  : 'border-white/10 hover:border-violet-500/40 hover:bg-white/5'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf,.txt,.md,.json,.csv"
              />
              <Upload size={22} className="text-slate-500 group-hover:text-violet-400 group-hover:scale-110 transition-all mb-2 pointer-events-none" />
              <p className="text-[11px] font-semibold text-slate-300 pointer-events-none">{isAr ? 'اضغط أو اسحب وأفلت الملف هنا' : 'Click or drag & drop file'}</p>
              <p className="text-[9px] text-slate-500 mt-0.5 pointer-events-none">{isAr ? 'يدعم مستندات PDF والنصوص المباشرة' : 'Supports PDF and plain text documents'}</p>
 
               {uploadProgressShow && (
                 <div className="absolute inset-x-4 bottom-4 bg-[#0a0a0f] p-2.5 rounded-lg border border-slate-900 z-10">
                   <div className="flex justify-between text-[9px] text-slate-400">
                     <span>{isAr ? 'يجري تحليل المستند...' : 'Processing file...'}</span>
                     <span>{progressVal}%</span>
                   </div>
                   <div className="w-full bg-slate-950 h-1 mt-1 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-400" style={{ width: `${progressVal}%` }} />
                   </div>
                 </div>
               )}
            </div>
 
            {/* Multiple pathways: Web scrape, YouTube, Text copy, and Google Drive forms */}
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              <button
                onClick={() => setShowWebModal(true)}
                className="p-2 bg-slate-900/60 hover:bg-slate-900 border border-[#1e1e2e] rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-300 flex flex-col items-center justify-center gap-1 transition-all text-center h-[56px] cursor-pointer"
              >
                <Globe size={11.5} className="text-cyan-400" />
                <span>{isAr ? 'رابط ويب' : 'URL Scraper'}</span>
              </button>

              <button
                onClick={() => setShowYoutubeModal(true)}
                className="p-2 bg-slate-900/60 hover:bg-slate-900 border border-[#1e1e2e] rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-300 flex flex-col items-center justify-center gap-1 transition-all text-center h-[56px] cursor-pointer"
              >
                <Youtube size={12} className="text-red-500 animate-pulse" />
                <span>{isAr ? 'يوتيوب' : 'YouTube URL'}</span>
              </button>
 
               <button
                 onClick={() => setShowTextModal(true)}
                 className="p-2 bg-slate-900/60 hover:bg-slate-900 border border-[#1e1e2e] rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-300 flex flex-col items-center justify-center gap-1 transition-all text-center h-[56px] cursor-pointer"
               >
                 <Copy size={11.5} className="text-violet-400" />
                 <span>{isAr ? 'لصق نص' : 'Paste Text'}</span>
               </button>

              <button
                onClick={() => setShowDriveModal(true)}
                className="p-2 bg-slate-900/60 hover:bg-emerald-950/30 hover:border-emerald-500/20 border border-[#1e1e2e] rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-300 flex flex-col items-center justify-center gap-1 transition-all text-center h-[56px] cursor-pointer"
              >
                <span className="text-emerald-400 font-bold text-[10px] font-mono leading-none">Drive</span>
                <span>{isAr ? 'جوجل درايف' : 'Google Drive'}</span>
              </button>
             </div>

            {/* Source card lists */}
            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {notebook.sources.length === 0 ? (
                <p className="text-center text-[11px] text-slate-600 italic py-6">{isAr ? 'لا يوجد مصادر مضافة بعد.' : 'No sources loaded.'}</p>
              ) : (
                notebook.sources.map(src => {
                  const isYt = src.type === 'youtube';
                  return (
                    <div
                      key={src.id}
                      onClick={() => setPreviewingSource(src)}
                      onMouseEnter={() => setHoveredSourceId(src.id)}
                      onMouseLeave={() => setHoveredSourceId(null)}
                      className={`group/item p-3 rounded-lg flex items-center justify-between cursor-pointer border transition-all ${previewingSource?.id === src.id ? 'bg-[#181824] border-violet-500/50 shadow' : 'glass-card border-white/5 hover:border-violet-500/35'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded bg-slate-950 border ${isYt ? 'border-red-900/40 text-red-500' : 'border-cyan-900/30 text-cyan-400'}`}>
                          {isYt ? <Youtube size={12} /> : <FileText size={12} />}
                        </div>
                        <div className="text-left font-sans select-none">
                          <p className="text-[11px] font-semibold text-white truncate max-w-[130px]">{src.name}</p>
                          <p className="text-[8px] text-slate-500 uppercase mt-0.5">{src.type}</p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 items-center transition-all">
                        {deletingSourceId === src.id ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSource(src.id, e);
                                setDeletingSourceId(null);
                              }}
                              className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[8px] font-bold uppercase cursor-pointer"
                              title="Confirm Erase"
                            >
                              {isAr ? 'حذف' : 'Yes'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingSourceId(null);
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-905 border border-white/5 hover:bg-slate-800 text-slate-400 text-[8px] font-bold uppercase cursor-pointer"
                              title="Cancel"
                            >
                              {isAr ? 'إلغاء' : 'No'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingSourceId(src.id);
                            }}
                            title="Remove Source"
                            className="p-1 rounded bg-slate-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-500 transition-colors opacity-0 group-hover/item:opacity-100 cursor-pointer"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Quick source preview hovering details card */}
          {previewingSource && (
            <div className="rounded-xl glass-card border border-white/10 p-4 text-xs mt-6 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-cyan-400 tracking-tight font-display">{previewingSource.name}</span>
                <button title="close preview" onClick={() => setPreviewingSource(null)} className="text-slate-500 hover:text-white">
                  <X size={12} strokeWidth={2} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                {previewingSource.content || 'Blank context.'}
              </p>
              {previewingSource.url && (
                <a href={previewingSource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-[9px] text-violet-400 font-mono hover:underline">
                  <span>Visit address</span>
                  <ExternalLink size={8} />
                </a>
              )}
            </div>
          )}
        </section>

        {/* PANEL B (CENTER): Grounded AI conversational Chat (columns 4 to 8) */}
        <section className="lg:col-span-2 xl:col-span-5 p-5 flex flex-col justify-between max-h-[calc(100vh-68px)] border-t lg:border-t-0 border-[#1e1e2e]/30 bg-slate-950/20 backdrop-blur-md">
          <div className="flex flex-col flex-grow overflow-hidden">
            
            <div className="pb-3 border-b border-[#1e1e2e]/45 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
                <Volume2 size={13} className="text-violet-400 animate-pulse" />
                <span>{isAr ? 'منصة التفاعل RAG' : 'Private RAG Chat'}</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/10">
                {isAr ? 'Gemini 3.5 فلاش' : 'Gemini 3.5' }
              </span>
            </div>

            {/* Chats log container */}
            <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1 max-h-[calc(100vh-240px)]">
              {notebook.chatHistory.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-8">
                  <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-violet-400 mb-3 animate-pulse">
                    <Sparkles size={16} />
                  </div>
                  <h4 className="text-slate-300 text-xs font-bold font-display">{isAr ? 'اطرح سؤالك الأول حول هذا الدفتر' : 'Interactive Grounded Chat'}</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed">
                    {notebook.sources.length === 0 
                      ? (isAr ? 'برجاء تحميل بعض المصادر في اليسار أولاً ليتمكن الذكاء الاصطناعي من الإجابة بالاعتماد عليها.' : 'Please add sources on the left panel first to let NoteMind anchor its responses.')
                      : (isAr ? 'اطرح أي سؤال حول هذه المستندات وسوف يقدم لك الذكاء الاصطناعي إجابة دقيقة مع مراجع تبرز الفقرة الأصلية.' : 'Ask queries regarding these papers. NoteMind replies with detailed evidence cards.')
                    }
                  </p>
                </div>
              ) : (
                notebook.chatHistory.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-4 rounded-xl max-w-[85%] border shadow-sm ${isUser ? 'bg-slate-900/80 border-white/5 text-slate-100 rounded-tr-none' : 'glass-card text-slate-200 rounded-tl-none'}`}>
                        <div className="text-[10px] font-mono text-slate-500 mb-1 leading-none">
                          {isUser ? (isAr ? 'أنت' : 'YOU') : (isAr ? 'مستشار NOTEMIND' : 'NOTEMIND AI')}
                        </div>
                        
                        {isUser ? (
                          <p className="text-xs font-sans leading-relaxed text-slate-200">{msg.text}</p>
                        ) : (
                          <SimpleMarkdown text={msg.text} />
                        )}

                        {/* Citation Index Chips */}
                        {!isUser && msg.citations && msg.citations.length > 0 && (
                          <div className="mt-4 pt-2 border-t border-[#1e1e2e]/45 flex flex-wrap gap-2">
                            {msg.citations.map((cite, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => {
                                  // Locate source and open active preview
                                  const linked = notebook.sources.find(s => s.id === cite.sourceId);
                                  if (linked) setPreviewingSource(linked);
                                }}
                                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-violet-950/20 text-[9px] text-violet-400 font-mono tracking-wide border border-violet-500/20 hover:border-violet-400/40 flex items-center gap-1 transition-all"
                              >
                                <span>[{cIdx + 1}]</span>
                                <span className="truncate max-w-[80px]">{cite.sourceName}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-xl glass-card text-slate-400 rounded-tl-none">
                    <span className="text-[10px] font-mono text-slate-500">NOTEMIND CO-PILOT</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Question Pills bar */}
            {notebook.chatHistory.length === 0 && (
              <div className="py-2 flex flex-wrap gap-1.5 overflow-x-auto select-none">
                {SUGGESTED_QST.map((qst, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => triggerSuggestedQuestion(qst)}
                    className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-950 border border-[#1e1e2e] text-[10px] text-slate-400 hover:text-cyan-400 transition-all font-medium text-left"
                  >
                    {qst}
                  </button>
                ))}
              </div>
            )}

            {/* Input Chat layout */}
            <div className="mt-4 pt-3 border-t border-[#1e1e2e]/45 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                disabled={chatLoading}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                placeholder={isAr ? 'اطرح سؤالاً يستند بالكامل إلى ملفاتك المرفقة...' : 'Query your private document collection...'}
                className="flex-grow glass-input rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-sans"
              />
              <button
                onClick={handleSendQuery}
                disabled={chatLoading || !chatMessage}
                className="px-4 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all font-semibold cursor-pointer shrink-0"
              >
                <Send size={13} />
              </button>
            </div>

          </div>
        </section>

        {/* PANEL C (RIGHT): Studio tools & AI Voice Podcast overview generation (columns 9 to 12) */}
        <section className="lg:col-span-1 xl:col-span-4 p-5 flex flex-col justify-between max-h-[calc(100vh-68px)] bg-[#0a0a0f] lg:overflow-y-auto border-t lg:border-t-0">
          <div className="space-y-6 flex flex-col h-full justify-between">
            
            <div className="space-y-4">
              
              {/* Tabs buttons navigation toolbar */}
              <div className="grid grid-cols-5 glass-card p-0.5 rounded-lg border border-white/5 text-[9px] md:text-[10px] font-semibold text-slate-400 select-none">
                <button
                  onClick={() => setActiveStudioTab('summarize')}
                  className={`py-1.5 rounded-md transition-all text-center leading-tight ${activeStudioTab === 'summarize' ? 'bg-[#1e1e2e] text-white' : 'hover:text-white'}`}
                  title={isAr ? 'ملخصات الاستوديو' : 'Studio Engine'}
                >
                  {isAr ? 'ملخصات' : 'Studio'}
                </button>
                <button
                  onClick={() => setActiveStudioTab('questions')}
                  className={`py-1.5 rounded-md transition-all text-center leading-tight ${activeStudioTab === 'questions' ? 'bg-[#1e1e2e] text-white' : 'hover:text-white'}`}
                  title={isAr ? 'اختبار الأسئلة من الذكاء الاصطناعي' : 'AI Questions'}
                >
                  {isAr ? 'أسئلة' : 'Quiz'}
                </button>
                <button
                  onClick={() => setActiveStudioTab('flashcards')}
                  className={`py-1.5 rounded-md transition-all text-center leading-tight ${activeStudioTab === 'flashcards' ? 'bg-[#1e1e2e] text-white' : 'hover:text-white'}`}
                  title={isAr ? 'بطاقات التكرار والذاكرة التفاعلية' : 'AI Flashcards'}
                >
                  {isAr ? 'بطاقات' : 'Cards'}
                </button>
                <button
                  onClick={() => setActiveStudioTab('infographic')}
                  className={`py-1.5 rounded-md transition-all text-center leading-tight ${activeStudioTab === 'infographic' ? 'bg-[#1e1e2e] text-white' : 'hover:text-white'}`}
                  title={isAr ? 'بناء إنفوجرافيك مفاهيمي ذكي' : 'AI Infographics'}
                >
                  {isAr ? 'بياني' : 'Visual'}
                </button>
                <button
                  onClick={() => setActiveStudioTab('research')}
                  className={`py-1.5 rounded-md transition-all text-center leading-tight ${activeStudioTab === 'research' ? 'bg-[#1e1e2e] text-white' : 'hover:text-white'}`}
                  title={isAr ? 'البحث اللامركزي المستقل عن الويب' : 'Deep Research'}
                >
                  {isAr ? 'أبحاث' : 'Search'}
                </button>
              </div>

              {/* TAB CONTENT: Studio summarizes and materials */}
              {activeStudioTab === 'summarize' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-semibold">
                    <button 
                      onClick={() => {
                        setActiveStudioSubTab('summary');
                        if (!notebook.studioOutput?.summary) {
                          handleGenerateStudio('summary');
                        }
                      }}
                      className={`p-2 border rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeStudioSubTab === 'summary' 
                          ? 'bg-violet-600/20 border-violet-500/60 text-white shadow-[0_0_10px_rgba(124,58,237,0.25)]' 
                          : 'bg-slate-900 border-[#1e1e2e] text-slate-400 hover:text-white hover:bg-[#111118]/80'
                      }`}
                    >
                      <Sparkles size={11} className={activeStudioSubTab === 'summary' ? "text-violet-300" : "text-violet-400"} />
                      <span>{isAr ? 'ملخص رئيسي' : 'Key Summary'}</span>
                      {notebook.studioOutput?.summary && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5" />
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveStudioSubTab('studyGuide');
                        if (!notebook.studioOutput?.studyGuide) {
                          handleGenerateStudio('studyGuide');
                        }
                      }}
                      className={`p-2 border rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeStudioSubTab === 'studyGuide' 
                          ? 'bg-violet-600/20 border-violet-500/60 text-white shadow-[0_0_10px_rgba(124,58,237,0.25)]' 
                          : 'bg-slate-900 border-[#1e1e2e] text-slate-400 hover:text-white hover:bg-[#111118]/80'
                      }`}
                    >
                      <Compass size={11} className={activeStudioSubTab === 'studyGuide' ? "text-cyan-300" : "text-cyan-400"} />
                      <span>{isAr ? 'دليل دراسي' : 'Study Guide'}</span>
                      {notebook.studioOutput?.studyGuide && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5" />
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveStudioSubTab('faq');
                        if (!notebook.studioOutput?.faq) {
                          handleGenerateStudio('faq');
                        }
                      }}
                      className={`p-2 border rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeStudioSubTab === 'faq' 
                          ? 'bg-violet-600/20 border-violet-500/60 text-white shadow-[0_0_10px_rgba(124,58,237,0.25)]' 
                          : 'bg-slate-900 border-[#1e1e2e] text-slate-400 hover:text-white hover:bg-[#111118]/80'
                      }`}
                    >
                      <Layers size={11} className={activeStudioSubTab === 'faq' ? "text-violet-300" : "text-violet-400"} />
                      <span>{isAr ? 'أهم الأسئلة' : 'FAQs Page'}</span>
                      {notebook.studioOutput?.faq && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5" />
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setActiveStudioSubTab('tables');
                        if (!notebook.studioOutput?.tables) {
                          handleGenerateStudio('tables');
                        }
                      }}
                      className={`p-2 border rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeStudioSubTab === 'tables' 
                          ? 'bg-violet-600/20 border-violet-500/60 text-white shadow-[0_0_10px_rgba(124,58,237,0.25)]' 
                          : 'bg-slate-900 border-[#1e1e2e] text-slate-400 hover:text-white hover:bg-[#111118]/80'
                      }`}
                    >
                      <FileSpreadsheet size={11} className={activeStudioSubTab === 'tables' ? "text-cyan-300" : "text-cyan-400"} />
                      <span>{isAr ? 'جداول بيانات' : 'Data Tables'}</span>
                      {notebook.studioOutput?.tables && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5" />
                      )}
                    </button>
                  </div>

                  {studioLoading ? (
                    <div className="p-8 border border-slate-900 rounded-xl bg-[#111118]/45 flex flex-col justify-center items-center text-center">
                      <Loader2 size={22} className="text-violet-400 animate-spin mb-2" />
                      <p className="text-[11px] text-slate-400 font-semibold">{isAr ? 'جاري تحضير وتوليد المادة الفاخرة...' : 'Synthesizing Studio compilation...'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Render generated output lists based on selected categories */}
                      <div className="p-4.5 glass-card border border-white/5 rounded-xl max-h-[340px] overflow-y-auto">
                        {activeStudioSubTab === 'summary' && notebook.studioOutput?.summary ? (
                          <div className="space-y-4 text-left">
                            <h4 className="text-xs uppercase font-mono tracking-widest text-[#a855f7] font-bold">{isAr ? 'الملخص المستولد الحقيقي' : 'Generated Summary Output'}</h4>
                            <SimpleMarkdown text={notebook.studioOutput.summary} />
                          </div>
                        ) : activeStudioSubTab === 'studyGuide' && notebook.studioOutput?.studyGuide ? (
                          <div className="space-y-4 text-left">
                            <h4 className="text-xs uppercase font-mono tracking-widest text-[#a855f7] font-bold">{isAr ? 'الدليل الدراسي المولد' : 'Generated Study Guide'}</h4>
                            <SimpleMarkdown text={notebook.studioOutput.studyGuide} />
                          </div>
                        ) : activeStudioSubTab === 'faq' && notebook.studioOutput?.faq ? (
                          <div className="space-y-4 text-left">
                            <h4 className="text-xs uppercase font-mono tracking-widest text-[#a855f7] font-bold">{isAr ? 'أهم الأسئلة المستقاة' : 'Generated FAQ Material'}</h4>
                            <SimpleMarkdown text={notebook.studioOutput.faq} />
                          </div>
                        ) : activeStudioSubTab === 'tables' && notebook.studioOutput?.tables ? (
                          <div className="space-y-4 text-left">
                            <h4 className="text-xs uppercase font-mono tracking-widest text-[#a855f7] font-bold">{isAr ? 'جداول البيانات والتحليلات' : 'Grounded Comparison Matrix'}</h4>
                            <SimpleMarkdown text={notebook.studioOutput.tables} />
                          </div>
                        ) : (
                          <div className="text-center py-12 text-slate-600 text-[11px]">
                            <p>{isAr ? 'لم يتم توليد هذا القسم بعد في الاستوديو.' : 'No Studio artifact compiled for this section yet.'}</p>
                            <p className="mt-1 text-[10px] text-slate-700">{isAr ? 'اضغط على زر الإنشاء هاهنا لبنائه بالذكاء الاصطناعي.' : 'Click below to synthesize it now.'}</p>
                            
                            <button
                              onClick={() => handleGenerateStudio(activeStudioSubTab)}
                              className="mt-4 px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-[10px] font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                            >
                              {isAr ? 'إنشاء الآن باستخدام الذكاء الاصطناعي' : 'Generate Now with AI'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* PDF Export & Regenerate buttons */}
                      {notebook.studioOutput?.[activeStudioSubTab] && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleGenerateStudio(activeStudioSubTab)}
                            disabled={studioLoading}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 text-[10px] font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <RefreshCw size={10} className={studioLoading ? "animate-spin" : ""} />
                            <span>{isAr ? 'تحديث/توليد جديد' : 'Regenerate'}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              const titles: Record<string, string> = {
                                summary: isAr ? 'الملخص المستولد الحقيقي' : 'Key Summary Report',
                                studyGuide: isAr ? 'دليل الدراسة الهيكلي' : 'Structural Study Guide',
                                faq: isAr ? 'دليل الأسئلة الشائعة' : 'Frequently Asked Questions Guide',
                                tables: isAr ? 'جداول وتحليلات المقارنة' : 'Data Tables Matrix'
                              };
                              const title = titles[activeStudioSubTab] || 'NoteMind Document';
                              const content = notebook.studioOutput?.[activeStudioSubTab] || '';
                              handleExportToPDF(title, content, isAr);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300 transition-all border border-cyan-500/20 text-[10px] font-medium flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <Download size={10} />
                            <span>{isAr ? 'تصدير كمستند' : 'Export File'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: Interactive AI Questions / Quizzes */}
              {activeStudioTab === 'questions' && (
                <div className="space-y-4 font-sans">
                  <div className="rounded-xl glass-card p-4 text-center relative overflow-hidden">
                    <span className="absolute -top-12 -right-12 w-24 h-24 bg-violet-600/10 blur-2xl rounded-full" />
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{isAr ? 'اختبر معلوماتك' : 'STUDY QUIZ'}</span>
                      <Sparkles size={14} className="text-violet-400 shrink-0" />
                    </div>
                    
                    <h4 className="text-xs font-bold text-white uppercase text-left">{isAr ? 'منشئ الأسئلة المتفاعل بـ AI' : 'Interactive AI Test Generator'}</h4>
                    <p className="text-[10px] text-slate-404 mt-1 text-left leading-relaxed">
                      {isAr ? 'يقوم المحرك بفحص مصادر مكتبتك لتشفير أسئلة ذكاء اصطناعي تفاعلية مع خيار التحقق الفوري والتقييم الذاتي الدقيق.' : 'Scans your document library to compile custom multiple-choice and true/false exam sheets.'}
                    </p>

                    {/* Controls */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-left text-[10px] text-slate-300">
                      <div>
                        <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">{isAr ? 'مستوى الصعوبة' : 'DIFFICULTY'}</label>
                        <select
                          value={quizDifficulty}
                          onChange={(e: any) => setQuizDifficulty(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 rounded p-1.5 text-[10px] text-white focus:outline-none"
                        >
                          <option value="easy">{isAr ? 'سهل' : 'Easy'}</option>
                          <option value="medium">{isAr ? 'متوسط' : 'Medium'}</option>
                          <option value="hard">{isAr ? 'صعب جداً' : 'Hard'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">{isAr ? 'نوع الأسئلة' : 'QUESTION TYPE'}</label>
                        <select
                          value={quizType}
                          onChange={(e: any) => setQuizType(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 rounded p-1.5 text-[10px] text-white focus:outline-none"
                        >
                          <option value="multiple-choice">{isAr ? 'اختيارات متعددة' : 'Multiple Choice'}</option>
                          <option value="true-false">{isAr ? 'صح أم خطأ' : 'True / False'}</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={quizLoading || notebook.sources.length === 0}
                      onClick={handleGenerateQuestions}
                      className="mt-4 w-full py-2 px-4 rounded-lg text-white font-bold text-[10px] tracking-wide bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {quizLoading ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>{isAr ? 'جاري الصياغة...' : 'Synthesizing quiz...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          <span>{isAr ? 'إنشاء ورقة الأسئلة' : 'Generate interactive quiz'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {quizQuestions && quizQuestions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-mono text-slate-400">{isAr ? `تم تحضير ${quizQuestions.length} أسئلة` : `Loaded ${quizQuestions.length} Questions`}</span>
                        <button
                          onClick={() => {
                            // Download Text Questionnaire as fallback
                            const questionnaireText = quizQuestions.map((q, qI) => {
                              const opts = q.options ? `\nOptions:\n${q.options.map((o: any, idx: number) => `   [ ] ${o}`).join('\n')}` : '';
                              return `${qI + 1}. ${q.question}${opts}\nCorrect Answer: ${q.correctAnswer}\nExplanation: ${q.explanation}\n`;
                            }).join('\n\n');
                            const blob = new Blob([questionnaireText], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${notebook.title}_quiz_guide.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="text-[9px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Download size={10} />
                          <span>{isAr ? 'تصدير الأسئلة' : 'Export Quiz'}</span>
                        </button>
                      </div>

                      {quizQuestions.map((q, idx) => {
                        const questionId = q.id || `q-${idx}`;
                        const isRevealed = !!revealedAnswers[questionId];
                        const selectedAns = selectedAnswers[questionId];
                        
                        return (
                          <div key={questionId} className="p-4 rounded-xl border border-white/5 bg-[#0d0d15] space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-[10px] font-mono text-violet-400 font-bold bg-violet-950/40 px-1.5 py-0.5 rounded">Q{idx + 1}</span>
                              <p className="text-[11px] font-semibold text-slate-100 flex-grow leading-relaxed text-left">{q.question}</p>
                            </div>

                            {/* Options choices */}
                            <div className="grid grid-cols-1 gap-1.5 text-[10px]">
                              {q.options?.map((opt: string, optI: number) => {
                                const isSelected = selectedAns === opt;
                                const isCorrect = opt === q.correctAnswer;
                                const isWrongSelection = isSelected && !isCorrect;
                                
                                let optionStyle = "border-white/5 bg-slate-950/65 text-slate-300 hover:bg-slate-900";
                                if (isRevealed) {
                                  if (isCorrect) {
                                    optionStyle = "border-emerald-500/50 bg-emerald-950/20 text-emerald-400 font-bold";
                                  } else if (isWrongSelection) {
                                    optionStyle = "border-rose-500/50 bg-rose-950/20 text-rose-400 line-through";
                                  } else {
                                    optionStyle = "border-white/5 bg-slate-950/40 text-slate-500 pointer-events-none";
                                  }
                                } else if (isSelected) {
                                  optionStyle = "border-cyan-500/50 bg-cyan-950/20 text-cyan-400 font-semibold";
                                }

                                return (
                                  <button
                                    key={optI}
                                    disabled={isRevealed}
                                    onClick={() => {
                                      setSelectedAnswers(prev => ({ ...prev, [questionId]: opt }));
                                      setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
                                    }}
                                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-start gap-2 cursor-pointer ${optionStyle}`}
                                  >
                                    <span className="w-4 h-4 rounded-full border border-current text-[9px] flex items-center justify-center shrink-0 font-mono">
                                      {String.fromCharCode(65 + optI)}
                                    </span>
                                    <span className="leading-tight">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanatory feedback */}
                            {isRevealed && (
                              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] text-slate-300 space-y-1">
                                <p className="font-bold text-slate-100 flex items-center gap-1">
                                  {selectedAns === q.correctAnswer ? (
                                    <span className="text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 size={12} />
                                      {isAr ? 'إجابة صحيحة!' : 'Excellent, Correct!'}
                                    </span>
                                  ) : (
                                    <span className="text-rose-400 flex items-center gap-1">
                                      <XCircle size={12} />
                                      {isAr ? `خطأ. الإجابة هي: ${q.correctAnswer}` : `Incorrect. Correct is: ${q.correctAnswer}`}
                                    </span>
                                  )}
                                </p>
                                <p className="leading-relaxed text-[10px] font-sans text-slate-400 text-left">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: Interactive Spaced-Repetition Cards */}
              {activeStudioTab === 'flashcards' && (
                <div className="space-y-4 font-sans">
                  <div className="rounded-xl glass-card p-4 text-center relative overflow-hidden">
                    <span className="absolute -top-12 -right-12 w-24 h-24 bg-rose-600/10 blur-2xl rounded-full" />
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest">{isAr ? 'مراجعة نشطة' : 'SPACED REPETITION'}</span>
                      <Layers size={14} className="text-pink-400 shrink-0" />
                    </div>

                    <h4 className="text-xs font-bold text-white uppercase text-left">{isAr ? 'مولد البطاقات الرقمية المتفوق' : 'Spaced Repetition Flashcards'}</h4>
                    <p className="text-[10px] text-slate-404 mt-1 text-left leading-relaxed">
                      {isAr ? 'يقوم ذكاء الاستوديو باختزال العناوين والمصطلحات الرئيسية لمستنداتك وتجميع حزمة بطاقات مراجعة تفاعلية ثنائية الأوجه.' : 'Converts core source literature concepts into double-sided active recall flipping cards.'}
                    </p>

                    <button
                      type="button"
                      disabled={flashcardLoading || notebook.sources.length === 0}
                      onClick={handleGenerateFlashcards}
                      className="mt-4 w-full py-2 px-4 rounded-lg text-white font-bold text-[10px] tracking-wide bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {flashcardLoading ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>{isAr ? 'جاري البناء...' : 'Squeezing cards...'}</span>
                        </>
                      ) : (
                        <>
                          <Layers size={12} />
                          <span>{isAr ? 'إنشاء بطاقات المذاكرة' : 'Build interactive flashcards'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {flashcards && flashcards.length > 0 && (
                    <div className="space-y-4">
                      {/* Interactive Progress Tracking */}
                      <div className="flex items-center justify-between px-1 text-[10px] text-slate-404">
                        <span>{isAr ? `بطاقة ${currentCardIdx + 1} من ${flashcards.length}` : `Card ${currentCardIdx + 1} of ${flashcards.length}`}</span>
                        <div className="flex gap-2">
                          <span className="text-emerald-400 font-bold font-mono">
                            {Object.values(cardKnowState).filter(s => s === 'know').length} ✔
                          </span>
                          <span className="text-pink-400 font-bold font-mono">
                            {Object.values(cardKnowState).filter(s => s === 'learn').length} ✕
                          </span>
                        </div>
                      </div>

                      {/* Card Flipping Stage */}
                      <div
                        onClick={() => setFlippedCards(prev => ({ ...prev, [currentCardIdx]: !prev[currentCardIdx] }))}
                        className="w-full min-h-[185px] rounded-2xl cursor-pointer relative transition-all duration-500"
                        style={{
                          transform: flippedCards[currentCardIdx] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Front Side */}
                        <div 
                          className="absolute inset-0 w-full h-full p-6 py-10 rounded-2xl glass-card flex flex-col justify-center items-center text-center border border-white/5 bg-[#0a0a0f] shadow-lg backface-hidden"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <span className="text-[7px] font-mono tracking-widest text-slate-500 uppercase absolute top-4">{isAr ? 'المفهوم الأساسي' : 'CONCEPT / TERM'}</span>
                          <h4 className="text-xs md:text-sm font-bold text-slate-100 leading-relaxed max-w-xs">{flashcards[currentCardIdx]?.front}</h4>
                          <span className="text-[8px] font-semibold text-pink-400 mt-5 px-2 py-0.5 rounded bg-pink-950/20 border border-pink-905/30">
                            {isAr ? 'انقر بالماوس لقلب البطاقة' : 'Tap to Flip Card'}
                          </span>
                        </div>

                        {/* Back Side */}
                        <div 
                          className="absolute inset-0 w-full h-full p-6 py-8 rounded-2xl glass-card flex flex-col justify-center items-center text-center border border-pink-500/20 bg-[#120a1c] shadow-lg backface-hidden"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          <span className="text-[7px] font-mono tracking-widest text-pink-400 uppercase absolute top-4">{isAr ? 'التحليلات والمحتوى' : 'DETAILED KNOWLEDGE'}</span>
                          <p className="text-[10px] text-slate-200 mt-2 leading-relaxed max-w-md overflow-y-auto max-h-[110px] text-left">{flashcards[currentCardIdx]?.back}</p>
                          <span className="text-[8px] font-mono text-slate-505 absolute bottom-4">{isAr ? 'انقر لقلبها مجدداً' : 'Click to flip back'}</span>
                        </div>
                      </div>

                      {/* Spaced repetition review nodes */}
                      <div className="flex justify-between items-center bg-[#0d0d15] p-2.5 rounded-xl border border-white/5">
                        <button
                          disabled={currentCardIdx === 0}
                          onClick={() => {
                            setCurrentCardIdx(prev => prev - 1);
                          }}
                          className="p-1 px-2.5 bg-slate-950 hover:bg-slate-900 text-slate-404 rounded-lg text-[10px] font-mono border border-white/5 disabled:opacity-30 cursor-pointer"
                        >
                          ← {isAr ? 'السابق' : 'Prev'}
                        </button>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              const cardId = flashcards[currentCardIdx]?.id || `fc-${currentCardIdx}`;
                              setCardKnowState(p => ({ ...p, [cardId]: 'learn' }));
                              if (currentCardIdx < flashcards.length - 1) {
                                setCurrentCardIdx(p => p + 1);
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900 text-rose-300 text-[9px] font-bold cursor-pointer"
                          >
                            ✕ {isAr ? 'مراجعة' : 'Review'}
                          </button>
                          <button
                            onClick={() => {
                              const cardId = flashcards[currentCardIdx]?.id || `fc-${currentCardIdx}`;
                              setCardKnowState(p => ({ ...p, [cardId]: 'know' }));
                              if (currentCardIdx < flashcards.length - 1) {
                                setCurrentCardIdx(p => p + 1);
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-950 text-emerald-400 text-[9px] font-bold cursor-pointer"
                          >
                            ✔ {isAr ? 'أعرفه' : 'Got It!'}
                          </button>
                        </div>

                        <button
                          disabled={currentCardIdx === flashcards.length - 1}
                          onClick={() => {
                            setCurrentCardIdx(prev => prev + 1);
                          }}
                          className="p-1 px-2.5 bg-slate-950 hover:bg-slate-900 text-slate-404 rounded-lg text-[10px] font-mono border border-white/5 disabled:opacity-30 cursor-pointer"
                        >
                          {isAr ? 'التالي' : 'Next'} →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: AI Infographics Image Synthesis (Nano Banana) */}
              {activeStudioTab === 'infographic' && (
                <div className="space-y-4 font-sans">
                  <div className="rounded-xl glass-card p-4 text-center relative overflow-hidden">
                    <span className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-600/10 blur-2xl rounded-full" />
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{isAr ? 'محرك نانو بنانا' : 'NANO BANANA IMAGEN'}</span>
                      <Activity size={14} className="text-cyan-400 shrink-0" />
                    </div>

                    <h4 className="text-xs font-bold text-white uppercase text-left">{isAr ? 'لوحة إنفوجرافيك ذكاء اصطناعي مفاهيمية' : 'Nano Banana Infographic Engine'}</h4>
                    <p className="text-[10px] text-slate-404 mt-1 text-left leading-relaxed">
                      {isAr ? 'يقوم نانو بنانا باستخلاص 5 مفاهيم ذهبية دقيقة من مستنداتك ورسم خريطة بيانية جدارية نيون ملونة.' : 'Extracts document keywords to synthesize custom educational diagrams and conceptual neon graphics.'}
                    </p>

                    <button
                      type="button"
                      disabled={infographicLoading || notebook.sources.length === 0}
                      onClick={handleGenerateInfographic}
                      className="mt-4 w-full py-2 px-4 rounded-lg text-white font-bold text-[10px] tracking-wide bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {infographicLoading ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>{isAr ? 'جاري الرسم الهندسي...' : 'Drawing Infographic...'}</span>
                        </>
                      ) : (
                        <>
                          <Activity size={12} />
                          <span>{isAr ? 'إنشاء الإنفوجرافيك التفاعلي' : 'Synthesize Visual Infographic'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {infographicData && (
                    <div className="p-4 rounded-2xl border border-white/5 bg-[#0d0d15] space-y-4">
                      <div className="relative rounded-xl overflow-hidden aspect-square border border-white/10 group bg-black/40">
                        <img
                          src={infographicData.imageUrl}
                          alt="Conceptual Infographic Visual Schema"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4">
                          <Eye size={18} className="text-cyan-400 mb-1" />
                          <span className="text-[9px] font-mono text-slate-300 font-bold uppercase">{isAr ? 'جاهزة للحفظ والتنزيل' : 'Ready to save or export'}</span>
                        </div>
                      </div>

                      {/* Metadata Details Info Box */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-300 leading-relaxed italic text-left">{infographicData.info}</p>
                        
                        {infographicData.concepts && (
                          <div className="space-y-1.5 text-left">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{isAr ? 'المفاهيم المشفرة بالرسم البياني:' : 'KEY CONCEPT SEGMENTS:'}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {infographicData.concepts.map((concept: string, cI: number) => (
                                <span
                                  key={cI}
                                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#151525] border border-white/5 text-cyan-400 select-all"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = infographicData.imageUrl;
                            a.download = `${notebook.title}_infographic.${infographicData.imageUrl.includes('svg+xml') ? 'svg' : 'jpg'}`;
                            a.click();
                          }}
                          className="w-full py-2 text-center text-[10px] font-semibold text-[#f1f1f1] border border-white/5 bg-[#0a0a0f] hover:bg-[#11111a] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download size={11} />
                          <span>{isAr ? 'تحميل ملف الرسم التوضيحي' : 'Download Infographic file'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* TAB CONTENT: Autonomous Deep Research mode */}
              {activeStudioTab === 'research' && (
                <div className="space-y-4">
                  <div className="rounded-xl glass-card p-4 text-center">
                    <Compass size={24} className="text-violet-400 mx-auto mb-2.5 animate-spin" />
                    <h4 className="text-xs font-bold text-white font-display uppercase">{isAr ? 'البحث المعمق اللامركزي المستقل' : 'Autonomous Deep Research System'}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      {isAr ? 'قم بكتابة موضوع معقد وسيقوم ذكاء NoteMind بالبحث والزحف عبر الويب لإحضار أفضل المقالات وتوليد دراسة شاملة.' : 'Enter an advanced topic to deploy crawling spiders on Google Web. Retrieves real grounded data & saves report.'}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        value={researchTopic}
                        onChange={(e) => setResearchTopic(e.target.value)}
                        placeholder={isAr ? 'اكتب موضوعاً هاهنا... (مثال: superconducting qubit types)' : 'Research keyword/phrases...'}
                        className="flex-grow bg-slate-950 border border-[#1e1e2e] rounded-lg p-2.5 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                      />
                      <button
                        onClick={handleDeepResearch}
                        disabled={researchLoading || !researchTopic}
                        className="px-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-[10px] rounded-lg hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] shrink-0 transition-all active:scale-95 cursor-pointer"
                      >
                        {isAr ? 'بحث' : 'Crawl'}
                      </button>
                    </div>
                  </div>

                  {researchLoading ? (
                    <div className="p-8 border border-slate-900 rounded-xl bg-[#111118]/45 flex flex-col justify-center items-center text-center">
                      <Loader2 size={18} className="text-violet-400 animate-spin mb-2" />
                      <p className="text-[10px] text-slate-400">{isAr ? 'جاري تحليل الخيوط والزحف المستقل عبر الويب...' : 'Deploying search grounding. Validating web signatures...'}</p>
                    </div>
                  ) : researchReport ? (
                    <div className="space-y-2">
                      <div className="p-4 glass-card rounded-xl max-h-[220px] overflow-y-auto text-left">
                        <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold mb-2">Autonomous Web Research Result</h4>
                        <SimpleMarkdown text={researchReport} />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const title = isAr ? 'تقرير البحث المعمق المستقل' : 'Autonomous Deep Research Report';
                            handleExportToPDF(title, researchReport, isAr);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-[10px] flex items-center gap-1 shadow-md shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <Download size={10} />
                          <span>{isAr ? 'تصدير كـ PDF' : 'Export to PDF'}</span>
                        </button>
                      </div>
                    </div>
                  ) : null}

                </div>
              )}

            </div>

          </div>
        </section>

      </div>

      {/* WEB SCRAPER MODALS LAYOUT FORM */}
      <AnimatePresence>
        {showWebModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowWebModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96}}
              className="relative z-10 w-full max-w-md bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 shadow-2xl text-xs"
            >
              <button title="close web scraper dialog" onClick={() => setShowWebModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                <X size={15} />
              </button>
              <h3 className="text-md font-display font-bold text-white mb-4">
                {isAr ? 'جلب واستخراج المحتوى من رابط ويب' : 'Import contents from Web Address'}
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">{isAr ? 'عنوان رابط الويب' : 'Destination URL'}</label>
                  <input
                    type="url"
                    required
                    value={scrapedUrl}
                    onChange={(e) => setScrapedUrl(e.target.value)}
                    placeholder="https://vercel.com/blog/scalability"
                    className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {scraping ? (
                  <div className="py-4 flex flex-col justify-center items-center text-center">
                    <Loader2 size={18} className="text-cyan-400 animate-spin mb-2" />
                    <p className="text-[11px] text-slate-400">{isAr ? 'جاري الاتصال وسحب النصوص والنسخ الخطي...' : 'Extracting plain marks from HTML and structures...'}</p>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setShowWebModal(false)}
                      className="px-4 py-2 bg-slate-900 border border-[#1e1e2e] text-slate-400 rounded-lg"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      onClick={handleScrapeUrl}
                      className="px-5 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all"
                    >
                      {isAr ? 'جلب وسحب النصوص' : 'Deploy Scraper Engine'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* YOUTUBE SCROLLER IMPORT MODAL */}
      <AnimatePresence>
        {showYoutubeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowYoutubeModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96}}
              className="relative z-10 w-full max-w-md bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 shadow-2xl text-xs"
            >
              <button title="close youtube dialog" onClick={() => setShowYoutubeModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                <X size={15} />
              </button>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded bg-red-500/10 text-red-500">
                  <Youtube size={18} />
                </div>
                <h3 className="text-sm font-display font-bold text-white">
                  {isAr ? 'تحميل وتفريغ نصوص فيديو يوتيوب' : 'Index & Transcribe YouTube Video'}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-11 hover:text-white transition-colors duration-200">
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                    {isAr 
                      ? 'أدخل رابط فيديو يوتيوب وسنقوم بسحب بيانات الفيديو وتلخيص المحتوى وصياغة مرجع كامل مع خطوط التوقيت لأسئلتك.' 
                      : 'Provide a valid YouTube video address. We will retrieve the title and generate a full timeline text transcript as a study source.'
                    }
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">{isAr ? 'رابط فيديو يوتيوب' : 'YouTube Link'}</label>
                  <input
                    type="url"
                    required
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                {scraping ? (
                  <div className="py-4 flex flex-col justify-center items-center text-center">
                    <Loader2 size={18} className="text-red-500 animate-spin mb-2" />
                    <p className="text-[11px] text-slate-400">
                      {isAr 
                        ? 'يجري استرجاع تفاصيل يوتيوب وتفريغ النصوص خطوة بخطوة بالذكاء الاصطناعي...' 
                        : 'Retrieving YouTube video data and generating transcript keynotes...'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setShowYoutubeModal(false)}
                      className="px-4 py-2 bg-slate-900 border border-[#1e1e2e] text-slate-400 rounded-lg"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      onClick={handleScrapeYoutubeUrl}
                      className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all"
                    >
                      {isAr ? 'جلب وتفريغ الفيديو' : 'Fetch Video & Transcribe'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TEXT PASTING IMPORT MODAL */}
      <AnimatePresence>
        {showTextModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowTextModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96}}
              className="relative z-10 w-full max-w-md bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 shadow-2xl text-xs"
            >
              <button title="close raw text dialog" onClick={() => setShowTextModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                <X size={15} />
              </button>
              <h3 className="text-md font-display font-bold text-white mb-4">
                {isAr ? 'لصق وصياغة مصدر نصي يدوي' : 'Compile Manual Text Source'}
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">{isAr ? 'اسم المصنف' : 'Document Title / File Name'}</label>
                  <input
                    type="text"
                    required
                    value={rawTextName}
                    onChange={(e) => setRawTextName(e.target.value)}
                    placeholder="My study notes on quantum mechanics"
                    className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">{isAr ? 'محتوى النص' : 'Plain text string content'}</label>
                  <textarea
                    required
                    value={rawTextContent}
                    onChange={(e) => setRawTextContent(e.target.value)}
                    rows={6}
                    placeholder="Superconducting Josephson junctions operates..."
                    className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTextModal(false)}
                    className="px-4 py-2 bg-slate-900 border border-[#1e1e2e] text-slate-400 rounded-lg cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleAddTextSource}
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
                  >
                    {isAr ? 'إدراج المصدر' : 'Assemble Source'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GOOGLE DRIVE DOCUMENT SEARCH AND IMPORT MODAL */}
      <AnimatePresence>
        {showDriveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowDriveModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative z-10 w-full max-w-2xl bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 shadow-2xl text-xs overflow-hidden flex flex-col max-h-[85vh]"
            >
              <button 
                title={isAr ? 'إغلاق' : 'Close'} 
                onClick={() => setShowDriveModal(false)} 
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-md font-display font-bold text-white">
                  {isAr ? 'استيراد الملفات والمستندات من جوجل درايف' : 'Import files from Google Drive'}
                </h3>
              </div>

              {driveStep === 'login' ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-5">
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/15 rounded-full text-emerald-400">
                    <span className="text-2xl font-bold font-mono">Drive</span>
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-sm font-semibold text-white">
                      {isAr ? 'مستكشف ملفات جوجل درايف الآمن' : 'Secure Google Drive Access'}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isAr ? 'اضغط للمصادقة وتخويل NoteMind بالوصول الآمن لحسابك على درايف لجلب المستندات.' : 'Connect your account to securely parse and index your personal PDF, TXT, and Google Doc files.'}
                    </p>
                  </div>

                  {driveError && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg text-[10px] w-full max-w-xs">
                      {driveError}
                    </div>
                  )}

                  <button
                    onClick={handleDriveSignIn}
                    disabled={driveLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {driveLoading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>{isAr ? 'جاري الاتصال بجوجل...' : 'Connecting...'}</span>
                      </>
                    ) : (
                      <span>{isAr ? 'تسجيل الدخول باستخدام Google' : 'Sign in with Google'}</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col flex-grow min-h-0 space-y-4">
                  {/* Drive User info bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-[#1e1e2e]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 flex items-center justify-center font-bold text-[9px] uppercase">
                        {driveUser?.displayName?.[0] || 'G'}
                      </div>
                      <span>
                        {isAr ? `متصل بـ ${driveUser?.email}` : `Connected as ${driveUser?.email}`}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setDriveToken(null);
                        setDriveStep('login');
                      }}
                      className="text-[9px] hover:text-red-400 transition-colors cursor-pointer"
                    >
                      {isAr ? 'قطع الاتصال' : 'Disconnect'}
                    </button>
                  </div>

                  {/* Filter and Search bars */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={driveSearch}
                        onChange={(e) => setDriveSearch(e.target.value)}
                        placeholder={isAr ? 'ابحث في ملفات درايف...' : 'Search Google Drive files...'}
                        className="w-full bg-slate-950 border border-[#1e1e2e] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 text-[11px]"
                      />
                    </div>

                    <div className="flex gap-1 border border-[#1e1e2e] p-1 rounded-xl bg-slate-950 shrink-0">
                      {(['all', 'pdf', 'doc', 'txt'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setDriveFilter(mode)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-semibold transition-all cursor-pointer ${driveFilter === mode ? 'bg-slate-900 text-white border border-[#1e1e2e]' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {mode === 'all' && (isAr ? 'الكل' : 'All')}
                          {mode === 'pdf' && 'PDF'}
                          {mode === 'doc' && (isAr ? 'مستندات' : 'Docs')}
                          {mode === 'txt' && 'TXT'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {driveError && (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg text-[10px]">
                      {driveError}
                    </div>
                  )}

                  {/* Files Browser ListView */}
                  <div className="flex-grow min-h-[250px] overflow-y-auto border border-[#1e1e2e] rounded-xl bg-slate-950/60 p-2 space-y-1">
                    {driveLoading ? (
                      <div className="h-full flex flex-col justify-center items-center py-16 text-slate-500">
                        <Loader2 size={20} className="animate-spin text-emerald-400 mb-2" />
                        <span className="text-[10px]">{isAr ? 'جاري جلب قائمة الملفات...' : 'Loading files list from Google Drive...'}</span>
                      </div>
                    ) : (() => {
                      // Client-side filtering logic
                      const filtered = driveFiles.filter((file) => {
                        const nameMatches = file.name.toLowerCase().includes(driveSearch.toLowerCase());
                        if (!nameMatches) return false;
                        
                        if (driveFilter === 'pdf') {
                          return file.mimeType === 'application/pdf';
                        }
                        if (driveFilter === 'doc') {
                          return file.mimeType === 'application/vnd.google-apps.document';
                        }
                        if (driveFilter === 'txt') {
                          return file.mimeType === 'text/plain';
                        }
                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="h-full flex flex-col justify-center items-center py-16 text-slate-600 italic">
                            <p>{isAr ? 'لم يتم العثور على ملفات تطابق البحث.' : 'No files matching criteria found.'}</p>
                            <p className="text-[9px] text-slate-500 mt-1">{isAr ? 'تأكد من وجود ملفات PDF أو مستندات Google Doc أو TXT في حسابك.' : 'Be sure you have PDF, TXT or Google Doc files in Drive.'}</p>
                          </div>
                        );
                      }

                      return filtered.map((file) => {
                        const isDoc = file.mimeType === 'application/vnd.google-apps.document';
                        const isPdf = file.mimeType === 'application/pdf';
                        const isTxt = file.mimeType === 'text/plain';
                        const isImporting = importingFileId === file.id;

                        let fileTypeDisplay = 'Raw File';
                        let badgeColor = 'border-slate-800 text-slate-400 bg-slate-900';
                        if (isDoc) {
                          fileTypeDisplay = 'Google Doc';
                          badgeColor = 'border-blue-900/40 text-blue-400 bg-blue-950/10';
                        } else if (isPdf) {
                          fileTypeDisplay = 'PDF Document';
                          badgeColor = 'border-red-900/40 text-red-400 bg-red-950/10';
                        } else if (isTxt) {
                          fileTypeDisplay = 'Plain Text';
                          badgeColor = 'border-cyan-900/40 text-cyan-400 bg-cyan-950/10';
                        }

                        // Parse friendly time
                        const modTime = file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : '';

                        return (
                          <div
                            key={file.id}
                            className="p-3 rounded-lg border border-white/[0.02] bg-slate-900/20 hover:bg-[#181824] hover:border-violet-500/20 flex items-center justify-between transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded border ${badgeColor}`}>
                                {isPdf && <FileText size={12} />}
                                {isDoc && <FileCode size={12} />}
                                {isTxt && <FileText size={12} />}
                              </div>
                              <div className="text-left font-sans select-none max-w-[200px] sm:max-w-[320px]">
                                <p className="text-[11px] font-semibold text-white truncate">{file.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[8px] font-mono border px-1 rounded-sm ${badgeColor}`}>
                                    {fileTypeDisplay}
                                  </span>
                                  {modTime && (
                                    <span className="text-[8px] text-slate-500 font-mono">
                                      {modTime}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => importDriveFile(file.id, file.name, file.mimeType)}
                              disabled={!!importingFileId}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${isImporting ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/30' : 'bg-[#181824] hover:bg-violet-600 border border-[#1e1e2e] text-slate-300 hover:text-white hover:shadow-[0_0_8px_rgba(124,58,237,0.2)]'}`}
                            >
                              {isImporting ? (
                                <>
                                  <Loader2 size={10} className="animate-spin" />
                                  <span>{isAr ? 'جاري الاستيراد...' : 'Importing...'}</span>
                                </>
                              ) : (
                                <span>{isAr ? 'استيراد' : 'Import'}</span>
                              )}
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
