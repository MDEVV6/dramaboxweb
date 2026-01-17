import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DramaCard from '../components/DramaCard';
import { getHome } from '../services/api';
import { Loader, Search, TrendingUp, Clock, Mic } from 'lucide-react';
import './Explore.css';

const Explore = () => {
    const location = useLocation();
    const [dramas, setDramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Determine category based on route
    const getCategory = () => {
        const path = location.pathname;
        if (path.includes('/latest')) return 'latest';
        if (path.includes('/popular')) return 'popular';
        if (path.includes('/trending')) return 'trending';
        if (path.includes('/sulih-suara')) return 'sulih-suara';
        return 'explore';
    };

    const category = getCategory();

    // Get page configuration based on category
    const getPageConfig = () => {
        switch (category) {
            case 'latest':
                return {
                    title: '🕐 Latest Dramas',
                    icon: Clock,
                    description: 'Newest releases and fresh content'
                };
            case 'popular':
                return {
                    title: '🔥 Popular Dramas',
                    icon: TrendingUp,
                    description: 'Most-watched and highly rated dramas'
                };
            case 'trending':
                return {
                    title: '📈 Trending Now',
                    icon: TrendingUp,
                    description: 'Hot and trending dramas right now'
                };
            case 'sulih-suara':
                return {
                    title: '🎤 Sulih Suara',
                    icon: Mic,
                    description: 'Dubbed dramas in Indonesian'
                };
            default:
                return {
                    title: '🔍 Explore All Dramas',
                    icon: Search,
                    description: 'Browse our complete collection'
                };
        }
    };

    const pageConfig = getPageConfig();


    useEffect(() => {
        fetchDramas();
    }, [category]); // Re-fetch when category changes

    const fetchDramas = async () => {
        setLoading(true);
        try {
            const response = await getHome(1, 48); // Fetch more to have enough for filtering
            if (response && response.data) {
                let processedData = response.data;

                // Sort/filter based on category
                switch (category) {
                    case 'latest':
                        // Sort by newest (assuming higher bookId = newer)
                        processedData = [...processedData].sort((a, b) =>
                            (b.bookId || 0) - (a.bookId || 0)
                        );
                        break;
                    case 'popular':
                    case 'trending':
                        // Sort by popularity (heat/views)
                        processedData = [...processedData].sort((a, b) =>
                            (b.heat || b.views || 0) - (a.heat || a.views || 0)
                        );
                        break;
                    case 'sulih-suara':
                        // Filter dramas with Indonesian dubbing
                        // For now, show all dramas since we don't have dubbing info in API
                        // In the future, this can be updated when API provides dubbing data
                        const dubbedDramas = processedData.filter(drama =>
                            drama.isDubbed ||
                            drama.language?.includes('id') ||
                            drama.tags?.includes('sulih-suara') ||
                            drama.dubbing === 'indonesian'
                        );

                        // If no dubbed dramas found, show all dramas
                        processedData = dubbedDramas.length > 0 ? dubbedDramas : processedData;
                        break;
                    default:
                        // Keep original order for explore
                        break;
                }

                setDramas(processedData);
            }
        } catch (error) {
            console.error('Failed to fetch dramas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const response = await getHome(nextPage, 24);
            if (response && response.data) {
                if (response.data.length === 0) {
                    setHasMore(false);
                } else {
                    setDramas(prev => [...prev, ...response.data]);
                    setPage(nextPage);
                }
            }
        } catch (error) {
            console.error('Failed to load more:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const filteredDramas = dramas.filter(drama =>
        drama.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drama.bookName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="explore-page">
                <div className="container">
                    <div className="loading-state">
                        <Loader className="spin" size={40} />
                        <p>Loading dramas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="explore-page">
            <div className="container">
                <div className="explore-header">
                    <div className="page-title-wrapper">
                        <h1 className="page-title">{pageConfig.title}</h1>
                        <p className="page-description">{pageConfig.description}</p>
                    </div>
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search dramas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="drama-grid animate-fade-in">
                    {filteredDramas.map((drama, idx) => (
                        <DramaCard key={`${drama.id}-${idx}`} drama={drama} />
                    ))}
                </div>

                {filteredDramas.length === 0 && (
                    <div className="no-results">
                        <p>No dramas found matching "{searchQuery}"</p>
                    </div>
                )}

                {hasMore && !searchQuery && (
                    <div className="load-more-container">
                        <button
                            className="btn btn-glass"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? (
                                <><Loader className="spin" size={20} /> Loading...</>
                            ) : (
                                "Load More Dramas"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
