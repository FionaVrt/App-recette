import React, { useRef, useState } from 'react';
import { Upload, Trash2, Loader, Image } from 'lucide-react';
import { uploadRecipePhoto, deleteRecipePhoto } from '../photoService';

export default function RecipePhotoUploader({ recipe, onPhotoUpload, darkMode }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const photoURL = await uploadRecipePhoto(recipe.id, file);
      const photos = recipe.photos || [];
      onPhotoUpload({
        ...recipe,
        photos: [...photos, photoURL]
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (photoURL) => {
    if (!window.confirm('Supprimer cette photo?')) return;

    setUploading(true);
    setError('');

    try {
      await deleteRecipePhoto(recipe.id, photoURL);
      const updatedPhotos = (recipe.photos || []).filter(p => p !== photoURL);
      onPhotoUpload({
        ...recipe,
        photos: updatedPhotos
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setUploading(false);
    }
  };

  const photos = recipe.photos || [];
  const maxPhotos = 5;

  return (
    <div className={`${bgClass} rounded-2xl p-4 mb-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Image size={20} className="text-orange-500" />
        <h3 className={`font-semibold ${textClass}`}>Photos</h3>
        <span className={`text-sm ${textSecondaryClass}`}>
          ({photos.length}/{maxPhotos})
        </span>
      </div>

      {/* Afficher les photos existantes */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {photos.map((photoURL, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden h-32 sm:h-40"
            >
              <img
                src={photoURL}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDeletePhoto(photoURL)}
                disabled={uploading}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bouton d'upload */}
      {photos.length < maxPhotos && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed ${borderClass} ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${textSecondaryClass}`}
        >
          {uploading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Chargement...
            </>
          ) : (
            <>
              <Upload size={20} />
              Ajouter une photo
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {photos.length >= maxPhotos && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          Nombre maximal de photos atteint ({maxPhotos})
        </div>
      )}
    </div>
  );
}
