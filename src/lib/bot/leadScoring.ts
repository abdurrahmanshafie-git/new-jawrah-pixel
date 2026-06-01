/**
 * Jawrah Bot Lead Scoring System
 * Assigns scores based on user behavior and intent.
 */

import { Intent } from './intentEngine';
import { ConversationStage } from './conversationMemory';

export const SCORE_WEIGHTS = {
  pricing: 10,
  services: 15,
  ecommerce: 20,
  seo: 15,
  automation: 20,
  ai: 20,
  branding: 15,
  consultation: 30,
  quote_request: 25,
  whatsapp_click: 40,
  proposal_request: 50,
  message_sent: 5
};

/**
 * Calculates updated lead score and promotes conversation stage.
 */
export function calculateLeadScore(currentScore: number, intent: Intent, action?: string): { score: number; stage: ConversationStage } {
  let newScore = currentScore;

  // Intent-based scoring
  if (intent !== 'unknown' && intent !== 'greeting' && intent !== 'thanks') {
    newScore += SCORE_WEIGHTS[intent as keyof typeof SCORE_WEIGHTS] || SCORE_WEIGHTS.message_sent;
  }

  // Action-based scoring
  if (action === 'whatsapp_click') newScore += SCORE_WEIGHTS.whatsapp_click;
  if (action === 'proposal_request') newScore += SCORE_WEIGHTS.proposal_request;

  // Determine stage
  let stage: ConversationStage = 'VISITOR';
  if (newScore > 70) stage = 'CONVERTING';
  else if (newScore > 50) stage = 'HOT_LEAD';
  else if (newScore > 30) stage = 'QUALIFIED';
  else if (newScore > 10) stage = 'INTERESTED';

  return { score: newScore, stage };
}
