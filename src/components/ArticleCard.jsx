import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, User } from 'lucide-react';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Default image if none provided
    const defaultImage = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059&ixlib=rb-4.0.3";

    return (
        <Link to={`/artikel/${article.slug}`} className="article-card-link">
            <div className="article-card">
                <div className="article-thumbnail-wrapper">
                    <span className="category-tag">{article.category}</span>
                    <img
                        src={article.featured_image || defaultImage}
                        alt={article.title}
                        className="article-thumbnail"
                        onError={(e) => e.target.src = defaultImage}
                    />
                    <div className="article-overlay"></div>
                </div>

                <div className="article-content">
                    <div className="article-meta">
                        <div className="meta-item">
                            <Calendar size={14} />
                            <span>{formatDate(article.created_at)}</span>
                        </div>
                        <div className="meta-item">
                            <Eye size={14} />
                            <span>{article.views || 0} views</span>
                        </div>
                    </div>

                    <h3 className="article-title">{article.title}</h3>

                    <p className="article-excerpt">
                        {article.excerpt || "No description available."}
                    </p>

                    <div className="read-more-btn">
                        Read Article <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
