import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundMusic from '../assets/audio/background.mp3';
import './MusicPlayer.css';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio(backgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                // Promise handling for play() to avoid browser policy errors
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Playback failed:", error);
                        // Reset state if auto-play was blocked
                        setIsPlaying(false);
                    });
                }
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="music-player-container">
            <motion.button
                className={`music-toggle-btn ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                <AnimatePresence mode='wait'>
                    {isPlaying ? (
                        <motion.div
                            key="pause"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Pause size={20} strokeWidth={1.5} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="play"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Music size={20} strokeWidth={1.5} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default MusicPlayer;
