import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import MemoryModal from './MemoryModal';
import './Gallery.css';

// Import initial images
import img1 from '../assets/images/moment1.jpg';
import img2 from '../assets/images/moment2.jpg';
import img3 from '../assets/images/moment3.jpg';
import img4 from '../assets/images/moment4.jpg';
import img5 from '../assets/images/moment5.jpg';

const initialImages = [
    { id: 1, src: img1, date: '', caption: '' },
    { id: 2, src: img2, date: '', caption: '' },
    { id: 3, src: img3, date: '', caption: '' },
    { id: 4, src: img4, date: '', caption: '' },
    { id: 5, src: img5, date: '', caption: '' },
];

const Gallery = () => {
    const [images, setImages] = useState(initialImages);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map((file, index) => ({
                id: Date.now() + index,
                src: URL.createObjectURL(file),
                date: '',
                caption: ''
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleUpdateImage = (id, newData) => {
        setImages(prev => prev.map(img =>
            img.id === id ? { ...img, ...newData } : img
        ));
        setSelectedImage(prev => prev && prev.id === id ? { ...prev, ...newData } : prev);
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
                    <label className="upload-btn">
                        <Upload size={18} />
                        <span>Add more memories</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <MemoryModal
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    image={selectedImage}
                    onUpdate={handleUpdateImage}
                />
            </div>
        </section>
    );
};

export default Gallery;
