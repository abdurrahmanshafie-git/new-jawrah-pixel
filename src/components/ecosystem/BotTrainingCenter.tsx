import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  BookOpen, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RefreshCcw, 
  MessageCircle, 
  DollarSign, 
  Zap,
  Globe,
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

type TrainingTab = 'intents' | 'knowledge' | 'pricing' | 'settings' | 'queue' | 'logs';

export function BotTrainingCenter() {
  const [activeTab, setActiveTab] = useState<TrainingTab>('intents');
  const [intents, setIntents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'intents') {
        const { data } = await supabase.from('bot_intents').select('*, bot_keywords(*), bot_answers(*)').order('name');
        setIntents(data || []);
      }
      // Add other tab fetchers here
    } catch (err) {
      console.error("Training center fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider flex items-center gap-2">
            <BrainCircuit className="text-brand-cyan" size={20} />
            Bot Training Center
          </h2>
          <p className="text-xs text-brand-gray mt-1">Configure intents, manage dynamic knowledge, and refine bot intelligence.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} className="text-[10px] font-mono uppercase h-9">
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button size="sm" className="text-[10px] font-mono uppercase h-9">
            <Plus size={14} className="mr-1" /> New Intent
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-xl scrollbar-hide">
        {[
          { id: 'intents', label: 'Intent Manager', icon: Zap },
          { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
          { id: 'pricing', label: 'Pricing Manager', icon: DollarSign },
          { id: 'settings', label: 'AI Settings', icon: Settings },
          { id: 'queue', label: 'Learning Queue', icon: AlertCircle },
          { id: 'logs', label: 'Change Logs', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TrainingTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20' 
                  : 'text-brand-gray hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-brand-cyan gap-4">
            <div className="w-10 h-10 border-2 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gray">Syncing Intelligence...</span>
          </div>
        ) : (
          <>
            {activeTab === 'intents' && <IntentManager intents={intents} onReload={fetchData} />}
            {activeTab === 'knowledge' && <KBManager />}
            {activeTab === 'pricing' && <PricingManager />}
            {activeTab === 'settings' && <AISettingsManager />}
            {activeTab === 'queue' && <LearningQueue />}
            {activeTab === 'logs' && <ChangeLogs />}
          </>
        )}
      </div>
    </div>
  );
}

function IntentManager({ intents, onReload }: { intents: any[], onReload: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {intents.map((intent) => (
        <div key={intent.id} className="p-6 bg-brand-black/60 border border-white/5 rounded-2xl space-y-4 hover:border-brand-cyan/20 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan text-[9px] font-mono uppercase rounded border border-brand-cyan/20">
                  {intent.slug}
                </span>
                <h3 className="text-white font-semibold uppercase tracking-wider text-sm">{intent.name}</h3>
              </div>
              <p className="text-xs text-brand-gray font-light">{intent.description || 'No description provided.'}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0"><Edit3 size={14} /></Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-400 border-red-500/20 hover:bg-red-500/10"><Trash2 size={14} /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Keywords */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} /> Keywords
                </h4>
                <button className="text-[9px] font-mono text-brand-gray hover:text-white uppercase">+ Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {intent.bot_keywords?.map((kw: any) => (
                  <span key={kw.id} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-brand-silver flex items-center gap-1.5">
                    {kw.keyword}
                    <button className="hover:text-red-400"><Trash2 size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Answers */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                  <MessageCircle size={12} /> Regional Answers
                </h4>
                <button className="text-[9px] font-mono text-brand-gray hover:text-white uppercase">+ Add</button>
              </div>
              <div className="space-y-2">
                {intent.bot_answers?.map((ans: any) => (
                  <div key={ans.id} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-brand-gray uppercase">{ans.region}</span>
                      <div className="flex gap-2">
                        <button className="text-brand-gray hover:text-brand-cyan"><Edit3 size={12} /></button>
                        <button className="text-brand-gray hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <p className="text-[11px] text-brand-silver line-clamp-2 italic">"{ans.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function KBManager() {
  return <div className="p-12 text-center text-xs font-mono text-brand-gray border border-dashed border-white/10 rounded-2xl">Knowledge Base Manager Coming Soon</div>;
}

function PricingManager() {
  return <div className="p-12 text-center text-xs font-mono text-brand-gray border border-dashed border-white/10 rounded-2xl">Regional Pricing Manager Coming Soon</div>;
}

function AISettingsManager() {
  return <div className="p-12 text-center text-xs font-mono text-brand-gray border border-dashed border-white/10 rounded-2xl">AI Tone & Creativity Settings Coming Soon</div>;
}

function LearningQueue() {
  return <div className="p-12 text-center text-xs font-mono text-brand-gray border border-dashed border-white/10 rounded-2xl">Unanswered Questions Learning Queue Coming Soon</div>;
}

function ChangeLogs() {
  return <div className="p-12 text-center text-xs font-mono text-brand-gray border border-dashed border-white/10 rounded-2xl">Audit Logs & Version History Coming Soon</div>;
}
