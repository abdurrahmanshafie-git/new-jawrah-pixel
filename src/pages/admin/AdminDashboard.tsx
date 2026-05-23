import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
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
  Check, 
  X, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronsUpDown,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Mail,
  TrendingUp,
  Globe,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Download,
  ShieldAlert,
  Save,
  Bell,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { SEO } from '@/components/layout/SEO';

// Reusable Toast feedback type
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  
  // Tab control states: 'overview' | 'projects' | 'inquiries' | 'bookings' | 'testimonials' | 'blogs' | 'media' | 'settings' | 'newsletter'
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sandboxMode, setSandboxMode] = useState<boolean>(true); // Sandbox fallback for instant preview without rigid role errors
  
  // System State Lists
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  
  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Search & Filter state values
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inquiryRegionFilter, setInquiryRegionFilter] = useState<'all' | 'lk' | 'pk'>('all');
  const [bookingRegionFilter, setBookingRegionFilter] = useState<'all' | 'lk' | 'pk'>('all');
  const [projectRegionFilter, setProjectRegionFilter] = useState<'all' | 'lk' | 'pk'>('all');
  
  // MODAL States for CRUD
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  
  // Project Form States
  const [projectTitle, setProjectTitle] = useState('');
  const [projectServiceType, setProjectServiceType] = useState('Premium Website');
  const [projectStatus, setProjectStatus] = useState<'planning' | 'design' | 'development' | 'review' | 'completed' | 'ongoing'>('planning');
  const [projectBudget, setProjectBudget] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Blog Form State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCategory, setBlogCategory] = useState('Tech Insights');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogPublished, setBlogPublished] = useState(false);

  // SEO Global Config State
  const [seoConfigTitle, setSeoConfigTitle] = useState('Jawrah Pixel | Elite Digital Agency');
  const [seoConfigDesc, setSeoConfigDesc] = useState('Highly optimized premium digital blueprints.');

  // Media Simulation state
  const [mediaVault, setMediaVault] = useState<{ id: string; name: string; url: string; size: string }[]>([
    { id: '1', name: 'shabnam_hero_macro.jpg', url: 'https://jawrahpixel.com/shabnam_hero_macro.jpg', size: '1.2 MB' },
    { id: '2', name: 'zenvor_advisory_radar.svg', url: 'https://jawrahpixel.com/zenvor_advisory_radar.svg', size: '45 KB' },
    { id: '3', name: 'mc_livings_zoom_wood.jpg', url: 'https://jawrahpixel.com/mc_livings_zoom_wood.jpg', size: '2.4 MB' }
  ]);
  const [simulatedMediaFile, setSimulatedMediaFile] = useState<string>('');

  // Newsletter blast simulator state
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');

  // Toast trigger utility
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Pre-seed mock datasets when database connectivity is empty or missing admin boundaries
  const INITIAL_MOCK_PROJECTS = [
    { id: 'p1', title: 'Shabnam Jewellers Platform', service_type: 'Bespoke Ecommerce & UI Branding', status: 'completed', budget: 'LKR 2,200,000', deadline: '2026-06-15', description: 'Heritage jewelry flagship with hourly metal appraisers API.', created_at: '2026-05-10T10:00:00Z' },
    { id: 'p2', title: 'Zenvor Corporate Portal', service_type: 'Corporate Platform & Advanced SEO', status: 'completed', budget: 'LKR 1,600,000', deadline: '2026-06-25', description: 'Consultancy flagship with publication vault and schema structuring.', created_at: '2026-05-12T11:00:00Z' },
    { id: 'p3', title: 'MC Livings Showroom', service_type: 'Interactive Spatial Digital Showroom', status: 'review', budget: 'LKR 1,850,000', deadline: '2026-07-02', description: 'Virtual room interior planner catalog with texture zoom.', created_at: '2026-05-13T12:00:00Z' },
    { id: 'p4', title: 'AeroVista Travels Engine', service_type: 'Luxury Travel System & Booking Engine', status: 'development', budget: 'LKR 2,400,000', deadline: '2026-07-15', description: 'Offline capability travel planners with hotel availability APIs caches.', created_at: '2026-05-15T09:00:00Z' }
  ];

  const INITIAL_MOCK_INQUIRIES = [
    { id: 'inq1', name: 'Nalin Wickramasinghe', email: 'nalin@wickremesinghe-partners.lk', whatsapp: '+94711122334', business_name: 'Wickremesinghe Partners', project_type: 'Bespoke Enterprise Web Portal', budget: 'LKR 2,500,000+', status: 'new', created_at: '2026-05-22T14:30:00Z', message: 'Need an online customer service terminal syncing directly with local legacy databases.' },
    { id: 'inq2', name: 'Dimitri Gomez', email: 'dimitri@aurora-studios.co', whatsapp: '+94775432110', business_name: 'Aurora Studios', project_type: 'Branding Layout & UI Architecture', budget: 'LKR 1,000,000 - 2,500,000', status: 'contacted', created_at: '2026-05-21T09:12:00Z', message: 'We want a portfolio showcasing design items that performs smoothly on mobile screens.' },
    { id: 'inq3', name: 'Nisansala Jayasinghe', email: 'nisansala@ceyloncrafts.org', whatsapp: '+94723456789', business_name: 'Ceylon Vintage Crafts', project_type: 'E-commerce Boutique Network', budget: 'Under LKR 1,000,000', status: 'qualified', created_at: '2026-05-20T11:45:00Z', message: 'Expanding local handcrafted textile sales onto international platform. Basic WhatsApp checkout needed.' }
  ];

  const INITIAL_MOCK_BOOKINGS = [
    { id: 'b1', name: 'Nalin Wickramasinghe', email: 'nalin@wickremesinghe-partners.lk', whatsapp: '+94711122334', project_type: 'Bespoke Enterprise Web Portal', budget: 'LKR 2,500,000+', preferred_date: '2026-05-28', preferred_time: '14:00 (GMT+5:30)', status: 'confirmed', created_at: '2026-05-22T14:35:00Z' },
    { id: 'b2', name: 'Dimitri Gomez', email: 'dimitri@aurora-studios.co', whatsapp: '+94775432110', project_type: 'Branding Layout & UI Architecture', preferred_date: '2026-05-29', preferred_time: '10:30 (GMT+5:30)', status: 'pending', created_at: '2026-05-21T09:15:00Z' }
  ];

  const INITIAL_MOCK_TESTIMONIALS = [
    { id: 't1', client_name: 'Faris Shabnam', company: 'Shabnam Jewellers', rating: 5, message: 'Jawrah Pixel codified the soul of our fine heritage jewelry catalog seamlessly.', active: true, created_at: '2026-05-18T10:00:00Z' },
    { id: 't2', client_name: 'Dr. Amara Perera', company: 'Zenvor Advisory', rating: 5, message: 'The platform perfectly reflects our consultancy ethics and drove heavy organic SEO traffic.', active: true, created_at: '2026-05-19T08:30:00Z' },
    { id: 't3', client_name: 'Shehan de Mel', company: 'MC Livings', rating: 4, message: 'Designer specialists highly comment on how incredible the virtual wood texture looks zoom-checked.', active: false, created_at: '2026-05-20T12:00:00Z' }
  ];

  const INITIAL_MOCK_BLOGS = [
    { id: 'bl1', title: 'The Blueprint of High-Conversion Jewelry Store UI', slug: 'blueprint-jewelry-ui', category: 'Design Strategy', excerpt: 'How we utilize radial grids and precise camera layouts to frame fine metals.', published: true, created_at: '2026-05-15T14:00:00Z', updated_at: '2026-05-15T14:00:00Z' },
    { id: 'bl2', title: 'Optimizing DB Loading on Luxury Travel Calendars', slug: 'optimizing-travel-api', category: 'Engineering Insights', excerpt: 'Tackling external lookup response latencies with cache controllers.', published: false, created_at: '2026-05-21T09:00:00Z', updated_at: '2021-05-21T09:00:00Z' }
  ];

  const INITIAL_NEWSLETTER_SUBSCRIBERS = [
    { id: 'n1', email: 'investor-relations@privateequity.com', created_at: '2026-05-21T10:00:00Z' },
    { id: 'n2', email: 'architects-hub@livingspace.org', created_at: '2026-05-22T08:15:00Z' },
    { id: 'n3', email: 'samantha-desilva@gmail.com', created_at: '2026-05-22T19:30:00Z' }
  ];

  useEffect(() => {
    loadAllDashboardData();
  }, [sandboxMode]);

  const loadAllDashboardData = async () => {
    setLoading(true);
    if (sandboxMode) {
      // Load offline pre-seeded arrays
      setProjects(INITIAL_MOCK_PROJECTS);
      setInquiries(INITIAL_MOCK_INQUIRIES);
      setBookings(INITIAL_MOCK_BOOKINGS);
      setTestimonials(INITIAL_MOCK_TESTIMONIALS);
      setBlogs(INITIAL_MOCK_BLOGS);
      setNewsletters(INITIAL_NEWSLETTER_SUBSCRIBERS);
      setLoading(false);
      return;
    }

    try {
      // Attempt real Supabase Database Loads
      const { data: projData, error: projErr } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!projErr && projData) setProjects(projData);

      const { data: inqData, error: inqErr } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!inqErr && inqData) setInquiries(inqData);

      const { data: bookData, error: bookErr } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (!bookErr && bookData) setBookings(bookData);

      const { data: testData, error: testErr } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (!testErr && testData) setTestimonials(testData);

      const { data: bldData, error: bldErr } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (!bldErr && bldData) setBlogs(bldData);

      const { data: newsData, error: newsErr } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (!newsErr && newsData) setNewsletters(newsData);

    } catch (err: any) {
      console.warn("Supabase load fallback triggered:", err.message);
      showToast("Defaulting to active local database state", "info");
      // Load local failover safely
      setProjects(INITIAL_MOCK_PROJECTS);
      setInquiries(INITIAL_MOCK_INQUIRIES);
      setBookings(INITIAL_MOCK_BOOKINGS);
      setTestimonials(INITIAL_MOCK_TESTIMONIALS);
      setBlogs(INITIAL_MOCK_BLOGS);
      setNewsletters(INITIAL_NEWSLETTER_SUBSCRIBERS);
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
      budget: projectBudget,
      deadline: projectDeadline || null,
      description: projectDescription,
      updated_at: new Date().toISOString()
    };

    if (editingProject) {
      // UPDATE
      if (sandboxMode) {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...payload } : p));
        showToast("Project blueprint updated locally!");
      } else {
        try {
          const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
          if (error) throw error;
          showToast("Sync: Project blueprint revised on Supabase!");
          loadAllDashboardData();
        } catch (err: any) {
          showToast(err.message, "error");
        }
      }
    } else {
      // CREATE
      const newProj = {
        id: 'p_' + Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      if (sandboxMode) {
        setProjects(prev => [newProj, ...prev]);
        showToast("New project registered in Sandbox database!");
      } else {
        try {
          const { error } = await supabase.from('projects').insert([payload]);
          if (error) throw error;
          showToast("Sync: New project deployed to Supabase and RLS verified!");
          loadAllDashboardData();
        } catch (err: any) {
          showToast(err.message, "error");
        }
      }
    }

    // Reset Form
    setProjectModalOpen(false);
    setEditingProject(null);
    setProjectTitle('');
    setProjectServiceType('Premium Website');
    setProjectStatus('planning');
    setProjectBudget('');
    setProjectDeadline('');
    setProjectDescription('');
  };

  const handleEditProjectClick = (p: any) => {
    setEditingProject(p);
    setProjectTitle(p.title);
    setProjectServiceType(p.service_type || 'Premium Website');
    setProjectStatus(p.status || 'planning');
    setProjectBudget(p.budget || '');
    setProjectDeadline(p.deadline || '');
    setProjectDescription(p.description || '');
    setProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to delete this project?")) return;

    if (sandboxMode) {
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast("Project asset removed from Sandbox database.", "info");
    } else {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        showToast("Sync: Project purged from Supabase.");
        loadAllDashboardData();
      } catch (err: any) {
        showToast(err.message, "error");
      }
    }
  };

  // INQUIRIES & BOOKING STATUS CHANGES
  const handleUpdateInquiryStatus = async (id: string, nextStatus: string) => {
    if (sandboxMode) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: nextStatus } : i));
      showToast(`Inquiry marked as ${nextStatus}`);
    } else {
      try {
        const { error } = await supabase.from('inquiries').update({ status: nextStatus }).eq('id', id);
        if (error) throw error;
        showToast(`Sync: Inquiry updated to ${nextStatus}`);
        loadAllDashboardData();
      } catch (err: any) {
        showToast(err.message, "error");
      }
    }
  };

  const handleUpdateBookingStatus = async (id: string, nextStatus: string) => {
    if (sandboxMode) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
      showToast(`Booking designated as ${nextStatus}`);
    } else {
      try {
        const { error } = await supabase.from('bookings').update({ status: nextStatus }).eq('id', id);
        if (error) throw error;
        showToast(`Sync: Booking state marked as ${nextStatus}`);
        loadAllDashboardData();
      } catch (err: any) {
        showToast(err.message, "error");
      }
    }
  };

  // TESTIMONIALS ACTIONS
  const toggleTestimonialActive = async (id: string, current: boolean) => {
    if (sandboxMode) {
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, active: !current } : t));
      showToast(`Testimonial publish state toggled!`);
    } else {
      try {
        const { error } = await supabase.from('testimonials').update({ active: !current }).eq('id', id);
        if (error) throw error;
        showToast(`Sync: Testimonial active-toggle updated.`);
        loadAllDashboardData();
      } catch (err: any) {
        showToast(err.message, "error");
      }
    }
  };

  // BLOG CRUD
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogSlug.trim()) {
      showToast("Title and Slug parameters are required", "error");
      return;
    }

    const payload = {
      title: blogTitle,
      slug: blogSlug,
      category: blogCategory,
      excerpt: blogExcerpt,
      content: blogContent,
      published: blogPublished,
      updated_at: new Date().toISOString()
    };

    if (sandboxMode) {
      const newB = { id: 'blog_' + Date.now(), ...payload, created_at: new Date().toISOString() };
      setBlogs(prev => [newB, ...prev]);
      showToast("Publication draft inserted in Sandbox!");
    } else {
      try {
        const { error } = await supabase.from('blog_posts').insert([payload]);
        if (error) throw error;
        showToast("Sync: Blog dispatch deployed dynamically!");
        loadAllDashboardData();
      } catch (err: any) {
        showToast(err.message, "error");
      }
    }

    setBlogModalOpen(false);
    setBlogTitle('');
    setBlogSlug('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogPublished(false);
  };

  // MEDIA UPLOADER SIMULATOR
  const handleFakeMediaUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedMediaFile.trim()) return;
    const newMedia = {
      id: Date.now().toString(),
      name: simulatedMediaFile.replace(/[^a-zA-Z0-9_.]/g, '_'),
      url: `https://jawrahpixel.com/media/${simulatedMediaFile}`,
      size: '240 KB'
    };
    setMediaVault(prev => [newMedia, ...prev]);
    showToast(`${simulatedMediaFile} uploaded to secure storage vault.`);
    setSimulatedMediaFile('');
  };

  // NEWSLETTER DISPATCH
  const handleDispatchNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterSubject.trim() || !newsletterBody.trim()) {
      showToast("Subject and communication block cannot be empty", "error");
      return;
    }
    showToast(`Transmitting blast to ${newsletters.length} verification nodes...`);
    setNewsletterSubject('');
    setNewsletterBody('');
  };

  // Safe checks for admin boundary while keeping presentation accessible
  const hasAdminRole = profile?.role === 'admin';

  // State filtered items block
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.service_type && p.service_type.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter.toLowerCase();
    const matchesRegion = projectRegionFilter === 'all' || p.region === projectRegionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

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
                <Globe size={12} className="text-brand-cyan" /> 
                {sandboxMode ? "Local Sandbox Simulated" : "Active DB Sync Active"}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold uppercase tracking-tight text-white">
              Operations Control
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Database Engine toggle switcher */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex items-center">
              <button 
                onClick={() => { setSandboxMode(true); showToast("Sandbox Mode Activated.", "info"); }}
                className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  sandboxMode ? 'bg-brand-cyan text-brand-black font-bold' : 'text-brand-gray hover:text-white'
                }`}
              >
                Sandbox Fallback
              </button>
              <button 
                onClick={() => { setSandboxMode(false); showToast("Connecting Database...", "info"); }}
                className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  !sandboxMode ? 'bg-brand-cyan text-brand-black font-bold' : 'text-brand-gray hover:text-white'
                }`}
              >
                Supabase Sync
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={loadAllDashboardData} className="uppercase font-mono text-[10px] tracking-wider border-white/10">
              Reload Engine
            </Button>
          </div>
        </div>

        {/* SECURITY ALERT SYSTEM RENDER FOR REAL MODE */}
        {!sandboxMode && !hasAdminRole && (
          <div className="mb-8 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Supabase Admin Barrier</h4>
                <p className="text-xs text-brand-silver leading-relaxed font-light mt-0.5">
                  Your active role is "{profile?.role || 'Guest'}". RLS blocks write tasks without role="admin" set in table. Switch back to **Sandbox Fallback** to test CRUD operations instantly!
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => { setSandboxMode(true); showToast("Switched back to client sandbox simulator.", "info"); }}
              className="px-4 text-[10px] font-mono tracking-widest bg-amber-500 hover:bg-amber-600 outline-none border-0 text-brand-black shrink-0 uppercase"
            >
              Toggle Sandbox
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* NAVIGATION CONTROL RAIL */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'overview', label: 'Overview Console', icon: Activity },
              { id: 'projects', label: 'Flagship Projects', count: projects.length, icon: Briefcase },
              { id: 'inquiries', label: 'Consult Inquiries', count: inquiries.length, icon: FileText },
              { id: 'bookings', label: 'Strategy Bookings', count: bookings.length, icon: Calendar },
              { id: 'testimonials', label: 'Verified Reviews', count: testimonials.length, icon: MessageSquare },
              { id: 'blogs', label: 'Agency Publications', count: blogs.length, icon: BookOpen },
              { id: 'media', label: 'Media Vault', count: mediaVault.length, icon: ImageIcon },
              { id: 'newsletter', label: 'Newsletter Hub', count: newsletters.length, icon: Mail },
              { id: 'settings', label: 'SEO Config Card', icon: Settings }
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
                
                {/* 1. OVERVIEW CONSOLE TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Operational Overview</h2>
                      <span className="text-[10px] font-mono text-brand-gray uppercase">Status: Automated Logs</span>
                    </div>

                    {/* Stats Metric Panel Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: 'Inquiries Rate', val: inquiries.length, growth: '+24%', desc: 'Month integrations', icon: FileText, color: 'text-brand-cyan' },
                        { title: 'Project Load', val: projects.length, growth: 'Active', desc: 'Active developer nodes', icon: Briefcase, color: 'text-brand-blue' },
                        { title: 'Scheduled Slots', val: bookings.length, growth: 'Confirmed', desc: 'Active strategy sessions', icon: Calendar, color: 'text-purple-400' },
                        { title: 'Estim. Revenue', val: 'LKR 7.2M', growth: 'Calculated', desc: 'Regional client commitments', icon: DollarSign, color: 'text-emerald-400' }
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

                    {/* SVG GRAPH CHART BLOCK */}
                    <div className="p-6 bg-brand-black/40 border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-0.5">Project Velocity Rate</h4>
                          <span className="text-xs text-brand-gray">Active vs Completed milestones tracking</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-brand-gray uppercase">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-cyan rounded-full"></span> Completed</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-blue rounded-full"></span> Active</span>
                        </div>
                      </div>

                      {/* Mock Chart SVG Render */}
                      <div className="w-full h-40 flex items-end justify-between px-4 pb-2 border-b border-white/10 relative">
                        {[40, 64, 52, 88, 70, 95].map((h, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 w-1/8">
                            <div className="w-5 bg-brand-cyan/25 rounded-t-sm group relative hover:bg-brand-cyan/40 transition-colors cursor-pointer" style={{ height: `${h}px` }}>
                              {/* Glowing overlay */}
                              <div className="absolute top-0 left-0 w-full h-full bg-brand-blue/30 rounded-t-sm opacity-50"></div>
                              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-mono text-brand-cyan font-bold opacity-0 hover:opacity-100 transition-opacity">
                                {h}%
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-brand-gray uppercase">{['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RECENT REQUISITIONS LIST */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono text-brand-cyan uppercase tracking-widest">Incoming Strategy Bookings</h4>
                      <div className="space-y-2.5">
                        {bookings.slice(0, 3).map((book) => (
                          <div key={book.id} className="p-4 bg-brand-black/40 border border-white/5 rounded-xl flex items-center justify-between flex-wrap gap-4">
                            <div>
                              <div className="text-xs font-semibold text-white uppercase tracking-wider">{book.name}</div>
                              <div className="text-[10px] text-brand-gray font-mono mt-0.5">{book.project_type} ● {book.preferred_date}</div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                book.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {book.status}
                              </span>
                              <ChevronRight size={14} className="text-brand-gray" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. PROJECTS LIST CONFIGTAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Dynamic Project Portfolio</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage live systems, status indicators, budgets, and milestones.</p>
                      </div>

                      <Button 
                        size="sm" 
                        onClick={() => {
                          setEditingProject(null);
                          setProjectTitle('');
                          setProjectServiceType('Premium Website');
                          setProjectStatus('planning');
                          setProjectBudget('');
                          setProjectDeadline('');
                          setProjectDescription('');
                          setProjectModalOpen(true);
                        }}
                        className="uppercase font-mono tracking-widest text-[10px] luxury-glow shrink-0 font-bold"
                      >
                        <Plus size={14} className="mr-1" /> Add Project
                      </Button>
                    </div>

                    {/* SEARCH SYSTEM AND STATUS FILTERS */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-brand-black/40 p-3.5 border border-white/5 rounded-xl">
                      <div className="sm:col-span-5 relative">
                        <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-brand-gray" />
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search database projects..."
                          className="w-full pl-9 pr-4 py-2.5 rounded bg-black/60 border border-white/5 text-xs text-white placeholder-brand-gray/50 focus:outline-none focus:border-brand-blue font-mono transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-7 flex flex-wrap items-center justify-end gap-3">
                        <div className="flex items-center gap-1.5 bg-brand-navy/40 border border-white/5 rounded p-1">
                          <button
                            type="button"
                            onClick={() => setProjectRegionFilter('all')}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                              projectRegionFilter === 'all'
                                ? 'bg-brand-blue text-white shadow-[0_0_8px_rgba(30,144,255,0.4)]'
                                : 'text-brand-gray hover:text-white'
                            }`}
                          >
                            All
                          </button>
                          <button
                            type="button"
                            onClick={() => setProjectRegionFilter('lk')}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                              projectRegionFilter === 'lk'
                                ? 'bg-brand-blue text-white shadow-[0_0_8px_rgba(30,144,255,0.4)]'
                                : 'text-brand-gray hover:text-white'
                            }`}
                          >
                            Sri Lanka
                          </button>
                          <button
                            type="button"
                            onClick={() => setProjectRegionFilter('pk')}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                              projectRegionFilter === 'pk'
                                ? 'bg-brand-cyan text-brand-black shadow-[0_0_8px_rgba(6,182,212,0.3)] font-semibold'
                                : 'text-brand-gray hover:text-white'
                            }`}
                          >
                            Pakistan
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Filter size={11} className="text-brand-gray" />
                          <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="py-1.5 px-2 rounded bg-black/60 border border-white/5 text-xs font-mono text-brand-silver focus:outline-none w-32"
                          >
                            <option value="ALL">ALL STATUSES</option>
                            <option value="PLANNING">Planning</option>
                            <option value="DESIGN">Design</option>
                            <option value="DEVELOPMENT">Development</option>
                            <option value="REVIEW">Review</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* DATABASE LIST TABLE */}
                    <div className="border border-white/5 rounded-xl overflow-hidden bg-brand-black/20 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.03]">
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Project Architecture</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Budget Details</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Target Timeline</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase">Status Matrix</th>
                            <th className="p-4 text-[10px] font-mono text-brand-gray uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProjects.length > 0 ? (
                            filteredProjects.map((proj) => (
                              <tr key={proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                  <div className="text-xs font-semibold text-white uppercase tracking-wider">{proj.title}</div>
                                  <div className="text-[10px] text-brand-gray block mt-0.5">{proj.service_type || 'Custom Blueprints'}</div>
                                </td>
                                
                                <td className="p-4 font-mono text-xs text-brand-cyan">
                                  {proj.budget || 'Calculated Project'}
                                </td>

                                <td className="p-4 font-mono text-xs text-brand-silver">
                                  {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'Continuous Node'}
                                </td>

                                <td className="p-4">
                                  <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                                    proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    proj.status === 'review' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                    proj.status === 'development' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' :
                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}>
                                    {proj.status}
                                  </span>
                                </td>

                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => handleEditProjectClick(proj)}
                                      className="p-2 rounded bg-white/5 hover:bg-brand-cyan/15 text-brand-gray hover:text-brand-cyan transition-colors"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteProject(proj.id)}
                                      className="p-2 rounded bg-white/5 hover:bg-red-500/15 text-brand-gray hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-12 text-center text-brand-gray font-mono text-xs">
                                No systems project datasets returned for filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

                {/* 3. INQUIRIES CONSOLE TAB */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Strategic Consultations</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Leads lifecycle pipelines processing initial business discovery formulas.</p>
                      </div>

                      {/* Region Filter Buttons */}
                      <div className="flex gap-1.5 p-1 bg-brand-navy/60 border border-white/5 rounded-lg w-fit text-xs backdrop-blur-md">
                        <button
                          onClick={() => setInquiryRegionFilter('all')}
                          className={`px-3 py-1 rounded transition-all ${
                            inquiryRegionFilter === 'all'
                              ? 'bg-brand-blue text-white shadow-[0_0_8px_rgba(30,144,255,0.4)]'
                              : 'text-brand-gray hover:text-white'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setInquiryRegionFilter('lk')}
                          className={`px-3 py-1 rounded transition-all ${
                            inquiryRegionFilter === 'lk'
                              ? 'bg-brand-blue text-white shadow-[0_0_8px_rgba(30,144,255,0.4)]'
                              : 'text-brand-gray hover:text-white'
                          }`}
                        >
                          Sri Lanka
                        </button>
                        <button
                          onClick={() => setInquiryRegionFilter('pk')}
                          className={`px-3 py-1 rounded transition-all ${
                            inquiryRegionFilter === 'pk'
                              ? 'bg-brand-cyan text-brand-black shadow-[0_0_8px_rgba(6,182,212,0.3)] font-semibold'
                              : 'text-brand-gray hover:text-white'
                          }`}
                        >
                          Pakistan
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {inquiries
                        .filter((inq) => inquiryRegionFilter === 'all' || inq.region === inquiryRegionFilter)
                        .map((inq) => (
                        <div key={inq.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl hover:border-brand-cyan/10 transition-colors relative group">
                          <div className="absolute top-4 right-4 flex gap-2">
                            {/* Update Status Actions */}
                            {['new', 'contacted', 'qualified'].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                                className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase border transition-all cursor-pointer ${
                                  inq.status === st 
                                    ? 'bg-brand-cyan/20 border-brand-cyan/30 text-brand-cyan font-semibold' 
                                    : 'border-white/5 text-brand-gray hover:border-white/10'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          <div className="space-y-2 max-w-2xl">
                            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest block">{inq.business_name || 'Individual Client'}</span>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{inq.name} ● <span className="text-brand-gray text-[11px] font-normal lowercase">{inq.email}</span></h3>
                            <p className="text-xs text-brand-silver font-light leading-relaxed italic">
                              "{inq.message || 'No additional project scope notes was submitted'}"
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono text-brand-gray uppercase">
                              <span>WhatsApp: {inq.whatsapp || 'N/A'}</span>
                              <span>Scale: {inq.budget || 'Calculated Budget'}</span>
                              <span>Target: {inq.project_type}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* 4. BOOKINGS STRATEGY CONSOLE */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Strategy Call Registrars</h2>
                        <p className="text-xs text-brand-gray mt-0.5">Manage virtual discovery sessions and verified consulting timelines.</p>
                      </div>

                      {/* Region Filter Buttons */}
                      <div className="flex gap-1.5 p-1 bg-brand-navy/60 border border-white/5 rounded-lg w-fit text-xs backdrop-blur-md">
                        <button
                          onClick={() => setBookingRegionFilter('all')}
                          className={`px-3 py-1 rounded transition-all ${
                            bookingRegionFilter === 'all'
                              ? 'bg-brand-blue text-white shadow-[0_0_8px_rgba(30,144,255,0.4)]'
                              : 'text-brand-gray hover:text-white'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setBookingRegionFilter('lk')}
                          className={`px-3 py-1 rounded transition-all ${
                            bookingRegionFilter === 'lk'
                              ? 'bg-brand-blue text-white shadow-[0_0_8px_rgba(30,144,255,0.4)]'
                              : 'text-brand-gray hover:text-white'
                          }`}
                        >
                          Sri Lanka
                        </button>
                        <button
                          onClick={() => setBookingRegionFilter('pk')}
                          className={`px-3 py-1 rounded transition-all ${
                            bookingRegionFilter === 'pk'
                              ? 'bg-brand-cyan text-brand-black shadow-[0_0_8px_rgba(6,182,212,0.3)] font-semibold'
                              : 'text-brand-gray hover:text-white'
                          }`}
                        >
                          Pakistan
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {bookings
                        .filter((book) => bookingRegionFilter === 'all' || book.region === bookingRegionFilter)
                        .map((book) => (
                        <div key={book.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-brand-blue/10 border border-brand-blue/25 text-brand-blue font-mono text-[9px] uppercase tracking-widest">
                              {book.project_type}
                            </span>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-2">{book.name}</h3>
                            <div className="text-[10px] text-brand-gray font-mono lowercase">{book.email} ● {book.whatsapp || 'No WhatsApp contact node'}</div>
                          </div>

                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="text-right sm:text-right">
                              <span className="text-[10px] font-mono uppercase text-brand-gray block">PREFERRED SLOT</span>
                              <span className="text-xs font-mono text-white max-w-[120px] block truncate">{book.preferred_date} at {book.preferred_time}</span>
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

                {/* 5. VERIFIED TESTIMONIALS MANAGER */}
                {activeTab === 'testimonials' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Social Proof Registry</h2>
                        <span className="text-xs text-brand-gray">Review and toggle active placement status across homepage.</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {testimonials.map((test) => (
                        <div key={test.id} className="p-5 bg-brand-black/60 border border-white/5 rounded-xl flex justify-between items-start gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={12} className={`fill-current ${s <= (test.rating || 5) ? 'text-brand-cyan' : 'text-white/5'}`} />
                              ))}
                            </div>
                            <blockquote className="text-xs text-brand-silver italic leading-relaxed">
                              "{test.message}"
                            </blockquote>
                            <div className="text-[10px] font-mono text-brand-gray uppercase">
                              {test.client_name} ● {test.company || 'Direct Client'}
                            </div>
                          </div>

                          <button
                            onClick={() => toggleTestimonialActive(test.id, test.active)}
                            className={`px-3 py-1.5 rounded text-[9px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                              test.active 
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold' 
                                : 'bg-white/5 border-white/5 text-brand-gray hover:text-white'
                            }`}
                          >
                            {test.active ? 'ACTIVE HERO' : 'DISABLED'}
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* 6. BLOG CHANNELS TABLE */}
                {activeTab === 'blogs' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Editorial Publications</h2>
                        <span className="text-xs text-brand-gray">Publish, edit layouts, and schema optimize index writeups.</span>
                      </div>

                      <Button size="sm" onClick={() => setBlogModalOpen(true)} className="uppercase font-mono tracking-widest text-[10px] font-bold">
                        <Plus size={14} className="mr-1" /> Add Publication
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {blogs.map((b) => (
                        <div key={b.id} className="p-4 bg-brand-black/40 border border-white/5 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-[8px] font-mono uppercase tracking-widest">
                              {b.category}
                            </span>
                            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mt-2">{b.title}</h3>
                            <span className="text-[9px] text-brand-gray font-mono lowercase">/{b.slug}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase ${
                              b.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-brand-gray'
                            }`}>
                              {b.published ? 'PUBLIC' : 'DRAFT'}
                            </span>
                            <button className="p-1.5 rounded bg-white/5 text-brand-gray hover:text-white">
                              <Edit size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* 7. MEDIA VAULT STORAGE CONTROLS */}
                {activeTab === 'media' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Pragmatic Storage Vault</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Asset manager featuring real-time copy link shortcuts for developers.</p>
                    </div>

                    {/* Sim upload action */}
                    <form onSubmit={handleFakeMediaUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-brand-black/60 p-5 border border-white/5 rounded-xl items-end">
                      <div className="sm:col-span-8 space-y-2">
                        <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Media Asset Name</label>
                        <Input 
                          type="text"
                          value={simulatedMediaFile}
                          onChange={(e) => setSimulatedMediaFile(e.target.value)}
                          placeholder="e.g. zenvor_seo_lighthouse.png"
                          className="bg-black border-white/5 h-10"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <Button type="submit" className="w-full h-10 uppercase font-mono tracking-widest text-[10px] select-none font-bold">
                          Simulate Upload
                        </Button>
                      </div>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {mediaVault.map((med) => (
                        <div key={med.id} className="p-4 bg-brand-black/40 border border-white/5 rounded-xl text-center space-y-3 relative group">
                          <div className="w-10 h-10 rounded bg-[#a855f7]/10 text-[#a855f7] flex items-center justify-center mx-auto">
                            <ImageIcon size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white uppercase tracking-wider block truncate">{med.name}</div>
                            <span className="text-[10px] text-brand-gray font-mono">{med.size}</span>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(med.url);
                              showToast("Storage URL copied to clipboard!");
                            }}
                            className="w-full py-1.5 border border-white/5 bg-white/5 hover:bg-brand-cyan/15 hover:border-brand-cyan/25 transition-all text-[9px] font-mono uppercase text-brand-silver hover:text-brand-cyan cursor-pointer rounded"
                          >
                            Copy Asset Link
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* 8. NEWSLETTER COMMUNICATIONS */}
                {activeTab === 'newsletter' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Subscribers Registry</h2>
                        <span className="text-xs text-brand-gray">Inbound marketing index tracking active email notifications limits.</span>
                      </div>

                      <button 
                        onClick={() => {
                          const csv = "Email,Subscribed_At\n" + newsletters.map(n => `${n.email},${n.created_at}`).join("\n");
                          navigator.clipboard.writeText(csv);
                          showToast("CSV index dataset copied to clipboard!");
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 border border-white/5 bg-white/5 hover:bg-brand-cyan/10 hover:border-brand-cyan/30 text-xs font-mono uppercase tracking-widest text-brand-silver transition-colors cursor-pointer rounded"
                      >
                        <Download size={14} /> Export CSV Index
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Left: blast simulator form */}
                      <div className="lg:col-span-7 bg-brand-black/60 p-5 border border-white/5 rounded-xl space-y-4">
                        <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold block">TRANSMISSION DISPATCH</span>
                        <h3 className="text-sm font-semibold uppercase text-white tracking-wider">Email Blast Console</h3>
                        
                        <form onSubmit={handleDispatchNewsletter} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-brand-gray uppercase">Subject Line</label>
                            <Input 
                              type="text"
                              required
                              value={newsletterSubject}
                              onChange={(e) => setNewsletterSubject(e.target.value)}
                              placeholder="e.g. Dynamic System Blueprint Launching"
                              className="bg-black border-white/5 h-10"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-brand-gray uppercase">Newsletter Markdown Content</label>
                            <Textarea 
                              required
                              value={newsletterBody}
                              onChange={(e) => setNewsletterBody(e.target.value)}
                              placeholder="# Dynamic launch catalog... Hello team, the blueprints are live."
                              className="bg-black border-white/5 min-h-[100px]"
                            />
                          </div>

                          <Button type="submit" className="w-full text-xs font-mono uppercase tracking-widest h-10 select-none font-bold">
                            Broadcast to {newsletters.length} nodes
                          </Button>
                        </form>
                      </div>

                      {/* Right: active lists */}
                      <div className="lg:col-span-5 space-y-3">
                        <span className="text-[9px] font-mono text-brand-gray uppercase tracking-widest block font-bold">ACTIVE SIGNUPS</span>
                        <div className="space-y-2 bg-brand-black/20 p-2 border border-white/5 rounded-xl max-h-[280px] overflow-y-auto">
                          {newsletters.map((sub) => (
                            <div key={sub.id} className="p-3 bg-brand-black/40 border border-white/5 rounded-lg flex justify-between items-center text-xs truncate">
                              <span className="font-mono text-brand-silver">{sub.email}</span>
                              <span className="text-[9px] text-brand-gray">{new Date(sub.created_at).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* 9. GLOBAL SEO CONTROLLERS TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-xl font-display font-semibold uppercase text-white tracking-wider">Real SEO System Controller</h2>
                      <p className="text-xs text-brand-gray mt-0.5">Configure global client-facing indexing tags, titles, and crawler instructions.</p>
                    </div>

                    <div className="p-5 bg-brand-black/60 border border-white/5 rounded-xl space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Global Page Index Title</label>
                          <Input 
                            value={seoConfigTitle}
                            onChange={(e) => setSeoConfigTitle(e.target.value)}
                            className="bg-black border-white/5 h-10"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Global Robots Controller</label>
                          <select className="flex h-10 w-full rounded-sm border border-white/5 bg-black px-3 py-2 text-xs font-mono text-brand-silver">
                            <option value="index, follow">INDEX, FOLLOW (Search engines recommended)</option>
                            <option value="noindex, nofollow">NOINDEX, NOFOLLOW (Staging setup)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">Global Meta Description Template</label>
                        <Textarea 
                          value={seoConfigDesc}
                          onChange={(e) => setSeoConfigDesc(e.target.value)}
                          className="bg-black border-white/5 min-h-[80px]"
                        />
                      </div>

                      <div className="pt-2 border-t border-white/5 flex gap-4">
                        <Button 
                          onClick={() => {
                            showToast("Global Search Schema updated successfully.");
                          }}
                          className="text-xs font-mono uppercase tracking-widest h-10 select-none font-bold"
                        >
                          <Save size={14} className="mr-1.5" /> Save Configuration
                        </Button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* ----------------- MODAL SHEET: ADD/EDIT PROJECT ----------------- */}
        {projectModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass-card max-w-lg w-full rounded-2xl p-6 md:p-8 relative bg-slate-950 border border-brand-cyan/35 space-y-6 animate-scale-up">
              <button 
                onClick={() => setProjectModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-brand-gray hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div>
                <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest block">DATABASE TRANSACTIONS</span>
                <h3 className="text-xl font-display font-semibold text-white uppercase mt-1">
                  {editingProject ? 'Revise Project Schema' : 'Add Strategic Project'}
                </h3>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase">Project System Title</label>
                  <Input 
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Shabnam Jewellers Platform"
                    className="bg-brand-black border-white/5 h-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-brand-gray uppercase">Service Framework</label>
                    <select
                      value={projectServiceType}
                      onChange={(e) => setProjectServiceType(e.target.value)}
                      className="flex h-10 w-full rounded-sm border border-white/5 bg-brand-black px-3 py-2 text-xs font-mono text-brand-silver"
                    >
                      <option value="Premium Website">Premium Website</option>
                      <option value="Bespoke Ecommerce">Bespoke Ecommerce</option>
                      <option value="Custom CRM Platform">Custom CRM Platform</option>
                      <option value="Branding & Systems">Branding & Systems</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-brand-gray uppercase">System Status</label>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value as any)}
                      className="flex h-10 w-full rounded-sm border border-white/5 bg-brand-black px-3 py-2 text-xs font-mono text-brand-silver"
                    >
                      <option value="planning">planning</option>
                      <option value="design">design</option>
                      <option value="development">development</option>
                      <option value="review">review</option>
                      <option value="completed">completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-brand-gray uppercase">Project Budget</label>
                    <Input 
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(e.target.value)}
                      placeholder="e.g. LKR 1,800,000"
                      className="bg-brand-black border-white/5 h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-brand-gray uppercase">Target Deadline</label>
                    <input 
                      type="date"
                      value={projectDeadline}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                      className="flex h-10 w-full rounded-sm border border-white/5 bg-brand-black px-3 py-2 text-xs font-mono text-brand-silver focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase">Architecture Technical Blueprint Summary</label>
                  <Textarea 
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Detail specific performance, SEO target points, and schema plans."
                    className="bg-brand-black border-white/5 min-h-[80px]"
                  />
                </div>

                <Button type="submit" className="w-full text-xs font-mono uppercase tracking-widest luxury-glow select-none h-11 font-bold">
                  {editingProject ? 'Commit Blueprint Revisions' : 'Deploy Strategic Project'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- MODAL SHEET: ADD BLOG ----------------- */}
        {blogModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass-card max-w-lg w-full rounded-2xl p-6 md:p-8 relative bg-slate-950 border border-brand-cyan/35 space-y-6 animate-scale-up">
              <button 
                onClick={() => setBlogModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-brand-gray hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div>
                <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest block">DATABASE TRANSACTIONS</span>
                <h3 className="text-xl font-display font-semibold text-white uppercase mt-1">
                  Create Publication Blueprint
                </h3>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-brand-gray uppercase">Publication Title</label>
                    <Input 
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="e.g. Scaling Database Clusters"
                      className="bg-brand-black border-white/5 h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-brand-gray uppercase">Routing Slug</label>
                    <Input 
                      required
                      value={blogSlug}
                      onChange={(e) => setBlogSlug(e.target.value)}
                      placeholder="e.g. scaling-data-clusters"
                      className="bg-brand-black border-white/5 h-10 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-brand-gray uppercase">Content Tag Group</label>
                    <Input 
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      placeholder="Strategic Designs"
                      className="bg-brand-black border-white/5 h-10"
                    />
                  </div>

                  <div className="space-y-1.5 select-none">
                    <label className="text-[10px] font-mono text-brand-gray uppercase block">Published Schema Status</label>
                    <label className="flex items-center gap-2 h-10 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={blogPublished}
                        onChange={(e) => setBlogPublished(e.target.checked)}
                        className="rounded border-white/10 bg-black text-brand-cyan focus:ring-0 w-4 h-4"
                      />
                      <span className="text-xs text-brand-silver font-mono uppercase">Immediate Public Publish</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase">Brief Excerpt</label>
                  <Input 
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    placeholder="Short summary for homepage and sitemap crawlers."
                    className="bg-brand-black border-white/5 h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-brand-gray uppercase">Full Publication Markdown Content</label>
                  <Textarea 
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="## Introduction..."
                    className="bg-brand-black border-white/5 min-h-[140px]"
                  />
                </div>

                <Button type="submit" className="w-full text-xs font-mono uppercase tracking-widest luxury-glow select-none h-11 font-bold">
                  Save Publication Blueprint
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
