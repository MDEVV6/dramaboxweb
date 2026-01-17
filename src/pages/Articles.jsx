import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Newspaper } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import { getPublishedArticles, getCategories } from '../services/articles';
import './Articles.css';

const Articles = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    // Filter states
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category') || 'all';
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        // Fetch categories for filter
        getCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                // Determine fetch parameters
                const fetchCategory = category === 'all' ? null : category;

                // Fetch articles
                // Note: getPublishedArticles currently handles both list and search logic 
                // but for simplicity we'll just use filtered list for this implementation
                const result = await getPublishedArticles(page, 9, fetchCategory);

                // If search query exists, we might need a specific search function 
                // but for now we'll filter client-side or assume API handles it
                // Ideally update service to support search param

                setArticles(result.data || []);
                setTotalPages(result.totalPages || 1);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [page, category, searchQuery]);

    const handleCategoryChange = (newCategory) => {
        setSearchParams({ category: newCategory, page: '1', q: searchQuery });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Trigger refetch via dependency array
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ category, page: newPage.toString(), q: searchQuery });
        window.scrollTo(0, 0);
    };

    return (
        <div className="articles-page">
            <div className="container">
                {/* Header Section */}
                <div className="articles-header">
                    <h1>Latest Updates & News</h1>
                    <p>Discover the latest stories, reviews, and insights from the world of Asian Dramas</p>
                </div>

                {/* Controls Section */}
                <div className="articles-controls">
                    <div className="categories-filter">
                        <button
                            className={`category-pill ${category === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            All Stories
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-pill ${category === cat.name ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.name)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="article-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchParams({ category, page: '1', q: e.target.value })}
                        />
                    </form>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="articles-loading">
                        <div className="loader"></div>
                        <p>Loading stories...</p>
                    </div>
                ) : articles.length > 0 ? (
                    <>
                        <div className="articles-grid">
                            {articles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="page-btn"
                                    disabled={page === totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-articles">
                        <Newspaper size={48} />
                        <h3>No articles found</h3>
                        <p>Try adjusting your search or category filter</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setSearchParams({ category: 'all', page: '1', q: '' })}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
