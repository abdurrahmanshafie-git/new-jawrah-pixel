-- Jawrah Pixel Supabase DB Schema
-- Execute this in the Supabase SQL editor

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'agent')),
  avatar_url TEXT,
  region TEXT DEFAULT 'lk',
  country TEXT DEFAULT 'Sri Lanka',
  currency TEXT DEFAULT 'LKR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inquiries (Contact Form)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  business_name TEXT,
  project_type TEXT NOT NULL,
  budget TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'rejected')),
  region TEXT DEFAULT 'lk',
  country TEXT DEFAULT 'Sri Lanka',
  currency TEXT DEFAULT 'LKR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  project_type TEXT NOT NULL,
  budget TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  region TEXT DEFAULT 'lk',
  country TEXT DEFAULT 'Sri Lanka',
  currency TEXT DEFAULT 'LKR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  service_type TEXT,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('planning', 'design', 'development', 'review', 'completed', 'ongoing')),
  budget TEXT,
  deadline DATE,
  description TEXT,
  region TEXT DEFAULT 'lk',
  country TEXT DEFAULT 'Sri Lanka',
  currency TEXT DEFAULT 'LKR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  excerpt TEXT,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper function to verify admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_agent() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read/update their own profile. Admins can do anything.
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin() OR is_agent());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin() OR is_agent());

-- Inquiries: Public can insert. Admins/Agents can read/update.
CREATE POLICY "Public can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins/Agents can view inquiries" ON inquiries FOR SELECT USING (is_admin() OR is_agent());
CREATE POLICY "Admins/Agents can update inquiries" ON inquiries FOR UPDATE USING (is_admin() OR is_agent());

-- Bookings: Public can insert. Users can read own. Admins/Agents can manage.
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (user_id = auth.uid() OR is_admin() OR is_agent());
CREATE POLICY "Users can modify own bookings" ON bookings FOR UPDATE USING (user_id = auth.uid() OR is_admin() OR is_agent());

-- Projects: Users can read own. Admins/Agents can manage.
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (client_id = auth.uid() OR is_admin() OR is_agent());
CREATE POLICY "Admins/Agents can insert projects" ON projects FOR INSERT WITH CHECK (is_admin() OR is_agent());
CREATE POLICY "Admins/Agents can update projects" ON projects FOR UPDATE USING (is_admin() OR is_agent());

-- Testimonials: Public can read active. Admins can manage.
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (active = true OR is_admin());
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (is_admin());

-- Blog Posts: Public can read published. Admins can manage.
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (published = true OR is_admin());
CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL USING (is_admin());

-- Newsletter: Public can insert. Admins can manage.
CREATE POLICY "Public can insert newsletter subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers FOR ALL USING (is_admin());

-- Trigger to automatically create profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
