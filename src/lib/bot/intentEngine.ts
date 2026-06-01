/**
 * Jawrah Bot Intent Engine
 * Detects user intent from messages using keyword and pattern matching.
 */

export type Intent =
  | 'company_info'
  | 'services'
  | 'pricing'
  | 'process'
  | 'payments'
  | 'client_portal'
  | 'branding'
  | 'ecommerce'
  | 'seo'
  | 'automation'
  | 'ai'
  | 'support'
  | 'contact'
  | 'consultation'
  | 'quote_request'
  | 'timeline'
  | 'revisions'
  | 'hosting'
  | 'maintenance'
  | 'greeting'
  | 'thanks'
  | 'follow_up'
  | 'unknown';

interface IntentPattern {
  intent: Intent;
  keywords: string[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: 'follow_up',
    keywords: [
      'how much', 'price?', 'cost?', 'how long', 'timeline', 'time taken', 
      'keeyada', 'gaana', 'kitna', 'paise', 'waqt', 'keeyak yanawada'
    ]
  },
  {
    intent: 'company_info',
    keywords: [
      'who are you', 'what is jawrah', 'tell me about', 'your company', 'about jawrah',
      'jawrah pixel kya hai', 'kaun ho', 'about us', 'what do you do', 'kon ho',
      'jawrah pixel mokakda', 'oyala kawda', 'kawda oya'
    ]
  },
  {
    intent: 'services',
    keywords: [
      'services', 'what you offer', 'what can you do', 'do you build', 'kam kya karte ho',
      'web development', 'design', 'websites', 'apps', 'mobile apps', 'kaam kya hai',
      'monawada karanne', 'website hadanawada', 'app hadanawada'
    ]
  },
  {
    intent: 'pricing',
    keywords: [
      'price', 'cost', 'how much', 'rates', 'pricing', 'charges', 'fees',
      'kitna', 'paise', 'budget', 'sasta', 'expensive', 'gana keeyada', 'gaana',
      'keeyak wenawada', 'paise kitne hain'
    ]
  },
  {
    intent: 'ecommerce',
    keywords: [
      'ecommerce', 'online store', 'shop', 'shopify', 'woocommerce', 'selling online',
      'dukan', 'online dukan'
    ]
  },
  {
    intent: 'ai',
    keywords: [
      'ai', 'artificial intelligence', 'chatbot', 'automation', 'chat bot', 'gpt',
      'intelligent', 'smart bot'
    ]
  },
  {
    intent: 'payments',
    keywords: [
      'payment', 'pay', 'bank transfer', 'credit card', 'paypal', 'stripe', 'payhere',
      'jazzcash', 'easypaisa', 'how to pay'
    ]
  },
  {
    intent: 'contact',
    keywords: [
      'contact', 'whatsapp', 'phone', 'email', 'call', 'talk to human', 'agent',
      'baat karni hai', 'rabta'
    ]
  },
  {
    intent: 'process',
    keywords: [
      'process', 'how you work', 'steps', 'workflow', 'method', 'procedure',
      'kaise kaam karte ho'
    ]
  },
  {
    intent: 'client_portal',
    keywords: [
      'portal', 'dashboard', 'client area', 'login', 'my project', 'track project',
      'account'
    ]
  },
  {
    intent: 'greeting',
    keywords: [
      'hi', 'hello', 'hey', 'aoa', 'asalam', 'salam', 'hola', 'gm', 'gn'
    ]
  },
  {
    intent: 'thanks',
    keywords: [
      'thanks', 'thank you', 'shukriya', 'jazakallah', 'great', 'awesome'
    ]
  }
];

export function detectIntent(message: string): Intent {
  const normalized = message.toLowerCase().trim();

  for (const pattern of INTENT_PATTERNS) {
    if (pattern.keywords.some(kw => normalized.includes(kw))) {
      return pattern.intent;
    }
  }

  return 'unknown';
}
