# 🚀 Quick Start - Test de l'Authentification

## En Développement Local

### 1. Démarrer l'app

```bash
cd /Users/laly/bouffe
npm run dev
```

Attends le message :

```
➜  Local:   http://localhost:5173/
```

### 2. Ouvre http://localhost:5173 dans ton navigateur

Tu devrais voir :

```
🔐 ÉCRAN DE CONNEXION
┌─────────────────────────────────┐
│     Mes Recettes                │
│   Créer un compte / Se connecter │
├─────────────────────────────────┤
│  Email       [email input]      │
│  Mot de passe [password input]  │
│  [Se connecter] ou [S'inscrire] │
└─────────────────────────────────┘
```

### 3. Crée un compte de test

- Email: `test@example.com`
- Mot de passe: `password123`
- Clique **"S'inscrire"**

**Résultats attendus :**

- ✅ Pas d'erreur
- ✅ Écran disparaît
- ✅ Tu vois l'app avec les 3 onglets (Recettes, Cocktails, Ajouter)

### 4. Teste l'app

```
a) Ajoute une recette:
   - Clique sur l'onglet "Ajouter"
   - Entre une URL (ex: https://www.marmiton.org/...)
   - Clique "Ajouter la recette"
   - Vérifie que la recette apparaît dans "Recettes"

b) Recharge la page (F5):
   - Tu devrais RESTER CONNECTÉ ✅
   - La recette que tu as ajoutée doit toujours être là
   - C'est la persistance de session !

c) Clique le bouton 🚪 (déconnexion) en haut à droite:
   - Un tooltip doit afficher ton email
   - Clique dessus
   - Tu devrais revenir à l'écran de login
```

### 5. Teste l'isolation des données

```
a) Crée un NOUVEAU compte:
   - Clique "Pas encore de compte? S'inscrire"
   - Email: test2@example.com
   - Mot de passe: password456
   - Clique "Créer un compte"

b) Ajoute une AUTRE recette avec ce compte

c) Vérifies que tu ne vois PAS la recette du premier compte:
   - Onglet "Recettes" devrait avoir seulement la nouvelle ✅
   - C'est l'isolation par utilisateur !

d) Déconnecte-toi et reconnecte-toi au premier compte:
   - L'ancienne recette doit revenir
   - La nouvelle du 2e compte doit disparaître
   - Parfait! ✅
```

---

## En Production (Après Déploiement)

### 1. Déploie l'app sur Netlify

```bash
# Commit et push
git add .
git commit -m "✨ Add authentication"
git push origin main

# Netlify déploie automatiquement
# Attends ~2-3 minutes
```

### 2. Teste sur https://resonant-alfajores-b439bf.netlify.app/

Répète les étapes 2-5 du test local, mais sur l'URL de production.

**Bonus :** Teste sur ton téléphone aussi ! La PWA devrait être installable.

---

## ✅ Checklist de Vérification

### Authentification

- [ ] L'écran de login s'affiche au premier accès
- [ ] Signup crée un nouveau compte
- [ ] Login se connecte à un compte existant
- [ ] Les erreurs (email invalide, mot de passe faible) affichent des messages clairs
- [ ] La session persiste après rechargement (F5)
- [ ] Le bouton logout déconnecte et affiche l'email

### Données

- [ ] Les recettes ajoutées sauvegardent
- [ ] Les recettes ne disparaissent pas après rechargement
- [ ] Les deux utilisateurs ne voient pas les recettes l'un de l'autre
- [ ] Chaque utilisateur ne voit que SES cocktails
- [ ] La synchronisation est instantanée

### Performance

- [ ] L'app charge vite (<2s)
- [ ] Pas d'erreurs JavaScript (F12 console)
- [ ] Fonctionne en mode sombre et clair

---

## 🐛 Dépannage

### "Page blanche"

→ Vide le cache: Ctrl+Shift+Suppr ou Cmd+Shift+Suppr

### "Erreur Firestore" dans la console

→ C'est normal pour l'instant! Les règles Firestore ne sont pas encore appliquées
→ Suis les étapes dans FIREBASE_SECURITY_RULES.md (importante pour la sécurité)

### "Mot de passe trop faible"

→ Firebase demande au moins 6 caractères

### "Les anciennes recettes ont disparu"

→ Elles sont dans la vieille collection (`/recipes` au lieu de `/users/{userId}/recipes`)
→ C'est normal après la migration vers la nouvelle structure sécurisée

---

## 📋 Prochaines Étapes

1. **Tester localement** (cette page)
2. **Tester en production** (après git push)
3. **Appliquer les règles Firestore** (FIREBASE_SECURITY_RULES.md) ⚠️ IMPORTANT
4. **Partager avec des amis** et tester avec vraies données
5. **Ajouter les photos** (prochaine feature)

---

## 💡 Tips

- Utilise **Ctrl+Shift+K** (ou Cmd+Shift+K sur Mac) pour vider le cache facilement
- Ouvre l'**inspection Firestore** dans Firebase Console pour voir où tes données sont sauvegardées
- La **PWA est installable** - essaie sur ton téléphone!
- Mode **hors ligne** fonctionne aussi (grâce au Service Worker)

---

**Prêt pour tester ? Lance `npm run dev` et c'est parti ! 🚀**
