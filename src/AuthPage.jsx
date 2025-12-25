import React, { useState } from 'react';
import { ChefHat, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { loginUser, registerUser } from './authService';

export default function AuthPage({ onAuthSuccess, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100';
  
  const cardClass = darkMode 
    ? 'bg-gray-800/90 backdrop-blur' 
    : 'bg-white/90 backdrop-blur';
  
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }
      onAuthSuccess();
    } catch (err) {
      let errorMessage = 'Une erreur est survenue';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Utilisateur non trouvé';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit faire au moins 6 caractères';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email invalide';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <ChefHat className="text-orange-500" size={36} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              Mes Recettes
            </h1>
          </div>
          <p className={textSecondaryClass}>
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </p>
        </div>

        <div className={`${cardClass} rounded-3xl shadow-2xl p-8`}>
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textSecondaryClass} mb-2`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:border-orange-400 focus:outline-none transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200'
                  }`}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondaryClass} mb-2`}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength="6"
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:border-orange-400 focus:outline-none transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-200'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl p-3 font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Chargement...
                </>
              ) : isLogin ? (
                'Se connecter'
              ) : (
                'Créer un compte'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className={`w-full text-center text-sm font-medium ${textSecondaryClass} hover:text-orange-600 transition-colors`}
            >
              {isLogin 
                ? "Pas encore de compte ? S'inscrire" 
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>

        <p className={`text-center text-xs ${textSecondaryClass} mt-6`}>
          Tes données sont sauvegardées de manière sécurisée dans le cloud
        </p>
      </div>
    </div>
  );
}
