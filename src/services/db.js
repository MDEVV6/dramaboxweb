import { supabase } from '../lib/supabaseClient';

// Helper untuk upload file ke Supabase Storage
export const uploadFile = async (file, bucket, path) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return publicUrl;
};

// Create Drama (Series)
export const createDrama = async (dramaData) => {
    const { data, error } = await supabase
        .from('dramas')
        .insert([dramaData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Add Episode
export const createEpisode = async (episodeData) => {
    const { data, error } = await supabase
        .from('episodes')
        .insert([episodeData])
        .select();

    if (error) throw error;
    return data;
};

// Get My Uploads
export const getMyDramas = async () => {
    const { data, error } = await supabase
        .from('dramas')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};
