export type Role = 'client' | 'admin' | 'agent';
export type RegionCode = 'lk' | 'pk';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  avatar_url: string | null;
  region: RegionCode | null;
  country: string | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
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
}

export interface Booking {
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
}

export interface Project {
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
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'queued' | 'active' | 'review' | 'approved' | 'complete';
  due_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
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
}

export interface ProjectFile {
  id: string;
  client_id: string;
  project_id: string | null;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  rating: number | null;
  message: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  content: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  client_id: string;
  project_id: string | null;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface RevisionRequest {
  id: string;
  client_id: string;
  project_id: string | null;
  detail: string;
  status: 'submitted' | 'in_review' | 'integrating' | 'completed';
  created_at: string;
  updated_at: string;
}
