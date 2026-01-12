import React from 'react';
import { motion } from 'framer-motion';
import './Quote.css';

export const Quote = () => {
    return (
        <section className="quote-section">
            <div className="quote-container">
                <motion.blockquote
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    “In a world full of temporary things, we chose permanence.”
                </motion.blockquote>
            </div>
        </section>
    );
};

export const Footer = () => {
    return (
        <footer className="site-footer">
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                Made with love by Parthiv, for Aswathy.
            </motion.p>
        </footer>
    );
};
