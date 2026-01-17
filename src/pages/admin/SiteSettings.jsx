import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    getSiteSettings,
    updateSiteSettings,
    uploadLogo,
    uploadFavicon,
    uploadOGImage,
    deleteAsset
} from '../../services/siteSettings';
import './SiteSettings.css';

const SiteSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('general');

    // Form state
    const [formData, setFormData] = useState({
        site_name: '',
        site_tagline: '',
        meta_description: '',
        meta_keywords: '',
        contact_email: '',
        footer_text: '',
        twitter_handle: '',
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        youtube_url: '',
        google_analytics_id: '',
        google_tag_manager_id: '',
        enable_registration: false,
        maintenance_mode: false,
        maintenance_message: ''
    });

    // File uploads
    const [logoFile, setLogoFile] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);
    const [ogImageFile, setOgImageFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [ogImagePreview, setOgImagePreview] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await getSiteSettings();
            setSettings(data);
            setFormData({
                site_name: data.site_name || '',
                site_tagline: data.site_tagline || '',
                meta_description: data.meta_description || '',
                meta_keywords: data.meta_keywords || '',
                contact_email: data.contact_email || '',
                footer_text: data.footer_text || '',
                twitter_handle: data.twitter_handle || '',
                facebook_url: data.facebook_url || '',
                twitter_url: data.twitter_url || '',
                instagram_url: data.instagram_url || '',
                youtube_url: data.youtube_url || '',
                google_analytics_id: data.google_analytics_id || '',
                google_tag_manager_id: data.google_tag_manager_id || '',
                enable_registration: data.enable_registration || false,
                maintenance_mode: data.maintenance_mode || false,
                maintenance_message: data.maintenance_message || ''
            });
            setLogoPreview(data.logo_url);
            setFaviconPreview(data.favicon_url);
            setOgImagePreview(data.og_image_url);
        } catch (error) {
            showMessage('error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = type === 'favicon'
            ? ['image/x-icon', 'image/png', 'image/jpeg']
            : ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

        if (!validTypes.includes(file.type)) {
            showMessage('error', `Invalid file type for ${type}`);
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showMessage('error', 'File size must be less than 2MB');
            return;
        }

        // Set file and preview
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'logo') {
                setLogoFile(file);
                setLogoPreview(reader.result);
            } else if (type === 'favicon') {
                setFaviconFile(file);
                setFaviconPreview(reader.result);
            } else if (type === 'og-image') {
                setOgImageFile(file);
                setOgImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (type) => {
        if (type === 'logo') {
            setLogoFile(null);
            setLogoPreview(null);
        } else if (type === 'favicon') {
            setFaviconFile(null);
            setFaviconPreview(null);
        } else if (type === 'og-image') {
            setOgImageFile(null);
            setOgImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let updatedSettings = { ...formData };

            // Upload logo if changed
            if (logoFile) {
                // Delete old logo if exists
                if (settings.logo_url) {
                    await deleteAsset(settings.logo_url);
                }
                const logoUrl = await uploadLogo(logoFile);
                updatedSettings.logo_url = logoUrl;
            }

            // Upload favicon if changed
            if (faviconFile) {
                // Delete old favicon if exists
                if (settings.favicon_url) {
                    await deleteAsset(settings.favicon_url);
                }
                const faviconUrl = await uploadFavicon(faviconFile);
                updatedSettings.favicon_url = faviconUrl;
            }

            // Upload OG image if changed
            if (ogImageFile) {
                // Delete old OG image if exists
                if (settings.og_image_url) {
                    await deleteAsset(settings.og_image_url);
                }
                const ogImageUrl = await uploadOGImage(ogImageFile);
                updatedSettings.og_image_url = ogImageUrl;
            }

            // Update settings
            await updateSiteSettings(updatedSettings);

            showMessage('success', 'Settings saved successfully!');
            await loadSettings();

            // Reset file states
            setLogoFile(null);
            setFaviconFile(null);
            setOgImageFile(null);
        } catch (error) {
            showMessage('error', 'Failed to save settings');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    if (loading) {
        return (
            <div className="site-settings-loading">
                <div className="spinner"></div>
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="site-settings">
            <div className="site-settings-header">
                <h1>Site Settings</h1>
                <p>Manage your website configuration and branding</p>
            </div>

            {message.text && (
                <motion.div
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="site-settings-tabs">
                <button
                    className={activeTab === 'general' ? 'active' : ''}
                    onClick={() => setActiveTab('general')}
                >
                    <i className="fas fa-cog"></i> General
                </button>
                <button
                    className={activeTab === 'branding' ? 'active' : ''}
                    onClick={() => setActiveTab('branding')}
                >
                    <i className="fas fa-palette"></i> Branding
                </button>
                <button
                    className={activeTab === 'seo' ? 'active' : ''}
                    onClick={() => setActiveTab('seo')}
                >
                    <i className="fas fa-search"></i> SEO
                </button>
                <button
                    className={activeTab === 'social' ? 'active' : ''}
                    onClick={() => setActiveTab('social')}
                >
                    <i className="fas fa-share-alt"></i> Social Media
                </button>
                <button
                    className={activeTab === 'advanced' ? 'active' : ''}
                    onClick={() => setActiveTab('advanced')}
                >
                    <i className="fas fa-sliders-h"></i> Advanced
                </button>
            </div>

            <form onSubmit={handleSubmit} className="site-settings-form">

                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="settings-section">
                        <h2>General Settings</h2>

                        <div className="form-group">
                            <label htmlFor="site_name">Site Name *</label>
                            <input
                                type="text"
                                id="site_name"
                                name="site_name"
                                value={formData.site_name}
                                onChange={handleInputChange}
                                placeholder="DramaBox Web"
                                required
                            />
                            <small>The name of your website</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="site_tagline">Site Tagline</label>
                            <input
                                type="text"
                                id="site_tagline"
                                name="site_tagline"
                                value={formData.site_tagline}
                                onChange={handleInputChange}
                                placeholder="Watch Chinese Dramas Online"
                            />
                            <small>A short description of your site</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact_email">Contact Email</label>
                            <input
                                type="email"
                                id="contact_email"
                                name="contact_email"
                                value={formData.contact_email}
                                onChange={handleInputChange}
                                placeholder="contact@dramabox.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="footer_text">Footer Text</label>
                            <textarea
                                id="footer_text"
                                name="footer_text"
                                value={formData.footer_text}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="© 2026 DramaBox Web. All rights reserved."
                            />
                        </div>
                    </div>
                )}

                {/* Branding Tab */}
                {activeTab === 'branding' && (
                    <div className="settings-section">
                        <h2>Branding</h2>

                        <div className="form-group">
                            <label>Logo (Header)</label>
                            <div className="image-upload">
                                {logoPreview ? (
                                    <div className="image-preview">
                                        <img src={logoPreview} alt="Logo preview" />
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => handleRemoveImage('logo')}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <i className="fas fa-image"></i>
                                        <p>No logo uploaded</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={(e) => handleFileChange(e, 'logo')}
                                    id="logo-upload"
                                />
                                <label htmlFor="logo-upload" className="upload-btn">
                                    <i className="fas fa-upload"></i> Choose Logo
                                </label>
                                <small>Recommended: PNG or JPG, max 2MB. Transparent background preferred.</small>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Favicon</label>
                            <div className="image-upload">
                                {faviconPreview ? (
                                    <div className="image-preview favicon-preview">
                                        <img src={faviconPreview} alt="Favicon preview" />
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => handleRemoveImage('favicon')}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <i className="fas fa-image"></i>
                                        <p>No favicon uploaded</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/x-icon,image/png,image/jpeg"
                                    onChange={(e) => handleFileChange(e, 'favicon')}
                                    id="favicon-upload"
                                />
                                <label htmlFor="favicon-upload" className="upload-btn">
                                    <i className="fas fa-upload"></i> Choose Favicon
                                </label>
                                <small>Recommended: ICO or PNG, 32x32 or 64x64 pixels, max 2MB.</small>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <div className="settings-section">
                        <h2>SEO Settings</h2>

                        <div className="form-group">
                            <label htmlFor="meta_description">Meta Description</label>
                            <textarea
                                id="meta_description"
                                name="meta_description"
                                value={formData.meta_description}
                                onChange={handleInputChange}
                                rows="3"
                                maxLength="160"
                                placeholder="Stream the latest Chinese dramas online..."
                            />
                            <small>{formData.meta_description.length}/160 characters</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="meta_keywords">Meta Keywords</label>
                            <input
                                type="text"
                                id="meta_keywords"
                                name="meta_keywords"
                                value={formData.meta_keywords}
                                onChange={handleInputChange}
                                placeholder="chinese drama, drama online, watch drama"
                            />
                            <small>Comma-separated keywords</small>
                        </div>

                        <div className="form-group">
                            <label>Open Graph Image</label>
                            <div className="image-upload">
                                {ogImagePreview ? (
                                    <div className="image-preview og-preview">
                                        <img src={ogImagePreview} alt="OG image preview" />
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => handleRemoveImage('og-image')}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <i className="fas fa-image"></i>
                                        <p>No OG image uploaded</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={(e) => handleFileChange(e, 'og-image')}
                                    id="og-image-upload"
                                />
                                <label htmlFor="og-image-upload" className="upload-btn">
                                    <i className="fas fa-upload"></i> Choose OG Image
                                </label>
                                <small>Recommended: 1200x630 pixels, PNG or JPG, max 2MB. Used for social media sharing.</small>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="google_analytics_id">Google Analytics ID</label>
                            <input
                                type="text"
                                id="google_analytics_id"
                                name="google_analytics_id"
                                value={formData.google_analytics_id}
                                onChange={handleInputChange}
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="google_tag_manager_id">Google Tag Manager ID</label>
                            <input
                                type="text"
                                id="google_tag_manager_id"
                                name="google_tag_manager_id"
                                value={formData.google_tag_manager_id}
                                onChange={handleInputChange}
                                placeholder="GTM-XXXXXXX"
                            />
                        </div>
                    </div>
                )}

                {/* Social Media Tab */}
                {activeTab === 'social' && (
                    <div className="settings-section">
                        <h2>Social Media</h2>

                        <div className="form-group">
                            <label htmlFor="twitter_handle">Twitter Handle</label>
                            <div className="input-with-prefix">
                                <span className="prefix">@</span>
                                <input
                                    type="text"
                                    id="twitter_handle"
                                    name="twitter_handle"
                                    value={formData.twitter_handle}
                                    onChange={handleInputChange}
                                    placeholder="dramaboxweb"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="facebook_url">Facebook URL</label>
                            <input
                                type="url"
                                id="facebook_url"
                                name="facebook_url"
                                value={formData.facebook_url}
                                onChange={handleInputChange}
                                placeholder="https://facebook.com/dramaboxweb"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="twitter_url">Twitter URL</label>
                            <input
                                type="url"
                                id="twitter_url"
                                name="twitter_url"
                                value={formData.twitter_url}
                                onChange={handleInputChange}
                                placeholder="https://twitter.com/dramaboxweb"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="instagram_url">Instagram URL</label>
                            <input
                                type="url"
                                id="instagram_url"
                                name="instagram_url"
                                value={formData.instagram_url}
                                onChange={handleInputChange}
                                placeholder="https://instagram.com/dramaboxweb"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="youtube_url">YouTube URL</label>
                            <input
                                type="url"
                                id="youtube_url"
                                name="youtube_url"
                                value={formData.youtube_url}
                                onChange={handleInputChange}
                                placeholder="https://youtube.com/@dramaboxweb"
                            />
                        </div>
                    </div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                    <div className="settings-section">
                        <h2>Advanced Settings</h2>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="enable_registration"
                                    checked={formData.enable_registration}
                                    onChange={handleInputChange}
                                />
                                <span>Enable User Registration</span>
                            </label>
                            <small>Allow users to create accounts</small>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="maintenance_mode"
                                    checked={formData.maintenance_mode}
                                    onChange={handleInputChange}
                                />
                                <span>Maintenance Mode</span>
                            </label>
                            <small>Put the site in maintenance mode</small>
                        </div>

                        {formData.maintenance_mode && (
                            <div className="form-group">
                                <label htmlFor="maintenance_message">Maintenance Message</label>
                                <textarea
                                    id="maintenance_message"
                                    name="maintenance_message"
                                    value={formData.maintenance_message}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="We are currently under maintenance..."
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={loadSettings}
                        disabled={saving}
                    >
                        <i className="fas fa-undo"></i> Reset
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i> Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SiteSettings;
