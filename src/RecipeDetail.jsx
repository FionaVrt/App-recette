import React, { useState } from 'react';
import { ChefHat, Clock, Users, ExternalLink, Copy, Trash2, Plus, X } from 'lucide-react';

export default function RecipeDetail({ recipe, onDelete, onUpdate, darkMode = false }) {
  const [shoppingList, setShoppingList] = useState([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [copiedIngredients, setCopiedIngredients] = useState(false);

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const bgSecondaryClass = darkMode ? 'bg-gray-700' : 'bg-gray-100';

  const generateShoppingList = () => {
    const ingredients = recipe.ingredients || [];
    setShoppingList(ingredients.map(ing => ({
      ...ing,
      checked: false
    })));
    setShowShoppingList(true);
  };

  const toggleIngredient = (index) => {
    const newList = [...shoppingList];
    newList[index].checked = !newList[index].checked;
    setShoppingList(newList);
  };

  const copyShoppingList = async () => {
    const text = shoppingList
      .map(i => `${i.checked ? '✓' : '☐'} ${i.quantity} ${i.unit} ${i.name}`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIngredients(true);
      setTimeout(() => setCopiedIngredients(false), 2000);
    } catch (err) {
      alert('Erreur lors de la copie');
    }
  };

  const formatIngredient = (ingredient) => {
    let text = '';
    if (ingredient.quantity) text += ingredient.quantity;
    if (ingredient.unit) text += (text ? ' ' : '') + ingredient.unit;
    if (ingredient.name) text += (text ? ' ' : '') + ingredient.name;
    return text;
  };

  if (showShoppingList) {
    return (
      <div className={`${bgClass} rounded-3xl shadow-xl overflow-hidden`}>
        <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">🛒 Liste de courses</h2>
          <button
            onClick={() => setShowShoppingList(false)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-2 mb-6">
            {shoppingList.map((ingredient, idx) => (
              <div
                key={idx}
                onClick={() => toggleIngredient(idx)}
                className={`p-4 rounded-xl cursor-pointer transition flex items-center gap-3 ${
                  ingredient.checked
                    ? darkMode ? 'bg-gray-700 line-through' : 'bg-green-100'
                    : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  ingredient.checked 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-400'
                }`}>
                  {ingredient.checked && <span className="text-white font-bold">✓</span>}
                </div>
                <span className={textClass}>
                  {formatIngredient(ingredient)}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={copyShoppingList}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${
              copiedIngredients
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:shadow-lg'
            }`}
          >
            <Copy size={20} />
            {copiedIngredients ? 'Liste copiée !' : 'Copier la liste'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgClass} rounded-3xl shadow-xl overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-rose-400 p-6">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{recipe.title}</h1>
        <div className="flex flex-wrap gap-2">
          {recipe.prepTime && (
            <div className="bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
              <Clock size={16} /> {recipe.prepTime} min
            </div>
          )}
          {recipe.portions && (
            <div className="bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
              <Users size={16} /> {recipe.portions} portions
            </div>
          )}
          {recipe.videoLink && (
            <a
              href={recipe.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium transition"
            >
              <ExternalLink size={16} /> Vidéo
            </a>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Ingrédients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <ChefHat className="text-orange-600" size={24} />
              </div>
              <h2 className={`text-2xl font-bold ${textClass}`}>Ingrédients</h2>
            </div>
            <div className={`${bgSecondaryClass} rounded-2xl p-5`}>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className={`flex items-start gap-3 ${textClass}`}>
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>{formatIngredient(ingredient)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={generateShoppingList}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold transition shadow-lg"
            >
              🛒 Générer une liste de courses
            </button>
          </div>
        )}

        {/* Étapes */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>👨‍🍳 Étapes de préparation</h2>
            <div className="space-y-4">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    darkMode ? 'bg-orange-600' : 'bg-orange-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className={`flex-1 pt-1 ${textSecondaryClass}`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {recipe.notes && (
          <div>
            <h2 className={`text-xl font-bold mb-3 ${textClass}`}>📝 Notes personnelles</h2>
            <div className={`${bgSecondaryClass} rounded-xl p-4 ${textSecondaryClass}`}>
              {recipe.notes}
            </div>
          </div>
        )}

        {/* Source */}
        {recipe.source && (
          <div>
            <a
              href={recipe.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium"
            >
              <ExternalLink size={16} /> Lien source
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
