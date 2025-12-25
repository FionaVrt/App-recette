# 🔄 Migration des Données - De Global à User-Isolated

## 📌 Contexte

Avant la mise à jour d'authentification, toutes les recettes étaient sauvegardées dans une collection globale :

```
/recipes/{recipeId}
/cocktails/{cocktailId}
```

Maintenant, avec l'authentification, chaque utilisateur a sa propre collection :

```
/users/{userId}/recipes/{recipeId}
/users/{userId}/cocktails/{cocktailId}
```

**Conséquence** : Les anciennes recettes ne sont plus accessibles après l'authentification.

---

## ✅ Options de Migration

### Option 1 : Supprimer les Anciennes Données (Recommandé pour Test)

Si tu testais juste l'app et que les recettes n'ont pas d'importance :

1. Ouvre [Firebase Console](https://console.firebase.google.com/)
2. Va à **Firestore Database**
3. Sélectionne la collection **`recipes`**
4. Clique sur **...** → **Supprimer la collection**
5. Fais pareil pour **`cocktails`**

**Effet** : Clean slate, aucune donnée inutile. Recommandé pour continuer le développement.

---

### Option 2 : Migrer les Recettes Existantes (Avancé)

Si tu avais de vraies recettes importantes à conserver :

#### Étape 1 : Créer une Cloud Function

1. Va dans Firebase Console → **Functions**
2. Déploie une fonction pour migrer les données :

```javascript
// functions/migrateRecipes.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.migrateRecipes = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in"
    );
  }

  const userId = context.auth.uid;
  const db = admin.firestore();

  try {
    // Copie les recettes globales vers les recettes de l'utilisateur
    const recipesSnapshot = await db.collection("recipes").get();
    const batch = db.batch();

    recipesSnapshot.docs.forEach((doc) => {
      const newRef = db
        .collection("users")
        .doc(userId)
        .collection("recipes")
        .doc();
      batch.set(newRef, doc.data());
    });

    await batch.commit();
    return { success: true, count: recipesSnapshot.size };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
```

3. Appelle la fonction depuis l'app après login

#### Étape 2 : Ajouter un Bouton de Migration

Ajoute un bouton dans AuthPage après login réussi :

```javascript
const migrateLegacyData = async () => {
  const migrate = httpsCallable(functions, "migrateRecipes");
  try {
    const result = await migrate();
    alert(`${result.data.count} recettes migrées!`);
    window.location.reload();
  } catch (error) {
    alert("Migration failed: " + error.message);
  }
};
```

**Avantage** : Garde toutes les anciennes recettes
**Inconvénient** : Code plus complexe, requiert une Cloud Function

---

## 🔍 Comment Vérifier les Données dans Firestore

### Voir les Anciennes Recettes

1. Firestore Console
2. Collections → **`recipes`**
3. Tu devrais voir les anciennes recettes globales

### Voir les Nouvelles Recettes

1. Firestore Console
2. Collections → **`users`** → Sélectionne un **userId** → **`recipes`**
3. Tu devrais voir les recettes du nouvel utilisateur

---

## 🛡️ Après la Migration - Sécurité

Une fois que tu as migré (ou supprimé) les anciennes données :

1. **Applique les Règles Firestore** (voir FIREBASE_SECURITY_RULES.md)

   ```firestore
   match /recipes/{document=**} {
     allow read, write: if false;  // Ancienne collection bloquée
   }

   match /users/{userId} {
     allow read, write: if request.auth.uid == userId;
   }
   ```

2. Les anciennes recettes ne seront plus accessibles
3. Seules les nouvelles recettes (dans `/users/{userId}/*`) seront accessibles

---

## 📊 Résumé

| Avant                                 | Après                                        |
| ------------------------------------- | -------------------------------------------- |
| Données globales                      | Données par utilisateur                      |
| Tout le monde voit tout               | Chacun voit le sien                          |
| Pas d'authentification                | Authentification Firebase                    |
| Collections: `/recipes`, `/cocktails` | Collections: `/users/{userId}/recipes`, etc. |
| Mode "test" (public)                  | Mode "sécurisé" (privé)                      |

---

## 🆘 Besoin d'Aide ?

**Si tu veux garder les anciennes recettes :**

- La Cloud Function est la meilleure option
- Contacte un développeur Firebase pour l'aide

**Si tu viens de commencer à tester :**

- Supprime simplement les anciennes collections
- Continue avec les nouvelles données !

---

**Choisis l'option qui te convient le mieux ! 🚀**
