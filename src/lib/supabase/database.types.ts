export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'client' | 'admin' | 'agent' | 'superadmin';
export type RegionCode = 'lk' | 'pk' | 'int';

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
          company_name: string | null;
          phone: string | null;
          whatsapp: string | null;
          status: 'active' | 'inactive' | 'suspended' | null;
          agent_code: string | null;
          agent_status: 'pending' | 'interview' | 'approved' | 'rejected' | 'suspended' | null;
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
          company_name?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          status?: 'active' | 'inactive' | 'suspended' | null;
          agent_code?: string | null;
          agent_status?: 'pending' | 'interview' | 'approved' | 'rejected' | 'suspended' | null;
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
          status: 'new' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
          assigned_to: string | null;
          notes: string | null;
          company: string | null;
          phone: string | null;
          region: RegionCode | null;
          agent_code: string | null;
          agent_id: string | null;
          referral_source: string | null;
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
          status?: 'new' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
          assigned_to?: string | null;
          notes?: string | null;
          company?: string | null;
          phone?: string | null;
          region?: RegionCode | null;
          agent_code?: string | null;
          agent_id?: string | null;
          referral_source?: string | null;
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
          status:
            | 'lead'
            | 'discovery'
            | 'planning'
            | 'design'
            | 'development'
            | 'testing'
            | 'revision'
            | 'deployment'
            | 'completed';
          progress: number | null;
          notes: string | null;
          assigned_to: string | null;
          estimated_completion: string | null;
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
          status?:
            | 'lead'
            | 'discovery'
            | 'planning'
            | 'design'
            | 'development'
            | 'testing'
            | 'revision'
            | 'deployment'
            | 'completed';
          progress?: number | null;
          notes?: string | null;
          assigned_to?: string | null;
          estimated_completion?: string | null;
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
          client_id: string | null;
          guest_email: string | null;
          guest_name: string | null;
          project_id: string | null;
          invoice_number: string;
          title: string;
          amount: number;
          currency: string;
          status: 'draft' | 'pending' | 'paid' | 'overdue' | 'void';
          payment_status:
            | 'unpaid'
            | 'pending'
            | 'processing'
            | 'paid'
            | 'failed'
            | 'refunded'
            | 'manual_review'
            | 'awaiting_verification'
            | 'confirmed'
            | 'update_requested'
            | 'rejected'
            | 'cancelled';
          project_value: number | null;
          deposit_percentage: number | null;
          deposit_amount: number | null;
          remaining_balance: number | null;
          amount_due_now: number | null;
          current_milestone: 'deposit' | 'development' | 'final' | 'completed' | null;
          region: RegionCode | null;
          payment_reference: string | null;
          payment_notes: string | null;
          proof_storage_path: string | null;
          payment_method:
            | 'payhere'
            | 'onepay'
            | 'bank_transfer'
            | 'easypaisa'
            | 'jazzcash'
            | 'paypal'
            | 'stripe'
            | 'visa'
            | 'mastercard'
            | 'wise'
            | 'payoneer'
            | null;
          transaction_id: string | null;
          due_date: string | null;
          paid_at: string | null;
          invoice_pdf_path: string | null;
          latest_receipt_pdf_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          guest_email?: string | null;
          guest_name?: string | null;
          project_id?: string | null;
          invoice_number: string;
          title: string;
          amount: number;
          currency?: string;
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'void';
          payment_status?:
            | 'unpaid'
            | 'pending'
            | 'processing'
            | 'paid'
            | 'failed'
            | 'refunded'
            | 'manual_review'
            | 'awaiting_verification'
            | 'confirmed'
            | 'update_requested'
            | 'rejected'
            | 'cancelled';
          project_value?: number | null;
          deposit_percentage?: number | null;
          deposit_amount?: number | null;
          remaining_balance?: number | null;
          amount_due_now?: number | null;
          current_milestone?: 'deposit' | 'development' | 'final' | 'completed' | null;
          region?: RegionCode | null;
          payment_reference?: string | null;
          payment_notes?: string | null;
          proof_storage_path?: string | null;
          payment_method?:
            | 'payhere'
            | 'onepay'
            | 'bank_transfer'
            | 'easypaisa'
            | 'jazzcash'
            | 'paypal'
            | 'stripe'
            | 'visa'
            | 'mastercard'
            | 'wise'
            | 'payoneer'
            | null;
          transaction_id?: string | null;
          due_date?: string | null;
          paid_at?: string | null;
          invoice_pdf_path?: string | null;
          latest_receipt_pdf_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      invoice_billing_milestones: {
        Row: {
          id: string;
          invoice_id: string;
          milestone_key: 'deposit' | 'development' | 'final';
          label: string;
          percentage: number;
          amount: number;
          status: 'pending' | 'paid' | 'cancelled';
          paid_at: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          milestone_key: 'deposit' | 'development' | 'final';
          label: string;
          percentage: number;
          amount: number;
          status?: 'pending' | 'paid' | 'cancelled';
          paid_at?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoice_billing_milestones']['Insert']>;
      };
      invoice_payments: {
        Row: {
          id: string;
          invoice_id: string;
          client_id: string | null;
          project_id: string | null;
          client_name: string | null;
          client_email: string | null;
          client_phone: string | null;
          project_name: string | null;
          invoice_number: string | null;
          amount: number;
          amount_paid: number | null;
          currency: string;
          region: RegionCode | null;
          payment_method: string | null;
          status:
            | 'pending'
            | 'processing'
            | 'manual_review'
            | 'pending_verification'
            | 'confirmed'
            | 'update_requested'
            | 'rejected'
            | 'paid'
            | 'failed'
            | 'cancelled';
          reference_number: string | null;
          bank_reference: string | null;
          proof_storage_path: string | null;
          receipt_storage_path: string | null;
          receipt_file_name: string | null;
          receipt_file_type: string | null;
          receipt_file_size: number | null;
          captcha_verified: boolean | null;
          notes: string | null;
          submitted_at: string | null;
          confirmed_at: string | null;
          confirmed_by: string | null;
          rejected_at: string | null;
          rejected_by: string | null;
          admin_note: string | null;
          provider_transaction_id: string | null;
          milestone_key: 'deposit' | 'development' | 'final' | null;
          receipt_number: string | null;
          receipt_pdf_path: string | null;
          submission_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          client_id?: string | null;
          project_id?: string | null;
          client_name?: string | null;
          client_email?: string | null;
          client_phone?: string | null;
          project_name?: string | null;
          invoice_number?: string | null;
          amount: number;
          amount_paid?: number | null;
          currency?: string;
          region?: RegionCode | null;
          payment_method?: string | null;
          status?:
            | 'pending'
            | 'processing'
            | 'manual_review'
            | 'pending_verification'
            | 'confirmed'
            | 'update_requested'
            | 'rejected'
            | 'paid'
            | 'failed'
            | 'cancelled';
          reference_number?: string | null;
          bank_reference?: string | null;
          proof_storage_path?: string | null;
          receipt_storage_path?: string | null;
          receipt_file_name?: string | null;
          receipt_file_type?: string | null;
          receipt_file_size?: number | null;
          captcha_verified?: boolean | null;
          notes?: string | null;
          submitted_at?: string | null;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          rejected_at?: string | null;
          rejected_by?: string | null;
          admin_note?: string | null;
          provider_transaction_id?: string | null;
          milestone_key?: 'deposit' | 'development' | 'final' | null;
          receipt_number?: string | null;
          receipt_pdf_path?: string | null;
          submission_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoice_payments']['Insert']>;
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
          file_category: 'project' | 'contract' | 'invoice' | 'proposal' | 'asset' | null;
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
          file_category?: 'project' | 'contract' | 'invoice' | 'proposal' | 'asset' | null;
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
      audit_events: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_table: string | null;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_table?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['audit_events']['Insert']>;
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
      project_updates: {
        Row: {
          id: string;
          project_id: string;
          status: string;
          progress: number | null;
          title: string;
          body: string | null;
          assigned_to: string | null;
          estimated_completion: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          status: string;
          progress?: number | null;
          title: string;
          body?: string | null;
          assigned_to?: string | null;
          estimated_completion?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['project_updates']['Insert']>;
      };
      proposals: {
        Row: {
          id: string;
          proposal_number: string;
          client_id: string | null;
          project_id: string | null;
          inquiry_id: string | null;
          title: string;
          scope_of_work: string | null;
          timeline: string | null;
          deliverables: string | null;
          pricing: number | null;
          currency: string;
          terms: string | null;
          status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
          region: RegionCode | null;
          sent_at: string | null;
          viewed_at: string | null;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proposal_number?: string;
          client_id?: string | null;
          project_id?: string | null;
          inquiry_id?: string | null;
          title: string;
          scope_of_work?: string | null;
          timeline?: string | null;
          deliverables?: string | null;
          pricing?: number | null;
          currency?: string;
          terms?: string | null;
          status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
          region?: RegionCode | null;
          sent_at?: string | null;
          viewed_at?: string | null;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['proposals']['Insert']>;
      };
      message_threads: {
        Row: {
          id: string;
          client_id: string | null;
          agent_id: string | null;
          thread_type: 'client' | 'agent';
          project_id: string | null;
          subject: string;
          status: 'open' | 'closed';
          last_message_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          agent_id?: string | null;
          thread_type?: 'client' | 'agent';
          project_id?: string | null;
          subject: string;
          status?: 'open' | 'closed';
          last_message_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['message_threads']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          body: string;
          attachment_path: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id: string;
          body: string;
          attachment_path?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      agent_applications: {
        Row: {
          id: string;
          inquiry_id: string | null;
          applicant_name: string;
          applicant_email: string;
          whatsapp: string | null;
          region: RegionCode | null;
          experience: string | null;
          profile_link: string | null;
          message: string | null;
          status: 'pending' | 'interview' | 'approved' | 'rejected' | 'suspended';
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          inquiry_id?: string | null;
          applicant_name: string;
          applicant_email: string;
          whatsapp?: string | null;
          region?: RegionCode | null;
          experience?: string | null;
          profile_link?: string | null;
          message?: string | null;
          status?: 'pending' | 'interview' | 'approved' | 'rejected' | 'suspended';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_applications']['Insert']>;
      };
      agent_profiles: {
        Row: {
          id: string;
          user_id: string;
          application_id: string | null;
          region: RegionCode;
          status: 'pending' | 'interview' | 'approved' | 'rejected' | 'suspended';
          tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'elite';
          completed_paid_projects: number;
          commission_rate: number;
          whatsapp: string | null;
          experience: string | null;
          profile_link: string | null;
          bio: string | null;
          approved_at: string | null;
          region_locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          application_id?: string | null;
          region: RegionCode;
          status?: 'pending' | 'interview' | 'approved' | 'rejected' | 'suspended';
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'elite';
          completed_paid_projects?: number;
          commission_rate?: number;
          whatsapp?: string | null;
          experience?: string | null;
          profile_link?: string | null;
          bio?: string | null;
          approved_at?: string | null;
          region_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_profiles']['Insert']>;
      };
      agent_leads: {
        Row: {
          id: string;
          agent_id: string;
          client_name: string;
          client_email: string | null;
          client_phone: string | null;
          company: string | null;
          service_interested: string | null;
          project_value: number;
          currency: string;
          region: RegionCode | null;
          status: 'submitted' | 'reviewing' | 'qualified' | 'proposal_sent' | 'won' | 'lost' | 'paid' | 'cancelled';
          commission_estimate: number;
          commission_status: 'pending' | 'approved' | 'paid' | 'rejected' | null;
          inquiry_id: string | null;
          project_id: string | null;
          notes: string | null;
          referral_source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          client_name: string;
          client_email?: string | null;
          client_phone?: string | null;
          company?: string | null;
          service_interested?: string | null;
          project_value?: number;
          currency?: string;
          region?: RegionCode | null;
          status?: 'submitted' | 'reviewing' | 'qualified' | 'proposal_sent' | 'won' | 'lost' | 'paid' | 'cancelled';
          commission_estimate?: number;
          commission_status?: 'pending' | 'approved' | 'paid' | 'rejected' | null;
          inquiry_id?: string | null;
          project_id?: string | null;
          notes?: string | null;
          referral_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_leads']['Insert']>;
      };
      agent_commissions: {
        Row: {
          id: string;
          agent_id: string;
          agent_lead_id: string | null;
          project_id: string | null;
          project_amount: number;
          commission_rate: number;
          commission_amount: number;
          currency: string;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'elite' | null;
          status: 'pending' | 'approved' | 'paid' | 'rejected';
          approved_by: string | null;
          approved_at: string | null;
          paid_at: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          agent_lead_id?: string | null;
          project_id?: string | null;
          project_amount: number;
          commission_rate?: number;
          commission_amount?: number;
          currency?: string;
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'elite' | null;
          status?: 'pending' | 'approved' | 'paid' | 'rejected';
          approved_by?: string | null;
          approved_at?: string | null;
          paid_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_commissions']['Insert']>;
      };
      agent_payouts: {
        Row: {
          id: string;
          agent_id: string;
          amount: number;
          currency: string;
          method: string | null;
          reference: string | null;
          status: 'pending' | 'completed' | 'failed';
          notes: string | null;
          paid_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          amount: number;
          currency?: string;
          method?: string | null;
          reference?: string | null;
          status?: 'pending' | 'completed' | 'failed';
          notes?: string | null;
          paid_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_payouts']['Insert']>;
      };
      agent_referrals: {
        Row: {
          id: string;
          agent_id: string;
          agent_code: string;
          visitor_session: string | null;
          landing_path: string | null;
          region: RegionCode | null;
          converted: boolean;
          inquiry_id: string | null;
          project_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          agent_code: string;
          visitor_session?: string | null;
          landing_path?: string | null;
          region?: RegionCode | null;
          converted?: boolean;
          inquiry_id?: string | null;
          project_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_referrals']['Insert']>;
      };
      agent_tier_history: {
        Row: {
          id: string;
          agent_id: string;
          previous_tier: string | null;
          new_tier: string;
          completed_projects: number;
          commission_rate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          previous_tier?: string | null;
          new_tier: string;
          completed_projects?: number;
          commission_rate: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_tier_history']['Insert']>;
      };
    };
  };
}

export type TableName = keyof Database['public']['Tables'];
export type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];
