import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, List, Home } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import ViewsCounter from '../components/ViewsCounter';
import { getStreamUrl, getDramaDetail, searchDramaById } from '../services/api';
import { trackEpisodeView } from '../services/analytics';
import { getWatchUrl, getDramaUrl } from '../utils/slugify';
import './Watch.css';

const Watch = () => {
    const { id, episode } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const initialDrama = location.state?.drama; // Get drama data from navigation state

    const [streamData, setStreamData] = useState(null);
    const [dramaData, setDramaData] = useState(null);
    const [loading, setLoading] = useState(true);
    // Lift state for processed chapters
    const [processedChapters, setProcessedChapters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setStreamData(null);
            try {
                // FALLBACK: If no initialDrama, try to get metadata from search
                let dramaMetadata = initialDrama;

                console.log('=== EPISODE COUNT DEBUG ===');
                console.log('1. Initial Drama from state:', initialDrama);
                console.log('2. Has chapterCount?', initialDrama?.chapterCount);

                if (!dramaMetadata || !dramaMetadata.chapterCount) {
                    console.log('3. No chapterCount, trying VIP API fallback...');
                    try {
                        const searchResult = await searchDramaById(id);
                        console.log('4. VIP API result:', searchResult);
                        if (searchResult && searchResult.data) {
                            dramaMetadata = searchResult.data;
                            console.log('5. Found drama from VIP API:', {
                                bookName: dramaMetadata.bookName,
                                chapterCount: dramaMetadata.chapterCount
                            });
                        } else {
                            console.log('5. VIP API returned no data');
                        }
                    } catch (e) {
                        console.log('5. Search fallback failed:', e);
                    }
                } else {
                    console.log('3. Using initialDrama chapterCount:', dramaMetadata.chapterCount);
                }

                console.log('6. Final dramaMetadata:', dramaMetadata);
                console.log('===========================');

                // Fetch Drama Detail (for sidebar list)
                const result = await getDramaDetail(id);
                // Normalize: API service returns unwrapped data
                const detailSource = result && result.data ? result.data : result;

                let currentChapters = [];
                let totalCount = dramaMetadata?.chapterCount || 0; // Use fetched metadata
                let dramaInfo = dramaMetadata || {};

                if (detailSource) {
                    setDramaData(detailSource);

                    // Merge with initialDrama data
                    const fetchedDrama = detailSource.drama || detailSource.book || {};
                    dramaInfo = {
                        ...dramaInfo,
                        ...fetchedDrama,
                        chapterCount: fetchedDrama.chapterCount || dramaInfo.chapterCount || 0
                    };
                    totalCount = dramaInfo.chapterCount || totalCount;

                    if (detailSource.chapters && detailSource.chapters.length > 0) {
                        currentChapters = detailSource.chapters;
                        // Fallback: use chapters length if chapterCount is missing
                        if (totalCount === 0) {
                            totalCount = currentChapters.length;
                        }
                    }
                }

                // Try to fetch episodes if we don't have enough
                if (totalCount > currentChapters.length || currentChapters.length === 0) {
                    try {
                        const epsResult = await import('../services/api').then(m => m.getEpisodes(id));
                        // Normalize episodes response
                        const episodes = epsResult && epsResult.data ? epsResult.data : epsResult;

                        if (Array.isArray(episodes) && episodes.length > 0) {
                            if (episodes.length > currentChapters.length) {
                                currentChapters = episodes;
                            }
                            // Update totalCount if we got more episodes
                            if (totalCount === 0 || episodes.length > totalCount) {
                                totalCount = Math.max(totalCount, episodes.length);
                            }
                        }
                    } catch (e) {
                        console.log('Could not fetch episodes:', e);
                    }
                }

                // Final fallback: use chapters length if totalCount is still 0
                if (totalCount === 0 && currentChapters.length > 0) {
                    totalCount = currentChapters.length;
                }

                // If chapters are still missing or incomplete, generate placeholders
                if (totalCount > 0 && totalCount > currentChapters.length) {
                    const filledChapters = [...currentChapters];
                    for (let i = currentChapters.length + 1; i <= totalCount; i++) {
                        filledChapters.push({
                            id: `gen-${i}`,
                            index: i,
                            chapterIndex: i,
                            chapterName: `EP ${i}`,
                            isPlaceholder: true
                        });
                    }
                    currentChapters = filledChapters;
                }

                console.log('Watch sidebar debug:', {
                    totalCount,
                    currentChaptersLength: currentChapters.length,
                    dramaInfo,
                    dramaMetadata,
                    hasInitialDrama: !!initialDrama,
                    usedSearchFallback: !initialDrama && !!dramaMetadata
                });

                setProcessedChapters(currentChapters);

                // Fetch Stream URL
                const stream = await getStreamUrl(id, episode);
                const streamSource = stream && stream.data ? stream.data : stream;

                if (streamSource && streamSource.chapter) {
                    setStreamData(streamSource.chapter);
                } else if (stream && stream.chapter) {
                    setStreamData(stream.chapter);
                }
            } catch (error) {
                console.error("Error fetching watch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Track episode view when page loads
        trackEpisodeView(id, parseInt(episode));
    }, [id, episode]);

    const handleNext = () => {
        const drama = dramaData?.drama || dramaData?.book || initialDrama;
        const nextEpisode = parseInt(episode) + 1;
        const nextUrl = getWatchUrl(drama, nextEpisode);

        navigate(nextUrl, {
            state: { drama }
        });
    };

    const handlePrev = () => {
        if (episode > 1) {
            const drama = dramaData?.drama || dramaData?.book || initialDrama;
            const prevEpisode = parseInt(episode) - 1;
            const prevUrl = getWatchUrl(drama, prevEpisode);

            navigate(prevUrl, {
                state: { drama }
            });
        }
    };

    if (loading) return <div className="watch-loading"><div className="skeleton video-skeleton"></div></div>;

    // Determine video source (prefer m3u8)
    const videoSrc = streamData?.video?.m3u8 || streamData?.video?.mp4;

    const dramaName = dramaData?.drama?.bookName || "Drama";
    const chapters = processedChapters;

    return (
        <div className="watch-page">
            <div className="container watch-container">

                {/* Main Player Area */}
                <div className="player-column">
                    <div className="player-navigation-top">
                        <button
                            onClick={() => {
                                // Use available drama data for constructing URL
                                const dramaInfo = dramaData?.drama || dramaData?.book || initialDrama || { bookId: id };
                                navigate(getDramaUrl(dramaInfo));
                            }}
                            className="back-link"
                        >
                            <ArrowLeft size={16} /> Back to Detail
                        </button>
                    </div>

                    {videoSrc ? (
                        <VideoPlayer src={videoSrc} poster={streamData?.cover} />
                    ) : (
                        <div className="video-error">
                            <p>Video source not found or content is locked/VIP.</p>
                            <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
                        </div>
                    )}

                    <div className="player-controls">
                        <div className="player-header">
                            <div>
                                <h1 className="episode-title">
                                    {dramaName}
                                </h1>
                                <span className="ep-subtitle">Episode {episode}</span>
                            </div>

                            <div className="player-header-right">
                                {/* Views Counter */}
                                <ViewsCounter dramaId={id} episodeNumber={parseInt(episode)} />

                                <div className="nav-buttons">
                                    <button
                                        onClick={handlePrev}
                                        disabled={parseInt(episode) <= 1}
                                        className="nav-btn"
                                    >
                                        <ArrowLeft size={18} /> Prev
                                    </button>
                                    <button onClick={handleNext} className="nav-btn">
                                        Next <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Episode List) */}
                <div className="sidebar-column">
                    <div className="sidebar-header">
                        <h3><List size={18} /> Episodes</h3>
                    </div>
                    <div className="sidebar-list">
                        {chapters.map((ch, idx) => {
                            // Normalize episode number - same logic as Detail.jsx
                            let epNum = ch.index;
                            if (epNum === undefined || epNum === null) {
                                epNum = ch.chapterIndex;
                            }
                            // If still undefined, use 1-based array index
                            if (epNum === undefined || epNum === null) {
                                epNum = idx + 1;
                            }
                            // Handle 0-based indexing
                            if (epNum === 0) epNum = idx + 1;

                            const displayNum = ch.chapterName && ch.chapterName.includes('EP')
                                ? ch.chapterName.replace(/\D/g, '')
                                : epNum;

                            const drama = dramaData?.drama || dramaData?.book || initialDrama;
                            const episodeUrl = getWatchUrl(drama, epNum);

                            return (
                                <button
                                    key={ch.id || idx}
                                    className={`sidebar-ep-btn ${parseInt(episode) === epNum ? 'active' : ''}`}
                                    onClick={() => navigate(episodeUrl, {
                                        state: { drama }
                                    })}
                                >
                                    {displayNum}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;
