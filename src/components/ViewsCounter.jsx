import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { getEpisodeViews, subscribeToEpisodeViews } from '../services/analytics';
import './ViewsCounter.css';

const ViewsCounter = ({ dramaId, episodeNumber }) => {
    const [views, setViews] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Fetch initial view count
        const fetchViews = async () => {
            const count = await getEpisodeViews(dramaId, episodeNumber);
            setViews(count);
        };

        fetchViews();

        // Subscribe to real-time updates
        const unsubscribe = subscribeToEpisodeViews(dramaId, episodeNumber, () => {
            setViews(prev => {
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 600);
                return prev + 1;
            });
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [dramaId, episodeNumber]);

    const formatViews = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className={`views-counter ${isAnimating ? 'animating' : ''}`}>
            <div className="views-icon">
                <Eye size={20} />
            </div>
            <div className="views-content">
                <span className="views-label">Views</span>
                <span className="views-count">{formatViews(views)}</span>
            </div>
            {isAnimating && (
                <div className="views-pulse">
                    <TrendingUp size={16} />
                </div>
            )}
        </div>
    );
};

export default ViewsCounter;
