import React, { useEffect, useRef } from 'react';
import './AdSlot.css';

const AdSlot = ({ adCode, position, className = '' }) => {
    const adRef = useRef(null);

    useEffect(() => {
        if (adCode && adRef.current) {
            // Clear previous content
            adRef.current.innerHTML = adCode;

            // Execute any scripts in the ad code
            const scripts = adRef.current.getElementsByTagName('script');
            for (let script of scripts) {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                script.parentNode.replaceChild(newScript, script);
            }
        }
    }, [adCode]);

    if (!adCode) return null;

    return (
        <div className={`ad-slot ad-slot-${position} ${className}`}>
            <div className="ad-label">Advertisement</div>
            <div ref={adRef} className="ad-content"></div>
        </div>
    );
};

export default AdSlot;
