import React from 'react';
import { motion } from 'framer-motion';
import './Moments.css';
import img1 from '../assets/images/moment1.jpg';
import img2 from '../assets/images/moment2.jpg';
import img3 from '../assets/images/moment3.jpg';

const momentsData = [
    {
        id: 1,
        img: img1,
        date: "02 December 2025",
        caption: "The first time we realized this was forever."
    },
    {
        id: 2,
        img: img2,
        date: "03 October 2025",
        caption: "Laughter that echoes in our hearts."
    },
    {
        id: 3,
        img: img3,
        date: "Every Day",
        caption: "Finding home in each other's eyes."
    }
];

const MomentItem = ({ item, index }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`moment-item ${isEven ? 'even' : 'odd'}`}>
            <motion.div
                className="moment-image-wrapper"
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <img src={item.img} alt={item.caption} className="moment-image" />
            </motion.div>

            <motion.div
                className="moment-content"
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <span className="moment-date">{item.date}</span>
                <h3 className="moment-caption">{item.caption}</h3>
                <div className="line"></div>
            </motion.div>
        </div>
    );
};

const Moments = () => {
    return (
        <section className="moments-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Cherished Memories</h2>
                    <div className="divider"></div>
                </motion.div>

                <div className="moments-list">
                    {momentsData.map((item, index) => (
                        <MomentItem key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Moments;
