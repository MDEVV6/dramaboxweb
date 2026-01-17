import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import DramaCard from '../components/DramaCard';
import AdSlot from '../components/AdSlot';
import { useAds } from '../contexts/AdsContext';
import { getHome, getRecommendations } from '../services/api';
import { getDramaUrl } from '../utils/slugify';
import { Loader } from 'lucide-react';
import './Home.css';

const Home = () => {
    const { getAdCode } = useAds();
    const [sliderData, setSliderData] = useState([]); // Untuk Hero Slider
    const [trending, setTrending] = useState([]);     // Untuk List Drama
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        try {
            // Load initial data
            const [homeData, recData] = await Promise.all([
                getHome(1, 12),
                getRecommendations()
            ]);

            // Set Slider Data (Priority: Recommendations, then Home Data)
            if (recData && recData.data && recData.data.length > 0) {
                // Normalize recommendation data
                const normalizedRecs = recData.data.slice(0, 5).map(item => ({
                    id: item.bookId || item.id,
                    name: item.bookName || item.name,
                    cover: item.coverWap || item.cover,
                    introduction: item.introduction || item.intro,
                    chapterCount: item.chapterCount,
                    playCount: item.playCount,
                    cornerName: item.corner?.name || item.cornerName,
                    cornerColor: item.corner?.color || item.cornerColor,
                    tags: item.tags || []
                }));
                setSliderData(normalizedRecs);
            } else if (homeData && homeData.data) {
                setSliderData(homeData.data.slice(0, 5));
            }

            // Set Trending List
            if (homeData && homeData.data) {
                setTrending(homeData.data);
            }
        } catch (error) {
            console.error("Failed to fetch home data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLoadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;

        try {
            const newData = await getHome(nextPage, 12);
            if (newData && newData.data && newData.data.length > 0) {
                setTrending(prev => [...prev, ...newData.data]);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more", error);
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) {
        return (
            <div className="home-loading">
                <div className="skeleton hero-skeleton"></div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <HeroCarousel items={sliderData} />

            {/* Home Top Ad */}
            <AdSlot adCode={getAdCode('home_top')} position="top" />

            {/* Trending Now Section */}
            <section className="section container">
                <div className="section-header-row">
                    <h2 className="section-title">🔥 Trending Now</h2>
                </div>
                <div className="drama-grid animate-fade-in">
                    {sliderData.slice(0, 6).map((drama, idx) => (
                        <DramaCard key={`trending-${drama.id}-${idx}`} drama={drama} />
                    ))}
                </div>
            </section>

            {/* Main Content with Sidebar Layout */}
            <section className="section container home-layout">
                <div className="main-content">
                    {/* For You Section */}
                    <div className="section-header-row">
                        <h2 className="section-title">✨ For You</h2>
                    </div>
                    <div className="drama-grid animate-fade-in">
                        {trending.slice(0, 12).map((drama, idx) => (
                            <DramaCard key={`foryou-${drama.id}-${idx}`} drama={drama} />
                        ))}
                    </div>

                    {/* Home Middle Ad */}
                    <AdSlot adCode={getAdCode('home_middle')} position="middle" />

                    {/* Latest Updates Section */}
                    <div className="section-header-row" style={{ marginTop: '3rem' }}>
                        <h2 className="section-title">📺 Latest Updates</h2>
                    </div>
                    <div className="drama-grid animate-fade-in">
                        {trending.slice(12).map((drama, idx) => (
                            <DramaCard key={`latest-${drama.id}-${idx}`} drama={drama} />
                        ))}
                    </div>

                    {hasMore && (
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

                    {/* Home Bottom Ad */}
                    <AdSlot adCode={getAdCode('home_bottom')} position="bottom" />
                </div>

                {/* Sidebar - Top Trending */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h3>Top Trending</h3>
                    </div>
                    <div className="trending-list">
                        {sliderData.slice(0, 10).map((item, idx) => (
                            <div key={idx} className="trending-item">
                                <span className="trending-rank">{idx + 1}</span>
                                <img src={item.cover} alt={item.name} className="trending-cover" />
                                <div className="trending-info">
                                    <h4>{item.name}</h4>
                                    <span className="trending-views">
                                        {(item.playCount && typeof item.playCount === 'string') ? item.playCount :
                                            ((parseInt(item.playCount || 0) / 10000).toFixed(1) + 'M')} Views
                                    </span>
                                </div>
                                <Link to={getDramaUrl(item)} className="trending-link-overlay"></Link>
                            </div>
                        ))}
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default Home;
