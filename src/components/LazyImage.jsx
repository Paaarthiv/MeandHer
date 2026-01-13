import React, { useState } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, onClick }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`lazy-image-wrapper ${isLoaded ? 'loaded' : 'loading'}`}>
            {!isLoaded && !hasError && (
                <div className="image-skeleton">
                    <div className="shimmer"></div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={isLoaded ? 'visible' : 'hidden'}
                onClick={onClick}
            />
            {hasError && (
                <div className="image-error">
                    <span>Failed to load</span>
                </div>
            )}
        </div>
    );
};

export default LazyImage;
