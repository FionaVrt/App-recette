# 🚀 Mettre à jour l'app sur Netlify

L'authentification et l'isolation des données par utilisateur ont été ajoutées ! Voici comment déployer :

## Option 1 : Déploiement Automatique (Recommandé)

Si tu as connecté ton repo GitHub à Netlify, c'est **automatique** :

1. **Fais un commit** de tes changements :

   ```bash
   git add .
   git commit -m "✨ Add authentication and user-isolated data"
   git push origin main
   ```

2. **Netlify déploie automatiquement** après quelques secondes
   - Vérifie sur https://app.netlify.com/sites/resonant-alfajores-b439bf/overview
   - Attends le badge **Published** ✅

## Option 2 : Déploiement Manuel

### Étape 1 : Build local

```bash
cd /Users/laly/bouffe
npm run build
```

Tu verras :

```
✓ 1270 modules transformed.
✓ built in 1.66s
```

### Étape 2 : Déployer avec Netlify CLI

**Si tu n'as pas Netlify CLI** :

```bash
npm install -g netlify-cli
netlify login
```

**Puis déploie** :

```bash
cd /Users/laly/bouffe
netlify deploy --prod --dir=dist
```

## 🧪 Tester l'App Déployée

1. Ouvre https://resonant-alfajores-b439bf.netlify.app/
2. Tu dois voir un **écran de connexion** (c'est normal !)
3. **Crée un compte** :
   - Email : `test@example.com`
   - Mot de passe : `password123` (au moins 6 caractères)
4. **Ajoute une recette**
5. **Recharge la page** (F5) → Tu restes connecté ✅
6. **Clique le bouton déconnexion** (icône 🚪) en haut à droite
7. **Essaie de te connecter avec un autre compte**
8. Confirme que tu ne vois pas les recettes du premier compte ✅

## 🔑 Éléments de la Nouvelle Authentification

### 🎨 Écran de Login/Signup

- Email et mot de passe requis
- Basculer entre "Se connecter" et "S'inscrire"
- Messages d'erreur clairs
- Support du mode sombre

### 🔐 Sécurité

- Sessions persistantes (reste connecté après rechargement)
- Mot de passe sécurisé avec Firebase Auth
- Données isolées par utilisateur
- **À faire** : Mettre à jour les règles Firestore (voir FIREBASE_SECURITY_RULES.md)

### 👤 Profil Utilisateur

- Icône déconnexion en haut à droite
- Hover pour voir ton email
- Session persiste dans localStorage

## 📝 Prochaines Étapes

1. **[IMPORTANT]** Mets à jour les règles Firestore (voir FIREBASE_SECURITY_RULES.md)
2. Ajoute la photo des recettes
3. Exporte en PDF
4. Ajoute les infos nutritionnelles

## 🐛 Dépannage

### "Page blanche" après déploiement

- Vide le cache : Ctrl+Shift+Suppr (Windows) ou Cmd+Shift+Suppr (Mac)
- Ou ouvre en navigation privée

### "Erreur Firestore" après login

- Ça signifie que tu dois **encore mettre à jour les règles Firestore**
- Suis les étapes dans FIREBASE_SECURITY_RULES.md

### "Les anciennes recettes ont disparu"

- Elles sont dans la vieille collection Firestore `/recipes`
- La nouvelle structure est `/users/{userId}/recipes`
- Tu peux nettoyer les anciennes données dans Firestore console

---

**Tout prêt ?** Teste dès maintenant ! 🍳✨
