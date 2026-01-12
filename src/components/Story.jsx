import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Star } from 'lucide-react';
import './Story.css';

const StoryCard = ({ title, text, icon: Icon, delay }) => (
    <motion.div
        className="story-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
    >
        <div className="card-icon">
            <Icon size={24} strokeWidth={1} />
        </div>
        <h3>{title}</h3>
        <p>{text}</p>
    </motion.div>
);

const Story = () => {
    return (
        <section id="story" className="story-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Our Journey</h2>
                    <div className="divider"></div>
                </motion.div>

                <div className="story-grid">
                    <StoryCard
                        title="The Beginning"
                        text="How we met. A chance encounter that became a lifetime promise."
                        icon={Calendar}
                        delay={0.2}
                    />
                    <StoryCard
                        title="The Journey"
                        text="How we grew. Through laughter, silence, and every moment in between."
                        icon={Heart}
                        delay={0.4}
                    />
                    <StoryCard
                        title="The Forever"
                        text="Where we are now. Building a future on the foundation of our love."
                        icon={Star}
                        delay={0.6}
                    />
                </div>
            </div>
        </section>
    );
};

export default Story;
