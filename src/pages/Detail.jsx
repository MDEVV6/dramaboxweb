import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Play, Share2, Heart, Clock, List } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import { useAds } from '../contexts/AdsContext';
import { getDramaDetail, getEpisodes, searchDramaById } from '../services/api';
import { getWatchUrl } from '../utils/slugify';
import './Detail.css';

const Detail = () => {
    const { getAdCode } = useAds();
    const { id } = useParams();
    const location = useLocation();
    const initialDrama = location.state?.drama;

    const [drama, setDrama] = useState(initialDrama || {});
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(!initialDrama);
    const [activeTab, setActiveTab] = useState('episodes');
    const [isSaved, setIsSaved] = useState(false);

    // Check if drama is saved
    useEffect(() => {
        const saved = localStorage.getItem('myDramaList');
        if (saved && drama.bookId) {
            const list = JSON.parse(saved);
            const exists = list.some(d => (d.id === drama.bookId) || (d.bookId === drama.bookId));
            setIsSaved(exists);
        }
    }, [drama.bookId]);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                // 1. Try to get Full Detail
                const result = await getDramaDetail(id);
                const detailSource = result && result.data ? result.data : result;

                let currentChapters = [];
                let currentDrama = initialDrama || {}; // Start with initialDrama from state
                let foundValidDetail = false;

                if (detailSource) {
                    // Update Drama Info if available
                    if (detailSource.drama || detailSource.book) {
                        const fetchedDrama = detailSource.drama || detailSource.book;
                        currentDrama = {
                            ...currentDrama,
                            ...fetchedDrama,
                            // Ensure critical fields are updated
                            bookName: fetchedDrama.bookName || fetchedDrama.name || currentDrama.bookName || currentDrama.name,
                            chapterCount: fetchedDrama.chapterCount || currentDrama.chapterCount || 0
                        };
                        setDrama(currentDrama);
                        foundValidDetail = true;
                    }

                    // Update Chapters if available
                    if (detailSource.chapters && detailSource.chapters.length > 0) {
                        currentChapters = detailSource.chapters;
                        setChapters(currentChapters);
                    }
                }

                // FALLBACK: If detail API didn't return valid drama info, try VIP Search
                if (!foundValidDetail || !currentDrama.bookName || currentDrama.bookName === 'Unknown Drama') {
                    console.log('Detail API incomplete, trying VIP search fallback...');
                    try {
                        const vipResult = await searchDramaById(id);
                        if (vipResult && vipResult.data) {
                            const vipData = vipResult.data;
                            currentDrama = {
                                ...currentDrama,
                                ...vipData,
                                bookName: vipData.bookName || vipData.name,
                                chapterCount: vipData.chapterCount || currentDrama.chapterCount
                            };
                            setDrama(currentDrama);
                        }
                    } catch (e) {
                        console.warn('VIP fallback failed', e);
                    }
                }

                // 2. Logic Check: If chapters are missing OR fewer than expected
                const expectedCount = currentDrama.chapterCount || 0;
                const needsFullEpisodes = currentChapters.length === 0 || (expectedCount > 0 && currentChapters.length < expectedCount);

                if (needsFullEpisodes) {
                    const eps = await getEpisodes(id);
                    // Normalize episodes
                    const fullEps = (eps && eps.data) ? eps.data : (Array.isArray(eps) ? eps : []);

                    if (fullEps.length > currentChapters.length) {
                        currentChapters = fullEps;
                        setChapters(fullEps);
                    }
                }

                // 3. FILL GAPS: Generate placeholders if needed
                const finalCount = currentDrama.chapterCount || expectedCount || 0;

                if (finalCount > 0 && currentChapters.length < finalCount) {
                    const filledChapters = [...currentChapters];

                    for (let i = currentChapters.length + 1; i <= finalCount; i++) {
                        filledChapters.push({
                            id: `generated-${i}`,
                            index: i,
                            chapterIndex: i,
                            chapterName: `EP ${i}`,
                            isPlaceholder: true
                        });
                    }
                    setChapters(filledChapters);
                } else {
                    // Ensure we don't accidentally clear chapters if state update race condition
                    if (currentChapters.length > 0) {
                        setChapters(currentChapters);
                    }
                }

            } catch (error) {
                console.error("Error fetching detail:", error);

                // Panic Fallback: Try to get just episodes and use initialDrama
                try {
                    const eps = await getEpisodes(id);
                    const fullEps = (eps && eps.data) ? eps.data : (Array.isArray(eps) ? eps : []);
                    if (fullEps.length > 0) setChapters(fullEps);
                } catch (e) { }
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const toggleSave = () => {
        const saved = localStorage.getItem('myDramaList');
        let list = saved ? JSON.parse(saved) : [];

        if (isSaved) {
            // Remove from list
            list = list.filter(d => d.id !== drama.bookId && d.bookId !== drama.bookId);
        } else {
            // Add to list - normalize drama object
            const dramaToSave = {
                id: drama.bookId,
                bookId: drama.bookId,
                name: drama.bookName,
                bookName: drama.bookName,
                cover: drama.coverWap || drama.cover,
                chapterCount: drama.chapterCount,
                playCount: drama.playCount,
                cornerName: drama.cornerName,
                cornerColor: drama.cornerColor,
                introduction: drama.introduction
            };
            list.push(dramaToSave);
        }

        localStorage.setItem('myDramaList', JSON.stringify(list));
        setIsSaved(!isSaved);
    };

    if (loading) return <div className="loading-screen">Loading...</div>;



    // Normalize props
    const bookName = drama.bookName || drama.name || "Unknown Drama";
    const coverImage = drama.coverWap || drama.cover || "";
    const intro = drama.introduction || drama.intro || "No description available.";
    const tags = drama.tagV3s || drama.tags || [];
    const playCountVal = drama.playCount;

    return (
        <div className="detail-page">
            {/* Backdrop Header */}
            <div className="detail-header">
                <div className="detail-backdrop">
                    <img src={coverImage} alt={drama.bookName} />
                    <div className="backdrop-overlay"></div>
                </div>

                <div className="container detail-content">
                    <div className="poster-wrapper">
                        <img src={coverImage} alt={bookName} className="poster-img" />
                    </div>

                    <div className="drama-info">
                        <h1 className="drama-title">{bookName}</h1>

                        <div className="drama-meta">
                            {tags.map((tag, idx) => {
                                const tName = tag.tagName || tag;
                                return <span key={idx} className="tag-badge">{tName}</span>;
                            })}
                        </div>

                        <p className="drama-intro">{intro}</p>

                        <div className="action-buttons">
                            {chapters.length > 0 ? (
                                <Link to={getWatchUrl(drama, 1)} state={{ drama: drama }} className="btn btn-primary">
                                    <Play size={20} fill="currentColor" />
                                    Start Watching
                                </Link>
                            ) : (
                                <button className="btn btn-primary" disabled>Coming Soon</button>
                            )}
                            <button
                                className={`btn btn-glass icon-only ${isSaved ? 'saved' : ''}`}
                                onClick={toggleSave}
                                title={isSaved ? 'Remove from My List' : 'Add to My List'}
                            >
                                <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Top Ad */}
            <AdSlot adCode={getAdCode('detail_top')} position="top" />

            {/* Tabs & Content */}
            <div className="container content-section">
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('episodes')}
                    >
                        Episodes ({drama.chapterCount || chapters.length})
                    </button>
                </div>

                {activeTab === 'episodes' && (
                    <div className="episodes-grid animate-fade-in">
                        {chapters.map((ch, idx) => {
                            // Normalize Index Logic
                            let epNum = ch.index;
                            if (epNum === undefined || epNum === null) {
                                epNum = ch.chapterIndex;
                            }
                            // If it's 0-based (e.g. 0, 1, 2...) shift to 1-based (1, 2, 3...)
                            // Assumption: if the first ch is 0, we shift all. 
                            // Simplified: If epNum is 0, display 1.
                            if (epNum === 0) epNum = 1;

                            // Or if explicit logical mapping is needed:
                            const displayNum = (ch.chapterName && ch.chapterName.includes('EP'))
                                ? ch.chapterName.replace(/\D/g, '')
                                : (epNum || idx + 1);

                            // Link param should match what Watch.jsx expects (stream API usually takes 1-based)
                            const linkParam = epNum === 0 || epNum === undefined ? idx + 1 : epNum;
                            const episodeUrl = getWatchUrl(drama, linkParam);

                            return (
                                <Link
                                    key={ch.id || idx}
                                    to={episodeUrl}
                                    state={{ drama: drama }}
                                    className="episode-btn"
                                >
                                    {displayNum}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Detail Bottom Ad */}
                <AdSlot adCode={getAdCode('detail_bottom')} position="bottom" />
            </div>
        </div>
    );
};

export default Detail;
