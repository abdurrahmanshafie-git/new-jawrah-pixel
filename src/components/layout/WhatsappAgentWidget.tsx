import { useState } from 'react';
import { MessageSquare, X, Check, ArrowRight, ShieldCheck, Mail, PhoneCall } from 'lucide-react';
import { useRegion } from '@/hooks/useRegion';

interface Agent {
  name: string;
  role: string;
  hub: string;
  status: 'active' | 'busy' | 'offline';
  phone: string;
  avatar: string;
}

export function WhatsappAgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { config, currentRegion } = useRegion();

  const sriLankaAgents: Agent[] = [
    {
      name: 'Prageeth Fernando',
      role: 'Lead System Architect',
      hub: 'Colombo Hub',
      status: 'active',
      phone: '+94762737411',
      avatar: 'PF',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Brand Experience Director',
      hub: 'London Hub',
      status: 'active',
      phone: '+447712345678',
      avatar: 'SJ',
    },
    {
      name: 'Zaid Al-Mansoori',
      role: 'Client Success Partner',
      hub: 'Dubai Hub',
      status: 'busy',
      phone: '+971501234567',
      avatar: 'ZM',
    },
  ];

  const pakistanAgents: Agent[] = [
    {
      name: 'Muhammad Ali',
      role: 'Lead Project Architect',
      hub: 'Karachi Hub',
      status: 'active',
      phone: '+94762737411',
      avatar: 'MA',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Brand Experience Director',
      hub: 'London Hub',
      status: 'active',
      phone: '+447712345678',
      avatar: 'SJ',
    },
    {
      name: 'Zaid Al-Mansoori',
      role: 'Client Success Partner',
      hub: 'Dubai Hub',
      status: 'busy',
      phone: '+971501234567',
      avatar: 'ZM',
    },
  ];

  const internationalAgents: Agent[] = [
    {
      name: 'Global Strategy Desk',
      role: 'International Project Advisor',
      hub: 'Remote Global',
      status: 'active',
      phone: config.whatsappNumber,
      avatar: 'GS',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Brand Experience Director',
      hub: 'London Desk',
      status: 'active',
      phone: '+447712345678',
      avatar: 'SJ',
    },
    {
      name: 'Zaid Al-Mansoori',
      role: 'Client Success Partner',
      hub: 'Dubai Desk',
      status: 'busy',
      phone: '+971501234567',
      avatar: 'ZM',
    },
  ];

  const agents = currentRegion === 'int' ? internationalAgents : currentRegion === 'lk' ? sriLankaAgents : pakistanAgents;
  const panelCopy = currentRegion === 'int'
    ? 'Connect directly with our global strategy and delivery team.'
    : 'Converse directly with our execution team leads.';

  const handleConnectAgent = (phone: string, name: string) => {
    // Generate secure whatsapp proxy link
    const text = encodeURIComponent(`Hello ${name}, I am interested in Jawrah Pixel agency services.`);
    const url = `https://wa.me/${phone.replace('+', '').replace(/\s+/g, '')}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group w-14 h-14 bg-brand-cyan hover:bg-white text-brand-black rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] hover:-translate-y-1 transform scale-100 active:scale-95 cursor-pointer"
        >
          {/* Active indicator dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-blue rounded-full border-2 border-brand-black flex items-center justify-center animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
          <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* Floating Panel Client */}
      {isOpen && (
        <div className="w-[360px] max-w-[calc(100vw-2rem)] bg-brand-black border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-5 bg-gradient-to-b from-brand-blue/20 to-transparent border-b border-white/5 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-brand-gray hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="text-brand-cyan w-5 h-5 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan">Secure Communication Line</span>
            </div>
            <h4 className="text-lg font-display font-semibold text-white uppercase tracking-wider">
              Jawrah <span className="text-brand-cyan">Agents</span>
            </h4>
            <p className="text-brand-gray text-xs mt-1">{panelCopy}</p>
          </div>

          {/* Agents List */}
          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {agents.map((agent) => (
              <div
                key={agent.name}
                onClick={() => handleConnectAgent(agent.phone, agent.name)}
                className="group p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar wrapper */}
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-cyan font-bold text-sm relative">
                    {agent.avatar}
                    {/* Status dot */}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-brand-black ${
                        agent.status === 'active'
                          ? 'bg-brand-blue'
                          : agent.status === 'busy'
                          ? 'bg-amber-500'
                          : 'bg-brand-gray'
                      }`}
                    ></span>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white group-hover:text-brand-cyan transition-colors">
                      {agent.name}
                    </h5>
                    <p className="text-[11px] text-brand-gray leading-tight mt-0.5">{agent.role}</p>
                    <span className="text-[10px] text-brand-cyan font-mono">{agent.hub}</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-sm bg-white/5 group-hover:bg-brand-cyan/20 flex items-center justify-center text-brand-gray group-hover:text-brand-cyan transition-all">
                  <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white/5 border-t border-white/5 text-center flex justify-around text-xs text-brand-gray">
            <a href={`mailto:${config.contactEmail}`} className="hover:text-white transition-colors flex items-center gap-1.5 font-medium">
              <Mail size={12} className="text-brand-cyan" /> email hub
            </a>
            <div className="w-px h-4 bg-white/10 self-center"></div>
            <a href={`tel:${config.whatsappNumber.replace(/\s+/g, '')}`} className="hover:text-white transition-colors flex items-center gap-1.5 font-medium">
              <PhoneCall size={12} className="text-brand-cyan" /> voice desk
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
