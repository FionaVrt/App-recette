import React, { useState } from 'react';
import { BookOpen, Loader } from 'lucide-react';
import { exportAllRecipesToPDF } from './pdfService';

export default function ExportAllButton({ recipes = [], darkMode = false }) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const handleExportAllPDF = async () => {
    if (!recipes || recipes.length === 0) {
      setError('Aucune recette à exporter');
      return;
    }

    setExporting(true);
    setError('');
    try {
      await exportAllRecipesToPDF(recipes);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'export');
      console.error('Erreur export:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleExportAllPDF}
        disabled={exporting || !recipes || recipes.length === 0}
        title={recipes && recipes.length > 0 ? `Exporter ${recipes.length} recette${recipes.length > 1 ? 's' : ''}` : 'Aucune recette à exporter'}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg
          font-medium transition-all duration-200 whitespace-nowrap
          ${darkMode 
            ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-800' 
            : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-400'
          }
          disabled:cursor-not-allowed disabled:opacity-60
        `}
      >
        {exporting ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Export en cours...
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4" />
            {recipes && recipes.length > 0 ? `Tout exporter (${recipes.length})` : 'Tout exporter'}
          </>
        )}
      </button>
      
      {error && (
        <div className={`
          text-sm px-3 py-2 rounded-lg
          ${darkMode 
            ? 'bg-red-900/30 text-red-300 border border-red-800' 
            : 'bg-red-100 text-red-700 border border-red-300'
          }
        `}>
          {error}
        </div>
      )}
    </div>
  );
}
