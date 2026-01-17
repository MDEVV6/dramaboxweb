-- ============================================
-- SITE SETTINGS SCHEMA
-- Website Configuration Management
-- Version: 1.0.0
-- Last Updated: January 17, 2026
-- ============================================

-- Create Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Basic Site Information
    site_name TEXT DEFAULT 'DramaBox Web',
    site_tagline TEXT DEFAULT 'Watch Chinese Dramas Online',
    meta_description TEXT DEFAULT 'Stream the latest Chinese dramas online. Watch your favorite shows with high quality video streaming.',
    meta_keywords TEXT DEFAULT 'chinese drama, drama online, watch drama, streaming',
    
    -- Branding
    logo_url TEXT, -- URL to logo image (for header)
    favicon_url TEXT, -- URL to favicon
    
    -- SEO & Social
    og_image_url TEXT, -- Open Graph image for social sharing
    twitter_handle TEXT, -- @username
    
    -- Contact & Footer
    contact_email TEXT DEFAULT 'contact@dramabox.com',
    footer_text TEXT DEFAULT '© 2026 DramaBox Web. All rights reserved.',
    
    -- Additional Settings
    enable_registration BOOLEAN DEFAULT FALSE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    maintenance_message TEXT DEFAULT 'We are currently under maintenance. Please check back soon.',
    
    -- Analytics
    google_analytics_id TEXT,
    google_tag_manager_id TEXT,
    
    -- Social Media Links
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Insert default settings
INSERT INTO public.site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;

-- Policies: Public can read, Admins can update
CREATE POLICY "Public can read site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for site assets (logo, favicon)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site assets
DROP POLICY IF EXISTS "Public can view site assets" ON storage.objects;
CREATE POLICY "Public can view site assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Authenticated users can upload site assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload site assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Authenticated users can update site assets" ON storage.objects;
CREATE POLICY "Authenticated users can update site assets"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Authenticated users can delete site assets" ON storage.objects;
CREATE POLICY "Authenticated users can delete site assets"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'site-assets');

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Site Settings Schema Setup Complete!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Table: site_settings ✓';
    RAISE NOTICE 'Storage bucket: site-assets ✓';
    RAISE NOTICE 'RLS Policies: ✓';
    RAISE NOTICE 'Triggers: ✓';
    RAISE NOTICE '========================================';
END $$;

-- Display current settings
SELECT 
    'Setup Complete!' as status,
    site_name,
    site_tagline,
    meta_description,
    created_at
FROM public.site_settings
WHERE id = 1;
