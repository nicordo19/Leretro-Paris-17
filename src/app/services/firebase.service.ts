import { Injectable, Optional } from '@angular/core';
import {
  Database,
  ref as dbRef,
  onValue,
  remove,
  set,
  update,
} from '@angular/fire/database';
import {
  deleteObject,
  getDownloadURL,
  Storage,
  ref as storageRef,
  uploadBytes,
} from '@angular/fire/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Photo } from './admin.service';

/**
 * Service pour gérer les photos via Firebase Realtime Database
 * Synchronise les données en temps réel entre tous les appareils
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private photosSubject = new BehaviorSubject<Photo[]>([]);
  public photos$ = this.photosSubject.asObservable();

  private headerImagesSubject = new BehaviorSubject<string[]>([]);
  public headerImages$ = this.headerImagesSubject.asObservable();

  private isInitialized = false;
  private firebaseDisabled = false;

  constructor(
    @Optional() private db: Database | null,
    @Optional() private storage: Storage | null
  ) {
    // Charger immédiatement les données locales pour éviter un écran vide
    this.loadPhotosFromLocalStorage();
    this.loadHeaderImagesFromLocalStorage();

    if (!this.db || !this.storage) {
      this.firebaseDisabled = true;
      console.warn(
        'Firebase non configuré. Utilisation du mode local (localStorage).'
      );
      return;
    }

    this.initializeRealtimeListeners();
  }

  /**
   * Initialise les listeners temps réel Firebase
   */
  private initializeRealtimeListeners(): void {
    if (this.firebaseDisabled || !this.db) {
      return;
    }
    try {
      this.listenToPhotos();
      this.listenToHeaderImages();
    } catch (error) {
      console.error("Erreur lors de l'initialisation Firebase", error);
    }
  }

  /**
   * Ecoute les changements sur les photos en temps réel
   */
  private listenToPhotos(): void {
    if (!this.db) {
      return;
    }
    const photosRef = dbRef(this.db, 'photos');
    onValue(
      photosRef,
      (snapshot) => {
        this.markInitialized();
        const photos: Photo[] = snapshot.exists()
          ? (Object.values(snapshot.val() || {}) as Photo[])
          : [];
        this.photosSubject.next(photos);
        localStorage.setItem('retro_photos', JSON.stringify(photos));
      },
      (error) => {
        console.error("Erreur lors de l'écoute des photos Firebase", error);
        this.loadPhotosFromLocalStorage();
      }
    );
  }

  /**
   * Ecoute les changements sur les images du header en temps réel
   */
  private listenToHeaderImages(): void {
    if (!this.db) {
      return;
    }
    const headerRef = dbRef(this.db, 'headerImages');
    onValue(
      headerRef,
      (snapshot) => {
        this.markInitialized();
        const images: string[] = snapshot.exists()
          ? Object.values(snapshot.val() || {})
          : [];
        this.headerImagesSubject.next(images);
        localStorage.setItem('retro_header', JSON.stringify(images));
      },
      (error) => {
        console.error(
          "Erreur lors de l'écoute des images header Firebase",
          error
        );
        this.loadHeaderImagesFromLocalStorage();
      }
    );
  }

  /**
   * Marque le service comme prêt après le premier retour Firebase
   */
  private markInitialized(): void {
    if (!this.isInitialized) {
      this.isInitialized = true;
    }
  }

  /**
   * Charge les photos depuis localStorage (fallback)
   */
  private loadPhotosFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('retro_photos');
      if (saved) {
        const photos: Photo[] = JSON.parse(saved);
        this.photosSubject.next(photos);
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage', error);
    }
  }

  /**
   * Charge les images header depuis localStorage (fallback)
   */
  private loadHeaderImagesFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('retro_header');
      if (saved) {
        const images: string[] = JSON.parse(saved);
        this.headerImagesSubject.next(images);
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage', error);
    }
  }

  /**
   * Récupère toutes les photos
   */
  getPhotos(): Observable<Photo[]> {
    return this.photos$;
  }

  /**
   * Ajoute une nouvelle photo
   */
  async addPhoto(photo: Photo): Promise<void> {
    try {
      if (!this.db) {
        throw new Error('Firebase non configuré');
      }
      const photoId = photo.id;
      const photosRef = dbRef(this.db, `photos/${photoId}`);
      await set(photosRef, photo);

      // Mettre à jour le sujet local - ajouter EN DÉBUT (pas en fin)
      const current = this.photosSubject.value;
      this.photosSubject.next([photo, ...current]);

      // Sauvegarder aussi dans localStorage comme backup
      const all = this.photosSubject.value;
      localStorage.setItem('retro_photos', JSON.stringify(all));
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo", error);
      throw new Error("Impossible d'ajouter la photo");
    }
  }

  /**
   * Met à jour une photo existante
   */
  async updatePhoto(id: string, photo: Partial<Photo>): Promise<void> {
    try {
      if (!this.db) {
        throw new Error('Firebase non configuré');
      }
      const photoRef = dbRef(this.db, `photos/${id}`);
      await update(photoRef, photo as any);

      // Mettre à jour le sujet local
      const current = this.photosSubject.value;
      const updated = current.map((p) =>
        p.id === id ? { ...p, ...photo } : p
      );
      this.photosSubject.next(updated);

      // Sauvegarder dans localStorage
      localStorage.setItem('retro_photos', JSON.stringify(updated));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo', error);
      throw new Error('Impossible de mettre à jour la photo');
    }
  }

  /**
   * Supprime une photo
   */
  async deletePhoto(id: string): Promise<void> {
    try {
      if (!this.db) {
        throw new Error('Firebase non configuré');
      }
      const photoRef = dbRef(this.db, `photos/${id}`);
      await remove(photoRef);
      await this.deletePhotoFile(id);

      // Mettre à jour le sujet local
      const current = this.photosSubject.value;
      const updated = current.filter((p) => p.id !== id);
      this.photosSubject.next(updated);

      // Sauvegarder dans localStorage
      localStorage.setItem('retro_photos', JSON.stringify(updated));
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo', error);
      throw new Error('Impossible de supprimer la photo');
    }
  }

  /**
   * Récupère les images du header
   */
  getHeaderImages(): Observable<string[]> {
    return this.headerImages$;
  }

  /**
   * Met à jour les images du header
   */
  async updateHeaderImages(images: string[]): Promise<void> {
    try {
      if (!this.db) {
        throw new Error('Firebase non configuré');
      }
      const headerRef = dbRef(this.db, 'headerImages');
      await set(headerRef, images);

      // Mettre à jour le sujet local
      this.headerImagesSubject.next(images);

      // Sauvegarder dans localStorage
      localStorage.setItem('retro_header', JSON.stringify(images));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du header', error);
      throw new Error('Impossible de mettre à jour les images du header');
    }
  }

  /**
   * Remplace toutes les photos dans Firebase
   */
  async replacePhotos(photos: Photo[]): Promise<void> {
    if (!this.db) {
      throw new Error('Firebase non configuré');
    }
    const photosRecord = photos.reduce(
      (acc, photo) => ({ ...acc, [photo.id]: photo }),
      {} as Record<string, Photo>
    );
    const photosRef = dbRef(this.db, 'photos');
    await set(photosRef, photosRecord);
  }

  /**
   * Vérifie si Firebase est initialisé
   */
  isReady(): boolean {
    return this.isInitialized && !this.firebaseDisabled;
  }

  /**
   * Upload un fichier de photo dans Firebase Storage et retourne l'URL
   */
  async uploadPhotoFile(file: File, photoId: string): Promise<string> {
    if (!this.storage) {
      throw new Error('Firebase Storage non configuré');
    }
    const path = `photos/${photoId}`;
    const photoStorageRef = storageRef(this.storage, path);
    await uploadBytes(photoStorageRef, file);
    return await getDownloadURL(photoStorageRef);
  }

  /**
   * Supprime la photo du stockage lorsqu'on retire son entrée
   */
  async deletePhotoFile(photoId: string): Promise<void> {
    try {
      if (!this.storage) {
        return;
      }
      const photoStorageRef = storageRef(this.storage, `photos/${photoId}`);
      await deleteObject(photoStorageRef);
    } catch (error) {
      console.warn('Impossible de supprimer le fichier Storage', error);
    }
  }
}
