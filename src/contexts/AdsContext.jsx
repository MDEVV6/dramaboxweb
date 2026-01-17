import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AdsContext = createContext();

export const useAds = () => {
    const context = useContext(AdsContext);
    if (!context) {
        throw new Error('useAds must be used within AdsProvider');
    }
    return context;
};

export const AdsProvider = ({ children }) => {
    const [adsSettings, setAdsSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdsSettings();
    }, []);

    const fetchAdsSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('ads_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            setAdsSettings(data);
        } catch (error) {
            console.error('Error fetching ads settings:', error);
            setAdsSettings(null);
        } finally {
            setLoading(false);
        }
    };

    const getAdCode = (position) => {
        if (!adsSettings || !adsSettings.ads_enabled_globally) return null;

        const enabledKey = `${position}_ad_enabled`;
        const codeKey = `${position}_ad_code`;

        if (adsSettings[enabledKey] && adsSettings[codeKey]) {
            return adsSettings[codeKey];
        }

        return null;
    };

    const value = {
        adsSettings,
        loading,
        getAdCode,
        refreshAds: fetchAdsSettings
    };

    return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};
