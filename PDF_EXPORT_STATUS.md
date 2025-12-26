# 📄 Export PDF - Fonctionnalités

Les exports PDF sont maintenant disponibles! 🎉

## Fichiers créés

### 1. **pdfService.js** (Service)

- `exportRecipeToPDF(recipe)` - Exporte une seule recette
- `exportAllRecipesToPDF(recipes)` - Exporte toutes les recettes

### 2. **ExportRecipeButton.jsx** (Composant)

Bouton d'export pour une recette individuelle

- Affiche titre, ingrédients, notes, photos
- Met en avant chaque recette
- Filename: `nom-de-la-recette.pdf`

### 3. **ExportAllButton.jsx** (Composant)

Bouton d'export pour le livret complet

- Page de couverture
- Table des matières
- Toutes les recettes
- Filename: `mes-recettes-2025-01-15.pdf`

---

## Intégration dans RecipeSaver.jsx

### Option A: Ajouter bouton export sur chaque recette

```jsx
import ExportRecipeButton from "./ExportRecipeButton";

// Dans le composant RecipeCard:
<ExportRecipeButton recipe={recipe} darkMode={darkMode} />;
```

### Option B: Ajouter bouton export global

```jsx
import ExportAllButton from "./ExportAllButton";

// Dans le Header:
<ExportAllButton recipes={recipes} darkMode={darkMode} />;
```

### Option C: Les deux (Recommandé)

```jsx
// Dans RecipeCard
<ExportRecipeButton recipe={recipe} darkMode={darkMode} />

// Dans Header
<ExportAllButton recipes={recipes} darkMode={darkMode} />
```

---

## Format PDF

### Export une recette:

```
┌─────────────────────────┐
│      Titre Recette      │
│ Catégorie | Temps 30min │
├─────────────────────────┤
│      INGRÉDIENTS        │
│ • Ingrédient 1          │
│ • Ingrédient 2          │
│ ...                     │
├─────────────────────────┤
│   NOTES & PRÉPARATION   │
│ (contenu de la note)    │
├─────────────────────────┤
│       PHOTOS (max 2)    │
│ [image 1]               │
│ [image 2]               │
└─────────────────────────┘
```

### Export tout:

```
Page 1: Couverture "Mes Recettes"
Page 2: Table des matières
Page 3+: Une page par recette
```

---

## Features

✅ Export single recipe to PDF  
✅ Export all recipes to PDF  
✅ Responsive design  
✅ Dark mode support  
✅ Error handling  
✅ Loading states  
✅ Photo support  
✅ Nice formatting

---

## À faire:

1. Importer les composants dans RecipeSaver.jsx
2. Ajouter les boutons aux endroits appropriés
3. Tester les exports
4. Commit & push

---

## Dépendances ajoutées:

- `jspdf` - Générateur PDF
- `html2canvas` - Capture HTML → Canvas → PDF
