# 🚀 Instructions de Déploiement

Le code est prêt à être déployé! Voici comment faire:

## Étape 1: Se connecter à Firebase

```bash
cd /Users/nicolaspoiraud/developpeur/LeRetro/Front/front
firebase login --no-localhost
```

Vous allez voir:

1. Un **Session ID** (ex: A2D1C)
2. Une **URL** pour vous connecter

## Étape 1 bis: Préparer la configuration Firebase

Avant de lancer l'application ou de déployer, copiez le fichier
`src/assets/env.example.js` vers `src/assets/env.js` et remplissez vos
vraies clés Firebase. Ce fichier est ignoré par git, vos identifiants
restent donc hors du dépôt.

## Étape 2: Obtenir le code d'autorisation

1. Cliquez sur l'URL fournie
2. Connectez-vous avec votre compte Google
3. Vous recevrez un **authorization code**

## Étape 3: Entrer le code

Collez le code dans le terminal quand demandé:

```
? Enter authorization code: [COLLEZ_LE_CODE_ICI]
```

## Étape 4: Déployer

Une fois authentifié, exécutez:

```bash
firebase deploy
```

## ✅ Résultat

Votre site sera déployé sur: **https://leretro-paris17.web.app**

---

## 📋 Changements déployés:

- ✅ **Lightbox clickable sur les menus** - Les images des menus peuvent être agrandies
- ✅ **Code refactorisé** - Plus lisible et maintenable
- ✅ **Gestion d'erreurs robuste** - Messages utilisateur clairs
- ✅ **Configuration centralisée** - Pas de valeurs en dur

---

## 🎯 Statut Actuel

**Dernier commit**: `feat: ajouter lightbox clickable sur les menus`

**Build**: ✅ Réussi (561KB)

**Prêt à déployer**: ✅ OUI

---

Pour toute aide, consultez: https://firebase.google.com/docs/hosting/quickstart
