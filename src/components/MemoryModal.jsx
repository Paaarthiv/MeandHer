import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import './MemoryModal.css';

const MemoryModal = ({ isOpen, onClose, image, onUpdate }) => {
    const [date, setDate] = useState('');
    const [caption, setCaption] = useState('');

    useEffect(() => {
        if (image) {
            setDate(image.date || '');
            setCaption(image.caption || '');
        }
    }, [image]);

    const handleSave = () => {
        if (image) {
            onUpdate(image.id, { date, caption });
            onClose();
        }
    };

    if (!isOpen || !image) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>

                    <div className="modal-image-container">
                        <img src={image.src} alt={caption || "Memory"} />
                    </div>

                    <div className="modal-details">
                        <div className="input-group">
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Date to be added"
                                className="memory-date-input"
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Add a caption..."
                                className="memory-caption-input"
                            />
                        </div>

                        <div className="save-indicator">
                            <button onClick={handleSave} className="save-btn">
                                <Save size={16} /> Save Memory
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MemoryModal;
