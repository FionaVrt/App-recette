import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChefHat, ExternalLink, Loader, BookOpen, Clock, Share2, Copy, Download, Search, Star, Moon, Sun, Edit2, X, LogOut } from 'lucide-react';
import { 
  loadRecipesFromFirebase, 
  addRecipeToFirebase, 
  updateRecipeInFirebase, 
  deleteRecipeFromFirebase,
  loadCocktailsFromFirebase,
  addCocktailToFirebase,
  updateCocktailInFirebase,
  deleteCocktailFromFirebase
} from './firebaseService';
import { logoutUser, onAuthChange } from './authService';
import AuthPage from './AuthPage';
import ExportRecipeButton from './ExportRecipeButton';
import ExportAllButton from './ExportAllButton';
import RecipeForm from './RecipeForm';
import RecipeDetail from './RecipeDetail';

export default function RecipeSaver() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [activeTab, setActiveTab] = useState('recipes');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [cookingMode, setCookingMode] = useState(false);
  const [portions, setPortions] = useState(4);
  const [editingTime, setEditingTime] = useState(null);
  const [prepTime, setPrepTime] = useState('');
  const [cocktailName, setCocktailName] = useState('');
  const [cocktailIngredients, setCocktailIngredients] = useState('');
  const [cocktailType, setCocktailType] = useState('sans-alcool');
  const [selectedCocktailCategory, setSelectedCocktailCategory] = useState('all');
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  const categories = [
    { id: 'all', name: 'Tout', emoji: '🍽️' },
    { id: 'entree', name: 'Entrée', emoji: '🥗' },
    { id: 'plat', name: 'Plat', emoji: '🍝' },
    { id: 'dessert', name: 'Dessert', emoji: '🍰' },
    { id: 'apero', name: 'Apéro', emoji: '🍾' }
  ];

  const cocktailCategories = [
    { id: 'all', name: 'Tous', emoji: '🍹' },
    { id: 'avec-alcool', name: 'Avec alcool', emoji: '🥃' },
    { id: 'sans-alcool', name: 'Sans alcool', emoji: '🧃' },
    { id: 'mocktail', name: 'Mocktail', emoji: '🍸' }
  ];

  useEffect(() => {
    // Check auth state
    const unsubAuth = onAuthChange((authUser) => {
      setUser(authUser);
      setAuthLoading(false);
      if (authUser) {
        loadRecipes();
        checkClipboard();
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (activeTab === 'add') {
      checkClipboard();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setRecipes([]);
      setCocktails([]);
      setSelectedRecipe(null);
      setSelectedCocktail(null);
      setActiveTab('recipes');
      showNotification('Déconnecté ✋');
    } catch (err) {
      showNotification('Erreur lors de la déconnexion');
    }
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    showNotification(newMode ? '🌙 Mode sombre activé' : '☀️ Mode clair activé');
  };

  const checkClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://')) && !url) {
        setUrl(text);
        showNotification('Lien collé automatiquement ! 📋');
      }
    } catch (err) {
      // Pas de permission clipboard
    }
  };

  const loadRecipes = async () => {
    try {
      // Charger depuis localStorage en premier (plus rapide)
      try {
        const savedRecipes = localStorage.getItem('recipes');
        if (savedRecipes) {
          setRecipes(JSON.parse(savedRecipes));
        }
      } catch (err) {
        console.log('Pas de recettes en localStorage');
      }

      // Puis charger depuis Firebase (synchroniser avec le cloud)
      const unsubscribe = await loadRecipesFromFirebase((recipes) => {
        setRecipes(recipes);
        // Sauvegarder aussi en localStorage comme backup
        try {
          localStorage.setItem('recipes', JSON.stringify(recipes));
        } catch (err) {
          console.log('localStorage plein');
        }
      });
      
      const unsubscribeCocktails = await loadCocktailsFromFirebase((cocktails) => {
        setCocktails(cocktails);
        try {
          localStorage.setItem('cocktails', JSON.stringify(cocktails));
        } catch (err) {
          console.log('localStorage plein');
        }
      });

      // Cleanup on unmount
      return () => {
        unsubscribe && unsubscribe();
        unsubscribeCocktails && unsubscribeCocktails();
      };
    } catch (error) {
      console.log('Erreur chargement recettes:', error);
      // Charger depuis localStorage comme fallback
      try {
        const saved = localStorage.getItem('recipes');
        if (saved) setRecipes(JSON.parse(saved));
      } catch (err) {
        console.log('Impossible de charger les recettes');
      }
    }
  };

  const saveRecipes = async (recipesToSave) => {
    try {
      localStorage.setItem('recipes', JSON.stringify(recipesToSave));
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  const saveCocktails = async (cocktailsToSave) => {
    try {
      localStorage.setItem('cocktails', JSON.stringify(cocktailsToSave));
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  };

  const extractRecipe = async () => {
    if (!url.trim()) return;
    
    showNotification("⚠️ Cette fonctionnalité n'est pas encore active. Crée la recette manuellement ! 👉 ✍️ Créer une recette");
    return;
    
    // API extraction désactivée pour éviter les erreurs CORS
    // Utilise plutôt le formulaire manuel "✍️ Créer une recette"
  };

  const toggleFavorite = async (recipe) => {
    const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
    const updatedRecipes = recipes.map(r => r.id === recipe.id ? updatedRecipe : r);
    setRecipes(updatedRecipes);
    await updateRecipeInFirebase(recipe.id, { favorite: updatedRecipe.favorite });
    showNotification(updatedRecipe.favorite ? '⭐ Ajouté aux favoris' : '☆ Retiré des favoris');
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const updateCategory = async (recipe, category) => {
    const updatedRecipe = { ...recipe, category };
    const updatedRecipes = recipes.map(r => r.id === recipe.id ? updatedRecipe : r);
    setRecipes(updatedRecipes);
    await updateRecipeInFirebase(recipe.id, { category });
    showNotification('Catégorie mise à jour ! 🏷️');
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const saveNote = async (recipe) => {
    const updatedRecipe = { ...recipe, note: noteText };
    const updatedRecipes = recipes.map(r => r.id === recipe.id ? updatedRecipe : r);
    setRecipes(updatedRecipes);
    await updateRecipeInFirebase(recipe.id, { note: noteText });
    setEditingNote(null);
    setNoteText('');
    showNotification('Note sauvegardée ! 📝');
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const saveTime = async (recipe) => {
    const updatedRecipe = { ...recipe, prepTime };
    const updatedRecipes = recipes.map(r => r.id === recipe.id ? updatedRecipe : r);
    setRecipes(updatedRecipes);
    await updateRecipeInFirebase(recipe.id, { prepTime });
    setEditingTime(null);
    setPrepTime('');
    showNotification('Temps ajouté ! ⏱️');
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const addCocktail = async () => {
    if (!cocktailName.trim() || !cocktailIngredients.trim()) {
      showNotification('❌ Remplis tous les champs');
      return;
    }

    const newCocktail = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      name: cocktailName,
      ingredients: cocktailIngredients.split('\n').filter(i => i.trim()),
      type: cocktailType,
      favorite: false,
      note: ''
    };

    const updatedCocktails = [newCocktail, ...cocktails];
    setCocktails(updatedCocktails);
    await addCocktailToFirebase(newCocktail);
    
    setCocktailName('');
    setCocktailIngredients('');
    setCocktailType('sans-alcool');
    showNotification('Cocktail ajouté ! 🍹');
  };

  const deleteCocktail = async (id) => {
    if (!confirm('Supprimer ce cocktail ?')) return;
    const updatedCocktails = cocktails.filter(c => c.id !== id);
    setCocktails(updatedCocktails);
    await deleteCocktailFromFirebase(id);
    if (selectedCocktail?.id === id) {
      setSelectedCocktail(null);
    }
    showNotification('Cocktail supprimé 🗑️');
  };

  const toggleCocktailFavorite = async (cocktail) => {
    const updatedCocktail = { ...cocktail, favorite: !cocktail.favorite };
    const updatedCocktails = cocktails.map(c => c.id === cocktail.id ? updatedCocktail : c);
    setCocktails(updatedCocktails);
    await updateCocktailInFirebase(cocktail.id, { favorite: updatedCocktail.favorite });
    showNotification(updatedCocktail.favorite ? '⭐ Ajouté aux favoris' : '☆ Retiré des favoris');
    if (selectedCocktail?.id === cocktail.id) {
      setSelectedCocktail(updatedCocktail);
    }
  };

  const detectAlcohol = (ingredients) => {
    const alcoholKeywords = [
      'vodka', 'rhum', 'gin', 'whisky', 'whiskey', 'tequila', 'mezcal',
      'cognac', 'brandy', 'champagne', 'prosecco', 'vin', 'vin rouge', 'vin blanc',
      'bière', 'beer', 'liqueur', 'triple sec', 'cointreau', 'baileys',
      'amaretto', 'kahlúa', 'pastis', 'absinthe', 'génépi', 'chartreuse',
      'campari', 'vermouth', 'pernod', 'ouzo', 'raki', 'sake', 'shochu',
      'beer', 'cider', 'cidre', 'mead', 'hydromel', 'sake', 'soju'
    ];
    
    const lowerIngredients = ingredients.toLowerCase();
    const hasAlcohol = alcoholKeywords.some(keyword => lowerIngredients.includes(keyword));
    
    return hasAlcohol ? 'avec-alcool' : 'sans-alcool';
  };

  const handleCocktailIngredientsChange = (e) => {
    const value = e.target.value;
    setCocktailIngredients(value);
    
    // Détection automatique
    const detectedType = detectAlcohol(value);
    setCocktailType(detectedType);
  };

  const handleSaveManualRecipe = async (formData) => {
    const newRecipe = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      favorite: false,
      ...formData
    };

    const updatedRecipes = [newRecipe, ...recipes];
    setRecipes(updatedRecipes);
    
    // Sauvegarder en localStorage immédiatement
    try {
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    } catch (err) {
      console.log('localStorage plein');
    }

    // Puis sauvegarder dans Firebase
    try {
      await addRecipeToFirebase(newRecipe);
    } catch (err) {
      console.log('Erreur Firebase:', err);
    }
    
    setShowManualRecipeForm(false);
    showNotification('Recette ajoutée manuellement ! 🎉');
    setActiveTab('recipes');
  };

  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipeIds(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const exportSelectedRecipes = async () => {
    const selectedRecipesData = recipes.filter(r => selectedRecipeIds.includes(r.id));
    if (selectedRecipesData.length === 0) {
      showNotification('❌ Sélectionne au moins une recette');
      return;
    }

    // Utilise ExportAllButton avec les recettes sélectionnées
    // (on va créer un component ou utiliser directement jsPDF)
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Cover page
    doc.setFontSize(28);
    doc.text('📋 Mes Recettes Sélectionnées', 105, 50, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`${selectedRecipesData.length} recette(s)`, 105, 80, { align: 'center' });
    
    let pageNum = 2;

    for (const recipe of selectedRecipesData) {
      doc.addPage();
      
      doc.setFontSize(20);
      doc.text(recipe.title, 20, 20);
      
      let yPos = 35;
      doc.setFontSize(11);

      // Temps et portions
      if (recipe.prepTime || recipe.portions) {
        doc.setFont(undefined, 'bold');
        doc.text('Informations:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');
        if (recipe.prepTime) doc.text(`⏱️ Temps: ${recipe.prepTime}`, 25, yPos), (yPos += 6);
        if (recipe.portions) doc.text(`👥 Portions: ${recipe.portions}`, 25, yPos), (yPos += 6);
      }

      // Ingrédients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('Ingrédients:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        recipe.ingredients.forEach(ing => {
          const text = typeof ing === 'string' 
            ? ing 
            : `${ing.quantity} ${ing.unit} ${ing.name}`.trim();
          
          const splitText = doc.splitTextToSize(`• ${text}`, 170);
          splitText.forEach(line => {
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(line, 25, yPos);
            yPos += 6;
          });
        });
      }

      // Étapes
      if (recipe.steps && recipe.steps.length > 0) {
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('Étapes:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        recipe.steps.forEach((step, idx) => {
          const text = `${idx + 1}. ${step}`;
          const splitText = doc.splitTextToSize(text, 170);
          splitText.forEach(line => {
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(line, 25, yPos);
            yPos += 6;
          });
        });
      }

      // Notes
      if (recipe.notes) {
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('Notes:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');
        const splitText = doc.splitTextToSize(recipe.notes, 170);
        splitText.forEach(line => {
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 25, yPos);
          yPos += 6;
        });
      }
    }

    doc.save('recettes-selectionnees.pdf');
    showNotification(`📥 ${selectedRecipesData.length} recette(s) exportée(s) !`);
    setSelectedRecipeIds([]);
  };

  const shareRecipe = async (recipe) => {
    const formatIngredients = recipe.ingredients.map(i => {
      if (typeof i === 'string') return `• ${i}`;
      return `• ${i.quantity} ${i.unit} ${i.name}`.replace(/\s+/g, ' ').trim();
    }).join('\n');

    const recipeText = `🍳 ${recipe.title}

📝 Ingrédients:
${formatIngredients}

👩‍🍳 Étapes:
${recipe.steps ? recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'Voir le lien'}

🔗 Source: ${recipe.source || 'Recette personnelle'}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipeText
        });
        showNotification('Recette partagée ! 📤');
      } else {
        await navigator.clipboard.writeText(recipeText);
        showNotification('Recette copiée ! 📋');
      }
    } catch (err) {
      // Annulé
    }
  };

  const copyRecipeData = async (recipe) => {
    const recipeJSON = JSON.stringify(recipe, null, 2);
    try {
      await navigator.clipboard.writeText(recipeJSON);
      showNotification('Données copiées ! 📋');
    } catch (err) {
      showNotification('❌ Erreur');
    }
  };

  const importRecipe = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const recipe = JSON.parse(text);
      
      if (recipe.title && recipe.ingredients) {
        const newRecipe = {
          ...recipe,
          id: Date.now().toString(),
          timestamp: Date.now(),
          favorite: false,
          category: recipe.category || 'plat',
          note: recipe.note || '',
          prepTime: recipe.prepTime || '',
          portions: recipe.portions || 4
        };
        const updatedRecipes = [newRecipe, ...recipes];
        setRecipes(updatedRecipes);
        
        // Sauvegarder en localStorage immédiatement
        try {
          localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
        } catch (err) {
          console.log('localStorage plein');
        }

        // Puis Firebase
        try {
          await addRecipeToFirebase(newRecipe);
        } catch (err) {
          console.log('Erreur Firebase:', err);
        }
        
        showNotification('Recette importée ! 🎉');
        setActiveTab('recipes');
      } else {
        showNotification('❌ Format invalide');
      }
    } catch (err) {
      showNotification('❌ Aucune recette à importer');
    }
  };

  const deleteRecipe = async (id) => {
    if (!confirm('Supprimer cette recette ?')) return;
    try {
      const updatedRecipes = recipes.filter(r => r.id !== id);
      setRecipes(updatedRecipes);
      await deleteRecipeFromFirebase(id);
      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
      }
      showNotification('Recette supprimée 🗑️');
    } catch (error) {
      showNotification('❌ Erreur');
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteRecipes = filteredRecipes.filter(r => r.favorite);

  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100';
  
  const cardClass = darkMode 
    ? 'bg-gray-800/90 backdrop-blur' 
    : 'bg-white/90 backdrop-blur';
  
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  if (selectedCocktail) {
    return (
      <div className={`min-h-screen ${bgClass}`}>
        {showToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50">
            {toastMessage}
          </div>
        )}
        
        <div className="max-w-3xl mx-auto p-4 pb-24">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedCocktail(null)}
              className={`flex-1 ${cardClass} px-4 py-2 rounded-full text-orange-600 hover:bg-opacity-100 font-medium shadow-md transition-all`}
            >
              ← Retour
            </button>
            <button
              onClick={() => toggleCocktailFavorite(selectedCocktail)}
              className={`${cardClass} px-4 py-2 rounded-full font-medium shadow-md transition-all`}
            >
              {selectedCocktail.favorite ? <Star className="text-yellow-500 fill-yellow-500" size={20} /> : <Star className="text-gray-400" size={20} />}
            </button>
          </div>
          
          <div className={`${cardClass} rounded-3xl shadow-2xl overflow-hidden`}>
            <div className="bg-gradient-to-r from-orange-400 to-rose-400 p-6">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-3">{selectedCocktail.name}</h1>
              <div className="flex gap-2">
                {cocktailCategories.filter(c => c.id !== 'all').map(cat => (
                  <div
                    key={cat.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCocktail.type === cat.id
                        ? 'bg-white text-orange-600'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <ChefHat className="text-orange-600" size={24} />
                  </div>
                  <h2 className={`text-2xl font-bold ${textClass}`}>Ingrédients</h2>
                </div>
                <div className={darkMode ? 'bg-gray-700 rounded-2xl p-5' : 'bg-orange-50 rounded-2xl p-5'}>
                  <ul className="space-y-3">
                    {selectedCocktail.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-orange-500 text-xl leading-none">•</span>
                        <span className={`${textClass} text-lg`}>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => deleteCocktail(selectedCocktail.id)}
                className="w-full bg-red-100 text-red-600 hover:bg-red-200 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                Supprimer ce cocktail
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRecipe) {
    if (cookingMode) {
      return (
        <div className={`min-h-screen ${bgClass} flex flex-col justify-between`}>
          <div className="max-w-2xl mx-auto w-full p-4 pt-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCookingMode(false)}
                className={`flex-1 ${cardClass} px-4 py-3 rounded-full text-orange-600 font-bold shadow-md text-lg`}
              >
                ← Retour
              </button>
            </div>

            <div className={`${cardClass} rounded-3xl shadow-2xl p-6 mb-6`}>
              <h1 className="text-4xl font-bold text-white text-center mb-2" style={{ color: '#f97316' }}>
                {selectedRecipe.title}
              </h1>
              
              <div className="flex gap-6 justify-center mb-8 text-2xl">
                {selectedRecipe.prepTime && (
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏱️</div>
                    <div className={textClass}>{selectedRecipe.prepTime}</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-4xl mb-2">👥</div>
                  <input
                    type="number"
                    value={portions}
                    onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`w-16 text-center text-2xl font-bold rounded-lg p-2 ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <h2 className={`text-2xl font-bold ${textClass} mb-4`}>📝 Ingrédients</h2>
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ingredient, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl flex items-center gap-3 ${
                        darkMode ? 'bg-gray-700' : 'bg-orange-50'
                      }`}>
                        <input 
                          type="checkbox" 
                          className="w-6 h-6 accent-orange-500 cursor-pointer"
                        />
                        <span className={`${textClass} text-lg`}>{ingredient}</span>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto w-full p-4 pb-6">
            <button
              onClick={() => setCookingMode(false)}
              className="w-full bg-gradient-to-r from-orange-400 to-rose-400 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-xl"
            >
              Voir la recette complète
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen ${bgClass}`}>
        {showToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50">
            {toastMessage}
          </div>
        )}
        
        <div className="max-w-3xl mx-auto p-4 pb-24">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedRecipe(null)}
              className={`flex-1 ${cardClass} px-4 py-2 rounded-full text-orange-600 hover:bg-opacity-100 font-medium shadow-md transition-all`}
            >
              ← Retour
            </button>
            <button
              onClick={() => toggleFavorite(selectedRecipe)}
              className={`${cardClass} px-4 py-2 rounded-full font-medium shadow-md transition-all`}
            >
              {selectedRecipe.favorite ? <Star className="text-yellow-500 fill-yellow-500" size={20} /> : <Star className="text-gray-400" size={20} />}
            </button>
            <button
              onClick={() => shareRecipe(selectedRecipe)}
              className={`${cardClass} px-4 py-2 rounded-full text-orange-600 hover:bg-opacity-100 font-medium shadow-md transition-all flex items-center gap-2`}
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => {
                setCookingMode(true);
                setPortions(4);
              }}
              className={`${cardClass} px-4 py-2 rounded-full text-orange-600 hover:bg-opacity-100 font-medium shadow-md transition-all flex items-center gap-2`}
              title="Mode cuisine"
            >
              🍳
            </button>
          </div>
          
          <div className={`${cardClass} rounded-3xl shadow-2xl overflow-hidden`}>
            <div className="bg-gradient-to-r from-orange-400 to-rose-400 p-6">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">{selectedRecipe.title}</h1>
              
              <div className="flex gap-4 mb-4 flex-wrap">
                {selectedRecipe.prepTime && (
                  <div className="bg-white/20 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    <Clock size={18} />
                    {selectedRecipe.prepTime}
                  </div>
                )}
                {selectedRecipe.portions && (
                  <div className="bg-white/20 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    👥 {selectedRecipe.portions} portions
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateCategory(selectedRecipe, cat.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedRecipe.category === cat.id
                        ? 'bg-white text-orange-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <ChefHat className="text-orange-600" size={24} />
                  </div>
                  <h2 className={`text-2xl font-bold ${textClass}`}>Ingrédients</h2>
                </div>
                <div className={darkMode ? 'bg-gray-700 rounded-2xl p-5' : 'bg-orange-50 rounded-2xl p-5'}>
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-orange-500 text-xl leading-none">•</span>
                        <span className={`${textClass} text-lg`}>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedRecipe.steps && selectedRecipe.steps.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-rose-100 p-2 rounded-lg">
                      <BookOpen className="text-rose-600" size={24} />
                    </div>
                    <h2 className={`text-2xl font-bold ${textClass}`}>Préparation</h2>
                  </div>
                  <div className="space-y-4">
                    {selectedRecipe.steps.map((step, idx) => (
                      <div key={idx} className={`flex gap-4 rounded-2xl p-5 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-rose-50 to-orange-50'}`}>
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-400 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                          {idx + 1}
                        </div>
                        <p className={`${textClass} text-lg pt-1.5`}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xl font-bold ${textClass}`}>⏱️ Temps de préparation</h2>
                  {!editingTime && (
                    <button
                      onClick={() => {
                        setEditingTime(selectedRecipe.id);
                        setPrepTime(selectedRecipe.prepTime || '');
                      }}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
                {editingTime === selectedRecipe.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      placeholder="Ex: 30 min, 1h, 45 min..."
                      className={`w-full p-3 rounded-xl border-2 focus:outline-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveTime(selectedRecipe)}
                        className="flex-1 bg-gradient-to-r from-orange-400 to-rose-400 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => {
                          setEditingTime(null);
                          setPrepTime('');
                        }}
                        className={`px-4 py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`${textSecondaryClass} ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-xl`}>
                    {selectedRecipe.prepTime || 'Aucun temps défini...'}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xl font-bold ${textClass}`}>📝 Ma note personnelle</h2>
                  {!editingNote && (
                    <button
                      onClick={() => {
                        setEditingNote(selectedRecipe.id);
                        setNoteText(selectedRecipe.note || '');
                      }}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </div>
                {editingNote === selectedRecipe.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Ajoute tes remarques ici..."
                      className={`w-full p-3 rounded-xl border-2 focus:outline-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveNote(selectedRecipe)}
                        className="flex-1 bg-gradient-to-r from-orange-400 to-rose-400 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => {
                          setEditingNote(null);
                          setNoteText('');
                        }}
                        className={`px-4 py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`${textSecondaryClass} ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-xl`}>
                    {selectedRecipe.note || 'Aucune note pour le moment...'}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t-2 border-gray-100">
                <a 
                  href={selectedRecipe.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${textSecondaryClass} hover:text-orange-600 transition-colors ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-2 rounded-full`}
                >
                  <ExternalLink size={16} />
                  <span className="text-sm font-medium">Voir la source</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-orange-50'}`}>
        <div className="flex items-center gap-3">
          <Loader className="animate-spin text-orange-500" size={24} />
          <span className={darkMode ? 'text-white' : 'text-gray-800'}>Chargement...</span>
        </div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50">
          {toastMessage}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="text-center mb-6 pt-4">
          <div className={`inline-flex items-center justify-center gap-3 ${cardClass} px-6 py-3 rounded-full shadow-lg mb-3`}>
            <ChefHat className="text-orange-500" size={36} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              Mes Recettes
            </h1>
            <div className="flex gap-2 ml-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="text-yellow-500" size={24} /> : <Moon className="text-gray-600" size={24} />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 transition-colors group"
                title={`Déconnecter ${user.email}`}
              >
                <LogOut className="text-red-500" size={24} />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {user.email}
                </span>
              </button>
            </div>
          </div>
          <p className={`${textSecondaryClass} font-medium`}>Sauvegarde tes recettes préférées ✨</p>
          {(activeTab === 'recipes' || activeTab === 'cocktails') && (
            <div className="mt-4 flex justify-center">
              <ExportAllButton recipes={activeTab === 'recipes' ? recipes : cocktails} darkMode={darkMode} />
            </div>
          )}
        </div>

        <div className={`${cardClass} rounded-2xl shadow-xl mb-6 p-2`}>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'recipes'
                  ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg'
                  : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen size={20} />
                Recettes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('cocktails')}
              className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'cocktails'
                  ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg'
                  : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                🍹
                Cocktails
              </div>
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg'
                  : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={20} />
                Ajouter
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'add' && (
          <div className="space-y-4">
            <div className={`${cardClass} rounded-3xl shadow-2xl p-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${textClass} text-center`}>
                ✍️ Créer une nouvelle recette
              </h2>
              <RecipeForm onSave={handleSaveManualRecipe} darkMode={darkMode} />
            </div>

            <div className={`${cardClass} rounded-3xl shadow-2xl p-8`}>
              <h2 className={`text-2xl font-bold mb-4 ${textClass} text-center`}>
                Importer une recette
              </h2>
              <p className={`${textSecondaryClass} text-center mb-4 text-sm`}>
                Quelqu'un t'a partagé une recette ? Copie-la et importe-la ici !
              </p>
              <button
                onClick={importRecipe}
                className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl p-4 font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all"
              >
                <Download size={24} />
                Importer depuis le presse-papier
              </button>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <>
            <div className={`${cardClass} rounded-2xl shadow-xl p-4 mb-6`}>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une recette..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:border-orange-400 transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200'
                  }`}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg'
                        : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 dark:hover:bg-gray-600`
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {favoriteRecipes.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-xl font-bold ${textClass} mb-3 flex items-center gap-2`}>
                  <Star className="text-yellow-500 fill-yellow-500" size={24} />
                  Favoris
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {favoriteRecipes.map((recipe) => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      darkMode={darkMode}
                      onSelect={setSelectedRecipe}
                      onToggleFavorite={toggleFavorite}
                      onShare={shareRecipe}
                      onCopy={copyRecipeData}
                      onDelete={deleteRecipe}
                      isSelected={selectedRecipeIds.includes(recipe.id)}
                      onToggleSelection={toggleRecipeSelection}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredRecipes.length === 0 ? (
              <div className={`text-center py-20 ${cardClass} rounded-3xl shadow-xl`}>
                <ChefHat className="mx-auto text-gray-300 mb-6" size={80} />
                <h3 className={`text-2xl font-bold ${textClass} mb-2`}>Aucune recette</h3>
                <p className={`${textSecondaryClass} text-lg mb-6`}>
                  {searchQuery ? 'Aucun résultat trouvé' : 'Commence par ajouter ta première recette !'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setActiveTab('add')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-rose-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus size={20} />
                    Ajouter une recette
                  </button>
                )}
              </div>
            ) : (
              <>
                {favoriteRecipes.length > 0 && (
                  <h3 className={`text-xl font-bold ${textClass} mb-3 mt-8`}>
                    Toutes les recettes
                  </h3>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      darkMode={darkMode}
                      onSelect={setSelectedRecipe}
                      onToggleFavorite={toggleFavorite}
                      onShare={shareRecipe}
                      onCopy={copyRecipeData}
                      onDelete={deleteRecipe}
                      isSelected={selectedRecipeIds.includes(recipe.id)}
                      onToggleSelection={toggleRecipeSelection}
                    />
                  ))}
                </div>
              </>
            )}

            {selectedRecipeIds.length > 0 && (
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-3 p-4 rounded-full shadow-2xl" style={darkMode ? {backgroundColor: '#1f2937'} : {backgroundColor: '#ffffff'}}>
                <div className={`font-semibold px-4 py-2 rounded-full flex items-center gap-2 ${darkMode ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  ✓ {selectedRecipeIds.length} sélectionnée{selectedRecipeIds.length > 1 ? 's' : ''}
                </div>
                <button
                  onClick={exportSelectedRecipes}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 text-white font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  📥 Exporter PDF
                </button>
                <button
                  onClick={() => setSelectedRecipeIds([])}
                  className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  ✕ Annuler
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, darkMode, onSelect, onToggleFavorite, onShare, onCopy, onDelete, isSelected, onToggleSelection }) {
  const categories = {
    entree: '🥗',
    plat: '🍝',
    dessert: '🍰',
    apero: '🍾'
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group relative`}>
      {onToggleSelection && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(recipe.id)}
            className="w-5 h-5 cursor-pointer accent-orange-500"
          />
        </div>
      )}
      <div className={`bg-gradient-to-r from-orange-400 to-rose-400 h-2 group-hover:h-3 transition-all ${isSelected ? 'ring-2 ring-orange-500' : ''}`}></div>
      <div 
        className="p-6 cursor-pointer"
        onClick={() => onSelect(recipe)}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex-1`}>
            {recipe.title}
          </h3>
          <span className="text-2xl ml-2">{categories[recipe.category] || '🍽️'}</span>
        </div>
        
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
          {recipe.ingredients.slice(0, 3).map(i => {
            if (typeof i === 'string') return i;
            return `${i.quantity} ${i.unit} ${i.name}`.trim();
          }).join(' • ')}
          {recipe.ingredients.length > 3 && '...'}
        </p>

        <div className="flex items-center gap-2 mb-4">
          {recipe.favorite && <Star className="text-yellow-500 fill-yellow-500" size={16} />}
          {recipe.note && <BookOpen className="text-orange-500" size={16} />}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe);
            }}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              recipe.favorite
                ? 'bg-yellow-100 text-yellow-600'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Star size={16} className={recipe.favorite ? 'fill-current' : ''} />
            {recipe.favorite ? 'Favoris' : 'Ajouter'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(recipe);
            }}
            className={`flex items-center justify-center p-2 rounded-lg transition-all ${
              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Partager"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy(recipe);
            }}
            className={`flex items-center justify-center p-2 rounded-lg transition-all ${
              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Copier"
          >
            <Copy size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(recipe.id);
            }}
            className="flex items-center justify-center p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t" style={darkMode ? {borderColor: 'rgba(255,255,255,0.1)'} : {borderColor: 'rgba(0,0,0,0.1)'}}>
          <ExportRecipeButton recipe={recipe} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}
