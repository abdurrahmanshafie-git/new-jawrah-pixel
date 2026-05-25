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
          name: string;
          email: string;
          whatsapp: string | null;
          business_name: string | null;
          project_type: string;
          budget: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          message: string | null;
          status: 'new' | 'contacted' | 'qualified' | 'rejected';
          region: RegionCode | null;
          country: string | null;
          currency: string | null;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          whatsapp?: string | null;
          business_name?: string | null;
          project_type: string;
          budget?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          message?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'rejected';
          region?: RegionCode | null;
          country?: string | null;
          currency?: string | null;
          source?: string | null;
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
          whatsapp: string | null;
          project_type: string;
          budget: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          message: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          region: RegionCode | null;
          country: string | null;
          currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email: string;
          whatsapp?: string | null;
          project_type: string;
          budget?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          message?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          region?: RegionCode | null;
          country?: string | null;
          currency?: string | null;
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
          status: 'planning' | 'design' | 'development' | 'review' | 'completed' | 'ongoing';
          budget: string | null;
          deadline: string | null;
          description: string | null;
          progress: number | null;
          region: RegionCode | null;
          country: string | null;
          currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          title: string;
          service_type?: string | null;
          status?: 'planning' | 'design' | 'development' | 'review' | 'completed' | 'ongoing';
          budget?: string | null;
          deadline?: string | null;
          description?: string | null;
          progress?: number | null;
          region?: RegionCode | null;
          country?: string | null;
          currency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
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
