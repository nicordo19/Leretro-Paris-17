import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

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

  constructor(private storage: StorageService) {
    this.loadPhotos();
  }

  /**
   * Charge les photos depuis le stockage ou initialise avec les valeurs par défaut
   */
  private loadPhotos(): void {
    try {
      // Charger les photos
      const savedPhotos = this.storage.getItem<Photo[]>('photos', []);

      if (savedPhotos && savedPhotos.length > 0) {
        this.photosSubject.next(savedPhotos);
      } else {
        this.initDefaultPhotos();
      }

      // Charger les images du header
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
   * Initialise les images du header avec les valeurs par défaut
   */
  private initDefaultHeaderImages(): void {
    const defaultHeader = [
      'assets/imageretro/header/Retro-face2.jpg',
      'assets/imageretro/header/remi.png',
      'assets/imageretro/header/Retro-cafe.jpg',
    ];
    this.headerImagesSubject.next(defaultHeader);
    this.updateHeaderImages(defaultHeader);
  }

  /**
   * Initialise les photos par défaut (photos du restaurant)
   */
  private initDefaultPhotos(): void {
    const defaultPhotos: Photo[] = [
      {
        id: '1',
        src: 'assets/imageretro/Photo/Retro-server2.jpg',
        alt: 'Serveur',
        category: 'photos',
      },
      {
        id: '2',
        src: 'assets/imageretro/Photo/Retro-server.jpg',
        alt: 'Serveur 2',
        category: 'photos',
      },
      {
        id: '3',
        src: 'assets/imageretro/Photo/Retro-bar.jpg',
        alt: 'Bar rétro',
        category: 'photos',
      },
      {
        id: '4',
        src: 'assets/imageretro/Photo/Retro-face.jpg',
        alt: 'Façade du bistrot',
        category: 'photos',
      },
      {
        id: '5',
        src: 'assets/imageretro/Photo/plat2.jpeg',
        alt: 'Bar et cocktails',
        category: 'photos',
      },
      {
        id: '6',
        src: 'assets/imageretro/Photo/Retro-plat.jpg',
        alt: 'Plat signature',
        category: 'photos',
      },
      {
        id: '7',
        src: 'assets/imageretro/Photo/photo9.webp',
        alt: 'Salle du restaurant',
        category: 'photos',
      },
      {
        id: '8',
        src: 'assets/imageretro/Photo/plat3.jpeg',
        alt: "Vue d'ensemble",
        category: 'photos',
      },
      {
        id: '9',
        src: 'assets/imageretro/Photo/photo5.webp',
        alt: 'Dessert maison',
        category: 'photos',
      },
      {
        id: '10',
        src: 'assets/imageretro/Photo/cocktail.jpeg',
        alt: 'Dessert maison',
        category: 'photos',
      },
      {
        id: '11',
        src: 'assets/imageretro/Photo/chef.jpeg',
        alt: 'Ambiance vintage',
        category: 'photos',
      },
      {
        id: 'e1',
        src: 'assets/imageretro/evenement/evenement.jpeg',
        alt: 'Serveur',
        category: 'evenements',
      },
      {
        id: 'e2',
        src: 'assets/imageretro/evenement/evenement2.jpeg',
        alt: 'Serveur 2',
        category: 'evenements',
      },
    ];
    this.photosSubject.next(defaultPhotos);
    this.savePhotos(defaultPhotos);
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
  addPhoto(photo: Photo): void {
    try {
      const current = this.photosSubject.value;
      const updated = [...current, { ...photo, id: Date.now().toString() }];
      this.photosSubject.next(updated);
      this.savePhotos(updated);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo", error);
      throw new Error("Impossible d'ajouter la photo");
    }
  }

  /**
   * Mets à jour une photo existante
   * @param id - ID de la photo à modifier
   * @param photo - Les propriétés à mettre à jour
   */
  updatePhoto(id: string, photo: Partial<Photo>): void {
    try {
      const current = this.photosSubject.value;
      const updated = current.map((p) =>
        p.id === id ? { ...p, ...photo } : p
      );
      this.photosSubject.next(updated);
      this.savePhotos(updated);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo', error);
      throw new Error('Impossible de mettre à jour la photo');
    }
  }

  /**
   * Supprime une photo
   * @param id - ID de la photo à supprimer
   */
  deletePhoto(id: string): void {
    try {
      const current = this.photosSubject.value;
      const updated = current.filter((p) => p.id !== id);
      this.photosSubject.next(updated);
      this.savePhotos(updated);
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo', error);
      throw new Error('Impossible de supprimer la photo');
    }
  }

  /**
   * Mets à jour les images du carousel header
   * @param images - Tableau des URLs des images
   */
  updateHeaderImages(images: string[]): void {
    try {
      this.headerImagesSubject.next(images);
      this.storage.setItem('headerImages', images);
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
}
