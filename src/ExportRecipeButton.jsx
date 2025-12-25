import React, { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import { exportRecipeToPDF } from './pdfService';

export default function ExportRecipeButton({ recipe, darkMode = false }) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const handleExportPDF = async () => {
    setExporting(true);
    setError('');
    try {
      await exportRecipeToPDF(recipe);
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
        onClick={handleExportPDF}
        disabled={exporting}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg
          font-medium transition-all duration-200
          ${darkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800' 
            : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-400'
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
            <FileText className="w-4 h-4" />
            Exporter en PDF
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
