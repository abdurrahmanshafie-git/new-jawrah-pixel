-- Advanced Jawrah Bot Intelligence Schema
-- Memory, Analytics, and Lead Tracking

-- 1. Conversation Persistence
CREATE TABLE IF NOT EXISTS bot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    region TEXT,
    lead_score INTEGER DEFAULT 0,
    conversation_stage TEXT DEFAULT 'VISITOR',
    business_type TEXT,
    last_intent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Message History
CREATE TABLE IF NOT EXISTS bot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES bot_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('bot', 'user')),
    message TEXT NOT NULL,
    intent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Detailed Analytics Tracking
CREATE TABLE IF NOT EXISTS bot_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    intent TEXT,
    service TEXT,
    region TEXT,
    language TEXT,
    lead_score INTEGER,
    conversation_stage TEXT,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bot_conv_session ON bot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_bot_msg_conv ON bot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_bot_analytics_session ON bot_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_bot_analytics_intent ON bot_analytics(intent);
CREATE INDEX IF NOT EXISTS idx_bot_analytics_service ON bot_analytics(service);

-- Enable RLS
ALTER TABLE bot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_analytics ENABLE ROW LEVEL SECURITY;

-- Public/Visitor access policies (Insert only)
DROP POLICY IF EXISTS "Public insert bot_conversations" ON bot_conversations;
CREATE POLICY "Public insert bot_conversations" ON bot_conversations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert bot_messages" ON bot_messages;
CREATE POLICY "Public insert bot_messages" ON bot_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert bot_analytics" ON bot_analytics;
CREATE POLICY "Public insert bot_analytics" ON bot_analytics FOR INSERT WITH CHECK (true);

-- User access policies (View own data)
DROP POLICY IF EXISTS "Users view own bot_conversations" ON bot_conversations;
CREATE POLICY "Users view own bot_conversations" ON bot_conversations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own bot_messages" ON bot_messages;
CREATE POLICY "Users view own bot_messages" ON bot_messages FOR SELECT USING (
    conversation_id IN (SELECT id FROM bot_conversations WHERE user_id = auth.uid())
);

-- Admin access policies (View all data)
DROP POLICY IF EXISTS "Admins view all bot_conversations" ON bot_conversations;
CREATE POLICY "Admins view all bot_conversations" ON bot_conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins view all bot_messages" ON bot_messages;
CREATE POLICY "Admins view all bot_messages" ON bot_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Admins view all bot_analytics" ON bot_analytics;
CREATE POLICY "Admins view all bot_analytics" ON bot_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);
