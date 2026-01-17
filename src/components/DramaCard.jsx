import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import { getDramaUrl } from '../utils/slugify';
import './DramaCard.css';

const DramaCard = ({ drama }) => {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Check if drama is in saved list
        const saved = localStorage.getItem('myDramaList');
        if (saved) {
            const list = JSON.parse(saved);
            const exists = list.some(d => (d.id === drama.id) || (d.bookId === drama.bookId));
            setIsSaved(exists);
        }
    }, [drama]);

    const toggleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const saved = localStorage.getItem('myDramaList');
        let list = saved ? JSON.parse(saved) : [];

        if (isSaved) {
            // Remove from list
            list = list.filter(d => d.id !== drama.id && d.bookId !== drama.bookId);
        } else {
            // Add to list
            list.push(drama);
        }

        localStorage.setItem('myDramaList', JSON.stringify(list));
        setIsSaved(!isSaved);
    };

    if (!drama) return null;

    const dramaUrl = getDramaUrl(drama);

    return (
        <Link to={dramaUrl} state={{ drama }} className="drama-card">
            <div className="card-image-wrapper">
                <img src={drama.cover} alt={drama.name} loading="lazy" />
                <div className="card-overlay">
                    <div className="play-button">
                        <Play size={24} fill="currentColor" />
                    </div>
                </div>
                <button
                    className={`love-button ${isSaved ? 'saved' : ''}`}
                    onClick={toggleSave}
                    title={isSaved ? 'Remove from My List' : 'Add to My List'}
                >
                    <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
                <div className="episode-badge">
                    {drama.chapterCount} Eps
                </div>
                {drama.cornerName && (
                    <div
                        className="card-badge"
                        style={{ backgroundColor: drama.cornerColor || 'var(--accent-red)' }}
                    >
                        {drama.cornerName}
                    </div>
                )}
            </div>
            <div className="card-content">
                <h3 className="card-title">{drama.name}</h3>
                <div className="card-meta">
                    <span>{drama.chapterCount} Eps</span>
                    <span className="dot">•</span>
                    <span>{drama.playCount ? (
                        typeof drama.playCount === 'string' && (drama.playCount.includes('M') || drama.playCount.includes('K'))
                            ? drama.playCount
                            : (parseInt(drama.playCount) / 10000).toFixed(1) + 'M'
                    ) : 'N/A'} Views</span>
                </div>
            </div>
        </Link>
    );
};

export default DramaCard;
