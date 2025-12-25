import { storage, auth } from './firebase';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';

// Upload une photo de recette
export const uploadRecipePhoto = async (recipeId, file) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        // Valider le fichier
        if (!file.type.startsWith('image/')) {
            throw new Error('Seules les images sont acceptées');
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB max
            throw new Error('Fichier trop volumineux (max 5MB)');
        }

        // Créer une référence au fichier
        const fileName = `${Date.now()}_${file.name}`;
        const photoRef = ref(storage, `users/${userId}/recipes/${recipeId}/${fileName}`);

        // Uploader le fichier
        const snapshot = await uploadBytes(photoRef, file);

        // Récupérer l'URL de téléchargement
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Erreur upload photo:', error);
        throw error;
    }
};

// Supprimer une photo de recette
export const deleteRecipePhoto = async (recipeId, photoURL) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        // Extraire le chemin du fichier depuis l'URL
        // Format: https://firebasestorage.googleapis.com/...users%2FuserId%2Frecipes%2FrecipeId%2Ffilename
        const decodedURL = decodeURIComponent(photoURL);
        const filePath = decodedURL.split('/').pop();

        const photoRef = ref(storage, `users/${userId}/recipes/${recipeId}/${filePath}`);

        await deleteObject(photoRef);
        return true;
    } catch (error) {
        console.error('Erreur suppression photo:', error);
        throw error;
    }
};

// Upload une photo de cocktail
export const uploadCocktailPhoto = async (cocktailId, file) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        if (!file.type.startsWith('image/')) {
            throw new Error('Seules les images sont acceptées');
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Fichier trop volumineux (max 5MB)');
        }

        const fileName = `${Date.now()}_${file.name}`;
        const photoRef = ref(storage, `users/${userId}/cocktails/${cocktailId}/${fileName}`);

        const snapshot = await uploadBytes(photoRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Erreur upload photo cocktail:', error);
        throw error;
    }
};

// Supprimer une photo de cocktail
export const deleteCocktailPhoto = async (cocktailId, photoURL) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const decodedURL = decodeURIComponent(photoURL);
        const filePath = decodedURL.split('/').pop();

        const photoRef = ref(storage, `users/${userId}/cocktails/${cocktailId}/${filePath}`);

        await deleteObject(photoRef);
        return true;
    } catch (error) {
        console.error('Erreur suppression photo cocktail:', error);
        throw error;
    }
};
