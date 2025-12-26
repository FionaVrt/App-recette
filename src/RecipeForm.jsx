import React, { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

export default function RecipeForm({ onSave, darkMode = false }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'plat',
    prepTime: '',
    portions: 4,
    source: '',
    ingredients: [{ quantity: '', unit: '', name: '' }],
    steps: [''],
    videoLink: '',
    notes: ''
  });

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const inputClass = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { quantity: '', unit: '', name: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Veuillez entrer un titre');
      return;
    }

    // Filtrer les ingrédients vides
    const validIngredients = formData.ingredients.filter(i => i.name.trim());
    if (validIngredients.length === 0) {
      alert('Veuillez ajouter au moins un ingrédient');
      return;
    }

    // Filtrer les étapes vides
    const validSteps = formData.steps.filter(s => s.trim());
    if (validSteps.length === 0) {
      alert('Veuillez ajouter au moins une étape');
      return;
    }

    const recipe = {
      ...formData,
      ingredients: validIngredients,
      steps: validSteps
    };

    onSave(recipe);

    // Reset form
    setFormData({
      title: '',
      category: 'plat',
      prepTime: '',
      portions: 4,
      source: '',
      ingredients: [{ quantity: '', unit: '', name: '' }],
      steps: [''],
      videoLink: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`${bgClass} rounded-3xl shadow-xl p-8 space-y-8`}>
      {/* Titre */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
          📝 Titre de la recette
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ex: Pâtes à la Carbonara"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
        />
      </div>

      {/* Catégorie, Temps, Portions */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
            🏷️ Catégorie
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
          >
            <option value="entree">🥗 Entrée</option>
            <option value="plat">🍝 Plat</option>
            <option value="dessert">🍰 Dessert</option>
            <option value="apero">🍾 Apéro</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
            ⏱️ Temps (min)
          </label>
          <input
            type="number"
            name="prepTime"
            value={formData.prepTime}
            onChange={handleInputChange}
            placeholder="30"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
            👥 Portions
          </label>
          <input
            type="number"
            name="portions"
            value={formData.portions}
            onChange={handleInputChange}
            min="1"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
          />
        </div>
      </div>

      {/* Source & Lien vidéo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
            🔗 Lien source
          </label>
          <input
            type="url"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            placeholder="https://..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
            🎬 Lien vidéo (Instagram, YouTube, etc.)
          </label>
          <input
            type="url"
            name="videoLink"
            value={formData.videoLink}
            onChange={handleInputChange}
            placeholder="https://instagram.com/..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
          />
        </div>
      </div>

      {/* Ingrédients */}
      <div>
        <label className={`block text-sm font-semibold mb-4 ${textClass}`}>
          🥘 Ingrédients
        </label>
        <div className="space-y-3">
          {formData.ingredients.map((ingredient, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                placeholder="Quantité"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
              />
              <select
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
              >
                <option value="">unité</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="c">c.</option>
                <option value="cac">cac</option>
                <option value="cas">cas</option>
                <option value="pincée">pincée</option>
                <option value="unité">unité</option>
              </select>
              <input
                type="text"
                placeholder="Ingrédient"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${inputClass}`}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className={`mt-4 flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-100 hover:bg-orange-200'} rounded-lg transition font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
        >
          <Plus size={20} /> Ajouter un ingrédient
        </button>
      </div>

      {/* Étapes */}
      <div>
        <label className={`block text-sm font-semibold mb-4 ${textClass}`}>
          👨‍🍳 Étapes de préparation
        </label>
        <div className="space-y-3">
          {formData.steps.map((step, idx) => (
            <div key={idx} className="flex gap-2">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${darkMode ? 'bg-orange-600' : 'bg-orange-500'}`}>
                {idx + 1}
              </div>
              <textarea
                value={step}
                onChange={(e) => handleStepChange(idx, e.target.value)}
                placeholder={`Étape ${idx + 1}...`}
                rows="2"
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition resize-none ${inputClass}`}
              />
              {formData.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(idx)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className={`mt-4 flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-orange-100 hover:bg-orange-200'} rounded-lg transition font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}
        >
          <Plus size={20} /> Ajouter une étape
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${textClass}`}>
          📝 Notes personnelles
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Astuces, variantes, commentaires..."
          rows="4"
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition resize-none ${inputClass}`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition shadow-lg"
      >
        💾 Enregistrer la recette
      </button>
    </form>
  );
}
