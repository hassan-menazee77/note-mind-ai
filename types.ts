/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'excel' | 'txt' | 'youtube' | 'web' | 'text';
  content: string;
  url?: string;
  itemCount?: number;
  addedAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  sourceId: string;
  sourceName: string;
  snippet: string;
}

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  color: string;
  pinned: boolean;
  sources: Source[];
  chatHistory: Message[];
  createdAt: string;
  studioOutput?: {
    summary?: string;
    studyGuide?: string;
    briefing?: string;
    timeline?: string;
    faq?: string;
    tables?: string;
    podcastScript?: string;
    podcastAudioUrl?: string; // Base64 audio path or mock blob URL
    aiQuestions?: any[];
    aiFlashcards?: any[];
    aiInfographic?: { imageUrl: string; info: string; concepts: string[] };
    deepResearchReport?: string;
  };
}

export interface DeepResearchResult {
  topic: string;
  sources: { title: string; url: string; snippet: string }[];
  report: string;
}
