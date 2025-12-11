# Guide de Développement - Le Rétro Restaurant

Ce document fournit des informations sur l'architecture, la structure du code et les bonnes pratiques pour maintenir le site web du restaurant Le Rétro.

## Table des matières

1. [Architecture Générale](#architecture-générale)
2. [Structure des Fichiers](#structure-des-fichiers)
3. [Services](#services)
4. [Composants](#composants)
5. [Gestion du Stockage](#gestion-du-stockage)
6. [Configuration d'Environnement](#configuration-denvironnement)
7. [Déploiement](#déploiement)
8. [Bonnes Pratiques](#bonnes-pratiques)

---

## Architecture Générale

### Pile Technologique

- **Framework**: Angular 19+ (Standalone Components)
- **Langage**: TypeScript 5+
- **Hosting**: Firebase Hosting
- **Styles**: CSS Grid + Flexbox
- **Design**: Responsive, Mobile-First

### Patterns Architecturaux

#### Service-Oriented Architecture
- Logique métier centralisée dans les services
- Réutilisabilité des services entre composants
- Injection de dépendances pour découplage

#### Reactive Programming
- RxJS Observables et BehaviorSubjects
- Patterns d'abonnement avec gestion d'erreurs
- Flux de données unidirectionnel

#### State Management
- RxJS BehaviorSubject pour l'état réactif
- Observables pour les flux de données asynchrones
- localStorage pour la persistance

---

## Structure des Fichiers

```
src/
├── app/
│   ├── admin/                    # Composant d'administration
│   │   ├── admin-panel.component.ts
│   │   ├── admin-panel.component.html
│   │   └── admin-panel.component.css
│   ├── auth/                     # Composants d'authentification
│   │   └── accueil/
│   │       └── accueil.component.ts
│   ├── services/                 # Services partagés
│   │   ├── admin.service.ts      # Gestion des photos
│   │   └── storage.service.ts    # Gestion du localStorage
│   ├── app.routes.ts             # Routes de l'application
│   ├── app.config.ts             # Configuration Angular
│   └── app.component.ts          # Composant racine
├── assets/                       # Images et ressources statiques
│   └── imageretro/
│       ├── Photo/               # Photos du restaurant
│       ├── evenement/           # Photos d'événements
│       └── header/              # Images du carousel
├── environments/                # Configurations d'environnement
│   ├── environment.ts           # Développement
│   └── environment.prod.ts      # Production
├── index.html                   # Point d'entrée HTML
├── main.ts                      # Point d'entrée de l'application
└── styles.css                   # Styles globaux
```

---

## Services

### AdminService
**Fichier**: `src/app/services/admin.service.ts`

**Responsabilités**:
- Gestion des photos (CRUD)
- Gestion du carousel du header
- Persistance dans localStorage via StorageService
- Émission d'observables pour réactivité

**Interfaces Principales**:
```typescript
interface Photo {
  id: string;
  src: string;        // URL ou Base64
  alt: string;        // Description
  category: 'header' | 'photos' | 'evenements';
}
```

**Méthodes Principales**:
```typescript
// Récupération
getPhotos(): Observable<Photo[]>
getPhotosByCategory(category): Observable<Photo[]>
getHeaderImages(): Observable<string[]>

// Modification
addPhoto(photo: Photo): void
updatePhoto(id: string, photo: Partial<Photo>): void
deletePhoto(id: string): void
updateHeaderImages(images: string[]): void
```

**Données Persistées**:
- `retro_photos`: Tableau de toutes les photos (JSON)
- `retro_header`: Tableau des images du carousel (JSON)

---

### StorageService
**Fichier**: `src/app/services/storage.service.ts`

**Responsabilités**:
- Abstraction générique du localStorage
- Sérialisation/Désérialisation JSON automatique
- Gestion d'erreurs centralisée
- Interface type-safe

**Méthodes**:
```typescript
// Écriture
setItem<T>(key: keyof StorageKeys, value: T): void

// Lecture
getItem<T>(key: keyof StorageKeys, defaultValue: T): T

// Utilitaires
removeItem(key: keyof StorageKeys): void
hasItem(key: keyof StorageKeys): boolean
clear(): void
getStorageKeys(): string[]
```

**Avantages**:
- Point unique de gestion du localStorage
- Erreurs loggées automatiquement
- Facilite les tests et les migrations futures
- Type-safe avec les clés d'environnement

---

## Composants

### AdminPanelComponent
**Fichier**: `src/app/admin/admin-panel.component.ts`

**Responsabilités**:
- Interface utilisateur pour l'administration
- Authentification via mot de passe
- Gestion des uploads de fichiers
- Feedback utilisateur (messages d'erreur/succès)

**Propriétés d'État**:
```typescript
// Authentification
isAuthenticated: boolean;
password: string;

// Données
photos: Photo[];
headerImages: string[];
selectedCategory: 'header' | 'photos' | 'evenements';

// Upload
newPhotoFile: File | null;
newHeaderImageFile: File | null;
previewImage: string | null;

// Feedback
successMessage: string;
errorMessage: string;
isLoading: boolean;
```

**Flux d'Upload de Fichiers**:
1. Utilisateur sélectionne un fichier (`onPhotoSelected()`)
2. Validation du fichier (`validateFile()`)
3. Affichage de l'aperçu avec `URL.createObjectURL()`
4. FileReader encode en Base64 (`readAsDataURL()`)
5. AdminService sauvegarde la photo
6. Nettoyage et message de feedback

**Gestion des Erreurs**:
- Try-catch dans chaque action utilisateur
- Validation des fichiers (taille, type MIME)
- Messages d'erreur affichés à l'utilisateur
- Timeout automatique des messages (3 secondes)

---

### AccueilComponent
**Fichier**: `src/app/auth/accueil/accueil.component.ts`

**Responsabilités**:
- Affichage de la page d'accueil
- Chargement des photos depuis AdminService
- Carousel du header
- Sections d'informations

**Données Chargées**:
```typescript
photos: Photo[];            // Toutes les photos
photosEvenements: Photo[];  // Photos d'événements
headerImages: string[];     // Images du carousel
```

**Lifecycle**:
```typescript
ngOnInit() {
  // Charger les données du service
  this.adminService.getPhotos().subscribe(...)
  this.adminService.getPhotosByCategory('evenements').subscribe(...)
  this.adminService.getHeaderImages().subscribe(...)
}
```

---

## Gestion du Stockage

### Stratégie de Stockage

**localStorage** est utilisé pour :
- Persistance des photos (Base64 encoded)
- Images du carousel
- État d'authentification

**Avantages**:
- ✅ Pas de backend requis
- ✅ Persiste entre les sessions
- ✅ Disponible immédiatement au chargement

**Limitations**:
- ⚠️ Limite: ~5-10MB par domaine
- ⚠️ Synchrone (peut bloquer le UI)
- ⚠️ Pas de chiffrement (données publiques)

### Clés de Stockage

Définies dans `environment.ts`:
```typescript
storage: {
  photos: 'retro_photos',
  headerImages: 'retro_header',
  adminAuth: 'admin_authenticated',
}
```

### Format des Données

**Photos**:
```json
[
  {
    "id": "1",
    "src": "data:image/jpeg;base64,...",
    "alt": "Description",
    "category": "photos"
  }
]
```

**Images Header**:
```json
[
  "data:image/jpeg;base64,...",
  "assets/imageretro/header/image.jpg"
]
```

**Authentification**:
```
admin_authenticated = "true" | "false"
```

---

## Configuration d'Environnement

### Fichiers de Configuration

#### `environment.ts` (Développement)
```typescript
export const environment = {
  production: false,
  
  admin: {
    password: 'LeRetro2025',
  },
  
  storage: {
    photos: 'retro_photos',
    headerImages: 'retro_header',
    adminAuth: 'admin_authenticated',
  },
  
  api: {
    baseUrl: 'http://localhost:4200',
  },
  
  upload: {
    maxFileSize: 5242880,           // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
    maxFilesPerUpload: 1,
  },
};
```

#### `environment.prod.ts` (Production)
- Même structure que dev
- `production: true`
- `baseUrl`: URL de production

### Utilisation
```typescript
import { environment } from '../../environments/environment';

// Accès au mot de passe
const password = environment.admin.password;

// Accès aux clés de stockage
const key = environment.storage.photos;

// Accès aux limites d'upload
const maxSize = environment.upload.maxFileSize;
```

### Bonnes Pratiques
- ✅ Toujours utiliser `environment.CLEF` au lieu de hardcoder
- ✅ Centraliser les constantes dans environment.ts
- ✅ Ne pas committer les secrets (mot de passe de prod)
- ✅ Utiliser des variables d'environnement pour la production

---

## Déploiement

### Build Local
```bash
# Installation des dépendances
npm install

# Développement avec hot reload
npm start

# Build production
ng build --configuration production

# Résultat: dist/front/browser/
```

### Déploiement Firebase
```bash
# Configuration Firebase (une fois)
firebase init hosting

# Deploy
firebase deploy

# Résultat: https://leretro-paris17.web.app/
```

### Configuration Firebase (`firebase.json`)
```json
{
  "hosting": {
    "public": "dist/front/browser",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Important**: La configuration `rewrites` est cruciale pour le SPA routing. Elle redirige toutes les routes vers `index.html` pour que Angular prenne en charge le routage côté client.

### Checklist de Déploiement
- [ ] Tester localement: `npm start`
- [ ] Build production: `ng build --configuration production`
- [ ] Vérifier aucune erreur de compilation
- [ ] Vérifier les messages de console
- [ ] Tester l'admin panel: `/admin`
- [ ] Tester les routes: `/`
- [ ] Tester l'upload de photos
- [ ] Déployer: `firebase deploy`
- [ ] Vérifier sur https://leretro-paris17.web.app/

---

## Bonnes Pratiques

### Code

#### 1. JSDoc et Commentaires
```typescript
/**
 * Ajoute une nouvelle photo
 * @param photo - La photo à ajouter
 * @throws Error si la sauvegarde échoue
 */
addPhoto(photo: Photo): void {
  try {
    // Logic...
  } catch (error) {
    console.error('Erreur lors de l\'ajout', error);
    throw new Error('Impossible d\'ajouter la photo');
  }
}
```

#### 2. Gestion des Erreurs
```typescript
// ✅ BON
try {
  this.service.addPhoto(photo);
  this.showSuccess('Photo ajoutée');
} catch (error) {
  console.error('Erreur:', error);
  this.showError('Erreur lors de l\'ajout');
}

// ❌ MAUVAIS
this.service.addPhoto(photo); // Peut échouer silencieusement
```

#### 3. Observables et Abonnements
```typescript
// ✅ BON - Gestion d'erreurs
this.service.getPhotos().subscribe({
  next: (photos) => { this.photos = photos; },
  error: (err) => { console.error('Erreur:', err); },
  complete: () => { console.log('Chargement terminé'); }
});

// ❌ MAUVAIS - Pas de gestion d'erreurs
this.service.getPhotos().subscribe(photos => {
  this.photos = photos;
});
```

#### 4. Nommage
- Services: `NomService` (ex: `AdminService`)
- Composants: `NomComponent` (ex: `AdminPanelComponent`)
- Interfaces: `INom` ou simplement `Nom` (ex: `Photo`)
- Variables privées: `_privé` ou `private private`
- Observables: `nom$` (ex: `photos$`)

#### 5. Types Stricts
```typescript
// ✅ BON
private updatePhoto(id: string, photo: Partial<Photo>): void

// ❌ MAUVAIS
private updatePhoto(id: any, photo: any): void
```

### Maintenance

#### 1. Lire le Code
- Commencez par `app.routes.ts` pour comprendre la navigation
- Consultez `environment.ts` pour les configurations
- Vérifiez `AdminService` pour la logique métier

#### 2. Ajouter des Fonctionnalités
1. Ajouter la méthode dans `AdminService`
2. Ajouter la JSDoc appropriée
3. Ajouter la gestion d'erreurs
4. Utiliser la méthode dans le composant
5. Ajouter le feedback utilisateur
6. Tester localement
7. Déployer

#### 3. Corriger des Bugs
1. Reproduire le bug localement
2. Ajouter des logs pour déboguer
3. Localiser la cause
4. Corriger et ajouter des tests
5. Vérifier les effets secondaires
6. Déployer

### Performance

#### 1. Optimisation du Bundle
```bash
ng build --configuration production

# Résultat attendu: < 1MB total
# Files: index.html, main.xxx.js, styles.css, etc.
```

#### 2. Images
- Utiliser WebP quand possible
- Compresser les JPEG/PNG
- Redimensionner pour réduire la taille
- Limiter à 5MB par fichier (voir `environment.upload.maxFileSize`)

#### 3. Observables
- Se désabonner des observables de longue durée
- Utiliser `unsubscribe()` dans `ngOnDestroy`
- Préférer `async` pipe dans les templates

---

## Dépannage

### Le site ne se charge pas
1. Vérifier `npm start` s'exécute sans erreur
2. Vérifier que le port 4200 est disponible
3. Vérifier la console du navigateur pour les erreurs
4. Vérifier que tous les imports sont corrects

### L'admin panel ne charge pas les photos
1. Vérifier que `AdminService` est injecté
2. Vérifier que `StorageService` est injecté dans `AdminService`
3. Vérifier que les clés de `environment.storage` sont correctes
4. Ouvrir la console et chercher les erreurs de localStorage

### L'upload de fichiers ne fonctionne pas
1. Vérifier le format du fichier (JPEG, PNG, WebP)
2. Vérifier la taille du fichier (< 5MB)
3. Vérifier que le navigateur supporte FileReader API
4. Vérifier la console pour les erreurs

### Les photos ne s'affichent pas après déploiement
1. Vérifier que `firebase.json` a la bonne configuration `rewrites`
2. Vérifier que le build a généré les fichiers correctement
3. Vérifier que `dist/front/browser/` contient les fichiers
4. Faire un `firebase deploy`

---

## Ressources Utiles

- [Documentation Angular](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Dernière mise à jour**: 2024
**Mainteneur**: Équipe Le Rétro
