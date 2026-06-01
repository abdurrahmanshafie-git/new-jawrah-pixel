-- Jawrah Bot Training Center Schema
-- Tables for dynamic bot control and administration

-- 1. Intents Table
CREATE TABLE IF NOT EXISTS bot_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- e.g., 'pricing', 'seo'
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Keywords Table
CREATE TABLE IF NOT EXISTS bot_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_id UUID REFERENCES bot_intents(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    language TEXT DEFAULT 'English', -- English, Roman Urdu, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Answers Table (Rich Text & Dynamic)
CREATE TABLE IF NOT EXISTS bot_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_id UUID REFERENCES bot_intents(id) ON DELETE CASCADE,
    content TEXT NOT NULL, -- Supports variables like {{currency}}
    region TEXT DEFAULT 'all', -- 'lk', 'pk', 'int', 'all'
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Pricing Manager Table
CREATE TABLE IF NOT EXISTS bot_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_slug TEXT NOT NULL, -- e.g., 'web_dev', 'ecommerce'
    region TEXT NOT NULL, -- 'lk', 'pk', 'int'
    price_text TEXT NOT NULL, -- e.g., 'Starting from 450,000 LKR'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(service_slug, region)
);

-- 5. Bot Settings & Tone
CREATE TABLE IF NOT EXISTS bot_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL, -- 'tone', 'gemini_fallback', 'whatsapp_escalation'
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Training Queue (Unanswered Questions)
CREATE TABLE IF NOT EXISTS bot_training_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    language TEXT,
    region TEXT,
    session_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'trained', 'ignored')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Change Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS bot_change_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id),
    entity_type TEXT NOT NULL, -- 'intent', 'answer', 'pricing'
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bot_keywords_intent ON bot_keywords(intent_id);
CREATE INDEX IF NOT EXISTS idx_bot_answers_intent ON bot_answers(intent_id);
CREATE INDEX IF NOT EXISTS idx_bot_pricing_service ON bot_pricing(service_slug);

-- RLS Policies
ALTER TABLE bot_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_training_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_change_logs ENABLE ROW LEVEL SECURITY;

-- Select: Public (for Bot Engine)
DROP POLICY IF EXISTS "Public select bot_intents" ON bot_intents;
CREATE POLICY "Public select bot_intents" ON bot_intents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select bot_keywords" ON bot_keywords;
CREATE POLICY "Public select bot_keywords" ON bot_keywords FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select bot_answers" ON bot_answers;
CREATE POLICY "Public select bot_answers" ON bot_answers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select bot_pricing" ON bot_pricing;
CREATE POLICY "Public select bot_pricing" ON bot_pricing FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select bot_settings" ON bot_settings;
CREATE POLICY "Public select bot_settings" ON bot_settings FOR SELECT USING (true);

-- Full Access: Admins only
DROP POLICY IF EXISTS "Admins full access bot_intents" ON bot_intents;
CREATE POLICY "Admins full access bot_intents" ON bot_intents USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins full access bot_keywords" ON bot_keywords;
CREATE POLICY "Admins full access bot_keywords" ON bot_keywords USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins full access bot_answers" ON bot_answers;
CREATE POLICY "Admins full access bot_answers" ON bot_answers USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins full access bot_pricing" ON bot_pricing;
CREATE POLICY "Admins full access bot_pricing" ON bot_pricing USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins full access bot_settings" ON bot_settings;
CREATE POLICY "Admins full access bot_settings" ON bot_settings USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins full access bot_training_queue" ON bot_training_queue;
CREATE POLICY "Admins full access bot_training_queue" ON bot_training_queue USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins full access bot_change_logs" ON bot_change_logs;
CREATE POLICY "Admins full access bot_change_logs" ON bot_change_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
