# Configuration des Règles de Sécurité Firebase

## 📋 Étapes pour sécuriser ton app

### 1. Accès à la Console Firebase

1. Ouvre [Firebase Console](https://console.firebase.google.com/)
2. Sélectionne ton projet **bouffe-62d9c**
3. Va à **Firestore Database** dans le menu de gauche
4. Clique sur l'onglet **Règles**

### 2. Règles de Sécurité Optimales

Remplace le contenu par :

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chaque utilisateur ne peut accéder qu'à ses propres données
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;

      // Recettes de l'utilisateur
      match /recipes/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }

      // Cocktails de l'utilisateur
      match /cocktails/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

### 3. Publier les Règles

1. Clique sur le bouton **Publier** en haut à droite
2. Confirme la publication
3. Attends que le statut change à ✅ "En vigueur"

## 🔒 Ce que ça signifie

✅ **Seuls les utilisateurs authentifiés** peuvent accéder à Firestore
✅ **Chaque utilisateur ne voit que SES propres données**
✅ **Personne d'autre ne peut lire ou modifier** les recettes et cocktails d'un autre
✅ **Protection complète** contre l'accès non autorisé

## 🧪 Tester les Règles

Avant de publier, tu peux tester avec le bouton "Simulateur de règles" :

1. Clique sur **Règles** → **Tester les règles**
2. Sélectionne l'opération : `read`, `write`, `create`, `update`, `delete`
3. Entre le chemin exemple : `/users/test-user-id/recipes/recipe-123`
4. Rentre l'UID de test dans **user.uid**
5. Clique **Tester**

## ⚠️ Passage de Mode Test à Production

**AVANT** de publier tes règles :

- Tous les utilisateurs existants auront perdu accès aux anciennes données
- C'est normal car l'ancienne structure était `/recipes` et `/cocktails` globales
- Aucune donnée n'est supprimée, elle est juste dans l'ancienne structure

**Solutions si tu veux garder les anciennes données** :

1. Utilise Firebase Cloud Functions pour migrer les données vers la nouvelle structure
2. Ou supprime simplement les anciennes collections (recommandé si c'est un test)

## 📊 Structure Firestore Après Sécurisation

```
Firestore Database
└── users/
    ├── user-id-1/
    │   ├── recipes/
    │   │   ├── recipe-123
    │   │   ├── recipe-456
    │   │   └── ...
    │   └── cocktails/
    │       ├── cocktail-789
    │       └── ...
    └── user-id-2/
        ├── recipes/
        └── cocktails/
```

## ✅ Vérification Finale

Après avoir appliqué les règles :

1. Ouvre l'app sur https://resonant-alfajores-b439bf.netlify.app/
2. **Crée un compte** avec email et mot de passe
3. **Ajoute une recette**
4. Vérifie dans Firestore que les données sont sous `users/{YOUR_UID}/recipes`
5. **Essaie de se connecter avec un autre compte**
6. Confirme que tu ne vois pas les recettes du premier compte ✅

## 🆘 Besoin d'aide ?

Si tu as des erreurs Firestore après activation des règles :

- Vérifie que tu es connecté (le bouton de déconnexion affiche ton email)
- Réinitialise la page (Ctrl+Shift+R sur Windows/Linux ou Cmd+Shift+R sur Mac)
- Vérifie que l'UID dans les règles correspond à auth.currentUser.uid
