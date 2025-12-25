import React from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

export default function PhotoGallery({ photos, recipeName, darkMode, className = '' }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
  
  if (!photos || photos.length === 0) {
    return (
      <div className={`${className} ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      } rounded-lg flex items-center justify-center h-40 sm:h-48`}>
        <div className="flex flex-col items-center gap-2">
          <Image size={32} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Aucune photo
          </p>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentPhotoIndex];
  const hasMultiplePhotos = photos.length > 1;

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`${className} relative group`}>
      {/* Main Photo */}
      <div className="relative h-40 sm:h-48 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={currentPhoto}
          alt={recipeName}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Navigation Arrows */}
        {hasMultiplePhotos && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Photo précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Photo suivante"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Photo Counter */}
        {hasMultiplePhotos && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {currentPhotoIndex + 1}/{photos.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiplePhotos && (
        <div className="flex gap-2 mt-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                currentPhotoIndex === index
                  ? 'border-orange-500 scale-105'
                  : `border-transparent ${darkMode ? 'hover:opacity-75' : 'hover:opacity-75'}`
              }`}
            >
              <img
                src={photo}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
