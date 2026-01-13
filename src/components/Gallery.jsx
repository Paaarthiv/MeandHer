import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase'; // Import supabase client
import MemoryModal from './MemoryModal';
import SecretUpload from './SecretUpload'; // Import SecretUpload
import './Gallery.css';

// Import initial images
import img1 from '../assets/images/moment1.jpg';
import img2 from '../assets/images/moment2.jpg';
import img3 from '../assets/images/moment3.jpg';
import img4 from '../assets/images/moment4.jpg';
import img5 from '../assets/images/moment5.jpg';

const initialImages = [
    { id: 'local-1', src: img1, date: '', caption: '' },
    { id: 'local-2', src: img2, date: '', caption: '' },
    { id: 'local-3', src: img3, date: '', caption: '' },
    { id: 'local-4', src: img4, date: '', caption: '' },
    { id: 'local-5', src: img5, date: '', caption: '' },
];

const Gallery = () => {
    const [images, setImages] = useState(initialImages);
    const [selectedImage, setSelectedImage] = useState(null);
    const [connectionError, setConnectionError] = useState(false);

    // Initialize unlock state from localStorage (persists across sessions/refreshes)
    const [isUnlocked, setIsUnlocked] = useState(() => {
        try {
            return localStorage.getItem('gallery_unlocked') === 'true';
        } catch (e) {
            return false;
        }
    });

    // Helper to check if image is from DB or Local
    const isDbImage = (id) => {
        return !String(id).startsWith('local-');
    };

    // Wrapper to update state and storage
    const handleSetUnlocked = (status) => {
        setIsUnlocked(status);
        try {
            localStorage.setItem('gallery_unlocked', status);
        } catch (e) {
            console.warn('LocalStorage failed:', e);
        }
    };

    useEffect(() => {
        // Validation check for Supabase connection
        if (!supabase) {
            setConnectionError(true);
            return;
        }
        fetchMemories();
    }, []);

    const fetchMemories = async () => {
        if (!supabase) return;

        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching memories:', error);
            setConnectionError(true);
            return;
        }

        if (data) {
            setConnectionError(false);
            const dbImages = data.map(m => ({
                id: m.id,
                src: m.image_url,
                date: m.date,
                caption: m.caption
            }));
            // Merge local and db images (db first)
            setImages([...dbImages, ...initialImages]);
        }
    };

    const handleUploadSuccess = (newMemory) => {
        const newImage = {
            id: newMemory.id,
            src: newMemory.image_url,
            date: newMemory.date,
            caption: newMemory.caption
        };
        setImages(prev => [newImage, ...prev]);
    };

    const handleImageClick = (image) => {
        console.log("Clicked Image:", image, "Unlocked:", isUnlocked);
        setSelectedImage(image);
    };

    const handleUpdateImage = async (id, newData) => {
        // Optimistic update
        setImages(prev => prev.map(img =>
            img.id === id ? { ...img, ...newData } : img
        ));
        setSelectedImage(prev => prev && prev.id === id ? { ...prev, ...newData } : prev);

        // Update Supabase if it's a DB image
        if (isDbImage(id) && supabase) {
            const { error } = await supabase
                .from('memories')
                .update({ date: newData.date, caption: newData.caption })
                .eq('id', id);

            if (error) {
                console.error("Update failed:", error);
                alert("Failed to save changes. Please try again.");
            } else {
                // Optional: alert("Memory saved!");
            }
        } else if (isDbImage(id) && !supabase) {
            alert("Cannot save: Database not connected. Check console.");
        }
    };

    const handleDeleteImage = async (id, imageUrl) => {
        if (!confirm("Are you sure you want to delete this memory? This action cannot be undone.")) return;

        // Optimistic update
        setImages(prev => prev.filter(img => img.id !== id));
        setSelectedImage(null);

        // Delete from Supabase if it's a DB image
        if (isDbImage(id) && supabase) {
            try {
                // 1. Delete record from table
                const { error: tableError } = await supabase
                    .from('memories')
                    .delete()
                    .eq('id', id);

                if (tableError) throw tableError;

                // 2. Delete file from storage
                const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                if (fileName) {
                    await supabase.storage
                        .from('gallery-images')
                        .remove([fileName]);
                }
            } catch (err) {
                console.error("Error deleting memory:", err);
                alert("Failed to delete from database. It may reappear on refresh.");
            }
        } else if (isDbImage(id) && !supabase) {
            alert("Cannot delete from database: disconnected.");
        }
    };

    return (
        <section className="gallery-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Our Moments</h2>
                    <div className="divider"></div>
                </motion.div>

                <div className="gallery-grid">
                    <AnimatePresence>
                        {images.map((image) => (
                            <motion.div
                                key={image.id}
                                className="gallery-item"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                layout
                                onClick={() => handleImageClick(image)}
                            >
                                <img src={image.src} alt={image.caption || "Gallery Moment"} />
                                <div className="overlay">
                                    {image.date && <span className="overlay-date">{image.date}</span>}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="upload-container">
                    <SecretUpload
                        onUploadSuccess={handleUploadSuccess}
                        isUnlocked={isUnlocked}
                        onUnlock={handleSetUnlocked}
                    />
                    {/* Visual Connection Status Indicator */}
                    {(isUnlocked || connectionError) && (
                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.7rem',
                            color: connectionError ? '#ef4444' : '#22c55e',
                            marginTop: '0.5rem',
                            fontFamily: 'monospace',
                            opacity: 0.8
                        }}>
                            {connectionError ? 'Database Connection Error' : 'Cloud Connected'}
                        </p>
                    )}
                </div>

                <MemoryModal
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    image={selectedImage}
                    onUpdate={handleUpdateImage}
                    onDelete={handleDeleteImage}
                    canEdit={!!isUnlocked}
                />
            </div>
        </section>
    );
};

export default Gallery;
