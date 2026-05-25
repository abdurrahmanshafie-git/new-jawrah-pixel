import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { fetchDashboardAnalytics } from '@/lib/supabase/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, 
  Users, 
  FileText, 
  Calendar, 
  Loader, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight, 
  Settings,
  MessageSquare,
  DollarSign,
  Briefcase,
  ShieldAlert,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';

// Reusable Toast feedback type
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { config } = useRegion();
  
  // Tab control states: 'analytics' | 'leads' | 'bookings' | 'clients' | 'projects' | 'settings'
  const [activeTab, setActiveTab] = useState<string>('analytics');
  
  // System State Lists
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Search & Filter state values
  const [regionFilter, setRegionFilter] = useState<'all' | 'lk' | 'pk'>('all');
  
  // MODAL States for CRUD
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  
  // Project Form States
  const [projectTitle, setProjectTitle] = useState('');
  const [projectServiceType, setProjectServiceType] = useState('Premium Website');
  const [projectStatus, setProjectStatus] = useState<any>('project active');
  const [projectPrice, setProjectPrice] = useState<number>(0);
  const [projectDeadline, setProjectDeadline] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [projectClientId, setProjectClientId] = useState('');

  // Toast trigger utility
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const loadAllDashboardData = async () => {
    setLoading(true);
    
    try {
      const [leadsRes, projectsRes, clientsRes, analyticsRes, bookingsRes] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*, client:profiles(*)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }),
        fetchDashboardAnalytics(),
        supabase.from('bookings').select('*').order('created_at', { ascending: false })
      ]);

      if (leadsRes.data) setInquiries(leadsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (clientsRes.data) setClients(clientsRes.data);
      if (analyticsRes) setAnalytics(analyticsRes);
      if (bookingsRes.data) setBookings(bookingsRes.data);

    } catch (err: any) {
      console.warn("Supabase load failed:", err.message);
      showToast("Database sync failed. Check connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  // CRUD OPERATIONS FOR PROJECTS
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      showToast("Project Title is required", "error");
      return;
    }

    const payload = {
      title: projectTitle,
      service_type: projectServiceType,
      status: projectStatus,
      price: projectPrice,
      deadline: projectDeadline || null,
      notes: projectNotes,
      client_id: projectClientId || null,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProject) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
        if (error) throw error;
        showToast("Project updated successfully!");
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        showToast("New project created!");
      }
      loadAllDashboardData();
      setProjectModalOpen(false);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleEditProjectClick = (p: any) => {
    setEditingProject(p);
    setProjectTitle(p.title);
    setProjectServiceType(p.service_type || 'Premium Website');
    setProjectStatus(p.status || 'project active');
    setProjectPrice(p.price || 0);
    setProjectDeadline(p.deadline || '');
    setProjectNotes(p.notes || '');
    setProjectClientId(p.client_id || '');
    setProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you absolutely sure?")) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      showToast("Project deleted.");
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // INQUIRIES & BOOKING STATUS CHANGES
  const handleUpdateInquiryStatus = async (id: string, nextStatus: string) => {
    try {
      const { error } = await supabase.from('inquiries').update({ status: nextStatus }).eq('id', id);
      if (error) throw error;
      showToast(`Inquiry marked as ${nextStatus}`);
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateBookingStatus = async (id: string, nextStatus: string) => {
    try {
      const { error } = await supabase.from('bookings').update({ status: nextStatus }).eq('id', id);
      if (error) throw error;
      showToast(`Booking marked as ${nextStatus}`);
      loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const hasAdminRole = profile?.role === 'admin';

  return (
    <div className="pt-28 pb-20 min-h-screen bg-brand-black text-white relative font-sans">
      <SEO 
        title="Admin CMS Operations Platform" 
        description="Full-suite database synchronization, bookings overview, client revision trackers, and client CRM controller." 
      />

      {/* Floating toasts render */}
      <div className="fixed top-24 right-6 space-y-3 z-50 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-md pointer-events-auto animate-bounce-short ${
              t.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
              t.type === 'info' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' :
              'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
            <p className="text-xs font-semibold uppercase font-mono tracking-wider">{t.message}</p>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* UPPER TITLE HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-3.5 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-brand-cyan/15 border border-brand-cyan/25 text-brand-cyan font-mono text-[9px] uppercase tracking-widest font-bold">
                SYSTEM CONSOLE
              </span>
              <div className="flex items-center gap-1 text-[10px] text-brand-gray font-mono uppercase tracking-widest">
                <Activity size={12} className="text-brand-cyan" /> 
                Active DB Sync Active
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold uppercase tracking-tight text-white">
              Operations Control
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="outline" size="sm" onClick={loadAllDashboardData} className="uppercase font-mono text-[10px] tracking-wider border-white/10">
              Reload Engine
            </Button>
          </div>
        </div>

        {/* SECURITY ALERT SYSTEM */}
        {!hasAdminRole && (
          <div className="mb-8 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Supabase Admin Barrier</h4>
                <p className="text-xs text-brand-silver leading-relaxed font-light mt-0.5">
                  Your active role is "{profile?.role || 'Guest'}". Admin access is required for full write capabilities.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* NAVIGATION CONTROL RAIL */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'analytics', label: 'Analytics Console', icon: Activity },
              { id: 'leads', label: 'Leads (Inquiries)', count: inquiries.length, icon: FileText },
              { id: 'bookings', label: 'Strategy Bookings', count: bookings.length, icon: Calendar },
              { id: 'clients', label: 'Client CRM', count: clients.length, icon: Users },
              { id: 'projects', label: 'Project Portfolio', count: projects.length, icon: Briefcase },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-xs uppercase font-mono tracking-wider cursor-pointer text-left ${
                    isActive 
                      ? 'bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan font-bold select-none drop-shadow-[0_0_12px_rgba(34,211,238,0.1)]' 
                      : 'border-white/5 bg-transparent text-brand-gray hover:text-white hover:border-white/15'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    {tab.label}
                  </span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded text-[10px] ${isActive ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-brand-silver'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN DYNAMIC CMS CONTAINER */}
          <div className="lg:col-span-9 glass-card p-6 md:p-8 rounded-2xl relative bg-white/[0.01] border-white/10 min-h-[500px]">
            
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-brand-cyan gap-4">
                <Loader className="animate-spin" size={36} />
                <span className="text-xs font-mono uppercase tracking-widest text-brand-gray">Extracting tables...</span>
              </div>
            ) : (
              <div>
                
                {/* 1. ANALYTICS CONSOLE TAB */}
                {activeTab === 'analytics' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Operational Analytics</h2>
                      <span className="text-[10px] font-mono text-brand-gray uppercase">Status: Real-time DB Sync</span>
                    </div>

                    {/* Stats Metric Panel Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: 'Total Leads', val: analytics?.totalLeads || 0, growth: '+12%', desc: 'Inquiries across regions', icon: FileText, color: 'text-brand-cyan' },
                        { title: 'Active Projects', val: analytics?.activeProjects || 0, growth: 'Stable', desc: 'Current dev operations', icon: Briefcase, color: 'text-brand-blue' },
                        { title: 'New Inquiries', val: analytics?.newInquiries || 0, growth: 'High', desc: 'Unprocessed opportunities', icon: MessageSquare, color: 'text-purple-400' },
                        { title: 'Total Revenue', val: `${config.currency} ${(analytics?.totalRevenue || 0).toLocaleString()}`, growth: 'Live', desc: 'Contracted project value', icon: DollarSign, color: 'text-emerald-400' }
                      ].map((card, cIdx) => {
                        const Icon = card.icon;
                        return (
                          <div key={cIdx} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest">{card.title}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-brand-cyan">{card.growth}</span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mb-1">
                              <span className="text-2xl font-mono font-bold text-white tracking-tight">{card.val}</span>
                            </div>
                            <p className="text-[10px] text-brand-gray font-light font-sans">{card.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* LEADS BY STATUS CHART */}
                    <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-0.5">Lead Pipeline Distribution</h4>
                          <span className="text-xs text-brand-gray">Status breakdown for all incoming inquiries</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {['new', 'contacted', 'proposal_sent', 'closed', 'rejected'].map((status) => {
                          const count = analytics?.leadsByStatus?.[status] || 0;
                          const percentage = analytics?.totalLeads ? (count / analytics.totalLeads) * 100 : 0;
                          return (
                            <div key={status} className="flex flex-col gap-2">
                              <div className="h-24 bg-white/5 rounded-lg relative overflow-hidden flex flex-col justify-end">
                                <div 
                                  className="bg-brand-cyan/20 border-t border-brand-cyan/40 w-full transition-all duration-1000" 
                                  style={{ height: `${percentage}%` }}
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold text-white">
                                  {count}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-brand-gray uppercase text-center">{status.replace('_', ' ')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. LEADS (INQUIRIES) TAB */}
                {activeTab === 'leads' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Leads Lifecycle</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage incoming inquiries and track conversion pipeline.</p>
                      </div>

                      <div className="flex gap-2">
                        <select 
                          value={regionFilter}
                          onChange={(e) => setRegionFilter(e.target.value as any)}
                          className="bg-brand-navy/40 border border-white/10 rounded px-3 py-1.5 text-[10px] font-mono text-white uppercase"
                        >
                          <option value="all">All Regions</option>
                          <option value="lk">Sri Lanka</option>
                          <option value="pk">Pakistan</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {inquiries
                        .filter(inq => regionFilter === 'all' || inq.region === regionFilter)
                        .map((inq) => (
                        <div key={inq.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl hover:border-brand-cyan/10 transition-colors relative group">
                          <div className="absolute top-4 right-4 flex gap-2">
                            {['new', 'contacted', 'proposal_sent', 'closed', 'rejected'].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                                className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border transition-all cursor-pointer ${
                                  inq.status === st 
                                    ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan font-semibold' 
                                    : 'border-white/5 text-brand-gray hover:border-white/10'
                                }`}
                              >
                                {st.replace('_', ' ')}
                              </button>
                            ))}
                          </div>

                          <div className="space-y-2 max-w-2xl">
                            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block">{inq.business_name || 'Individual Lead'}</span>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{inq.full_name} ● <span className="text-brand-gray text-[11px] font-normal lowercase">{inq.email}</span></h3>
                            <p className="text-xs text-brand-silver font-light leading-relaxed italic">
                              "{inq.message || 'No additional project scope notes.'}"
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-brand-gray uppercase">
                              <span>WhatsApp: {inq.whatsapp || 'N/A'}</span>
                              <span>Budget: {inq.budget_range || 'N/A'}</span>
                              <span>Service: {inq.service_interested}</span>
                              <span>Source: {inq.source_page?.toUpperCase() || 'WEB'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. CLIENT CRM TAB */}
                {activeTab === 'clients' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Client CRM</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage registered clients and their profile coordinates.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clients.map((client) => (
                        <div key={client.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan text-lg font-bold">
                            {client.full_name?.[0] || 'C'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{client.full_name}</h3>
                            <p className="text-[10px] text-brand-gray font-mono lowercase">{client.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-brand-silver uppercase">
                                {client.country || 'Global'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-brand-blue/10 text-[9px] font-mono text-brand-blue uppercase">
                                {client.region?.toUpperCase() || 'INTL'}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-brand-gray" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Project Portfolio</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Live delivery management and revenue tracking.</p>
                      </div>

                      <Button 
                        size="sm" 
                        onClick={() => {
                          setEditingProject(null);
                          setProjectTitle('');
                          setProjectServiceType('Premium Website');
                          setProjectStatus('project active');
                          setProjectPrice(0);
                          setProjectDeadline('');
                          setProjectNotes('');
                          setProjectClientId('');
                          setProjectModalOpen(true);
                        }}
                        className="uppercase font-mono tracking-widest text-[10px] luxury-glow shrink-0 font-bold"
                      >
                        <Plus size={14} className="mr-1" /> New Project
                      </Button>
                    </div>

                    <div className="border border-white/5 rounded-xl overflow-hidden bg-brand-black/20 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.03]">
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Project Architecture</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Client</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Price</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Status</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((proj) => (
                            <tr key={proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div className="text-xs font-semibold text-white uppercase tracking-wider">{proj.title}</div>
                                <div className="text-[10px] text-brand-gray block mt-0.5">{proj.service_type}</div>
                              </td>
                              <td className="p-4 text-[10px] text-brand-silver uppercase font-mono">
                                {proj.client?.full_name || 'N/A'}
                              </td>
                              <td className="p-4 font-mono text-xs text-brand-cyan">
                                {config.currency} {Number(proj.price || 0).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                                  proj.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  proj.status === 'project active' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' :
                                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>
                                  {proj.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => handleEditProjectClick(proj)} className="p-2 rounded bg-white/5 hover:bg-brand-cyan/15 text-brand-gray hover:text-brand-cyan transition-colors">
                                    <Edit size={14} />
                                  </button>
                                  <button onClick={() => handleDeleteProject(proj.id)} className="p-2 rounded bg-white/5 hover:bg-red-500/15 text-brand-gray hover:text-red-400 transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Consultation Slots</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage virtual briefing invitations and meeting timelines.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {bookings.map((book) => (
                        <div key={book.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-brand-blue/10 border border-brand-blue/25 text-brand-blue font-mono text-[9px] uppercase tracking-widest">
                              {book.project_type}
                            </span>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-2">{book.name}</h3>
                            <div className="text-[10px] text-brand-gray font-mono lowercase">{book.email} ● {book.whatsapp || 'No WhatsApp'}</div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-[10px] font-mono uppercase text-brand-gray block">DATE & TIME</span>
                              <span className="text-xs font-mono text-white block">{book.preferred_date} at {book.preferred_time}</span>
                            </div>

                            <select
                              value={book.status}
                              onChange={(e) => handleUpdateBookingStatus(book.id, e.target.value)}
                              className="py-1 px-2.5 rounded bg-black border border-white/5 text-[10px] font-mono text-brand-cyan uppercase"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">System Settings</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Global configuration for agency operations and security.</p>
                    </div>

                    <div className="p-6 bg-brand-black/60 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-4 text-amber-500 mb-4">
                        <ShieldAlert size={20} />
                        <span className="text-xs font-mono uppercase tracking-widest">Administrative Boundaries Active</span>
                      </div>
                      <p className="text-xs text-brand-silver leading-relaxed">
                        Global settings are managed via environment variables and Supabase Auth configuration for production readiness.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* PROJECT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-sm" onClick={() => setProjectModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-brand-navy/90 border border-white/10 p-8 rounded-3xl shadow-2xl animate-scale-in">
            <button 
              onClick={() => setProjectModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-brand-gray hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-2xl font-display font-semibold uppercase text-white mb-6">
              {editingProject ? 'Revise Project Node' : 'Initialize New Project'}
            </h2>
            
            <form onSubmit={handleSaveProject} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Project Title</label>
                  <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. AeroVista Flagship" className="bg-black/40 border-white/5 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Service Type</label>
                  <Input value={projectServiceType} onChange={(e) => setProjectServiceType(e.target.value)} placeholder="e.g. Web Architecture" className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Client</label>
                  <select 
                    value={projectClientId} 
                    onChange={(e) => setProjectClientId(e.target.value)}
                    className="w-full h-10 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Price ({config.currency})</label>
                  <Input type="number" value={projectPrice} onChange={(e) => setProjectPrice(Number(e.target.value))} className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Status Matrix</label>
                  <select 
                    value={projectStatus} 
                    onChange={(e) => setProjectStatus(e.target.value as any)}
                    className="w-full h-10 bg-black/40 border border-white/5 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  >
                    {['new lead', 'contacted', 'proposal sent', 'payment pending', 'project active', 'delivered', 'maintenance'].map(s => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Deadline</label>
                  <Input type="date" value={projectDeadline} onChange={(e) => setProjectDeadline(e.target.value)} className="bg-black/40 border-white/5 text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Internal Notes / CRM Data</label>
                <Textarea value={projectNotes} onChange={(e) => setProjectNotes(e.target.value)} placeholder="Enter sensitive client follow-up details..." className="bg-black/40 border-white/5 text-xs min-h-[100px]" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setProjectModalOpen(false)} className="uppercase font-mono text-[10px] tracking-widest border-white/10">
                  Cancel
                </Button>
                <Button type="submit" className="uppercase font-mono text-[10px] tracking-widest luxury-glow font-bold">
                  {editingProject ? 'Commit Changes' : 'Initialize Node'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
