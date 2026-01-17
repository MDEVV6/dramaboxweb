import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSiteSettings } from '../services/siteSettings';

const SiteContext = createContext();

export const useSiteSettings = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteSettings must be used within SiteProvider');
    }
    return context;
};

export const SiteProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        site_name: 'DramaBox Web',
        site_tagline: 'Watch Chinese Dramas Online',
        meta_description: 'Stream the latest Chinese dramas online',
        logo_url: null,
        favicon_url: null,
        footer_text: '© 2026 DramaBox Web. All rights reserved.'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await getSiteSettings();
            if (data) {
                setSettings(data);

                // Update document title
                document.title = data.site_name || 'DramaBox Web';

                // Update meta description
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc && data.meta_description) {
                    metaDesc.content = data.meta_description;
                }

                // Update favicon
                const favicon = document.querySelector("link[rel*='icon']");
                if (favicon && data.favicon_url) {
                    favicon.href = data.favicon_url;
                }
            }
        } catch (error) {
            console.error('Error loading site settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshSettings = () => {
        loadSettings();
    };

    return (
        <SiteContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SiteContext.Provider>
    );
};
