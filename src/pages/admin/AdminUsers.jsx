import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, UserCheck, UserX, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminUsers.css';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_active: true
    });

    useEffect(() => {
        checkAuth();
        fetchUsers();
    }, []);

    const checkAuth = () => {
        const session = localStorage.getItem('adminSession');
        if (!session) {
            navigate('/admin/login');
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load admin users');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.username || !formData.email) {
            toast.error('Username and email are required');
            return;
        }

        if (!editingUser && !formData.password) {
            toast.error('Password is required for new users');
            return;
        }

        try {
            if (editingUser) {
                // Update existing user
                const updateData = {
                    username: formData.username,
                    email: formData.email,
                    is_active: formData.is_active
                };

                // Only update password if provided
                if (formData.password) {
                    updateData.password_hash = formData.password;
                }

                const { error } = await supabase
                    .from('admin_users')
                    .update(updateData)
                    .eq('id', editingUser.id);

                if (error) throw error;
                toast.success('Admin user updated successfully');
            } else {
                // Create new user
                const { error } = await supabase
                    .from('admin_users')
                    .insert([{
                        username: formData.username,
                        email: formData.email,
                        password_hash: formData.password,
                        is_active: formData.is_active
                    }]);

                if (error) throw error;
                toast.success('Admin user created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            if (error.code === '23505') {
                toast.error('Username or email already exists');
            } else {
                toast.error('Failed to save admin user');
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            is_active: user.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (userId, username) => {
        if (!confirm(`Are you sure you want to delete admin user "${username}"?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('admin_users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            toast.success('Admin user deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete admin user');
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            const { error } = await supabase
                .from('admin_users')
                .update({ is_active: !user.is_active })
                .eq('id', user.id);

            if (error) throw error;
            toast.success(`User ${!user.is_active ? 'activated' : 'deactivated'} successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            is_active: true
        });
        setEditingUser(null);
        setShowPassword(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading admin users...</p>
            </div>
        );
    }

    return (
        <div className="admin-users-page">
            <div className="admin-users-container">
                <div className="admin-users-header">
                    <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                    <h1>Admin Users Management</h1>
                    <button
                        className="create-btn"
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        <Plus size={20} />
                        Create Admin User
                    </button>
                </div>

                <div className="users-stats">
                    <div className="stat-card">
                        <Shield className="stat-icon" />
                        <div className="stat-info">
                            <h3>{users.length}</h3>
                            <p>Total Admins</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <UserCheck className="stat-icon active" />
                        <div className="stat-info">
                            <h3>{users.filter(u => u.is_active).length}</h3>
                            <p>Active</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <UserX className="stat-icon inactive" />
                        <div className="stat-info">
                            <h3>{users.filter(u => !u.is_active).length}</h3>
                            <p>Inactive</p>
                        </div>
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="empty-state">
                        <Shield size={64} />
                        <h2>No Admin Users</h2>
                        <p>Create your first admin user to get started</p>
                        <button
                            className="create-btn"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={20} />
                            Create Admin User
                        </button>
                    </div>
                ) : (
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Last Login</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className={!user.is_active ? 'inactive-row' : ''}>
                                        <td>{user.id}</td>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <strong>{user.username}</strong>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            {user.last_login ? formatDate(user.last_login) : 'Never'}
                                        </td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEdit(user)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className={`action-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                                                    onClick={() => toggleUserStatus(user)}
                                                    title={user.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDelete(user.id, user.username)}
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
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingUser ? 'Edit Admin User' : 'Create Admin User'}</h2>
                            <button className="close-btn" onClick={handleCloseModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Password {editingUser ? '(leave blank to keep current)' : '*'}
                                </label>
                                <div className="password-input">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={editingUser ? 'Enter new password' : 'Enter password'}
                                        required={!editingUser}
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

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <span>Active User</span>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
