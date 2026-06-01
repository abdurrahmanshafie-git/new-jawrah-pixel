/**
 * Jawrah Bot Intelligence Engine (Main Entry)
 * Tying together Intent, Region, Knowledge Base, and Response Engines.
 */

import { detectIntent, Intent } from './intentEngine';
import { generateResponse } from './responseEngine';
import { getChatResponse } from '../ai';
import { detectRegion } from './regionEngine';
import { getMemory, updateMemory, ConversationContext } from './conversationMemory';
import { calculateLeadScore } from './leadScoring';
import { supabase } from '../supabase/client';

export interface BotResponse {
  text: string;
  showWhatsApp?: boolean;
  score?: number;
  stage?: string;
  intent?: Intent;
}

/**
 * Processes a user message and returns an intelligent response.
 */
export async function processBotMessage(
  message: string, 
  sessionId: string,
  history: { role: "user" | "model", parts: string }[] = []
): Promise<BotResponse> {
  // 1. Get Memory
  const context = getMemory(sessionId);

  // 2. Detect Intent
  let intent = detectIntent(message);
  
  // Handle contextual follow-up mapping
  if (intent === 'follow_up' && context.lastIntent) {
    // Keep lastIntent but allow responseEngine to handle the follow-up specific text
  }

  // 3. Generate Rule-based Response
  const response = generateResponse(intent, message, context);
  
  // Update intent if recommended
  if (response.recommendedIntent) {
    intent = response.recommendedIntent;
  }

  // 4. Update Lead Score
  const { score, stage } = calculateLeadScore(context.leadScore, intent);
  
  // 5. Update Memory
  const updates: Partial<ConversationContext> = {
    lastIntent: intent !== 'follow_up' ? intent : context.lastIntent,
    lastQuestion: message,
    leadScore: score,
    conversationStage: stage,
    region: detectRegion().code
  };

  // Map intent to service if possible
  const serviceMap: Record<string, string> = {
    'ecommerce': 'ecommerce',
    'branding': 'branding',
    'ai': 'ai_automation',
    'automation': 'ai_automation',
    'web_dev': 'web_dev'
  };
  if (serviceMap[intent]) updates.lastService = serviceMap[intent];

  updateMemory(sessionId, updates);

  // 6. AI Fallback (If intent is unknown)
  if (intent === 'unknown') {
    try {
      const region = detectRegion();
      const aiText = await getChatResponse(message, history, region.code);
      
      // Async log to Supabase
      void logInteraction(sessionId, message, 'user', 'unknown', score, stage);
      void logInteraction(sessionId, aiText, 'bot', 'unknown', score, stage);

      return { text: aiText, showWhatsApp: true, score, stage, intent };
    } catch (error) {
      console.warn("AI Fallback failed, using local fallback:", error);
    }
  }
  
  // High Intent Suggestion
  let finalResponseText = response.text;
  if (stage === 'HOT_LEAD' && !finalResponseText.includes('consultation')) {
    finalResponseText += "\n\nWould you like to book a free technical consultation to discuss this further?";
  }

  // Async log to Supabase
  void logInteraction(sessionId, message, 'user', intent, score, stage);
  void logInteraction(sessionId, finalResponseText, 'bot', intent, score, stage);

  return { 
    text: finalResponseText, 
    showWhatsApp: response.showWhatsApp,
    score,
    stage,
    intent
  };
}

/**
 * Logs interaction to Supabase for analytics.
 */
async function logInteraction(
  sessionId: string, 
  message: string, 
  role: 'user' | 'bot', 
  intent: Intent,
  score: number,
  stage: string
) {
  try {
    const region = detectRegion().code;
    
    // 1. Ensure conversation exists or update it
    const { data: conv } = await supabase
      .from('bot_conversations')
      .upsert({ 
        session_id: sessionId, 
        region, 
        lead_score: score, 
        conversation_stage: stage,
        updated_at: new Date().toISOString()
      }, { onConflict: 'session_id' })
      .select('id')
      .single();

    if (conv) {
      // 2. Insert message
      await supabase.from('bot_messages').insert({
        conversation_id: conv.id,
        role,
        message,
        intent
      });

      // 3. Log analytics interaction
      if (role === 'user') {
        await supabase.from('bot_analytics').insert({
          session_id: sessionId,
          intent,
          region,
          lead_score: score,
          conversation_stage: stage,
          language: detectLanguage(message)
        });
      }
    }
  } catch (err) {
    console.warn("Analytics logging failed:", err);
  }
}

function detectLanguage(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('kya') || t.includes('hai') || t.includes('hain')) return 'Roman Urdu';
  if (t.includes('mokakda') || t.includes('kawda')) return 'Singlish';
  if (t.includes('gaana') || t.includes('keeyada')) return 'Singlish/Tanglish';
  return 'English';
}
