import React from 'react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface-dark)',
            color: 'white'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Setup Page</h1>
                <p>This page is under construction</p>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    style={{
                        marginTop: '2rem',
                        padding: '0.75rem 1.5rem',
                        background: 'var(--accent-gold)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'var(--primary-900)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Setup;
