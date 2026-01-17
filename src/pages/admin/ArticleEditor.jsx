import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Rocket,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';
import ImageUploader from '../../components/ImageUploader';
import {
    createArticle,
    updateArticle,
    getArticleById,
    getCategories,
    isSlugAvailable
} from '../../services/articles';
import { slugify } from '../../utils/slugify';
import './ArticleEditor.css';

const ArticleEditor = () => {
    console.log('ArticleEditor component mounted. ID:', useParams().id); // DEBUG LOG
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [status, setStatus] = useState('draft');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [categories, setCategories] = useState([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isSlugManual, setIsSlugManual] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesData = await getCategories();
                setCategories(categoriesData || []);

                // If edit mode, fetch article
                if (isEditMode) {
                    // console.log('Fetching article for edit:', id); // Debug log
                    const article = await getArticleById(id);

                    if (article) {
                        // Set manual slug flag FIRST to prevent auto-slug effect from overwriting
                        setIsSlugManual(true);

                        // Then set other data
                        setTitle(article.title);
                        setSlug(article.slug);
                        setContent(article.content);
                        setExcerpt(article.excerpt || '');
                        setCategory(article.category || 'Uncategorized');
                        setStatus(article.status);
                        setFeaturedImage(article.featured_image);
                    } else {
                        console.error('Article not found or access denied');
                        setMessage({ type: 'error', text: 'Article not found' });
                        setTimeout(() => navigate('/admin/articles'), 2000);
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setMessage({ type: 'error', text: 'Failed to load data: ' + error.message });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode, navigate]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!isSlugManual && title) {
            setSlug(slugify(title));
        }
    }, [title, isSlugManual]);

    const handleSave = async (newStatus) => {
        if (!title || !content) {
            setMessage({ type: 'error', text: 'Title and content are required' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Check slug availability
            // Use current ID as excludeId if in edit mode (to allow keeping same slug)
            const excludeId = isEditMode ? id : null;
            const available = await isSlugAvailable(slug, excludeId);

            if (!available) {
                setMessage({ type: 'error', text: 'URL Slug is already taken' });
                setSaving(false);
                return;
            }

            const articleData = {
                title,
                slug,
                content,
                excerpt,
                category,
                featured_image: featuredImage,
                status: newStatus || status
            };

            if (isEditMode) {
                await updateArticle(id, articleData);
                setMessage({ type: 'success', text: 'Article updated successfully!' });
            } else {
                await createArticle(articleData);
                setMessage({ type: 'success', text: 'Article created successfully!' });

                // Redirect after create
                setTimeout(() => {
                    navigate('/admin/articles');
                }, 1500);
            }
        } catch (error) {
            console.error('Save failed:', error);
            setMessage({ type: 'error', text: 'Failed to save article' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-screen">Loading editor...</div>;
    }

    return (
        <div className="article-editor">
            <div className="editor-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate('/admin/articles')}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>{isEditMode ? 'Edit Article' : 'New Article'}</h1>
                </div>

                <div className="header-actions">
                    <button
                        className="btn btn-glass"
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                    >
                        <Save size={18} />
                        Save Draft
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSave('published')}
                        disabled={saving}
                    >
                        <Rocket size={18} />
                        {saving ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
                    {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="editor-grid">
                <div className="editor-main">
                    <div className="form-group">
                        <input
                            type="text"
                            className="title-input"
                            placeholder="Enter article title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="slug-preview">
                            URL: /artikel/
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => {
                                    setSlug(slugify(e.target.value));
                                    setIsSlugManual(true);
                                }}
                                className="slug-input"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    fontFamily: 'monospace',
                                    width: '300px'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        {/* 
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Write your amazing content here..."
                        /> 
                        */}
                        <textarea
                            className="textarea-input"
                            style={{ minHeight: '400px', fontSize: '1rem', fontFamily: 'sans-serif' }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your amazing content here... (HTML Editor disabled for debugging)"
                        />
                        <p style={{ color: 'var(--accent-gold)', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                            * Text Editor sedang dalam mode debug. Jika halaman ini terbuka, berarti RichTextEditor sebelumnya menyebabkan crash.
                        </p>
                    </div>
                </div>

                <div className="editor-sidebar">
                    <div className="sidebar-card">
                        <h3>Publishing</h3>
                        <div className="meta-field">
                            <label>Status</label>
                            <select
                                className="select-input"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="meta-field">
                            <label>Category</label>
                            <select
                                className="select-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Uncategorized">Uncategorized</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <h3>Featured Image</h3>
                        <ImageUploader
                            currentImage={featuredImage}
                            onImageUploaded={setFeaturedImage}
                            onImageRemoved={() => setFeaturedImage(null)}
                        />
                    </div>

                    <div className="sidebar-card">
                        <h3>Excerpt</h3>
                        <div className="meta-field">
                            <label>Short Description (SEO)</label>
                            <textarea
                                className="textarea-input"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Write a short summary..."
                                maxLength={300}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleEditor;
