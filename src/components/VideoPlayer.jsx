import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import './VideoPlayer.css';

const VideoPlayer = ({ src, poster }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        // Check if source is HLS (.m3u8)
        if (src.includes('.m3u8')) {
            if (Hls.isSupported()) {
                // Destroy previous HLS instance if exists
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                }

                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });

                hls.loadSource(src);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    // Video is ready to play
                    console.log('HLS manifest loaded');
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        console.error('HLS Error:', data);
                    }
                });

                hlsRef.current = hls;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = src;
            }
        } else {
            // Regular MP4
            video.src = src;
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [src]);

    return (
        <div className="video-player-wrapper">
            <video
                ref={videoRef}
                className="video-player"
                controls
                poster={poster}
                playsInline
            />
        </div>
    );
};

export default VideoPlayer;
