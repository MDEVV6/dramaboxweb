import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PenSquare,
    Plus,
    ArrowLeft,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    Circle,
    Search
} from 'lucide-react';
import { getAllArticles, deleteArticle, publishArticle, unpublishArticle } from '../../services/articles';
import './ArticleManager.css';

const ArticleManager = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, published, draft
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchArticles();
    }, [filter, page]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const result = await getAllArticles(page, 20, filter === 'all' ? null : filter);
            setArticles(result.data || []);
            setTotalPages(result.totalPages || 1);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await deleteArticle(id);
            alert('Article deleted successfully!');
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article');
        }
    };

    const handleTogglePublish = async (article) => {
        try {
            if (article.status === 'published') {
                await unpublishArticle(article.id);
                alert('Article unpublished!');
            } else {
                await publishArticle(article.id);
                alert('Article published!');
            }
            fetchArticles();
        } catch (error) {
            console.error('Error toggling publish:', error);
            alert('Failed to update article status');
        }
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="article-manager">
            <div className="manager-header">
                <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div className="header-content">
                    <div className="header-left">
                        <h1><PenSquare size={32} /> Article Management</h1>
                        <p>Create and manage your blog articles</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/admin/articles/new')}
                    >
                        <Plus size={20} />
                        Create New Article
                    </button>
                </div>
            </div>

            <div className="manager-content">
                {/* Filters and Search */}
                <div className="controls-bar">
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Articles
                        </button>
                        <button
                            className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
                            onClick={() => setFilter('published')}
                        >
                            Published
                        </button>
                        <button
                            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
                            onClick={() => setFilter('draft')}
                        >
                            Drafts
                        </button>
                    </div>

                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Articles Table */}
                {loading ? (
                    <div className="loading-state">Loading articles...</div>
                ) : filteredArticles.length === 0 ? (
                    <div className="empty-state">
                        <PenSquare size={64} />
                        <h3>No articles found</h3>
                        <p>Create your first article to get started!</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/admin/articles/new')}
                        >
                            <Plus size={20} />
                            Create Article
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="articles-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Views</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArticles.map(article => (
                                        <tr key={article.id}>
                                            <td className="title-cell">
                                                <div className="article-title">
                                                    {article.title}
                                                </div>
                                                <div className="article-slug">
                                                    /{article.slug}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="category-badge">
                                                    {article.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${article.status}`}>
                                                    {article.status === 'published' ? (
                                                        <><CheckCircle size={14} /> Published</>
                                                    ) : (
                                                        <><Circle size={14} /> Draft</>
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="views-count">
                                                    <Eye size={14} />
                                                    {article.views || 0}
                                                </div>
                                            </td>
                                            <td>
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className={`action-btn ${article.status === 'published' ? 'unpublish' : 'publish'}`}
                                                        onClick={() => handleTogglePublish(article)}
                                                        title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                                                    >
                                                        {article.status === 'published' ? (
                                                            <Circle size={16} />
                                                        ) : (
                                                            <CheckCircle size={16} />
                                                        )}
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleDelete(article.id, article.title)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="page-btn"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticleManager;
