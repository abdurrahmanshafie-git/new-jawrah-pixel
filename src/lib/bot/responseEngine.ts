/**
 * Jawrah Bot Response Engine
 * Generates natural language responses based on intent, region, and knowledge base.
 */

import { Intent } from './intentEngine';
import { detectRegion, RegionConfig } from './regionEngine';
import { KNOWLEDGE_BASE } from './knowledgeBase';
import { ConversationContext } from './conversationMemory';

export function generateResponse(
  intent: Intent, 
  message: string, 
  context?: ConversationContext
): { text: string; showWhatsApp?: boolean; recommendedIntent?: Intent } {
  const region = detectRegion();
  const normalizedMsg = message.toLowerCase();

  // Smart Recommendations based on business type
  if (intent === 'company_info' || intent === 'greeting') {
    if (normalizedMsg.includes('clothing') || normalizedMsg.includes('brand') || normalizedMsg.includes('store')) {
      return { 
        text: "For a clothing brand, we recommend a Luxury E-commerce platform combined with our Branding package to ensure a premium market position. Would you like to see our e-commerce pricing?",
        recommendedIntent: 'ecommerce'
      };
    }
    if (normalizedMsg.includes('restaurant') || normalizedMsg.includes('food') || normalizedMsg.includes('cafe')) {
      return { 
        text: "For restaurants, we specialize in high-conversion websites with integrated reservation flows and local SEO optimization. Shall I explain our SEO services?",
        recommendedIntent: 'seo'
      };
    }
  }

  // Contextual Follow-up Handling
  let activeIntent = intent;
  if (intent === 'follow_up' && context?.lastIntent) {
    activeIntent = context.lastIntent;
  }
  
  switch (activeIntent) {
    case 'greeting':
      return { text: "Hello! I'm the Jawrah Bot. How can I assist you with your digital project today?" };
    
    case 'thanks':
      return { text: "You're very welcome! Let me know if there's anything else I can help with." };

    case 'company_info':
      return { text: KNOWLEDGE_BASE.company.description };

    case 'services':
      const services = Object.values(KNOWLEDGE_BASE.services).map(s => s.name).join(", ");
      return { text: `We offer a range of premium services including ${services}. Which one would you like to learn more about?` };

    case 'pricing':
    case 'follow_up': // If it reached here, it's likely a pricing follow-up
      if (normalizedMsg.includes('long') || normalizedMsg.includes('time') || normalizedMsg.includes('waqt')) {
        const serviceKey = context?.lastService as keyof typeof KNOWLEDGE_BASE.services;
        const timeline = serviceKey && KNOWLEDGE_BASE.services[serviceKey] ? KNOWLEDGE_BASE.services[serviceKey].timeline : "4-12 weeks";
        return { text: `A typical project of this scale takes approximately ${timeline}.` };
      }
      
      const pService = (context?.lastService || 'web_dev') as keyof typeof KNOWLEDGE_BASE.services;
      return { 
        text: `Our pricing for ${KNOWLEDGE_BASE.services[pService].name} in the ${region.code.toUpperCase()} region typically starts from ${getRegionalPricing(pService, region)}. Would you like a custom quote?`,
        showWhatsApp: true 
      };

    case 'ecommerce':
      return { 
        text: `${KNOWLEDGE_BASE.services.ecommerce.description} Our e-commerce solutions for ${region.code.toUpperCase()} start at ${getRegionalPricing('ecommerce', region)}.`,
        showWhatsApp: true 
      };
    
    case 'branding':
      return { 
        text: `${KNOWLEDGE_BASE.services.branding.description} Our branding packages for ${region.code.toUpperCase()} start at ${getRegionalPricing('branding', region)}.`,
        showWhatsApp: true 
      };

    case 'ai':
    case 'automation':
      return { 
        text: `${KNOWLEDGE_BASE.services.ai_automation.description} We can build custom AI agents and automate your business workflows.`,
        showWhatsApp: true 
      };

    case 'payments':
      return { text: `We support several payment methods in your region: ${KNOWLEDGE_BASE.payments.methods[region.code]}. ${KNOWLEDGE_BASE.payments.terms}` };

    case 'process':
      return { text: `Our development process is highly structured: \n${KNOWLEDGE_BASE.process.join('\n')}` };

    case 'client_portal':
      const features = KNOWLEDGE_BASE.portal.features.join(", ");
      return { text: `Our Client Portal allows you to manage everything in one place: ${features}. You can access it after logging in.` };

    case 'contact':
      return { 
        text: `You can reach us at ${KNOWLEDGE_BASE.contact.email} or chat with our team directly on WhatsApp for immediate assistance.`,
        showWhatsApp: true 
      };

    case 'unknown':
    default:
      return { 
        text: "I'm not quite sure about that. Would you like to speak with a human team member or explore our services?",
        showWhatsApp: true 
      };
  }
}

function getRegionalPricing(serviceKey: keyof typeof KNOWLEDGE_BASE.services, region: RegionConfig): string {
  const service = KNOWLEDGE_BASE.services[serviceKey];
  return service.pricing[region.code];
}
