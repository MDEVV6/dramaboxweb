import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Megaphone,
    LogOut,
    Save,
    Eye,
    EyeOff,
    ToggleLeft,
    ToggleRight,
    Home,
    FileText,
    Play,
    Code,
    BarChart3,
    TrendingUp,
    Users,
    PenSquare,
    Settings
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { getTodayStats, getAnalyticsSummary } from '../../services/analytics';
import HTMLGenerator from './HTMLGenerator';
import './Dashboard.css';

const AD_SLOTS = [
    { key: 'header', label: 'Header Ad (Global)', icon: <LayoutDashboard size={18} /> },
    { key: 'home_top', label: 'Home - Top', icon: <Home size={18} /> },
    { key: 'home_middle', label: 'Home - Middle', icon: <Home size={18} /> },
    { key: 'home_bottom', label: 'Home - Bottom', icon: <Home size={18} /> },
    { key: 'detail_top', label: 'Detail - Top', icon: <FileText size={18} /> },
    { key: 'detail_sidebar', label: 'Detail - Sidebar', icon: <FileText size={18} /> },
    { key: 'detail_bottom', label: 'Detail - Bottom', icon: <FileText size={18} /> },
    { key: 'watch_top', label: 'Watch - Top', icon: <Play size={18} /> },
    { key: 'watch_sidebar', label: 'Watch - Sidebar', icon: <Play size={18} /> },
    { key: 'watch_bottom', label: 'Watch - Bottom', icon: <Play size={18} /> },
    { key: 'video_preroll', label: 'Video - Preroll', icon: <Play size={18} /> },
    { key: 'video_midroll', label: 'Video - Midroll', icon: <Play size={18} /> },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [adsSettings, setAdsSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSlot, setActiveSlot] = useState('header');
    const [showCode, setShowCode] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [activeMenu, setActiveMenu] = useState('ads'); // 'ads', 'generator', or 'analytics'
    const [analyticsData, setAnalyticsData] = useState({
        today: { total_views: 0, unique_visitors: 0, page_views: 0, episode_views: 0 },
        weekly: []
    });

    useEffect(() => {
        checkAuth();
        fetchAdsSettings();
    }, []);

    const checkAuth = () => {
        const session = localStorage.getItem('adminSession');
        if (!session) {
            navigate('/admin/login');
            return;
        }
        setAdmin(JSON.parse(session));
    };

    const fetchAdsSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('ads_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            setAdsSettings(data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const [today, weekly] = await Promise.all([
                getTodayStats(),
                getAnalyticsSummary(7)
            ]);

            setAnalyticsData({
                today: today || { total_views: 0, unique_visitors: 0, page_views: 0, episode_views: 0 },
                weekly: weekly || []
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    // Fetch analytics when menu changes to analytics
    useEffect(() => {
        if (activeMenu === 'analytics') {
            fetchAnalytics();
        }
    }, [activeMenu]);

    const handleLogout = () => {
        localStorage.removeItem('adminSession');
        navigate('/admin/login');
    };

    const handleToggleSlot = (slotKey) => {
        const enabledKey = `${slotKey}_ad_enabled`;
        setAdsSettings(prev => ({
            ...prev,
            [enabledKey]: !prev[enabledKey]
        }));
    };

    const handleCodeChange = (slotKey, value) => {
        const codeKey = `${slotKey}_ad_code`;
        setAdsSettings(prev => ({
            ...prev,
            [codeKey]: value
        }));
    };

    const handleToggleGlobal = () => {
        setAdsSettings(prev => ({
            ...prev,
            ads_enabled_globally: !prev.ads_enabled_globally
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('ads_settings')
                .update(adsSettings)
                .eq('id', 1);

            if (error) throw error;

            setSuccessMessage('Ads settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner-large"></div>
            </div>
        );
    }

    const activeSlotData = AD_SLOTS.find(s => s.key === activeSlot);
    const codeKey = `${activeSlot}_ad_code`;
    const enabledKey = `${activeSlot}_ad_enabled`;

    const activeCount = AD_SLOTS.filter(slot =>
        adsSettings?.[`${slot.key}_ad_enabled`]
    ).length;

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Megaphone size={28} />
                        <span>Admin Panel</span>
                    </div>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        {admin?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <p className="user-name">{admin?.username}</p>
                        <p className="user-email">{admin?.email}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeMenu === 'ads' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('ads')}
                    >
                        <Megaphone size={20} />
                        <span>Ad Slots</span>
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'generator' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('generator')}
                    >
                        <Code size={20} />
                        <span>HTML Generator</span>
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('analytics')}
                    >
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'articles' ? 'active' : ''}`}
                        onClick={() => navigate('/admin/articles')}
                    >
                        <PenSquare size={20} />
                        <span>Articles</span>
                    </button>
                    <button
                        className="nav-item"
                        onClick={() => navigate('/admin/settings')}
                    >
                        <Settings size={20} />
                        <span>Site Settings</span>
                    </button>
                    <button
                        className="nav-item"
                        onClick={() => navigate('/admin/users')}
                    >
                        <Users size={20} />
                        <span>Admin Users</span>
                    </button>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>Admin Panel</h1>
                        <p>Manage your website content, ads, and settings</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {successMessage && (
                    <div className="success-banner">
                        {successMessage}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Megaphone size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Slots</p>
                            <p className="stat-value">{AD_SLOTS.length}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon active">
                            <ToggleRight size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Active Slots</p>
                            <p className="stat-value">{activeCount}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <LayoutDashboard size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Global Status</p>
                            <button
                                className={`toggle-btn ${adsSettings?.ads_enabled_globally ? 'active' : ''}`}
                                onClick={handleToggleGlobal}
                            >
                                {adsSettings?.ads_enabled_globally ? (
                                    <><ToggleRight size={20} /> Enabled</>
                                ) : (
                                    <><ToggleLeft size={20} /> Disabled</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conditional Content */}
                {activeMenu === 'analytics' ? (
                    /* Analytics View */
                    <div className="analytics-view">
                        <h2>Traffic & Analytics</h2>
                        <p className="section-subtitle">Monitor your website traffic and user engagement</p>

                        {/* Today's Stats */}
                        <div className="analytics-stats-grid">
                            <div className="analytics-stat-card">
                                <div className="stat-icon-large">
                                    <Eye size={28} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-label-large">Total Views Today</p>
                                    <p className="stat-value-large">{analyticsData.today.total_views.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="analytics-stat-card">
                                <div className="stat-icon-large visitors">
                                    <Users size={28} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-label-large">Unique Visitors</p>
                                    <p className="stat-value-large">{analyticsData.today.unique_visitors.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="analytics-stat-card">
                                <div className="stat-icon-large pages">
                                    <FileText size={28} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-label-large">Page Views</p>
                                    <p className="stat-value-large">{analyticsData.today.page_views.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="analytics-stat-card">
                                <div className="stat-icon-large episodes">
                                    <Play size={28} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-label-large">Episode Views</p>
                                    <p className="stat-value-large">{analyticsData.today.episode_views.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Summary */}
                        <div className="analytics-table-section">
                            <h3>Last 7 Days Summary</h3>
                            <div className="analytics-table-wrapper">
                                <table className="analytics-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Total Views</th>
                                            <th>Visitors</th>
                                            <th>Page Views</th>
                                            <th>Episode Views</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData.weekly.length > 0 ? (
                                            analyticsData.weekly.map((day, idx) => (
                                                <tr key={idx}>
                                                    <td>{new Date(day.date).toLocaleDateString()}</td>
                                                    <td>{day.total_views.toLocaleString()}</td>
                                                    <td>{day.unique_visitors.toLocaleString()}</td>
                                                    <td>{day.page_views.toLocaleString()}</td>
                                                    <td>{day.episode_views.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                                    No data available. Start tracking by running the analytics schema.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : activeMenu === 'generator' ? (
                    <HTMLGenerator />
                ) : (
                    /* Ad Slots Manager */
                    <div className="ads-manager">
                        <div className="slots-list">
                            <h3>Ad Slots</h3>
                            {AD_SLOTS.map(slot => (
                                <button
                                    key={slot.key}
                                    className={`slot-item ${activeSlot === slot.key ? 'active' : ''}`}
                                    onClick={() => setActiveSlot(slot.key)}
                                >
                                    <div className="slot-item-left">
                                        {slot.icon}
                                        <span>{slot.label}</span>
                                    </div>
                                    <div className={`slot-status ${adsSettings?.[`${slot.key}_ad_enabled`] ? 'active' : ''}`}>
                                        {adsSettings?.[`${slot.key}_ad_enabled`] ? 'ON' : 'OFF'}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="slot-editor">
                            <div className="editor-header">
                                <div>
                                    <h3>{activeSlotData?.label}</h3>
                                    <p>Configure ad code for this slot</p>
                                </div>
                                <button
                                    className={`toggle-btn ${adsSettings?.[enabledKey] ? 'active' : ''}`}
                                    onClick={() => handleToggleSlot(activeSlot)}
                                >
                                    {adsSettings?.[enabledKey] ? (
                                        <><ToggleRight size={20} /> Enabled</>
                                    ) : (
                                        <><ToggleLeft size={20} /> Disabled</>
                                    )}
                                </button>
                            </div>

                            <div className="editor-body">
                                <div className="code-editor-header">
                                    <label>Ad Code (HTML/JavaScript)</label>
                                    <button
                                        className="show-code-btn"
                                        onClick={() => setShowCode(prev => ({
                                            ...prev,
                                            [activeSlot]: !prev[activeSlot]
                                        }))}
                                    >
                                        {showCode[activeSlot] ? (
                                            <><EyeOff size={16} /> Hide Code</>
                                        ) : (
                                            <><Eye size={16} /> Show Code</>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    className="code-editor"
                                    value={adsSettings?.[codeKey] || ''}
                                    onChange={(e) => handleCodeChange(activeSlot, e.target.value)}
                                    placeholder="Paste your ad code here (Google AdSense, custom HTML, etc.)"
                                    rows={12}
                                    style={{
                                        fontFamily: showCode[activeSlot] ? 'monospace' : 'inherit',
                                        filter: showCode[activeSlot] ? 'none' : 'blur(4px)'
                                    }}
                                />
                                <p className="editor-hint">
                                    💡 Tip: Paste your Google AdSense code or custom HTML/JS here
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
