import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="error-code">404</div>
                <h1 className="error-title">Page Not Found</h1>
                <p className="error-description">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="error-actions">
                    <Link to="/" className="btn btn-primary">
                        <Home size={20} />
                        Back to Home
                    </Link>
                    <button onClick={() => window.history.back()} className="btn btn-glass">
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
