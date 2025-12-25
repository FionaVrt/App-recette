# 🍳 Mes Recettes - PWA Moderne avec Firebase

Une application web progressive pour sauvegarder, organiser et cuisiner tes recettes préférées. Avec authentification, synchronisation cloud et mode hors ligne.

## ✨ Fonctionnalités

### 🔐 Authentification Sécurisée

- Inscription et connexion par email/mot de passe
- Sessions persistantes (reste connecté après rechargement)
- Firebase Authentication intégré
- Données isolées par utilisateur

### 📖 Gestion des Recettes

- 📋 Ajouter des recettes par URL (détection automatique)
- ⭐ Marquer comme favoris
- 📝 Ajouter des notes personnelles
- 🏷️ Catégoriser (Entrée, Plat, Dessert, Apéro)
- ⏱️ Noter le temps de préparation
- 👥 Ajuster les portions
- 🔍 Rechercher en temps réel
- 📤 Partager/copier les recettes

### 🍹 Bar à Cocktails

- 3 types : Avec alcool, Sans alcool, Mocktail
- 🤖 Détection automatique de l'alcool dans les ingrédients
- ⭐ Favoris pour les cocktails
- Synchronisation en temps réel

### 🍳 Mode Cuisson

- 📱 Vue simplifiée plein écran
- ☑️ Cases à cocher pour chaque ingrédient
- 👥 Ajustement en temps réel des portions
- Sans distractions pendant la cuisine

### 🌙 Expérience Utilisateur

- 🌓 Mode sombre/clair
- 📱 Entièrement responsive
- 🚀 Temps de chargement ultra-rapide (Vite)
- 🎨 Design moderne avec Tailwind CSS
- 📲 Icônes intuitives (Lucide React)

### 🌐 Synchronisation Cloud

- ☁️ Sauvegarde automatique sur Firebase Firestore
- 📱 Sync en temps réel entre appareil → Desktop → Tablet
- 🔄 Mises à jour instantanées
- 🔒 Sécurité : Chaque utilisateur voit ses données

### 📴 Hors Ligne

- Service Worker pour cache offline
- Continue à fonctionner sans connexion
- Synchronise au retour en ligne

### 📲 Progressive Web App

- ✅ Installable sur téléphone (iOS & Android)
- ✅ Fonctionne hors ligne
- ✅ Notifications push (futur)
- ✅ Accès rapide depuis écran d'accueil

## 🛠️ Stack Technologique

```
Frontend:     React 18.2.0
Build:        Vite 4.5.14
Styling:      Tailwind CSS 3.3.0
Icons:        Lucide React
Database:     Firebase Firestore
Auth:         Firebase Authentication
PWA:          Service Worker + Manifest
Deployment:   Netlify
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 16+
- npm ou yarn

### Installation

```bash
cd /Users/laly/bouffe
npm install
npm run dev
```

L'app démarre sur http://localhost:5173

### Build pour Production

```bash
npm run build
npm run preview
```

## 📦 Scripts Disponibles

```bash
npm run dev      # Démarrage développement
npm run build    # Build production
npm run preview  # Aperçu du build
```

## 📁 Structure du Projet

```
bouffe/
├── src/
│   ├── main.jsx          # Entrée React + SW registration
│   ├── App.jsx           # Wrapper principal
│   ├── RecipeSaver.jsx   # Composant principal (1200+ lignes)
│   ├── AuthPage.jsx      # Écran de login/signup
│   ├── firebase.js       # Config Firebase
│   ├── firebaseService.js # CRUD Firestore
│   ├── authService.js    # Firebase Auth
│   └── index.css         # Styles globaux
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── sw.js             # Service Worker
│   ├── vite.svg          # Icons
│   └── apple-touch-icon.png
├── vite.config.js        # Config Vite + React
├── tailwind.config.js    # Config Tailwind
├── postcss.config.js     # Config PostCSS
├── package.json
└── index.html            # Shell HTML

```

## 🔐 Sécurité

### Authentification

- ✅ Firebase Auth avec email/password
- ✅ Sessions persistantes
- ✅ Protection contre les connexions non autorisées

### Données

- ✅ Firestore avec structure `users/{userId}/recipes`
- ✅ Chaque utilisateur ne voit que ses données
- ⏳ **À faire**: Publier les règles Firestore (voir FIREBASE_SECURITY_RULES.md)

## 🚀 Déploiement

L'app est actuellement déployée sur :
**https://resonant-alfajores-b439bf.netlify.app/**

Pour mettre à jour :

```bash
git push origin main  # Déploie automatiquement
```

Ou manuellement :

```bash
npm run build
netlify deploy --prod --dir=dist
```

(Voir DEPLOYMENT_GUIDE.md pour plus de détails)

## 📝 Configuration Firebase

### Ton Projet

- **Projet ID**: bouffe-62d9c
- **Database**: Firestore
- **Authentication**: Email/Password
- **Rules Status**: ⏳ En cours de sécurisation

### Structure Firestore

```
users/
  {userId}/
    recipes/
      {recipeId}: { title, url, ingredients, ... }
    cocktails/
      {cocktailId}: { name, type, ingredients, ... }
```

## 🎯 Feuille de Route

### ✅ Complétées

- [x] Authentification Firebase
- [x] Gestion des recettes
- [x] Système de cocktails
- [x] Mode cuisson
- [x] Synchronisation temps réel
- [x] PWA et offline support
- [x] Isolation des données par utilisateur

### ⏳ En Cours

- [ ] Publier les règles Firestore (voir FIREBASE_SECURITY_RULES.md)

### 🔜 Prochainement

- [ ] Upload photos avec Firebase Storage
- [ ] Export PDF des recettes
- [ ] Informations nutritionnelles
- [ ] Tags allergènes/régimes spéciaux
- [ ] Partager via lien unique
- [ ] Statistiques d'utilisation
- [ ] Collections et playlists

## 📞 Support

Des questions ? Consulte :

- [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md) - Configuration sécurité
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Mettre à jour l'app

## 📄 Licence

MIT - Libre d'utilisation

---

**Bon appétit! 🍳✨**

_Créé avec ❤️ pour faciliter ta vie en cuisine_
