import { supabase } from './supabase';

// Generate session ID (stored in sessionStorage)
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
};

// Track page view
export const trackPageView = async (pageType, pageId = null) => {
    try {
        const sessionId = getSessionId();

        await supabase
            .from('page_views')
            .insert({
                page_type: pageType,
                page_id: pageId,
                session_id: sessionId,
                user_agent: navigator.userAgent,
                referrer: document.referrer || null
            });
    } catch (error) {
        console.error('Error tracking page view:', error);
    }
};

// Track episode view
export const trackEpisodeView = async (dramaId, episodeNumber) => {
    try {
        const sessionId = getSessionId();

        await supabase.rpc('track_episode_view', {
            p_drama_id: dramaId.toString(),
            p_episode_number: episodeNumber,
            p_session_id: sessionId
        });
    } catch (error) {
        console.error('Error tracking episode view:', error);
    }
};

// Get episode view count
export const getEpisodeViews = async (dramaId, episodeNumber) => {
    try {
        const { data, error } = await supabase.rpc('get_episode_views', {
            p_drama_id: dramaId.toString(),
            p_episode_number: episodeNumber
        });

        if (error) throw error;
        return data || 0;
    } catch (error) {
        console.error('Error getting episode views:', error);
        return 0;
    }
};

// Get analytics summary
export const getAnalyticsSummary = async (days = 7) => {
    try {
        const { data, error } = await supabase
            .from('analytics_summary')
            .select('*')
            .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting analytics summary:', error);
        return [];
    }
};

// Get today's stats
export const getTodayStats = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('analytics_summary')
            .select('*')
            .eq('date', today)
            .single();

        if (error) throw error;
        return data || { total_views: 0, unique_visitors: 0, page_views: 0, episode_views: 0 };
    } catch (error) {
        console.error('Error getting today stats:', error);
        return { total_views: 0, unique_visitors: 0, page_views: 0, episode_views: 0 };
    }
};

// Get top episodes
export const getTopEpisodes = async (limit = 10) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('episode_views')
            .select('drama_id, episode_number, view_count')
            .gte('created_at', today)
            .order('view_count', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting top episodes:', error);
        return [];
    }
};

// Get real-time view count for episode
export const subscribeToEpisodeViews = (dramaId, episodeNumber, callback) => {
    const channel = supabase
        .channel(`episode_${dramaId}_${episodeNumber}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'episode_views',
                filter: `drama_id=eq.${dramaId},episode_number=eq.${episodeNumber}`
            },
            (payload) => {
                callback(payload);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
