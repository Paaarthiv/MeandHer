import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
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

    // Initialize unlock state from storage (persists on refresh)
    const [isUnlocked, setIsUnlocked] = useState(() => {
        return sessionStorage.getItem('gallery_unlocked') === 'true';
    });

    // Wrapper to update state and storage
    const handleSetUnlocked = (status) => {
        setIsUnlocked(status);
        sessionStorage.setItem('gallery_unlocked', status);
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const fetchMemories = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
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
        setSelectedImage(image);
    };

    const handleUpdateImage = async (id, newData) => {
        // Optimistic update
        setImages(prev => prev.map(img =>
            img.id === id ? { ...img, ...newData } : img
        ));
        setSelectedImage(prev => prev && prev.id === id ? { ...prev, ...newData } : prev);

        // If it's a DB image (numeric ID), update Supabase
        if (typeof id === 'number' && supabase) {
            await supabase
                .from('memories')
                .update({ date: newData.date, caption: newData.caption })
                .eq('id', id);
        }
    };

    const handleDeleteImage = async (id, imageUrl) => {
        if (!confirm("Are you sure you want to delete this memory? This action cannot be undone.")) return;

        // Optimistic update
        setImages(prev => prev.filter(img => img.id !== id));
        setSelectedImage(null);

        // If it's a DB image (numeric ID), delete from Supabase
        if (typeof id === 'number' && supabase) {
            try {
                // 1. Delete record from table
                const { error: tableError } = await supabase
                    .from('memories')
                    .delete()
                    .eq('id', id);

                if (tableError) throw tableError;

                // 2. Delete file from storage (optional but good practice)
                // Extract filename from URL: .../gallery-images/filename.jpg
                const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                if (fileName) {
                    await supabase.storage
                        .from('gallery-images')
                        .remove([fileName]);
                }
            } catch (err) {
                console.error("Error deleting memory:", err);
                alert("Failed to delete from database.");
            }
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
                </div>

                <MemoryModal
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    image={selectedImage}
                    onUpdate={handleUpdateImage}
                    onDelete={handleDeleteImage}
                    canEdit={isUnlocked}
                />
            </div>
        </section>
    );
};

export default Gallery;
