# 📚 Documentation - Guide Complet

Bienvenue! Voici tous les guides pour utiliser et maintenir ton app **Mes Recettes**.

## 🚀 Commencer

### Je Veux Tester Localement

→ [QUICK_START.md](./QUICK_START.md)

Contient :

- Comment démarrer l'app avec `npm run dev`
- Étapes pour tester login/signup
- Tests d'isolation des données
- Dépannage courant

**Temps: ~15 minutes**

---

### Je Veux Déployer en Production

→ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Contient :

- Déploiement automatique (GitHub → Netlify)
- Déploiement manuel avec Netlify CLI
- Comment tester après déploiement
- Dépannage

**Temps: ~5 minutes**

---

## 🔐 Sécurité

### Je Veux Sécuriser Mon App

→ [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md)

⚠️ **IMPORTANT** : À lire en priorité!

Contient :

- Comment appliquer les règles Firestore
- Protocoles de sécurité
- Structure de données sécurisée
- Comment tester la sécurité
- Passage de mode "test" à production

**Temps: ~10 minutes** (mais ultra-important!)

---

## 🔄 Migration des Données

### Les Anciennes Recettes Ont Disparu!

→ [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

Contient :

- Pourquoi les anciennes données ne sont plus visibles
- Option 1: Supprimer les anciennes données
- Option 2: Migrer avec Cloud Functions
- Vérification dans Firestore
- Comparaison avant/après

**Temps: ~5-20 minutes** (selon l'option)

---

## 📖 Fonctionnalités & Archictecture

### Vue d'ensemble du Projet

→ [README_FEATURES.md](./README_FEATURES.md)

Contient :

- ✨ Liste complète des features
- 🛠️ Stack technologique utilisé
- 📁 Structure du projet
- 🚀 Scripts et commandes
- 🎯 Feuille de route

**Pour**: Comprendre l'app dans sa globalité

---

### Changements Récents

→ [CHANGELOG.md](./CHANGELOG.md)

Contient :

- Résumé des changements d'authentification
- Fichiers créés/modifiés
- Code ajouté détaillé
- État d'avancement

**Pour**: Comprendre ce qui a changé avec l'auth

---

## 🗺️ Flux de Lecture Recommandé

### 👤 Premier Accès (Nouveau à l'App)

1. [README_FEATURES.md](./README_FEATURES.md) - Comprendre les features
2. [QUICK_START.md](./QUICK_START.md) - Tester localement

### 🚀 Premier Déploiement

1. [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md) - **IMPORTANT!**
2. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Déployer
3. Tester sur l'URL déployée

### 🔄 Gestion des Données

1. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Si tu avais des anciennes recettes

### 👨‍💻 Développement Futur

1. [CHANGELOG.md](./CHANGELOG.md) - Comprendre l'architecture auth
2. [README_FEATURES.md](./README_FEATURES.md#-feuille-de-route) - Features à venir

---

## 📱 Quick Reference

### Commandes Essentielles

```bash
# Développement
npm run dev              # Démarre le serveur local (port 5173)

# Production
npm run build            # Build pour production
npm run preview          # Prévisualiser le build

# Déploiement Netlify
netlify deploy --prod    # Déploie le dossier dist/
```

### URLs Importantes

- **Développement**: http://localhost:5173
- **Production**: https://resonant-alfajores-b439bf.netlify.app/
- **Firebase Console**: https://console.firebase.google.com/
- **Netlify Dashboard**: https://app.netlify.com/

### Stack Technique

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Deployment**: Netlify
- **Icons**: Lucide React

---

## ❓ Problèmes Courants

| Problème                   | Solution                                            |
| -------------------------- | --------------------------------------------------- |
| "Page blanche"             | Vide le cache (Ctrl+Shift+Suppr)                    |
| "Erreur Firestore"         | Applique les règles Firestore (voir guide sécurité) |
| "Les recettes ont disparu" | Voir MIGRATION_GUIDE.md                             |
| "L'app ne démarre pas"     | Assure-toi que Node 16+ est installé                |
| "npm install échoue"       | Essaie `npm cache clean --force`                    |

---

## 📞 Besoin d'Aide?

1. **Problème technique** → Cherche dans le guide concerné
2. **Question sur une feature** → [README_FEATURES.md](./README_FEATURES.md)
3. **Erreur après deployment** → [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (section dépannage)
4. **Sécurité Firestore** → [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md)

---

## 🎯 État de l'App

### ✅ Actuellement Implémenté

- Authentification email/password
- Gestion des recettes et cocktails
- Synchronisation cloud (Firestore)
- Mode cuisson
- PWA (offline, installable)
- Mode sombre/clair

### ⏳ Prochaines Étapes

1. **URGENT** : Appliquer les règles Firestore (sécurité)
2. Upload de photos
3. Export PDF
4. Nutritional info

---

## 🚀 Ready to Go!

**Recommandation** :

1. Commence par [QUICK_START.md](./QUICK_START.md) pour tester localement
2. Puis [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md) pour sécuriser
3. Puis [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) pour déployer

**Bon appétit! 🍳✨**

---

_Dernière mise à jour : Authentification Firebase complètement implémentée_
