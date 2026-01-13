import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Upload, Key, Check, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './SecretUpload.css';

const SecretUpload = ({ onUploadSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(false);

    const SECRET_CODE = import.meta.env.VITE_SECRET_PASSCODE;

    const handleUnlock = (e) => {
        e.preventDefault();
        if (passcode === SECRET_CODE) {
            setIsUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
            setPasscode('');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

            // 1. Upload to Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('gallery-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery-images')
                .getPublicUrl(fileName);

            // 3. Insert into Database
            const { data: dbData, error: dbError } = await supabase
                .from('memories')
                .insert([{ image_url: publicUrl, date: '', caption: '' }])
                .select();

            if (dbError) throw dbError;

            // 4. Success
            onUploadSuccess(dbData[0]);
            setIsOpen(false); // Close modal
            setIsUploading(false);
        } catch (err) {
            console.error('Upload failed:', err);
            setIsUploading(false);
            alert('Upload failed. unique constraint? storage limit?');
        }
    };

    return (
        <>
            <div className="secret-trigger" onClick={() => setIsOpen(true)}>
                <button className="upload-btn">
                    <Upload size={18} />
                    <span>Add more memories</span>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="secret-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="secret-modal"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!isUnlocked ? (
                                <form onSubmit={handleUnlock} className="secret-form">
                                    <div className="lock-icon-wrapper">
                                        <Lock size={20} className={error ? "shake" : ""} />
                                    </div>
                                    <h3>Private Access</h3>
                                    <input
                                        type="password"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value)}
                                        placeholder="Enter Passcode"
                                        autoFocus
                                        className="passcode-input"
                                    />
                                </form>
                            ) : (
                                <div className="upload-interface">
                                    <div className="success-icon-wrapper">
                                        <Key size={20} />
                                    </div>
                                    <h3>Add Memory</h3>
                                    <p>Upload a new photo to the collection.</p>

                                    <label className={`upload-action-btn ${isUploading ? 'loading' : ''}`}>
                                        {isUploading ? (
                                            <Loader size={18} className="spin" />
                                        ) : (
                                            <Upload size={18} />
                                        )}
                                        <span>{isUploading ? "Uploading..." : "Select Photo"}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={isUploading}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SecretUpload;
