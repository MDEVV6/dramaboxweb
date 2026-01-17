import React, { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isRouteChanging, setIsRouteChanging] = useState(false);

    // Initial page load
    useEffect(() => {
        // Simulate initial loading (minimum 2 seconds for smooth animation)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const startLoading = () => {
        setIsRouteChanging(true);
    };

    const stopLoading = () => {
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
            setIsRouteChanging(false);
        }, 500);
    };

    const value = {
        isLoading,
        isRouteChanging,
        startLoading,
        stopLoading,
    };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};
