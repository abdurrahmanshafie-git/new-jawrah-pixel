export type Role = 'client' | 'admin' | 'agent';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  avatar_url: string | null;
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
  created_at: string;
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
  created_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  rating: number | null;
  message: string;
  active: boolean;
  created_at: string;
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
