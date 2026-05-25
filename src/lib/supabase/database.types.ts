export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'client' | 'admin' | 'agent';
export type RegionCode = 'lk' | 'pk';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: UserRole;
          avatar_url: string | null;
          region: RegionCode | null;
          country: string | null;
          currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          region?: RegionCode | null;
          country?: string | null;
          currency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      inquiries: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          whatsapp: string | null;
          country: string | null;
          business_name: string | null;
          service_interested: string;
          inquiry_type: 'general' | 'project' | 'pricing' | 'collaboration' | 'support';
          budget_range: string | null;
          message: string | null;
          source_page: RegionCode | null;
          status: 'new' | 'contacted' | 'proposal_sent' | 'closed' | 'rejected';
          assigned_to: string | null;
          notes: string | null;
          region: RegionCode | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          whatsapp?: string | null;
          country?: string | null;
          business_name?: string | null;
          service_interested: string;
          inquiry_type?: 'general' | 'project' | 'pricing' | 'collaboration' | 'support';
          budget_range?: string | null;
          message?: string | null;
          source_page?: RegionCode | null;
          status?: 'new' | 'contacted' | 'proposal_sent' | 'closed' | 'rejected';
          assigned_to?: string | null;
          notes?: string | null;
          region?: RegionCode | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          whatsapp: string | null;
          country: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          project_type: string;
          message: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          region: RegionCode | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          whatsapp?: string | null;
          country?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          project_type: string;
          message?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          region?: RegionCode | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          client_id: string | null;
          title: string;
          service_type: string | null;
          price: number | null;
          deadline: string | null;
          status: 'new lead' | 'contacted' | 'proposal sent' | 'payment pending' | 'project active' | 'delivered' | 'maintenance';
          progress: number | null;
          notes: string | null;
          region: RegionCode | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          title: string;
          service_type?: string | null;
          price?: number | null;
          deadline?: string | null;
          status?: 'new lead' | 'contacted' | 'proposal sent' | 'payment pending' | 'project active' | 'delivered' | 'maintenance';
          progress?: number | null;
          notes?: string | null;
          region?: RegionCode | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: 'queued' | 'active' | 'review' | 'approved' | 'complete';
          due_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: 'queued' | 'active' | 'review' | 'approved' | 'complete';
          due_date?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['project_milestones']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          invoice_number: string;
          title: string;
          amount: number;
          currency: string;
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
          due_date: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          invoice_number: string;
          title: string;
          amount: number;
          currency?: string;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
          due_date?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      project_files: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          file_name: string;
          storage_path: string;
          mime_type: string | null;
          size_bytes: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          file_name: string;
          storage_path: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['project_files']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          company: string | null;
          rating: number | null;
          message: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          company?: string | null;
          rating?: number | null;
          message: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string | null;
          excerpt: string | null;
          content: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category?: string | null;
          excerpt?: string | null;
          content?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      newsletter_subscribers: {
        Row: { id: string; email: string; source: string | null; created_at: string };
        Insert: { id?: string; email: string; source?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>;
      };
      chatbot_leads: {
        Row: {
          id: string;
          name: string;
          business_type: string | null;
          country: string | null;
          project_type: string | null;
          budget_range: string | null;
          whatsapp: string | null;
          message: string | null;
          status: 'new' | 'contacted' | 'qualified' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          business_type?: string | null;
          country?: string | null;
          project_type?: string | null;
          budget_range?: string | null;
          whatsapp?: string | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['chatbot_leads']['Insert']>;
      };
      support_tickets: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          subject: string;
          message: string;
          status: 'open' | 'in_progress' | 'resolved' | 'closed';
          priority: 'low' | 'normal' | 'high' | 'urgent';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          subject: string;
          message: string;
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          priority?: 'low' | 'normal' | 'high' | 'urgent';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>;
      };
      revision_requests: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          detail: string;
          status: 'submitted' | 'in_review' | 'integrating' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          detail: string;
          status?: 'submitted' | 'in_review' | 'integrating' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['revision_requests']['Insert']>;
      };
    };
  };
}

export type TableName = keyof Database['public']['Tables'];
export type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];
