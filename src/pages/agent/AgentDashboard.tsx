import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, MessageSquare, Calendar, Folder, Award, AlertCircle, RefreshCw, Send, CheckCircle, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AgentDashboard() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'inquiries' | 'bookings' | 'projects' | 'ai-assistant'>('inquiries');
  
  // State for data
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  // Loading and action state
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // AI Assistant states
  const [aiTitle, setAiTitle] = useState('');
  const [aiType, setAiType] = useState('Web Design & Development');
  const [aiBudget, setAiBudget] = useState('LKR 1,500,000+');
  const [aiBrief, setAiBrief] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Inquiries
      const { data: inqs, error: inqsErr } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!inqsErr && inqs) setInquiries(inqs);

      // 2. Fetch Bookings
      const { data: bks, error: bksErr } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!bksErr && bks) setBookings(bks);

      // 3. Fetch Projects
      const { data: prjs, error: prjsErr } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!prjsErr && prjs) setProjects(prjs);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status updaters
  const updateInquiryStatus = async (id: string, nextStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) throw error;
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    } catch (err) {
      console.error('Error updating inquiry:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateBookingStatus = async (id: string, nextStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) throw error;
      setBookings(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    } catch (err) {
      console.error('Error updating booking:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateProjectStatus = async (id: string, nextStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    } catch (err) {
      console.error('Error updating project:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // AI Proposal Designer
  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTitle || !aiBrief) return;
    setAiGenerating(true);
    setAiResponse(null);

    // Prompt simulation to draft perfect premium proposal
    setTimeout(() => {
      const mockResult = `
# LUXURY DIGITAL PROPOSAL BY JAWRAH PIXEL
**Prepared For:** ${aiType} - ${aiTitle}
**Target Budget Frame:** ${aiBudget}
**Strategic Focus:** Premium Branding & High-Performance Technological Architecture

---

### 1. Executive Summary & Brand Positioning
For **${aiTitle}**, our brand positioning focuses on translating physical digital elegance into custom high-end systems. We will build a signature experience featuring expansive micro-animations, near-black geometric grids, and high-performance load times that reflect brand authority.

### 2. Architectural Blueprint & Tech Stack
To deliver maximum reliability, security, and world-class speed, we recommend the following state-of-the-art stack:
*   **Frontend Engine:** Next.js with React & React Router, styled via Tailwind CSS for micro-interactions.
*   **Database & Core Services:** Supabase PostgreSQL with fully-configured Row-Level Security (RLS) policies.
*   **Performance Optimization:** Global Edge Caching with static build rendering for load times below 0.5s.

### 3. Progressive Implementation Schedule
*   **Phase 1 - Brand Identity & UI Design (Weeks 1-2):** Wireframes, interactive visual design grids, typography pairings, and layout models.
*   **Phase 2 - Core System Architecture (Weeks 3-5):** Database configuration, API integration, dashboard interfaces, and payment setups.
*   **Phase 3 - Refined Testing & Launch (Week 6):** Custom caching, SEO setup, and full-platform audit.

### 4. Continuous Care & Maintenance
Includes our custom Jawrah Pixel Care framework (LKR 35,000/mo package):
*   24/7 Security patches & regular server optimizations.
*   Monthly content revisions and premium speed assurance.
      `;
      setAiResponse(mockResult.trim());
      setAiGenerating(false);
    }, 1500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <Loader className="animate-spin text-brand-cyan" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white relative">
      {/* Visual background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono uppercase tracking-widest">
                Internal Portal
              </span>
              <span className="text-brand-gray text-xs font-mono uppercase tracking-wider">
                Logged in as {profile?.full_name || 'Agent'}
              </span>
            </div>
            <h1 className="text-4xl font-display font-semibold tracking-tight text-white uppercase">
              Agent <span className="text-brand-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">Workspace</span>
            </h1>
            <p className="text-brand-gray mt-1 text-sm">
              Premium client relationship manager and strategic proposal designer hub.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchDashboardData} className="border-white/10 text-brand-silver">
              <RefreshCw size={14} className="mr-2" /> Refresh Data
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-brand-silver hover:text-white hover:bg-white/5">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-8 border-b border-white/5 scrollbar-thin">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
              activeTab === 'inquiries'
                ? 'bg-brand-blue/10 border-brand-blue text-white shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-white/5 border-white/10 text-brand-gray hover:text-white hover:border-white/20'
            }`}
          >
            <MessageSquare size={16} />
            Inquiries
            <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-blue/20 text-white text-xs">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
              activeTab === 'bookings'
                ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                : 'bg-white/5 border-white/10 text-brand-gray hover:text-white hover:border-white/20'
            }`}
          >
            <Calendar size={16} />
            Bookings
            <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-cyan/20 text-white text-xs">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
              activeTab === 'projects'
                ? 'bg-brand-blue/10 border-brand-blue text-white shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-white/5 border-white/10 text-brand-gray hover:text-white hover:border-white/20'
            }`}
          >
            <Folder size={16} />
            Projects
            <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-blue/20 text-white text-xs">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
              activeTab === 'ai-assistant'
                ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                : 'bg-white/5 border-white/10 text-brand-gray hover:text-white hover:border-white/20'
            }`}
          >
            <Award size={16} />
            AI Proposal Assistant
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="py-20 flex justify-center text-brand-cyan">
            <Loader className="animate-spin" size={40} />
          </div>
        ) : (
          <div>
            {/* 1. INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-brand-silver">
                    <Filter size={16} className="text-brand-cyan" />
                    <span>Showing all customer responses submitted via website forms.</span>
                  </div>
                </div>

                {inquiries.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold font-display text-white">{inq.name}</h3>
                              <span className="px-3 py-1 text-xs font-mono uppercase bg-brand-navy border border-brand-blue/10 text-brand-blue rounded">
                                {inq.project_type}
                              </span>
                              <span className="px-2.5 py-0.5 rounded text-xs text-white capitalize bg-brand-cyan/10 border border-brand-cyan/20">
                                {inq.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6 text-sm text-brand-silver">
                              <div><span className="text-brand-gray">Email:</span> {inq.email}</div>
                              <div><span className="text-brand-gray">WhatsApp:</span> {inq.whatsapp || 'None'}</div>
                              <div><span className="text-brand-gray">Budget limit:</span> {inq.budget || 'Custom'}</div>
                            </div>
                            {inq.message && (
                              <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-4 text-sm text-brand-silver leading-relaxed">
                                <p className="font-semibold text-white mb-1">Message Detail:</p>
                                {inq.message}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end justify-start shrink-0">
                            <span className="text-xs text-brand-gray font-mono block lg:mb-2 text-right">
                              Received: {new Date(inq.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {['contacted', 'qualified', 'rejected'].map((stat) => (
                                <button
                                  key={stat}
                                  onClick={() => updateInquiryStatus(inq.id, stat)}
                                  disabled={updatingId === inq.id}
                                  className={`px-3 py-1.5 rounded text-xs font-medium tracking-wider uppercase transition-all ${
                                    inq.status === stat
                                      ? 'bg-brand-cyan text-brand-black shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                                      : 'bg-white/5 hover:bg-white/10 text-brand-silver hover:text-white border border-white/10'
                                  }`}
                                >
                                  {stat}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <MessageSquare size={48} className="mx-auto text-brand-gray mb-4 opacity-40" />
                    <p className="text-brand-silver">No submitted inquiries found in the pipeline.</p>
                  </div>
                )}
              </div>
            )}

            {/* 2. BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                  <span className="text-sm text-brand-silver">Client meeting schedules. Keep statuses synchronized closely.</span>
                </div>

                {bookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((bk) => (
                      <div key={bk.id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold font-display text-white">{bk.name}</h3>
                              <p className="text-xs text-brand-gray">{bk.email}</p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded text-xs uppercase font-mono tracking-widest bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                              {bk.status}
                            </span>
                          </div>

                          <div className="p-3.5 bg-white/5 border border-white/5 rounded-lg text-sm space-y-1.5">
                            <div className="text-brand-silver"><span className="text-brand-gray">Meeting Date:</span> {bk.preferred_date || 'TBD'}</div>
                            <div className="text-brand-silver"><span className="text-brand-gray">Preferred Time:</span> {bk.preferred_time || 'TBD'}</div>
                            <div className="text-brand-silver"><span className="text-brand-gray">WhatsApp Contact:</span> {bk.whatsapp || 'None'}</div>
                          </div>

                          {bk.message && (
                            <p className="text-xs text-brand-silver italic bg-black/20 p-2.5 rounded border border-white/5">
                              "{bk.message}"
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end gap-2">
                          {['confirmed', 'completed', 'cancelled'].map((stat) => (
                            <button
                              key={stat}
                              onClick={() => updateBookingStatus(bk.id, stat)}
                              disabled={updatingId === bk.id}
                              className={`px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                                bk.status === stat
                                  ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                  : 'bg-white/5 hover:bg-white/10 text-brand-silver border border-white/10'
                              }`}
                            >
                              {stat}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <Calendar size={48} className="mx-auto text-brand-gray mb-4 opacity-40" />
                    <p className="text-brand-gray">Unallocated bookings feed is empty.</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                  <span className="text-sm text-brand-silver">Track and update ongoing project progress milestones.</span>
                </div>

                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide">{project.title}</h3>
                              <span className="px-2.5 py-0.5 rounded text-xs tracking-wider uppercase font-mono bg-brand-cyan/20 text-brand-cyan">
                                {project.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-brand-silver">
                              <div><span className="text-brand-gray block mb-1">SERVICE TYPE</span> <span className="font-semibold text-white">{project.service_type || 'Custom Engineering'}</span></div>
                              <div><span className="text-brand-gray block mb-1">BUDGET SCALE</span> <span className="font-semibold text-white">{project.budget || 'Custom Frame'}</span></div>
                              <div><span className="text-brand-gray block mb-1">DEADLINE</span> <span className="font-semibold text-brand-cyan">{project.deadline || 'Ongoing Care'}</span></div>
                              <div><span className="text-brand-gray block mb-1">PROJECT ID</span> <span className="font-mono text-xs">{project.id.slice(0, 8)}...</span></div>
                            </div>
                          </div>

                          <div className="flex flex-col justify-center gap-2 lg:items-end w-full lg:w-auto shrink-0">
                            <span className="text-xs text-brand-gray block font-mono">Milestone Status Manager</span>
                            <div className="flex flex-wrap gap-1.5">
                              {['planning', 'design', 'development', 'review', 'completed'].map((stat) => (
                                <button
                                  key={stat}
                                  onClick={() => updateProjectStatus(project.id, stat)}
                                  disabled={updatingId === project.id}
                                  className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase transition-all ${
                                    project.status === stat
                                      ? 'bg-brand-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                      : 'bg-white/5 border border-white/5 text-brand-silver hover:bg-white/10 hover:text-white'
                                  }`}
                                >
                                  {stat}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <Folder size={48} className="mx-auto text-brand-gray mb-4 opacity-40" />
                    <p className="text-brand-gray">No ongoing projects currently in the production system.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. AI PROPOSAL ASSISTANT TAB */}
            {activeTab === 'ai-assistant' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-white/10 self-start">
                  <h2 className="text-xl font-display font-medium text-white uppercase mb-1">AI Proposal Builder</h2>
                  <p className="text-xs text-brand-gray mb-6">Autopilot customized architecture schemes based on luxury principles.</p>

                  <form onSubmit={handleGenerateProposal} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-brand-silver font-mono uppercase tracking-widest">Brand / Project Name</label>
                      <input
                        type="text"
                        value={aiTitle}
                        onChange={(e) => setAiTitle(e.target.value)}
                        required
                        placeholder="e.g. Royal Gems Lounge"
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 text-sm focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-brand-silver font-mono uppercase tracking-widest">Service Classification</label>
                      <select
                        value={aiType}
                        onChange={(e) => setAiType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 text-sm focus:border-brand-cyan focus:outline-none transition-all"
                      >
                        <option value="Web Design & Development" className="bg-brand-navy">Web Design & High-End Tech Stack</option>
                        <option value="E-Commerce Ecosystem" className="bg-brand-navy">Premium E-Commerce Ecosystem & Supabase</option>
                        <option value="Luxury Brand Identity & Design" className="bg-brand-navy">Identity, Logomark & Visual Design Systems</option>
                        <option value="Dashboard & ERP Support" className="bg-brand-navy">Enterprise CRM Dashboards & Performance</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-brand-silver font-mono uppercase tracking-widest">Pricing & Budget Band</label>
                      <select
                        value={aiBudget}
                        onChange={(e) => setAiBudget(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 text-sm focus:border-brand-cyan focus:outline-none transition-all"
                      >
                        <option value="LKR 500,000 - 1,000,000" className="bg-brand-navy">LKR 500k - LKR 1M (Standard Premium)</option>
                        <option value="LKR 1,000,000 - 2,500,000" className="bg-brand-navy">LKR 1M - LKR 2.5M (Signature Quality)</option>
                        <option value="LKR 2,500,000+" className="bg-brand-navy">LKR 2.5M+ (Bespoke Enterprise Integration)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-brand-silver font-mono uppercase tracking-widest">Project Brief & Details</label>
                      <textarea
                        value={aiBrief}
                        onChange={(e) => setAiBrief(e.target.value)}
                        required
                        rows={4}
                        placeholder="State any specific requests, e.g. Jewellery showcase page, lightning-fast dashboard, SEO focus..."
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 text-sm focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/20 transition-all font-sans"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={aiGenerating}
                      className="w-full mt-2 luxury-glow select-none"
                    >
                      {aiGenerating ? 'Designing Structure Scheme...' : 'Generate Design Proposal Plan'}
                    </Button>
                  </form>
                </div>

                <div className="lg:col-span-7 flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-brand-gray font-mono uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-ping"></span>
                    AI Model Engine
                  </div>

                  <h3 className="text-lg font-display font-medium text-white mb-4 uppercase tracking-wider">Strategic Proposal Output</h3>

                  {aiGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-brand-cyan">
                      <Loader className="animate-spin mb-4" size={32} />
                      <p className="text-brand-silver text-sm font-mono animate-pulse">Drafting luxury implementation grid...</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="flex-1 overflow-y-auto max-h-[500px] text-brand-silver text-sm space-y-4 font-sans bg-black/40 p-4 border border-white/5 rounded-xl pr-2 select-text leading-relaxed">
                      <div className="whitespace-pre-line text-brand-silver block">
                        {aiResponse}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                      <Send size={40} className="text-brand-gray mb-3 opacity-30" />
                      <h4 className="text-white font-medium mb-1">Proposal Builder is Ready</h4>
                      <p className="text-brand-gray text-xs max-w-sm">Enter client details and click build to generate custom system components and scheduled blueprints instantly.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
