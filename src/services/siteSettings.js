import { supabase } from './supabase';

/**
 * Site Settings Service
 * Manages website configuration settings
 */

// Get site settings
export const getSiteSettings = async () => {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching site settings:', error);
        throw error;
    }
};

// Update site settings
export const updateSiteSettings = async (settings) => {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .update(settings)
            .eq('id', 1)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating site settings:', error);
        throw error;
    }
};

// Upload logo
export const uploadLogo = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('site-assets')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw error;
    }
};

// Upload favicon
export const uploadFavicon = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `favicon-${Date.now()}.${fileExt}`;
        const filePath = `favicons/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('site-assets')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading favicon:', error);
        throw error;
    }
};

// Upload OG image
export const uploadOGImage = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `og-image-${Date.now()}.${fileExt}`;
        const filePath = `og-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('site-assets')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading OG image:', error);
        throw error;
    }
};

// Delete file from storage
export const deleteAsset = async (url) => {
    try {
        // Extract file path from URL
        const urlParts = url.split('/site-assets/');
        if (urlParts.length < 2) return;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from('site-assets')
            .remove([filePath]);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting asset:', error);
        throw error;
    }
};
