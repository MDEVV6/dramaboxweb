import React from 'react';
import './RouteLoadingBar.css';

const RouteLoadingBar = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="route-loading-bar">
            <div className="route-loading-progress"></div>
        </div>
    );
};

export default RouteLoadingBar;
