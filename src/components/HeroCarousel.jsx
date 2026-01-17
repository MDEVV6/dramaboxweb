import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWatchUrl, getDramaUrl } from '../utils/slugify';
import './Hero.css';

const HeroCarousel = ({ items }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [items.length]);

    const featured = items[index];
    if (!featured) return null;

    const nextSlide = () => setIndex((prev) => (prev + 1) % items.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

    return (
        <div className="hero">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={featured.id}
                    className="hero-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <img src={featured.cover} alt={featured.name} className="hero-bg-img" />
                    <div className="hero-overlay"></div>
                </motion.div>
            </AnimatePresence>

            <div className="container hero-content">
                <div className="hero-info animate-slide-up">
                    {featured.cornerName && (
                        <span className="hero-badge" style={{ borderColor: featured.cornerColor, color: featured.cornerColor }}>
                            {featured.cornerName}
                        </span>
                    )}
                    <motion.h1
                        key={featured.name}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="hero-title"
                    >
                        {featured.name}
                    </motion.h1>

                    <div className="hero-meta">
                        <span>{featured.chapterCount} Episodes</span>
                        <span className="dot">•</span>
                        <span>{featured.playCount ? (
                            typeof featured.playCount === 'string' && (featured.playCount.includes('M') || featured.playCount.includes('K'))
                                ? featured.playCount
                                : (parseInt(featured.playCount) / 10000).toFixed(1) + 'M'
                        ) : 'N/A'} Views</span>
                        <span className="dot">•</span>
                        <span className="quality-badge">HD</span>
                    </div>

                    <p className="hero-desc">{featured.introduction}</p>

                    <div className="hero-actions">
                        <Link to={getWatchUrl(featured, 1)} state={{ drama: featured }} className="btn btn-primary">
                            <Play size={20} fill="currentColor" />
                            Watch Now
                        </Link>
                        <Link to={getDramaUrl(featured)} state={{ drama: featured }} className="btn btn-glass">
                            <Info size={20} />
                            Details
                        </Link>
                    </div>
                </div>
            </div>

            <button className="carousel-btn prev" onClick={prevSlide}><ChevronLeft size={30} /></button>
            <button className="carousel-btn next" onClick={nextSlide}><ChevronRight size={30} /></button>

            <div className="carousel-dots">
                {items.map((_, i) => (
                    <button
                        key={i}
                        className={`dot-btn ${i === index ? 'active' : ''}`}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
