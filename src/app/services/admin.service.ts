import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: 'header' | 'photos' | 'evenements';
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private photosSubject = new BehaviorSubject<Photo[]>([]);
  public photos$ = this.photosSubject.asObservable();

  private headerImagesSubject = new BehaviorSubject<string[]>([]);
  public headerImages$ = this.headerImagesSubject.asObservable();

  constructor() {
    this.loadPhotos();
  }

  private loadPhotos(): void {
    // Récupérer depuis localStorage ou initialiser avec les valeurs par défaut
    const savedPhotos = localStorage.getItem('retro_photos');
    const savedHeader = localStorage.getItem('retro_header');

    if (savedPhotos) {
      this.photosSubject.next(JSON.parse(savedPhotos));
    } else {
      this.initDefaultPhotos();
    }

    if (savedHeader) {
      this.headerImagesSubject.next(JSON.parse(savedHeader));
    } else {
      this.headerImagesSubject.next([
        'assets/imageretro/header/Retro-face2.jpg',
        'assets/imageretro/header/remi.png',
        'assets/imageretro/header/Retro-cafe.jpg',
      ]);
    }
  }

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

  getPhotos(): Observable<Photo[]> {
    return this.photos$;
  }

  getPhotosByCategory(
    category: 'header' | 'photos' | 'evenements'
  ): Observable<Photo[]> {
    return new Observable((observer) => {
      this.photos$.subscribe((photos) => {
        observer.next(photos.filter((p) => p.category === category));
      });
    });
  }

  getHeaderImages(): Observable<string[]> {
    return this.headerImages$;
  }

  addPhoto(photo: Photo): void {
    const current = this.photosSubject.value;
    const updated = [...current, { ...photo, id: Date.now().toString() }];
    this.photosSubject.next(updated);
    this.savePhotos(updated);
  }

  updatePhoto(id: string, photo: Partial<Photo>): void {
    const current = this.photosSubject.value;
    const updated = current.map((p) => (p.id === id ? { ...p, ...photo } : p));
    this.photosSubject.next(updated);
    this.savePhotos(updated);
  }

  deletePhoto(id: string): void {
    const current = this.photosSubject.value;
    const updated = current.filter((p) => p.id !== id);
    this.photosSubject.next(updated);
    this.savePhotos(updated);
  }

  updateHeaderImages(images: string[]): void {
    this.headerImagesSubject.next(images);
    localStorage.setItem('retro_header', JSON.stringify(images));
  }

  private savePhotos(photos: Photo[]): void {
    localStorage.setItem('retro_photos', JSON.stringify(photos));
  }
}
