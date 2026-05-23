import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Minus, 
  Bot, 
  User, 
  RefreshCcw, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { useRegion } from '@/hooks/useRegion';
import { supabase } from '@/lib/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  isAction?: boolean;
}

interface LeadData {
  name: string;
  business_type: string;
  country: string;
  project_type: string;
  budget_range: string;
  whatsapp: string;
}

type BotFlow = 'normal' | 'lead_capture';
type LeadStep = 'name' | 'business' | 'country' | 'project' | 'budget' | 'whatsapp' | 'complete';

const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "How much does a website cost?",
  "Can you build ecommerce websites?",
  "How long does a project take?",
  "How do I start a project?",
  "Do you work in Sri Lanka and Pakistan?"
];

const BUDGET_OPTIONS = [
  "LKR 80k - 180k",
  "LKR 180k - 450k",
  "LKR 450k - 900k",
  "LKR 900k - 2M+",
  "Monthly Maintenance"
];

export function JawrahBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Jawrah-Bot, your premium digital project assistant. How can I help you elevate your brand today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Lead Capture State
  const [flow, setFlow] = useState<BotFlow>('normal');
  const [leadStep, setLeadStep] = useState<LeadStep>('name');
  const [leadData, setLeadData] = useState<Partial<LeadData>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const { config } = useRegion();

  // Handle auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // Handle unread count
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Initialize unread after delay if closed
  useEffect(() => {
    if (!isOpen && messages.length === 1) {
      const timer = setTimeout(() => {
        setUnreadCount(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const saveLeadToStorage = (data: LeadData) => {
    try {
      const existingLeads = JSON.parse(localStorage.getItem('jawrah_chatbot_leads') || '[]');
      localStorage.setItem('jawrah_chatbot_leads', JSON.stringify([...existingLeads, { ...data, created_at: new Date() }]));
    } catch (e) {
      console.error("Failed to save lead to local storage");
    }
  };

  const submitLeadToSupabase = async (data: LeadData) => {
    try {
      const { error } = await supabase
        .from('chatbot_leads')
        .insert([{
          name: data.name,
          business_type: data.business_type,
          country: data.country,
          project_type: data.project_type,
          budget_range: data.budget_range,
          whatsapp: data.whatsapp,
          message: `Lead captured via Jawrah-Bot. Interested in ${data.project_type} for ${data.business_type}. Budget: ${data.budget_range}.`,
          created_at: new Date()
        }]);
      
      if (error) throw error;
    } catch (e) {
      console.warn("Supabase lead capture failed, falling back to local storage:", e);
      saveLeadToStorage(data);
    }
  };

  const addBotMessage = (text: string, isAction = false) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        timestamp: new Date(),
        isAction
      }]);
      setIsTyping(false);
      if (!isOpen) setUnreadCount(prev => prev + 1);
    }, 800);
  };

  const startLeadCapture = () => {
    setFlow('lead_capture');
    setLeadStep('name');
    addBotMessage("Great! I'll help you start your project. First, what is your name?");
  };

  const handleLeadStep = (value: string) => {
    const nextData = { ...leadData };
    
    switch (leadStep) {
      case 'name':
        nextData.name = value;
        setLeadData(nextData);
        setLeadStep('business');
        addBotMessage(`Nice to meet you, ${value}. What type of business do you have?`);
        break;
      case 'business':
        nextData.business_type = value;
        setLeadData(nextData);
        setLeadStep('country');
        addBotMessage("Understood. Which country are you located in?");
        break;
      case 'country':
        nextData.country = value;
        setLeadData(nextData);
        setLeadStep('project');
        addBotMessage("What type of project are we looking at? (e.g., Ecommerce, Corporate Website, Admin Dashboard)");
        break;
      case 'project':
        nextData.project_type = value;
        setLeadData(nextData);
        setLeadStep('budget');
        addBotMessage("Please select your estimated budget range:");
        break;
      case 'budget':
        nextData.budget_range = value;
        setLeadData(nextData);
        setLeadStep('whatsapp');
        addBotMessage("Lastly, what is your WhatsApp number so our team can reach out?");
        break;
      case 'whatsapp':
        nextData.whatsapp = value;
        setLeadData(nextData);
        setLeadStep('complete');
        const finalData = nextData as LeadData;
        submitLeadToSupabase(finalData);
        addBotMessage("Thank you! Your project details have been captured. A member of our architectural team will contact you within 24 hours.");
        addBotMessage("You can also message us directly on WhatsApp right now for an immediate response.", true);
        setFlow('normal');
        break;
    }
  };

  const getBotResponse = (input: string): string => {
    const text = input.toLowerCase();
    
    if (text.includes('service')) {
      return "Jawrah Pixel provides high-end digital architecture including: Bespoke Business Websites, Performance Ecommerce, UI/UX Strategy, Premium Branding, and Enterprise Admin Dashboards.";
    }
    
    if (text.includes('cost') || text.includes('price') || text.includes('how much')) {
      return "Our pricing is structured by project complexity:\n• Basic: LKR 80k - 180k\n• Premium: LKR 180k - 450k\n• Ecommerce: LKR 300k - 900k+\n• Enterprise: LKR 600k - 2M+\n\nWould you like to start a project and get a specific quote?";
    }
    
    if (text.includes('ecommerce') || text.includes('shop')) {
      return "We build elite ecommerce experiences with seamless LKR/USD payment gateways, inventory automation, and conversion-optimized checkout flows.";
    }

    if (text.includes('how long') || text.includes('time') || text.includes('timeline')) {
      return "Typical timelines range from 2 weeks for business sites to 6-10 weeks for advanced ecommerce and platform development.";
    }
    
    if (text.includes('sri lanka') || text.includes('pakistan')) {
      return "We have specialized regional architects in both Sri Lanka and Pakistan to ensure localized payment and server performance.";
    }
    
    if (text.includes('contact') || text.includes('whatsapp')) {
      return `Reach us instantly:\n• WhatsApp: ${config.whatsappNumber}\n• Email: ${config.contactEmail}\n• Instagram: ${config.instagramHandle}`;
    }

    if (text.includes('start') || text.includes('hire')) {
      return "I can help you start right now! Shall we go through a few quick questions to get your project initiated?";
    }

    return "I'm Jawrah-Bot, here to help with Jawrah Pixel's elite design and engineering services. Would you like to check our pricing, services, or start a new project?";
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    if (flow === 'lead_capture') {
      handleLeadStep(text);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        const response = getBotResponse(text);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      text: "Hello! I'm Jawrah-Bot, your premium digital project assistant. How can I help you elevate your brand today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setFlow('normal');
    setLeadStep('name');
    setLeadData({});
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-0 sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 w-full h-full sm:w-[400px] sm:h-[650px] bg-brand-navy border-none sm:border border-white/10 sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-xl z-[101]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-brand-black border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand-navy to-brand-black">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center">
                    <Bot className="text-brand-cyan" size={22} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-navy"></div>
                </div>
                <div>
                  <h3 className="text-white text-sm sm:text-base font-display font-medium tracking-tight">Jawrah-Bot</h3>
                  <p className="text-[10px] sm:text-[11px] text-brand-cyan/70 font-mono uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse"></span>
                    Digital Project Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={resetChat}
                  className="p-1.5 text-brand-gray/50 hover:text-white transition-colors"
                  title="Reset Chat"
                >
                  <RefreshCcw size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-brand-gray/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-2 sm:gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0 flex items-center justify-center mt-1 bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                        <Bot size={16} />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <div className={`p-3 sm:p-4 rounded-2xl text-[12px] sm:text-[14px] leading-relaxed relative ${
                        msg.sender === 'user' 
                          ? 'bg-brand-cyan text-brand-navy rounded-tr-none font-medium' 
                          : 'bg-white/5 border border-white/10 text-brand-gray rounded-tl-none shadow-xl'
                      }`}>
                        {msg.text.split('\n').map((line, i) => (
                          <span key={i} className="block">{line}</span>
                        ))}
                      </div>
                      
                      {msg.isAction && (
                        <motion.a
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          href={config.whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full text-xs font-medium w-fit hover:scale-105 transition-transform"
                        >
                          <Phone size={14} />
                          Message WhatsApp
                        </motion.a>
                      )}
                      
                      <span className={`text-[9px] opacity-40 uppercase tracking-tighter ${msg.sender === 'user' ? 'text-right pr-1' : 'pl-1'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan flex items-center justify-center mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-10">
                      <span className="w-1.5 h-1.5 bg-brand-cyan/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-brand-cyan/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-brand-cyan/40 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contextual Actions (Quick Replies) */}
            <div className="px-4 py-3 bg-brand-black/60 border-t border-white/5 flex flex-wrap gap-2">
              {flow === 'normal' && messages.length < 5 && !isTyping && (
                <>
                  <button
                    onClick={startLeadCapture}
                    className="text-[10px] sm:text-[11px] bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan px-4 py-2 rounded-full hover:bg-brand-cyan/20 transition-all font-medium flex items-center gap-1.5 group"
                  >
                    <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
                    Start Project
                  </button>
                  {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] sm:text-[11px] bg-white/5 border border-white/10 text-brand-gray/80 px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </>
              )}
              
              {flow === 'lead_capture' && leadStep === 'budget' && (
                <div className="grid grid-cols-2 gap-2 w-full">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSendMessage(opt)}
                      className="text-[10px] sm:text-[11px] bg-white/5 border border-white/10 text-brand-gray px-3 py-2 rounded-lg hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-all text-left"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-5 bg-brand-black border-t border-white/10">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex gap-3"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={leadStep === 'whatsapp' ? "Enter your WhatsApp..." : "Type your message..."}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[13px] sm:text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all font-light"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-11 h-11 rounded-xl bg-brand-cyan text-brand-navy flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
              <div className="mt-3 flex justify-center">
                <p className="text-[9px] text-white/20 font-mono tracking-widest uppercase">
                  Powered by Jawrah Pixel Intelligence
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-navy border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-[0_10px_30px_rgba(0,0,0,0.5)] group overflow-hidden z-[102]"
      >
        <div className="absolute inset-0 bg-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? (
          <Minus size={28} />
        ) : (
          <div className="relative">
            <Bot size={26} className={unreadCount > 0 ? 'animate-bounce' : ''} />
            {unreadCount > 0 && (
              <span className="absolute -top-3 -right-3 w-5 h-5 bg-brand-cyan text-brand-navy text-[10px] font-bold rounded-full border-2 border-brand-navy flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        )}
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full border border-brand-cyan/40 scale-110 blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
      </motion.button>
    </div>
  );
}
