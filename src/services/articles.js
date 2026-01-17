import { supabase } from './supabase';

/**
 * Article Service
 * Handles all article-related API calls
 */

// ============================================
// PUBLIC FUNCTIONS (For Frontend)
// ============================================

/**
 * Get all published articles with pagination
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {string} category - Filter by category (optional)
 * @returns {Promise<{data: Array, total: number, page: number, totalPages: number}>}
 */
export const getPublishedArticles = async (page = 1, limit = 12, category = null) => {
    try {
        const offset = (page - 1) * limit;

        let query = supabase
            .from('articles')
            .select('*', { count: 'exact' })
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error, count } = await query
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
            data: data || [],
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limit)
        };
    } catch (error) {
        console.error('Error fetching published articles:', error);
        return { data: [], total: 0, page: 1, totalPages: 0 };
    }
};

/**
 * Get single article by slug
 * @param {string} slug - Article slug
 * @returns {Promise<object|null>}
 */
export const getArticleBySlug = async (slug) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error) throw error;

        // Increment views
        if (data) {
            await incrementArticleViews(slug);
        }

        return data;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
};

/**
 * Increment article views
 * @param {string} slug - Article slug
 */
export const incrementArticleViews = async (slug) => {
    try {
        await supabase.rpc('increment_article_views', {
            article_slug: slug
        });
    } catch (error) {
        console.error('Error incrementing views:', error);
    }
};

/**
 * Get related articles
 * @param {string} category - Article category
 * @param {string} currentSlug - Current article slug to exclude
 * @param {number} limit - Number of articles to return
 * @returns {Promise<Array>}
 */
export const getRelatedArticles = async (category, currentSlug, limit = 3) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('id, title, slug, excerpt, featured_image, category, published_at')
            .eq('status', 'published')
            .eq('category', category)
            .neq('slug', currentSlug)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching related articles:', error);
        return [];
    }
};

/**
 * Search articles
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
export const searchArticles = async (query, limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('id, title, slug, excerpt, category, published_at')
            .eq('status', 'published')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error searching articles:', error);
        return [];
    }
};

/**
 * Get all categories
 * @returns {Promise<Array>}
 */
export const getCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('article_categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// ============================================
// ADMIN FUNCTIONS (For Admin Panel)
// ============================================

/**
 * Get all articles (admin) with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<object>}
 */
export const getAllArticles = async (page = 1, limit = 20, status = null) => {
    try {
        const offset = (page - 1) * limit;

        let query = supabase
            .from('articles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data, error, count } = await query
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
            data: data || [],
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limit)
        };
    } catch (error) {
        console.error('Error fetching all articles:', error);
        return { data: [], total: 0, page: 1, totalPages: 0 };
    }
};

/**
 * Get article by ID (admin)
 * @param {string} id - Article ID
 * @returns {Promise<object|null>}
 */
export const getArticleById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        return null;
    }
};

/**
 * Create new article
 * @param {object} articleData - Article data
 * @returns {Promise<object|null>}
 */
export const createArticle = async (articleData) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .insert([articleData])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating article:', error);
        throw error;
    }
};

/**
 * Update article
 * @param {string} id - Article ID
 * @param {object} updates - Updated data
 * @returns {Promise<object|null>}
 */
export const updateArticle = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating article:', error);
        throw error;
    }
};

/**
 * Delete article
 * @param {string} id - Article ID
 * @returns {Promise<boolean>}
 */
export const deleteArticle = async (id) => {
    try {
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
};

/**
 * Publish article
 * @param {string} id - Article ID
 * @returns {Promise<object|null>}
 */
export const publishArticle = async (id) => {
    return updateArticle(id, {
        status: 'published',
        published_at: new Date().toISOString()
    });
};

/**
 * Unpublish article (set to draft)
 * @param {string} id - Article ID
 * @returns {Promise<object|null>}
 */
export const unpublishArticle = async (id) => {
    return updateArticle(id, {
        status: 'draft',
        published_at: null
    });
};

/**
 * Upload article image
 * @param {File} file - Image file
 * @param {string} folder - Folder name (optional)
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export const uploadArticleImage = async (file, folder = 'articles') => {
    try {
        if (!file || !file.name) {
            throw new Error('Invalid file provided');
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('article-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('article-images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * Delete article image
 * @param {string} imageUrl - Full image URL
 * @returns {Promise<boolean>}
 */
export const deleteArticleImage = async (imageUrl) => {
    try {
        if (!imageUrl) return false;

        // Extract file path from URL
        const urlParts = imageUrl.split('/article-images/');
        if (urlParts.length < 2) return false;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from('article-images')
            .remove([filePath]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
};

/**
 * Check if slug is available
 * @param {string} slug - Slug to check
 * @param {string} excludeId - Article ID to exclude (for updates)
 * @returns {Promise<boolean>}
 */
export const isSlugAvailable = async (slug, excludeId = null) => {
    try {
        let query = supabase
            .from('articles')
            .select('id')
            .eq('slug', slug);

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data.length === 0;
    } catch (error) {
        console.error('Error checking slug:', error);
        return false;
    }
};
