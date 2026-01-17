import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Calendar,
    Eye,
    User,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Link as LinkIcon,
    ArrowLeft
} from 'lucide-react';
import {
    getArticleBySlug,
    incrementArticleViews,
    getRelatedArticles
} from '../services/articles';
import ArticleCard from '../components/ArticleCard';
import './ArticleDetail.css';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticleData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch article content
                const data = await getArticleBySlug(slug);

                if (!data) {
                    setError('Article not found');
                    return;
                }

                setArticle(data);

                // Increment views
                incrementArticleViews(slug).catch(console.error);

                // Fetch related articles
                if (data.category) {
                    const related = await getRelatedArticles(data.category, data.id);
                    setRelatedArticles(related || []);
                }
            } catch (err) {
                console.error('Error fetching article:', err);
                setError('Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticleData();
            window.scrollTo(0, 0);
        }
    }, [slug]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = article?.title;

        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                return;
            default:
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading article...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="error-screen">
                <h2>Article Not Found</h2>
                <p>The article you are looking for does not exist or has been removed.</p>
                <Link to="/artikel" className="btn btn-primary">
                    <ArrowLeft size={20} />
                    Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="article-detail-page">
            {/* Header */}
            <header className="article-header">
                <div className="article-badges">
                    <span className="category-badge">{article.category}</span>
                </div>
                <h1 className="article-title">{article.title}</h1>
                <div className="article-meta">
                    <div className="meta-item">
                        <User size={16} />
                        <span>{article.author_name || 'Admin'}</span>
                    </div>
                    <div className="meta-item">
                        <Calendar size={16} />
                        <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <div className="meta-item">
                        <Eye size={16} />
                        <span>{article.views || 0} views</span>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {article.featured_image && (
                <div className="featured-image-container">
                    <img
                        src={article.featured_image}
                        alt={article.title}
                        className="featured-image"
                    />
                </div>
            )}

            <div className="article-container">
                {/* Main Content */}
                <article className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                        <div className="tags-list">
                            {article.tags.map((tag, index) => (
                                <span key={index} className="tag-pill">#{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share Section */}
                <div className="share-section">
                    <h3>Share this article:</h3>
                    <button className="share-btn" onClick={() => handleShare('facebook')}>
                        <Facebook size={20} />
                    </button>
                    <button className="share-btn" onClick={() => handleShare('twitter')}>
                        <Twitter size={20} />
                    </button>
                    <button className="share-btn" onClick={() => handleShare('linkedin')}>
                        <Linkedin size={20} />
                    </button>
                    <button className="share-btn" onClick={() => handleShare('copy')}>
                        <LinkIcon size={20} />
                    </button>
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="related-articles">
                        <h2>Read Next</h2>
                        <div className="related-grid">
                            {relatedArticles.map(related => (
                                <ArticleCard key={related.id} article={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleDetail;
