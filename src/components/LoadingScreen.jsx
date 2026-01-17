import React from 'react';
import { useSiteSettings } from '../contexts/SiteContext';
import './LoadingScreen.css';

const LoadingScreen = ({ isVisible }) => {
    const { settings } = useSiteSettings();

    if (!isVisible) return null;

    return (
        <div className="loading-screen">
            <div className="loading-content">
                {/* Animated Logo */}
                <div className="loading-logo">
                    {settings?.logo_url ? (
                        <div className="logo-image-container">
                            <img src={settings.logo_url} alt={settings.site_name} className="logo-image" />
                        </div>
                    ) : (
                        <div className="logo-circle">
                            <div className="logo-inner">
                                <svg viewBox="0 0 100 100" className="logo-svg">
                                    <circle cx="50" cy="50" r="45" className="logo-ring" />
                                    <circle cx="50" cy="50" r="35" className="logo-ring-inner" />
                                </svg>
                                <div className="logo-text">
                                    <span className="logo-d">D</span>
                                    <span className="logo-w">W</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Brand Name */}
                <div className="loading-brand">
                    <h1 className="brand-name">
                        {settings?.site_name || 'DramaBox'}<span className="brand-accent">Web</span>
                    </h1>
                    <p className="brand-tagline">{settings?.site_tagline || 'Premium Chinese Drama Experience'}</p>
                </div>

                {/* Loading Bar */}
                <div className="loading-bar-container">
                    <div className="loading-bar">
                        <div className="loading-bar-fill"></div>
                    </div>
                    <div className="loading-particles">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="particle" style={{
                                '--delay': `${i * 0.1}s`,
                                '--x': `${Math.random() * 100}%`
                            }}></div>
                        ))}
                    </div>
                </div>

                {/* Loading Text */}
                <div className="loading-text">
                    <span className="loading-dot">.</span>
                    <span className="loading-dot">.</span>
                    <span className="loading-dot">.</span>
                </div>
            </div>

            {/* Background Effects */}
            <div className="loading-bg-effects">
                <div className="glow-orb glow-orb-1"></div>
                <div className="glow-orb glow-orb-2"></div>
                <div className="glow-orb glow-orb-3"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
