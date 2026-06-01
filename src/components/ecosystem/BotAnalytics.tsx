import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  BarChart3, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Users, 
  Globe, 
  Languages, 
  Filter,
  ArrowDown
} from 'lucide-react';

export function BotAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      // 1. Total Conversations
      const { count: totalConvs } = await supabase.from('bot_conversations').select('*', { count: 'exact', head: true });
      
      // 2. High Intent Leads (Score > 50)
      const { count: highIntent } = await supabase.from('bot_conversations').select('*', { count: 'exact', head: true }).gt('lead_score', 50);
      
      // 3. Hot Leads (Score > 70)
      const { count: hotLeads } = await supabase.from('bot_conversations').select('*', { count: 'exact', head: true }).gt('lead_score', 70);

      // 4. Most Asked Intents (from analytics)
      const { data: intentData } = await supabase.rpc('get_bot_intent_stats');

      // 5. Service Demand (from analytics)
      const { data: serviceData } = await supabase.rpc('get_bot_service_stats');

      // 6. Language Stats
      const { data: langData } = await supabase.rpc('get_bot_lang_stats');

      setMetrics({
        totalConvs,
        highIntent,
        hotLeads,
        intents: intentData || [],
        services: serviceData || [],
        languages: langData || []
      });
    } catch (err) {
      console.error("Failed to fetch bot analytics:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-xs font-mono text-brand-gray animate-pulse">Analyzing Intelligence Data...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider flex items-center gap-2">
          <MessageSquare className="text-brand-cyan" size={20} />
          Bot Intelligence Dashboard
        </h2>
        <p className="text-xs text-brand-gray mt-1">Real-time conversational analytics and lead quality tracking.</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', val: metrics.totalConvs, icon: MessageSquare, color: 'text-brand-cyan' },
          { label: 'High Intent', val: metrics.highIntent, icon: Target, color: 'text-brand-gold' },
          { label: 'Hot Leads', val: metrics.hotLeads, icon: TrendingUp, color: 'text-brand-pink' },
          { label: 'Qualified Rate', val: `${Math.round((metrics.highIntent / metrics.totalConvs) * 100) || 0}%`, icon: Users, color: 'text-brand-silver' }
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-brand-black/60 border border-white/5 rounded-xl">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={stat.color} size={14} />
            </div>
            <div className="text-2xl font-mono font-bold text-white mt-2">{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Funnel & Service Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl space-y-6">
          <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest flex items-center gap-2">
            <Filter size={14} /> Conversion Funnel
          </h4>
          <div className="space-y-3">
            {[
              { label: 'Visitors', val: metrics.totalConvs, width: '100%' },
              { label: 'Qualified (30+)', val: metrics.highIntent, width: `${(metrics.highIntent / metrics.totalConvs) * 100}%` },
              { label: 'Hot Leads (70+)', val: metrics.hotLeads, width: `${(metrics.hotLeads / metrics.totalConvs) * 100}%` }
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="relative h-10 bg-white/5 rounded overflow-hidden flex items-center px-4 border border-white/5">
                  <div className="absolute inset-0 bg-brand-cyan/10 transition-all duration-1000" style={{ width: step.width }} />
                  <span className="relative z-10 text-[11px] text-white font-medium">{step.label}</span>
                  <span className="relative z-10 ml-auto text-xs font-mono text-brand-cyan">{step.val}</span>
                </div>
                {i < 2 && <div className="flex justify-center py-1"><ArrowDown size={12} className="text-white/20" /></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Service Demand */}
        <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl space-y-6">
          <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={14} /> Service Demand
          </h4>
          <div className="space-y-4">
            {metrics.services.length === 0 && <p className="text-[10px] text-brand-gray font-mono py-8 text-center uppercase">No service data tracked yet</p>}
            {metrics.services.map((svc: any) => (
              <div key={svc.service} className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-mono tracking-tighter">
                  <span className="text-brand-silver">{svc.service.replace('_', ' ')}</span>
                  <span className="text-white">{svc.count} requests</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple transition-all duration-1000" 
                    style={{ width: `${(svc.count / metrics.totalConvs) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language & Intents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Language Breakdown */}
        <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl space-y-4">
          <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest flex items-center gap-2">
            <Languages size={14} /> Language Analytics
          </h4>
          <div className="flex flex-wrap gap-3">
            {metrics.languages.map((lang: any) => (
              <div key={lang.language} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1 min-w-[100px]">
                <span className="text-[9px] font-mono text-brand-gray uppercase">{lang.language}</span>
                <span className="text-sm font-bold text-white">{lang.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Intents */}
        <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl space-y-4">
          <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest flex items-center gap-2">
            <Globe size={14} /> Popular Intents
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {metrics.intents.slice(0, 4).map((intent: any) => (
              <div key={intent.intent} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[9px] font-mono text-brand-gray uppercase mb-1">{intent.intent.replace('_', ' ')}</div>
                <div className="text-xs text-brand-silver">{intent.count} Interactions</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
