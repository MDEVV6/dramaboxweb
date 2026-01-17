import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../services/supabase';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        const session = localStorage.getItem('adminSession');
        if (session) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Query admin user
            const { data, error: queryError } = await supabase
                .from('admin_users')
                .select('*')
                .eq('username', username)
                .eq('is_active', true)
                .single();

            if (queryError || !data) {
                setError('Invalid username or password');
                setLoading(false);
                return;
            }

            // In production, verify password hash with bcrypt
            // For now, simple check (CHANGE THIS IN PRODUCTION!)
            if (password === 'admin123') {
                // Update last login
                await supabase
                    .from('admin_users')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', data.id);

                // Store session
                localStorage.setItem('adminSession', JSON.stringify({
                    id: data.id,
                    username: data.username,
                    email: data.email
                }));

                navigate('/admin/dashboard');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo-container">
                            <Lock size={40} className="logo-icon" />
                        </div>
                        <h1 className="login-title">Admin Portal</h1>
                        <p className="login-subtitle">DramaBox Web Management</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        {error && (
                            <div className="error-message">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <User size={20} className="input-icon" />
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                'Sign In'
                            )}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
