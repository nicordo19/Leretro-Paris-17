# ✅ CHECKLIST PRÉ-DÉPLOIEMENT SEO

## 🔧 ÉTAPE 1 : Préparation locale

- [ ] Tous les fichiers SEO créés

  - [ ] `public/robots.txt` ✓
  - [ ] `public/sitemap.xml` ✓
  - [ ] `src/app/services/schema.service.ts` ✓

- [ ] Fichiers modifiés
  - [ ] `src/index.html` (lang, title, meta desc) ✓
  - [ ] `src/app/auth/accueil/accueil.component.html` (H1 ajouté) ✓
  - [ ] `src/app/auth/accueil/accueil.component.ts` (SchemaService) ✓
  - [ ] `firebase.json` (headers) ✓

---

## 🌍 ÉTAPE 2 : Configuration du domaine

**AVANT de déployer, vous DEVEZ :**

1. **Remplacer le domaine test** `leretro-paris.fr`

   **Option A (Automatique)** :

   ```bash
   cd /Users/nicolaspoiraud/developpeur/LeRetro/Front/front
   ./replace-domain.sh votre-domaine-reel.fr
   ```

   **Option B (Manuel)** : Utiliser Find & Replace (Ctrl+H)

   - Find: `leretro-paris.fr`
   - Replace: `votre-domaine-reel.fr`
   - In files: `src/index.html`, `public/robots.txt`, `public/sitemap.xml`, `src/app/services/schema.service.ts`

- [ ] Domaine remplacé dans tous les fichiers

2. **Vérifier les coordonnées** du restaurant

   Éditer `src/app/services/schema.service.ts` :

   - [ ] `streetAddress` : 2 Rue de Tocqueville (correcte ?)
   - [ ] `postalCode` : 75017 (correcte ?)
   - [ ] `telephone` : +33140189002 (correcte ?)
   - [ ] `latitude` : 48.8765 (correcte ?)
   - [ ] `longitude` : 2.3070 (correcte ?)
   - [ ] `openingHoursSpecification` : Horaires corrects ?

3. **Mettre à jour la description** si nécessaire

   `src/app/services/schema.service.ts` (dans la description) :

   - [ ] Description du restaurant à jour

---

## 🏗️ ÉTAPE 3 : Compilation

- [ ] Compiler le projet
  ```bash
  ng build --configuration production
  ```
  - [ ] Build réussi sans erreurs
  - [ ] Tous les fichiers SEO dans `dist/front/browser/`

---

## 🚀 ÉTAPE 4 : Déploiement sur Firebase

- [ ] Déployer
  ```bash
  firebase deploy
  ```
  - [ ] Déploiement réussi
  - [ ] URL de la Firebase affiché

---

## 🔍 ÉTAPE 5 : Vérifications post-déploiement

### 5.1 Vérifier les fichiers SEO en ligne

- [ ] `robots.txt` accessible

  ```
  https://votre-domaine.fr/robots.txt
  ```

  Devrait afficher le contenu

- [ ] `sitemap.xml` accessible

  ```
  https://votre-domaine.fr/sitemap.xml
  ```

  Devrait afficher le XML

- [ ] Page d'accueil loadée sans erreur
  ```
  https://votre-domaine.fr/
  ```

### 5.2 Valider le HTML

- [ ] Ouvrir Chrome DevTools (F12)

  - [ ] Aucune erreur rouge en console
  - [ ] Title correct dans l'onglet
  - [ ] Meta description visible dans le source

- [ ] Vérifier le source (Ctrl+U)
  ```html
  <html lang="fr">
  <title>Le Rétro...</title>
  <meta name="description" content="...">
  <script type="application/ld+json">
  ```
  - [ ] Lang="fr" ✓
  - [ ] Title optimisé ✓
  - [ ] Meta description présente ✓
  - [ ] Schéma JSON-LD présent ✓

### 5.3 Tester les schémas

- [ ] [Schema.org Validator](https://validator.schema.org/)
  - Coller le source de votre page
  - [ ] 3 schémas détectés (Restaurant, Organization, LocalBusiness)
  - [ ] Aucune erreur

---

## 🎯 ÉTAPE 6 : Google Search Console

- [ ] Créer un compte (si nécessaire)

  - URL : https://search.google.com/search-console

- [ ] Ajouter votre propriété

  - [ ] Choisir "URL prefix" → https://votre-domaine.fr
  - [ ] Vérifier la propriété (Google Site Verification déjà en place)

- [ ] Soumettre le sitemap

  - [ ] Aller dans "Sitemaps" (menu gauche)
  - [ ] Ajouter : `https://votre-domaine.fr/sitemap.xml`
  - [ ] Cliquer "Soumettre"

- [ ] Demander l'indexation manuelle

  - [ ] URL Inspection → Entrer votre URL
  - [ ] Cliquer "Request indexing"

- [ ] Vérifier les données structurées
  - [ ] "Améliorations" (menu gauche)
  - [ ] Vérifier que les schémas sont bien détectés

---

## 📱 ÉTAPE 7 : Tests de performance

- [ ] [Google PageSpeed Insights](https://pagespeed.web.dev/)

  - [ ] Entrer votre domaine
  - [ ] Mobile SEO score ≥ 80
  - [ ] Desktop SEO score ≥ 90
  - [ ] Performance ≥ 70
  - [ ] Accessibility ≥ 80

- [ ] [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

  - [ ] "Page is mobile friendly"

- [ ] Chrome Lighthouse (F12)
  - [ ] SEO score ≥ 90
  - [ ] Performance score ≥ 70
  - [ ] Best Practices score ≥ 80

---

## 🏢 ÉTAPE 8 : Google Business Profile

- [ ] Créer/Mettre à jour la fiche

  - URL : https://business.google.com
  - [ ] Nom : Le Rétro
  - [ ] Catégorie : Restaurant
  - [ ] Adresse : 2 Rue de Tocqueville, 75017 Paris
  - [ ] Téléphone : +33140189002
  - [ ] Horaires : Lun-Sam 09:00-01:00, Dim 15:00-22:00
  - [ ] Photos : Ajouter 5-10 photos de qualité
  - [ ] Description : Complète et SEO-friendly

- [ ] Vérifier la fiche
  - [ ] Apparaît dans Google Maps
  - [ ] Les horaires sont corrects

---

## 📊 ÉTAPE 9 : Monitoring (après déploiement)

### Semaine 1

- [ ] Vérifier les erreurs GSC (Coverage)

  - Cliquer "Coverage" dans GSC
  - Vérifier qu'il y a 0 erreurs

- [ ] Attendre l'indexation
  - Google devrait découvrir votre sitemap sous 2-3 jours

### Semaine 2-3

- [ ] Vérifier les impressions GSC
  - "Performance" dans GSC
  - Les pages devraient commencer à apparaître

### Semaine 4-6

- [ ] Vérifier le ranking initial
  - Taper "Le Rétro Paris 17" dans Google
  - Devrait apparaître dans les 10 premiers résultats

---

## 🎓 ÉTAPE 10 : Améliorations continues

### Contenu

- [ ] Ajouter un blog/articles

  - 1 article/semaine avec mots-clés locaux
  - "Meilleur bistrot du 17e", "Restaurant parisien authentic", etc.

- [ ] Ajouter des images
  - Photos du restaurant
  - Mettre à jour le sitemap avec les images

### Technique

- [ ] Monitorer la vitesse

  - Cron : PageSpeed Insights 1x/mois

- [ ] Mettre à jour le sitemap
  - Ajouter les articles du blog
  - Ajouter les nouvelles pages

### Local

- [ ] Ajouter des avis

  - Demander aux clients des avis Google
  - Répondre aux avis (augmente le ranking local de 30%)

- [ ] S'inscrire sur les annuaires
  - Google Maps ✓
  - Pages Jaunes
  - TripAdvisor
  - Yelp
  - Michelin Guide
  - LesfousdeBouffe

---

## 📞 Aide et Support

### Si vous avez des erreurs dans GSC :

1. **"Crawled – currently not indexed"**

   - Trop récent, attendre 2 semaines
   - Relancer l'indexation manuelle

2. **"Blocked by robots.txt"**

   - ❌ PROBLÈME : Vérifier robots.txt
   - S'assurer que "Allow: /" est présent

3. **"Discovered – currently not indexed"**

   - Google a trouvé mais n'a pas encore indexé
   - Attendre et relancer l'indexation

4. **"Excluded by noindex tag"**
   - ❌ PROBLÈME : Vérifier qu'il n'y a pas de noindex
   - Regarder dans le source HTML

### Contacts utiles :

- Google Search Central : https://developers.google.com/search
- Google Business Help : https://support.google.com/business
- Firebase Help : https://firebase.google.com/support

---

## ✨ Résumé

Vous avez optimisé votre site avec :

- ✅ Sitemap + Robots.txt
- ✅ Métadonnées SEO complètes
- ✅ H1 unique
- ✅ 3 schémas JSON-LD
- ✅ Headers de cache optimisés
- ✅ Sécurité renforcée

**Temps estimé avant apparition Google** :

- 7 jours : Indexation
- 14 jours : Premières impressions
- 30 jours : Premiers clics
- 60 jours : Ranking stable

**Bonnes chances de ranking en 1ère page** pour :

- "Le Rétro Paris" (30-45 jours)
- "Bistrot 17e" (60-90 jours)
- "Restaurant Paris 17" (90-120 jours)

---

**Créé le** : 16 décembre 2025
