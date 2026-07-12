import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageSliderProps {
    images: string[];
    alt: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, alt }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-200">
            {/* Main Image */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`${alt} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
