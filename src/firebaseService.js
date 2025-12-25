import { db, auth } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    query
} from 'firebase/firestore';

// ========== RECETTES ==========

export const loadRecipesFromFirebase = async (onRecipes) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            console.warn('User not authenticated');
            onRecipes([]);
            return () => { };
        }

        const recipesRef = collection(db, `users/${userId}/recipes`);
        const q = query(recipesRef);

        // Écoute les changements en temps réel
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipes = [];
            snapshot.forEach((doc) => {
                recipes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            onRecipes(recipes.sort((a, b) => b.timestamp - a.timestamp));
        });

        return unsubscribe;
    } catch (error) {
        console.error('Erreur chargement recettes:', error);
    }
};

export const addRecipeToFirebase = async (recipe) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const docRef = await addDoc(collection(db, `users/${userId}/recipes`), {
            ...recipe,
            timestamp: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erreur ajout recette:', error);
    }
};

export const updateRecipeInFirebase = async (recipeId, updates) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        await updateDoc(doc(db, `users/${userId}/recipes`, recipeId), {
            ...updates,
            lastModified: new Date()
        });
    } catch (error) {
        console.error('Erreur mise à jour recette:', error);
    }
};

export const deleteRecipeFromFirebase = async (recipeId) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        await deleteDoc(doc(db, `users/${userId}/recipes`, recipeId));
    } catch (error) {
        console.error('Erreur suppression recette:', error);
    }
};

// ========== COCKTAILS ==========

export const loadCocktailsFromFirebase = async (onCocktails) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            console.warn('User not authenticated');
            onCocktails([]);
            return () => { };
        }

        const cocktailsRef = collection(db, `users/${userId}/cocktails`);
        const q = query(cocktailsRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cocktails = [];
            snapshot.forEach((doc) => {
                cocktails.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            onCocktails(cocktails.sort((a, b) => b.timestamp - a.timestamp));
        });

        return unsubscribe;
    } catch (error) {
        console.error('Erreur chargement cocktails:', error);
    }
};

export const addCocktailToFirebase = async (cocktail) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        const docRef = await addDoc(collection(db, `users/${userId}/cocktails`), {
            ...cocktail,
            timestamp: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erreur ajout cocktail:', error);
    }
};

export const updateCocktailInFirebase = async (cocktailId, updates) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        await updateDoc(doc(db, `users/${userId}/cocktails`, cocktailId), {
            ...updates,
            lastModified: new Date()
        });
    } catch (error) {
        console.error('Erreur mise à jour cocktail:', error);
    }
};

export const deleteCocktailFromFirebase = async (cocktailId) => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        await deleteDoc(doc(db, `users/${userId}/cocktails`, cocktailId));
    } catch (error) {
        console.error('Erreur suppression cocktail:', error);
    }
};
