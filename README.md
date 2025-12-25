# 🍳 Mes Recettes - PWA Moderne avec Firebase

Une application web progressive avec authentification sécurisée pour sauvegarder, organiser et cuisiner tes recettes préférées. Synchronisation cloud en temps réel entre tous tes appareils.

**Status**: ✅ Authentification implémentée | ☁️ Firestore synchronisé | 🚀 Prêt pour production

**Live**: https://resonant-alfajores-b439bf.netlify.app/

---

## 🚀 Démarrage Rapide

### Je Veux Tester Localement

```bash
npm install
npm run dev
# → http://localhost:5173
```

[Guide détaillé: QUICK_START.md](./QUICK_START.md)

### Je Veux Déployer

```bash
git push origin main
# Netlify déploie automatiquement
```

[Guide détaillé: DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Je Veux Comprendre l'Architecture

[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md) avec diagrammes visuels

---

## 📋 Documentation

| Besoin              | Guide                                                      |
| ------------------- | ---------------------------------------------------------- |
| Tester localement   | [QUICK_START.md](./QUICK_START.md)                         |
| Déployer l'app      | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)               |
| Sécuriser (URGENT!) | [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md) |
| Migrer données      | [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)                 |
| Voir all features   | [README_FEATURES.md](./README_FEATURES.md)                 |
| Changements récents | [CHANGELOG.md](./CHANGELOG.md)                             |
| Doc index           | [DOCS_INDEX.md](./DOCS_INDEX.md)                           |
| Résumé complet      | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)   |

---

## ✨ Fonctionnalités

### 🔐 Authentification Sécurisée

- ✅ Inscription/Connexion par email/password
- ✅ Sessions persistantes (reste connecté)
- ✅ Déconnexion en 1 clic
- ✅ Données isolées par utilisateur

### 📖 Gestion des Recettes

- ✅ Ajouter par URL (détection auto)
- ✅ Marquer favoris
- ✅ Notes personnelles
- ✅ Catégories (Entrée, Plat, Dessert, Apéro)
- ✅ Temps de préparation
- ✅ Ajuster portions
- ✅ Rechercher en temps réel
- ✅ Partager/copier

### 🍹 Bar à Cocktails

- ✅ 3 types (Alcool, Sans alcool, Mocktail)
- ✅ Détection auto de l'alcool
- ✅ Synchronisation temps réel

### 🍳 Mode Cuisson

- ✅ Vue fullscreen simplifiée
- ✅ Cases à cocher ingrédients
- ✅ Ajustement portions
- ✅ Sans distractions

### 🌐 Cloud & Offline

- ✅ Sauvegarde Firebase Firestore
- ✅ Sync temps réel multi-appareils
- ✅ Fonctionne hors ligne
- ✅ Installable sur téléphone

### 🎨 Experience

- ✅ Mode sombre/clair
- ✅ Responsive (mobile/tablet/desktop)
- ✅ Ultra rapide (Vite)
- ✅ Icônes modernes

---

## 📱 Installation sur téléphone

### Sur Android

1. Ouvre l'app dans Chrome (après le déploiement)
2. Clique sur le menu (3 points)
3. Sélectionne "Installer l'app" ou "Ajouter à l'écran d'accueil"

### Sur iPhone/iPad

1. Ouvre l'app dans Safari (après le déploiement)
2. Clique sur le bouton Partager
3. Sélectionne "Sur l'écran d'accueil"

## Installation locale

### Prérequis

- Node.js 16+
- npm ou yarn

### Étapes

1. **Installer les dépendances**

```bash
npm install
```

2. **Lancer en développement**

```bash
npm run dev
```

L'app s'ouvrira sur `http://localhost:5173`

3. **Construire pour la production**

```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`

## Fonctionnalités

✨ **Extraction automatique** - Récupère une recette depuis un lien (nécessite une clé API Anthropic)
📱 **Installable** - Fonctionne comme une vraie app sur le téléphone
💾 **Hors ligne** - Accès à tes recettes sans internet
🌙 **Mode sombre** - Interface jour/nuit
⭐ **Favoris** - Marque tes recettes préférées
🏷️ **Catégories** - Organise par entrée, plat, dessert, apéro
📝 **Notes** - Ajoute tes remarques personnelles
📤 **Partage** - Partage tes recettes avec des amis
📋 **Import/Export** - Copie-colle des recettes entre appareils

## Configuration API

Pour activer l'extraction de recettes, ajoute ta clé Anthropic dans `src/RecipeSaver.jsx` ligne 128:

```javascript
"x-api-key": "YOUR_ANTHROPIC_API_KEY"
```

Obtiens une clé sur https://console.anthropic.com

## Déploiement

### Sur Netlify

```bash
npm run build
# Glisse-dépose le dossier 'dist/' sur Netlify
```

### Sur Vercel

```bash
vercel
```

### Sur un serveur personnel

1. Build: `npm run build`
2. Sers le contenu du dossier `dist/` via HTTP(S)

## Structure du projet

```
/
├── src/
│   ├── main.jsx          # Point d'entrée
│   ├── App.jsx           # Composant principal
│   ├── RecipeSaver.jsx   # App de recettes
│   └── index.css         # Styles Tailwind
├── public/
│   ├── sw.js            # Service Worker
│   └── manifest.json    # Manifeste PWA
├── index.html           # HTML principal
├── vite.config.js       # Config Vite
├── tailwind.config.js   # Config Tailwind
└── package.json         # Dépendances
```

## Support des navigateurs

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 15+
- ✅ Samsung Internet 14+

## License

MIT
