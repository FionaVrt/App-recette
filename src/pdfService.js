import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export une seule recette en PDF
 * @param {Object} recipe - Recette à exporter
 * @param {string} recipe.title - Titre de la recette
 * @param {Array} recipe.ingredients - Liste des ingrédients
 * @param {string} recipe.category - Catégorie
 * @param {string} recipe.note - Notes/préparation
 * @param {number} recipe.prepTime - Temps de préparation
 * @param {Array} recipe.photos - Photos (optionnel)
 */
export const exportRecipeToPDF = async (recipe) => {
    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yPosition = margin;

        // Titre
        pdf.setFontSize(24);
        pdf.setTextColor(51, 51, 51);
        const titleText = recipe.title || 'Recette sans titre';
        pdf.text(titleText, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
        yPosition += 15;

        // Infos rapides
        pdf.setFontSize(11);
        pdf.setTextColor(100, 100, 100);
        const infoText = `Catégorie: ${recipe.category || 'N/A'} | Temps: ${recipe.prepTime || 'N/A'} min`;
        pdf.text(infoText, margin, yPosition);
        yPosition += 8;

        // Ligne de séparation
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // Section Ingrédients
        pdf.setFontSize(14);
        pdf.setTextColor(51, 51, 51);
        pdf.text('Ingrédients', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach((ingredient) => {
                const ingredientText = `• ${ingredient}`;
                const lines = pdf.splitTextToSize(ingredientText, pageWidth - 2 * margin - 5);
                lines.forEach((line) => {
                    if (yPosition > pageHeight - margin) {
                        pdf.addPage();
                        yPosition = margin;
                    }
                    pdf.text(line, margin + 5, yPosition);
                    yPosition += 6;
                });
            });
        } else {
            pdf.text('Aucun ingrédient', margin + 5, yPosition);
            yPosition += 6;
        }

        yPosition += 5;

        // Section Notes/Préparation
        if (recipe.note && recipe.note.trim()) {
            if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = margin;
            }

            pdf.setFontSize(14);
            pdf.setTextColor(51, 51, 51);
            pdf.text('Notes & Préparation', margin, yPosition);
            yPosition += 8;

            pdf.setFontSize(11);
            pdf.setTextColor(80, 80, 80);
            const noteLines = pdf.splitTextToSize(recipe.note, pageWidth - 2 * margin);
            noteLines.forEach((line) => {
                if (yPosition > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }
                pdf.text(line, margin, yPosition);
                yPosition += 6;
            });
        }

        // Ajouter les photos si disponibles
        if (recipe.photos && recipe.photos.length > 0) {
            yPosition += 10;

            for (let i = 0; i < Math.min(recipe.photos.length, 2); i++) {
                // Max 2 photos par page
                if (yPosition > pageHeight - 60) {
                    pdf.addPage();
                    yPosition = margin;
                }

                try {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';

                    img.onload = () => {
                        const photoWidth = pageWidth - 2 * margin;
                        const photoHeight = 80;
                        pdf.addImage(img, 'JPEG', margin, yPosition, photoWidth, photoHeight);
                        yPosition += photoHeight + 8;
                    };

                    img.src = recipe.photos[i];
                } catch (err) {
                    console.error('Erreur lors de l\'ajout de la photo:', err);
                }
            }
        }

        // Pied de page
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        const footerText = `Généré avec Mes Recettes | ${new Date().toLocaleDateString('fr-FR')}`;
        pdf.text(footerText, margin, pageHeight - 10);

        // Télécharger
        const filename = `${recipe.title || 'recette'}.pdf`.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        pdf.save(filename);
    } catch (error) {
        console.error('Erreur lors de la création du PDF:', error);
        throw new Error('Impossible de générer le PDF de la recette');
    }
};

/**
 * Export toutes les recettes en un seul PDF
 * @param {Array} recipes - Liste de toutes les recettes
 */
export const exportAllRecipesToPDF = async (recipes) => {
    try {
        if (!recipes || recipes.length === 0) {
            throw new Error('Aucune recette à exporter');
        }

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;

        // Page de couverture
        pdf.setFontSize(32);
        pdf.setTextColor(51, 51, 51);
        pdf.text('Mes Recettes', pageWidth / 2, 80, { align: 'center' });

        pdf.setFontSize(14);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Nombre de recettes: ${recipes.length}`, pageWidth / 2, 100, { align: 'center' });

        pdf.setFontSize(11);
        pdf.setTextColor(150, 150, 150);
        const today = new Date().toLocaleDateString('fr-FR');
        pdf.text(`Exporté le ${today}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

        // Table des matières
        pdf.addPage();
        let yPosition = margin;

        pdf.setFontSize(16);
        pdf.setTextColor(51, 51, 51);
        pdf.text('Table des matières', margin, yPosition);
        yPosition += 15;

        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        recipes.forEach((recipe, index) => {
            const title = recipe.title || `Recette ${index + 1}`;
            pdf.text(`${index + 1}. ${title}`, margin + 5, yPosition);
            yPosition += 8;

            if (yPosition > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
        });

        // Ajouter chaque recette
        recipes.forEach((recipe, index) => {
            pdf.addPage();
            let recipeYPosition = margin;

            // Numéro et titre
            pdf.setFontSize(18);
            pdf.setTextColor(51, 51, 51);
            const recipeTitle = recipe.title || `Recette ${index + 1}`;
            pdf.text(`${index + 1}. ${recipeTitle}`, margin, recipeYPosition);
            recipeYPosition += 12;

            // Infos
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            const infoText = `Catégorie: ${recipe.category || 'N/A'} | Temps: ${recipe.prepTime || 'N/A'} min`;
            pdf.text(infoText, margin, recipeYPosition);
            recipeYPosition += 8;

            // Ligne
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, recipeYPosition, pageWidth - margin, recipeYPosition);
            recipeYPosition += 8;

            // Ingrédients
            pdf.setFontSize(12);
            pdf.setTextColor(51, 51, 51);
            pdf.text('Ingrédients', margin, recipeYPosition);
            recipeYPosition += 7;

            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                recipe.ingredients.forEach((ingredient) => {
                    const ingredientText = `• ${ingredient}`;
                    const lines = pdf.splitTextToSize(ingredientText, pageWidth - 2 * margin - 5);
                    lines.forEach((line) => {
                        if (recipeYPosition > pageHeight - margin - 20) {
                            pdf.addPage();
                            recipeYPosition = margin;
                        }
                        pdf.text(line, margin + 5, recipeYPosition);
                        recipeYPosition += 5;
                    });
                });
            }

            // Notes (court)
            if (recipe.note && recipe.note.trim()) {
                recipeYPosition += 3;
                if (recipeYPosition > pageHeight - 40) {
                    pdf.addPage();
                    recipeYPosition = margin;
                }

                pdf.setFontSize(12);
                pdf.setTextColor(51, 51, 51);
                pdf.text('Notes', margin, recipeYPosition);
                recipeYPosition += 7;

                pdf.setFontSize(9);
                pdf.setTextColor(80, 80, 80);
                const notePreview = recipe.note.substring(0, 200) + (recipe.note.length > 200 ? '...' : '');
                const noteLines = pdf.splitTextToSize(notePreview, pageWidth - 2 * margin);
                noteLines.forEach((line) => {
                    if (recipeYPosition > pageHeight - margin) {
                        pdf.addPage();
                        recipeYPosition = margin;
                    }
                    pdf.text(line, margin, recipeYPosition);
                    recipeYPosition += 5;
                });
            }
        });

        // Dernière page - pied de page
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        const footerText = `Généré avec Mes Recettes | ${new Date().toLocaleDateString('fr-FR')}`;
        pdf.text(footerText, margin, pageHeight - 10);

        // Télécharger
        const filename = `mes-recettes-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
    } catch (error) {
        console.error('Erreur lors de la création du PDF complet:', error);
        throw new Error('Impossible de générer le PDF complet');
    }
};
