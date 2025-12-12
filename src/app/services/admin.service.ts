import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { FirebaseService } from './firebase.service';

/**
 * Interface représentant une photo avec ses métadonnées
 */
export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: 'header' | 'photos' | 'evenements';
}

/**
 * Service de gestion des photos et images du carousel.
 * Persiste les données via StorageService (localStorage) avec gestion d'erreurs.
 * Utilise RxJS BehaviorSubjects pour la réactivité.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private photosSubject = new BehaviorSubject<Photo[]>([]);
  public photos$ = this.photosSubject.asObservable();

  private headerImagesSubject = new BehaviorSubject<string[]>([]);
  public headerImages$ = this.headerImagesSubject.asObservable();

  private hasSeededPhotos = false;
  private hasSeededHeader = false;

  constructor(
    private storage: StorageService,
    private firebaseService: FirebaseService
  ) {
    this.loadFromStorage();
    this.subscribeToFirebase();
  }

  /**
   * Initialise les sujets avec les données du stockage local
   */
  private loadFromStorage(): void {
    try {
      const savedPhotos = this.storage.getItem<Photo[]>('photos', []);

      if (savedPhotos && savedPhotos.length > 0) {
        this.photosSubject.next(savedPhotos);
      } else {
        this.initDefaultPhotos();
      }

      const savedHeader = this.storage.getItem<string[]>('headerImages', []);

      if (savedHeader && savedHeader.length > 0) {
        this.headerImagesSubject.next(savedHeader);
      } else {
        this.initDefaultHeaderImages();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos', error);
      this.initDefaultPhotos();
      this.initDefaultHeaderImages();
    }
  }

  /**
   * Souscrit aux flux Firebase pour synchroniser les données en temps réel
   */
  private subscribeToFirebase(): void {
    this.firebaseService.getPhotos().subscribe({
      next: (photos: Photo[]) => {
        if (photos && photos.length > 0) {
          this.photosSubject.next(photos);
          this.savePhotos(photos);
        } else {
          this.seedDefaultPhotosToFirebase();
        }
      },
      error: (error) => {
        console.error('Erreur Firebase (photos), utilisation du cache local', error);
      },
    });

    this.firebaseService.getHeaderImages().subscribe({
      next: (images: string[]) => {
        if (images && images.length > 0) {
          this.headerImagesSubject.next(images);
          this.storage.setItem('headerImages', images);
        } else {
          this.seedDefaultHeaderToFirebase();
        }
      },
      error: (error) => {
        console.error('Erreur Firebase (header), utilisation du cache local', error);
      },
    });
  }

  /**
   * Initialise les images du header avec les valeurs par défaut
   */
  private initDefaultHeaderImages(): void {
    const defaultHeader = this.getDefaultHeaderImages();
    this.headerImagesSubject.next(defaultHeader);
    this.updateHeaderImages(defaultHeader);
  }

  /**
   * Initialise les photos par défaut (photos du restaurant)
   */
  private initDefaultPhotos(): void {
    const defaultPhotos = this.getDefaultPhotos();
    this.photosSubject.next(defaultPhotos);
    this.savePhotos(defaultPhotos);
  }

  private getDefaultHeaderImages(): string[] {
    return [
      'assets/imageretro/header/Retro-face2.jpg',
      'assets/imageretro/header/remi.png',
      'assets/imageretro/header/Retro-cafe.jpg',
    ];
  }

  private getDefaultPhotos(): Photo[] {
    return [
      { id: '1', src: 'assets/imageretro/Photo/Retro-server2.jpg', alt: 'Serveur', category: 'photos' },
      { id: '2', src: 'assets/imageretro/Photo/Retro-server.jpg', alt: 'Serveur 2', category: 'photos' },
      { id: '3', src: 'assets/imageretro/Photo/Retro-bar.jpg', alt: 'Bar rétro', category: 'photos' },
      { id: '4', src: 'assets/imageretro/Photo/Retro-face.jpg', alt: 'Façade du bistrot', category: 'photos' },
      { id: '5', src: 'assets/imageretro/Photo/plat2.jpeg', alt: 'Bar et cocktails', category: 'photos' },
      { id: '6', src: 'assets/imageretro/Photo/Retro-plat.jpg', alt: 'Plat signature', category: 'photos' },
      { id: '7', src: 'assets/imageretro/Photo/photo9.webp', alt: 'Salle du restaurant', category: 'photos' },
      { id: '8', src: 'assets/imageretro/Photo/plat3.jpeg', alt: "Vue d'ensemble", category: 'photos' },
      { id: '9', src: 'assets/imageretro/Photo/photo5.webp', alt: 'Dessert maison', category: 'photos' },
      { id: '10', src: 'assets/imageretro/Photo/cocktail.jpeg', alt: 'Dessert maison', category: 'photos' },
      { id: '11', src: 'assets/imageretro/Photo/chef.jpeg', alt: 'Ambiance vintage', category: 'photos' },
      { id: 'e1', src: 'assets/imageretro/evenement/evenement.jpeg', alt: 'Serveur', category: 'evenements' },
      { id: 'e2', src: 'assets/imageretro/evenement/evenement2.jpeg', alt: 'Serveur 2', category: 'evenements' },
    ];
  }

  /**
   * Récupère toutes les photos
   * @returns Observable de toutes les photos
   */
  getPhotos(): Observable<Photo[]> {
    return this.photos$;
  }

  /**
   * Récupère les photos filtrées par catégorie
   * @param category - Catégorie de photos à récupérer
   * @returns Observable des photos de la catégorie spécifiée
   */
  getPhotosByCategory(
    category: 'header' | 'photos' | 'evenements'
  ): Observable<Photo[]> {
    return new Observable((observer) => {
      this.photos$.subscribe((photos) => {
        observer.next(photos.filter((p) => p.category === category));
      });
    });
  }

  /**
   * Récupère les images du header
   * @returns Observable des images du header
   */
  getHeaderImages(): Observable<string[]> {
    return this.headerImages$;
  }

  /**
   * Ajoute une nouvelle photo
   * @param photo - La photo à ajouter
   */
  async addPhoto(photo: Photo): Promise<void> {
    try {
      const photoWithId: Photo = photo.id
        ? photo
        : { ...photo, id: Date.now().toString() };

      if (this.firebaseService.isReady()) {
        await this.firebaseService.addPhoto(photoWithId);
      } else {
        this.addPhotoLocal(photoWithId);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo', error);
      throw new Error('Impossible d\'ajouter la photo');
    }
  }

  /**
   * Ajoute une photo à partir d'un fichier en utilisant Firebase Storage
   */
  async addPhotoFromFile(
    file: File,
    alt: string,
    category: Photo['category']
  ): Promise<void> {
    try {
      const photoId = Date.now().toString();
      let photoSrc: string;

      if (this.firebaseService.isReady()) {
        photoSrc = await this.firebaseService.uploadPhotoFile(file, photoId);
      } else {
        photoSrc = await this.convertFileToBase64(file);
      }

      await this.addPhoto({
        id: photoId,
        src: photoSrc,
        alt,
        category,
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo depuis un fichier', error);
      throw new Error('Impossible d\'ajouter la photo depuis ce fichier');
    }
  }

  /**
   * Mets à jour une photo existante
   * @param id - ID de la photo à modifier
   * @param photo - Les propriétés à mettre à jour
   */
  async updatePhoto(id: string, photo: Partial<Photo>): Promise<void> {
    try {
      if (this.firebaseService.isReady()) {
        await this.firebaseService.updatePhoto(id, photo);
      } else {
        this.updatePhotoLocal(id, photo);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo', error);
      throw new Error('Impossible de mettre à jour la photo');
    }
  }

  /**
   * Supprime une photo
   * @param id - ID de la photo à supprimer
   */
  async deletePhoto(id: string): Promise<void> {
    try {
      if (this.firebaseService.isReady()) {
        await this.firebaseService.deletePhoto(id);
      } else {
        this.deletePhotoLocal(id);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo', error);
      throw new Error('Impossible de supprimer la photo');
    }
  }

  /**
   * Mets à jour les images du carousel header
   * @param images - Tableau des URLs des images
   */
  async updateHeaderImages(images: string[]): Promise<void> {
    try {
      if (this.firebaseService.isReady()) {
        await this.firebaseService.updateHeaderImages(images);
      } else {
        this.headerImagesSubject.next(images);
        this.storage.setItem('headerImages', images);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du header', error);
      throw new Error('Impossible de mettre à jour les images du header');
    }
  }

  /**
   * Sauvegarde les photos dans le stockage
   * @param photos - Tableau des photos à sauvegarder
   */
  private savePhotos(photos: Photo[]): void {
    try {
      this.storage.setItem('photos', photos);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des photos', error);
      // On laisse passer l'erreur car elle est loggée par StorageService
    }
  }

  /**
   * Ajoute une photo en local (fallback)
   */
  private addPhotoLocal(photo: Photo): void {
    const current = this.photosSubject.value;
    const updated = [...current, photo];
    this.photosSubject.next(updated);
    this.savePhotos(updated);
  }

  /**
   * Met à jour une photo en local (fallback)
   */
  private updatePhotoLocal(id: string, photo: Partial<Photo>): void {
    const current = this.photosSubject.value;
    const updated = current.map((p) => (p.id === id ? { ...p, ...photo } : p));
    this.photosSubject.next(updated);
    this.savePhotos(updated);
  }

  /**
   * Supprime une photo en local (fallback)
   */
  private deletePhotoLocal(id: string): void {
    const current = this.photosSubject.value;
    const updated = current.filter((p) => p.id !== id);
    this.photosSubject.next(updated);
    this.savePhotos(updated);
  }

  /**
   * Convertit un fichier en base64 pour le mode hors-ligne
   */
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Impossible de lire le fichier'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Alimente Firebase avec les photos par défaut si la base est vide
   */
  private seedDefaultPhotosToFirebase(): void {
    if (this.hasSeededPhotos) {
      return;
    }
    this.hasSeededPhotos = true;
    const defaults = this.getDefaultPhotos();
    this.firebaseService
      .replacePhotos(defaults)
      .catch((error) => {
        console.error('Impossible de synchroniser les photos par défaut', error);
        this.hasSeededPhotos = false;
      });
  }

  /**
   * Alimente Firebase avec les images header par défaut si nécessaire
   */
  private seedDefaultHeaderToFirebase(): void {
    if (this.hasSeededHeader) {
      return;
    }
    this.hasSeededHeader = true;
    const defaults = this.getDefaultHeaderImages();
    this.firebaseService
      .updateHeaderImages(defaults)
      .catch((error) => {
        console.error('Impossible de synchroniser le header par défaut', error);
        this.hasSeededHeader = false;
      });
  }
}
