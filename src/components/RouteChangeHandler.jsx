import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';

const RouteChangeHandler = ({ children }) => {
    const location = useLocation();
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        // Start loading when route changes
        startLoading();

        // Scroll to top
        window.scrollTo(0, 0);

        // Stop loading after a short delay
        const timer = setTimeout(() => {
            stopLoading();
        }, 800);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return <>{children}</>;
};

export default RouteChangeHandler;
