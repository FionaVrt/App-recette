# 🔐 Guide Pas-à-Pas: Sécuriser Firestore (5 minutes)

## ⏱️ Durée: 5 minutes maximum

---

## 📍 Étape 1: Accéder à Firebase Console

1. Ouvre https://console.firebase.google.com/ dans ton navigateur
2. **Sélectionne ton projet** "bouffe-62d9c" dans la liste

Écran attendu:

```
┌─────────────────────────────────────┐
│ Projets Firebase                    │
├─────────────────────────────────────┤
│ ☑ bouffe-62d9c  ← Clique ici       │
│   ☐ Autre projet                   │
└─────────────────────────────────────┘
```

---

## 📍 Étape 2: Aller à Firestore

1. Dans le menu de gauche, cherche **"Firestore Database"**
2. Clique dessus

Écran attendu:

```
Menu de gauche:
  Réaltime Database
  Firestore Database  ← Clique ici
  Cloud Storage
  Cloud Functions
  ...
```

---

## 📍 Étape 3: Ouvrir l'Onglet Règles

1. Tu dois voir 2-3 onglets en haut: "Données", "Index", **"Règles"**
2. **Clique sur "Règles"**

Écran attendu:

```
Onglets:
[Données] [Index] [Règles] ← Clique ici
```

---

## 📍 Étape 4: Voir les Règles Actuelles

Tu dois voir quelque chose comme:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

C'est le mode "test" - **personne ne peut accéder à rien** actuellement.

---

## 📍 Étape 5: Copier les Nouvelles Règles

Sélectionne et **COPIE** ce texte exactement:

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

---

## 📍 Étape 6: Remplacer le Contenu

1. Dans l'éditeur Firestore Rules:
   - **Sélectionne TOUT** (Ctrl+A ou Cmd+A)
   - **Supprime**
2. **Colle** les nouvelles règles (Ctrl+V ou Cmd+V)

L'éditeur devrait ressembler à ça:

```
┌─────────────────────────────────────┐
│ Règles Firestore                    │
├─────────────────────────────────────┤
│ rules_version = '2';                │
│ service cloud.firestore {           │
│   match /databases/{database}/docs  │
│     match /users/{userId} {         │
│       allow read, write: if ...     │
│       ...                           │
│     }                               │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
```

---

## 📍 Étape 7: Publier les Règles

Tu dois voir deux boutons en haut à droite:

- "Annuler"
- **"Publier"** (en bleu/orange)

**Clique sur "Publier"**

Écran attendu:

```
[Annuler] [Publier] ← Clique ici
```

---

## 📍 Étape 8: Confirmer la Publication

Une popup apparaîtra:

```
┌──────────────────────────────────┐
│ Publier les nouvelles règles?    │
├──────────────────────────────────┤
│ Les utilisateurs ne pourront     │
│ accéder qu'à leurs propres docs  │
│                                  │
│ [Annuler] [Publier]              │
│            ↑ Clique ici          │
└──────────────────────────────────┘
```

**Clique sur "Publier"** dans la popup

---

## 📍 Étape 9: Attendre la Confirmation

Tu devrais voir:

- Un spinner ⏳
- Puis un message ✅ **"Publié avec succès"** ou **"En vigueur"**

C'est terminé! 🎉

---

## ✅ Vérification Finale

Pour confirmer que ça marche:

### Test 1: Localement

```bash
npm run dev
# Crée 2 comptes différents
# Vérifie que chaque compte ne voit que SES recettes
```

### Test 2: En Production

```bash
git push origin main
# Attends que Netlify déploie
# Teste sur https://resonant-alfajores-b439bf.netlify.app/
```

### Test 3: Dans Firestore Console

1. Reste sur Firebase Console
2. Va à l'onglet **"Données"**
3. Tu dois voir la structure:

```
users/
  ├── {userId1}/
  │   ├── recipes/
  │   └── cocktails/
  └── {userId2}/
      ├── recipes/
      └── cocktails/
```

---

## 🐛 Dépannage

### "Le bouton Publier est grisé"

→ Tu as pas modifié le contenu
→ Supprime et recollé complètement

### "Erreur de syntaxe"

→ Copie/colle exactement le contenu ci-dessus
→ Pas de modification manuelle

### "Les règles montrent des erreurs rouges"

→ Colle encore une fois en supprimant complètement d'abord
→ Ctrl+A → Delete → Colle → Publier

### "Après publication, je vois des erreurs Firestore"

→ C'est normal si tu avais des données dans `/recipes`
→ Les règles ne protègent que `/users/{userId}/recipes`
→ L'app crée automatiquement les données au bon endroit

---

## 🎯 Résumé

| Étape | Action                              | Temps     |
| ----- | ----------------------------------- | --------- |
| 1-2   | Ouvrir Firebase Console + Firestore | 30s       |
| 3-4   | Ouvrir onglet Règles                | 15s       |
| 5-6   | Copier/coller les nouvelles règles  | 1 min     |
| 7-9   | Publier et confirmer                | 1 min     |
| ✅    | Fait!                               | **5 min** |

---

## 🚀 Prochaine Étape

Une fois les règles publiées:

```bash
git push origin main
```

Netlify déploie automatiquement et tes utilisateurs peuvent commencer à utiliser l'app en sécurité!

---

**C'est facile! Tu peux le faire en 5 minutes ✨**
