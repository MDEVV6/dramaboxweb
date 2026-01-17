import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { getDramaUrl, getWatchUrl } from '../utils/slugify';
import './Hero.css';

const Hero = ({ featured }) => {
    if (!featured) return <div className="hero-skeleton skeleton"></div>;

    const dramaUrl = getDramaUrl(featured);
    const watchUrl = getWatchUrl(featured, 1);

    return (
        <div className="hero">
            <div className="hero-backdrop">
                <img src={featured.cover} alt={featured.name} className="hero-bg-img" />
                <div className="hero-overlay"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-layout">
                    <div className="hero-info animate-slide-up">
                        {featured.cornerName && (
                            <span className="hero-badge">{featured.cornerName}</span>
                        )}
                        <h1 className="hero-title">{featured.name}</h1>
                        <div className="hero-meta">
                            <span>{featured.chapterCount} Episodes</span>
                            <span className="dot">•</span>
                            <span>{featured.playCount} Views</span>
                            <span className="dot">•</span>
                            <span className="quality-badge">HD</span>
                        </div>
                        <p className="hero-desc">
                            {featured.introduction || "Experience the drama that has captured millions of hearts. A story of love, betrayal, and redemption."}
                        </p>

                        <div className="hero-actions">
                            <Link to={watchUrl} className="btn btn-primary">
                                <Play size={20} fill="currentColor" />
                                Watch Now
                            </Link>
                            <Link to={dramaUrl} className="btn btn-glass">
                                <Info size={20} />
                                More Info
                            </Link>
                        </div>
                    </div>

                    {/* Portrait Thumbnail - Desktop Only */}
                    <div className="hero-thumbnail">
                        <img src={featured.cover} alt={featured.name} />
                        <div className="thumbnail-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
