/**
 * Jawrah Bot Conversation Memory
 * Stores and retrieves context during a bot session.
 */

import { Intent } from './intentEngine';
import { Region } from './regionEngine';

export interface ConversationContext {
  lastIntent: Intent | null;
  lastService: string | null;
  lastTopic: string | null;
  lastQuestion: string | null;
  region: Region | null;
  leadScore: number;
  conversationStage: ConversationStage;
  businessType: string | null;
  sessionId: string;
}

export type ConversationStage = 
  | 'VISITOR' 
  | 'INTERESTED' 
  | 'QUALIFIED' 
  | 'HOT_LEAD' 
  | 'CONVERTING';

const MEMORY_KEY = 'jawrah_bot_memory';

/**
 * Initializes or retrieves existing memory from session storage.
 */
export function getMemory(sessionId: string): ConversationContext {
  const stored = sessionStorage.getItem(`${MEMORY_KEY}_${sessionId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  
  return {
    lastIntent: null,
    lastService: null,
    lastTopic: null,
    lastQuestion: null,
    region: null,
    leadScore: 0,
    conversationStage: 'VISITOR',
    businessType: null,
    sessionId
  };
}

/**
 * Updates memory and persists to session storage.
 */
export function updateMemory(sessionId: string, updates: Partial<ConversationContext>): ConversationContext {
  const current = getMemory(sessionId);
  const updated = { ...current, ...updates };
  sessionStorage.setItem(`${MEMORY_KEY}_${sessionId}`, JSON.stringify(updated));
  return updated;
}

/**
 * Clears memory for a session.
 */
export function clearMemory(sessionId: string) {
  sessionStorage.removeItem(`${MEMORY_KEY}_${sessionId}`);
}
