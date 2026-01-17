-- ============================================
-- DRAMABOXWEB - COMPLETE DATABASE SCHEMA
-- Version: 3.0.0 (Consolidated)
-- Last Updated: January 17, 2026
-- ============================================
-- This file contains all database schemas merged into one
-- Safe to run on a fresh Supabase database
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. DRAMAS & EPISODES TABLES
-- ============================================

-- Dramas Table
CREATE TABLE IF NOT EXISTS public.dramas (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    total_episodes INTEGER DEFAULT 0,
    plays INTEGER DEFAULT 0
);

-- Episodes Table
CREATE TABLE IF NOT EXISTS public.episodes (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    drama_id BIGINT REFERENCES public.dramas(id) ON DELETE CASCADE NOT NULL,
    episode_number INTEGER NOT NULL,
    title TEXT,
    video_url TEXT NOT NULL
);

-- ============================================
-- 2. ADMIN USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ
);

-- ============================================
-- 3. ADS SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.ads_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Global Settings
    ads_enabled_globally BOOLEAN DEFAULT FALSE,
    
    -- Header Ad (Global)
    header_ad_enabled BOOLEAN DEFAULT FALSE,
    header_ad_code TEXT,
    
    -- Home Page Ads
    home_top_ad_enabled BOOLEAN DEFAULT FALSE,
    home_top_ad_code TEXT,
    home_middle_ad_enabled BOOLEAN DEFAULT FALSE,
    home_middle_ad_code TEXT,
    home_bottom_ad_enabled BOOLEAN DEFAULT FALSE,
    home_bottom_ad_code TEXT,
    
    -- Detail Page Ads
    detail_top_ad_enabled BOOLEAN DEFAULT FALSE,
    detail_top_ad_code TEXT,
    detail_sidebar_ad_enabled BOOLEAN DEFAULT FALSE,
    detail_sidebar_ad_code TEXT,
    detail_bottom_ad_enabled BOOLEAN DEFAULT FALSE,
    detail_bottom_ad_code TEXT,
    
    -- Watch Page Ads
    watch_top_ad_enabled BOOLEAN DEFAULT FALSE,
    watch_top_ad_code TEXT,
    watch_sidebar_ad_enabled BOOLEAN DEFAULT FALSE,
    watch_sidebar_ad_code TEXT,
    watch_bottom_ad_enabled BOOLEAN DEFAULT FALSE,
    watch_bottom_ad_code TEXT,
    
    -- Video Ads
    video_preroll_ad_enabled BOOLEAN DEFAULT FALSE,
    video_preroll_ad_code TEXT,
    video_midroll_ad_enabled BOOLEAN DEFAULT FALSE,
    video_midroll_ad_code TEXT
);

-- Insert default ads settings
INSERT INTO public.ads_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. ANALYTICS TABLES
-- ============================================

-- Page Views Table
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_type TEXT NOT NULL,
    page_id TEXT,
    session_id TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Episode Views Table
CREATE TABLE IF NOT EXISTS public.episode_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drama_id TEXT NOT NULL,
    episode_number INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    view_count INTEGER DEFAULT 1,
    unique_views INTEGER DEFAULT 1,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(drama_id, episode_number, session_id)
);

-- Analytics Summary Table
CREATE TABLE IF NOT EXISTS public.analytics_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    episode_views INTEGER DEFAULT 0,
    top_drama_id TEXT,
    top_episode TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 5. ARTICLE MANAGEMENT TABLES
-- ============================================

-- Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category TEXT DEFAULT 'Uncategorized',
    tags TEXT[] DEFAULT '{}',
    author_id BIGINT REFERENCES public.admin_users(id),
    author_name TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    published_at TIMESTAMPTZ
);

-- Article Categories Table
CREATE TABLE IF NOT EXISTS public.article_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default categories
INSERT INTO public.article_categories (name, slug, description) VALUES
    ('News', 'news', 'Latest news and updates'),
    ('Reviews', 'reviews', 'Drama reviews and ratings'),
    ('Guides', 'guides', 'How-to guides and tutorials'),
    ('Announcements', 'announcements', 'Official announcements')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================

-- Page Views Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_type ON public.page_views(page_type);

-- Episode Views Indexes
CREATE INDEX IF NOT EXISTS idx_episode_views_drama ON public.episode_views(drama_id);
CREATE INDEX IF NOT EXISTS idx_episode_views_episode ON public.episode_views(episode_number);
CREATE INDEX IF NOT EXISTS idx_episode_views_created_at ON public.episode_views(created_at DESC);

-- Analytics Summary Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON public.analytics_summary(date DESC);

-- Articles Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

-- ============================================
-- 7. FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to track episode view
CREATE OR REPLACE FUNCTION public.track_episode_view(
    p_drama_id TEXT,
    p_episode_number INTEGER,
    p_session_id TEXT
) RETURNS void AS $$
BEGIN
    INSERT INTO public.episode_views (drama_id, episode_number, session_id)
    VALUES (p_drama_id, p_episode_number, p_session_id)
    ON CONFLICT (drama_id, episode_number, session_id)
    DO UPDATE SET 
        view_count = episode_views.view_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get episode views
CREATE OR REPLACE FUNCTION public.get_episode_views(
    p_drama_id TEXT,
    p_episode_number INTEGER
) RETURNS INTEGER AS $$
DECLARE
    total_views INTEGER;
BEGIN
    SELECT COALESCE(SUM(view_count), 0)
    INTO total_views
    FROM public.episode_views
    WHERE drama_id = p_drama_id
    AND episode_number = p_episode_number;
    
    RETURN total_views;
END;
$$ LANGUAGE plpgsql;

-- Function to increment article views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.articles
    SET views = views + 1
    WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to update analytics summary
CREATE OR REPLACE FUNCTION public.update_analytics_summary()
RETURNS void AS $$
BEGIN
    INSERT INTO public.analytics_summary (
        date,
        total_views,
        unique_visitors,
        page_views,
        episode_views
    )
    SELECT 
        CURRENT_DATE,
        COUNT(*) as total_views,
        COUNT(DISTINCT session_id) as unique_visitors,
        COUNT(CASE WHEN page_type != 'watch' THEN 1 END) as page_views,
        COUNT(CASE WHEN page_type = 'watch' THEN 1 END) as episode_views
    FROM public.page_views
    WHERE DATE(created_at) = CURRENT_DATE
    ON CONFLICT (date) 
    DO UPDATE SET
        total_views = EXCLUDED.total_views,
        unique_visitors = EXCLUDED.unique_visitors,
        page_views = EXCLUDED.page_views,
        episode_views = EXCLUDED.episode_views,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. TRIGGERS
-- ============================================

-- Trigger for admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for ads_settings
DROP TRIGGER IF EXISTS update_ads_settings_updated_at ON public.ads_settings;
CREATE TRIGGER update_ads_settings_updated_at
    BEFORE UPDATE ON public.ads_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for articles
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for episode_views
DROP TRIGGER IF EXISTS update_episode_views_updated_at ON public.episode_views;
CREATE TRIGGER update_episode_views_updated_at
    BEFORE UPDATE ON public.episode_views
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.dramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;

-- Dramas Policies
DROP POLICY IF EXISTS "Public dramas are viewable by everyone" ON public.dramas;
CREATE POLICY "Public dramas are viewable by everyone"
    ON public.dramas FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert dramas" ON public.dramas;
CREATE POLICY "Authenticated users can insert dramas"
    ON public.dramas FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Episodes Policies
DROP POLICY IF EXISTS "Public episodes are viewable by everyone" ON public.episodes;
CREATE POLICY "Public episodes are viewable by everyone"
    ON public.episodes FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert episodes" ON public.episodes;
CREATE POLICY "Authenticated users can insert episodes"
    ON public.episodes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Admin Users Policies
DROP POLICY IF EXISTS "Admins can view their own data" ON public.admin_users;
CREATE POLICY "Admins can view their own data"
    ON public.admin_users FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can update their own data" ON public.admin_users;
CREATE POLICY "Admins can update their own data"
    ON public.admin_users FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert admin users" ON public.admin_users;
CREATE POLICY "Authenticated users can insert admin users"
    ON public.admin_users FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Ads Settings Policies
DROP POLICY IF EXISTS "Public can read ads settings" ON public.ads_settings;
CREATE POLICY "Public can read ads settings"
    ON public.ads_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can update ads settings" ON public.ads_settings;
CREATE POLICY "Admins can update ads settings"
    ON public.ads_settings FOR ALL
    USING (true)
    WITH CHECK (true);

-- Articles Policies
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles"
    ON public.articles FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins can do everything with articles" ON public.articles;
CREATE POLICY "Admins can do everything with articles"
    ON public.articles FOR ALL
    USING (true)
    WITH CHECK (true);

-- Article Categories Policies
DROP POLICY IF EXISTS "Public can read categories" ON public.article_categories;
CREATE POLICY "Public can read categories"
    ON public.article_categories FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.article_categories;
CREATE POLICY "Admins can manage categories"
    ON public.article_categories FOR ALL
    USING (true)
    WITH CHECK (true);

-- Analytics Policies
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views"
    ON public.page_views FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;
CREATE POLICY "Admins can read page views"
    ON public.page_views FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can insert episode views" ON public.episode_views;
CREATE POLICY "Anyone can insert episode views"
    ON public.episode_views FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update episode views" ON public.episode_views;
CREATE POLICY "Anyone can update episode views"
    ON public.episode_views FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Public can read episode views" ON public.episode_views;
CREATE POLICY "Public can read episode views"
    ON public.episode_views FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can read analytics summary" ON public.analytics_summary;
CREATE POLICY "Admins can read analytics summary"
    ON public.analytics_summary FOR SELECT
    USING (true);

-- ============================================
-- 10. STORAGE BUCKETS
-- ============================================

-- Create storage bucket for media (dramas/episodes)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
DROP POLICY IF EXISTS "Media is publicly accessible" ON storage.objects;
CREATE POLICY "Media is publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Storage policies for article images
DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
CREATE POLICY "Public can view article images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
CREATE POLICY "Authenticated users can upload article images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Authenticated users can update article images" ON storage.objects;
CREATE POLICY "Authenticated users can update article images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Authenticated users can delete article images" ON storage.objects;
CREATE POLICY "Authenticated users can delete article images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'article-images');

-- ============================================
-- 11. SAMPLE DATA (OPTIONAL)
-- ============================================

-- Insert default admin user
-- Username: admin
-- Password: admin123
-- Note: Change password after first login!
INSERT INTO public.admin_users (username, email, password_hash, is_active)
VALUES ('admin', 'admin@dramabox.com', 'admin123', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Insert sample article
INSERT INTO public.articles (title, slug, content, excerpt, category, status, author_name, published_at)
VALUES (
    'Welcome to DramaboxWeb Blog',
    'welcome-to-dramaboxweb-blog',
    '<h2>Welcome to Our Blog!</h2><p>This is our first blog post. Stay tuned for more updates about Chinese dramas, reviews, and news!</p><p>We will be sharing:</p><ul><li>Latest drama news</li><li>Episode reviews</li><li>Behind the scenes content</li><li>Actor interviews</li></ul><p>Thank you for being part of our community!</p>',
    'Welcome to our new blog section where we share drama news, reviews, and exclusive content.',
    'Announcements',
    'published',
    'Admin',
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial analytics summary
INSERT INTO public.analytics_summary (date, total_views, unique_visitors, page_views, episode_views)
VALUES (CURRENT_DATE, 0, 0, 0, 0)
ON CONFLICT (date) DO NOTHING;

-- ============================================
-- 12. VERIFICATION
-- ============================================

DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'dramas', 'episodes', 'admin_users', 'ads_settings',
        'page_views', 'episode_views', 'analytics_summary',
        'articles', 'article_categories'
    );
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DramaboxWeb Database Setup Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: %', table_count;
    RAISE NOTICE 'Admin users: %', (SELECT COUNT(*) FROM admin_users);
    RAISE NOTICE 'Article categories: %', (SELECT COUNT(*) FROM article_categories);
    RAISE NOTICE 'Articles: %', (SELECT COUNT(*) FROM articles);
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Default Admin Credentials:';
    RAISE NOTICE 'Username: admin';
    RAISE NOTICE 'Password: admin123';
    RAISE NOTICE '⚠️  CHANGE PASSWORD IMMEDIATELY!';
    RAISE NOTICE '========================================';
END $$;

-- Summary Query
SELECT 
    'Setup Complete!' as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
    (SELECT COUNT(*) FROM admin_users) as admin_users,
    (SELECT COUNT(*) FROM article_categories) as categories,
    (SELECT COUNT(*) FROM articles) as articles;
