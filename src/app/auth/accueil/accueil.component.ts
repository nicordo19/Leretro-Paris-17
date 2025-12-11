import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselCover } from '../../carousel-cover';
import { AdminService, Photo } from '../../services/admin.service';

@Component({
  selector: 'app-accueil.component',
  standalone: true,
  imports: [CommonModule, CarouselCover],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent implements OnInit {
  showHours = false;
  sectionActive: string = '';
  photos: Photo[] = [];
  photosEvenements: Photo[] = [];
  headerImages: string[] = [];
  lightboxActive = false;
  lightboxImage = '';
  lightboxAlt = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();

    const hour = new Date().getHours();
    const day = new Date().getDay();

    if (
      (day === 0 && hour >= 9 && hour <= 20) ||
      (day >= 1 && day <= 6 && hour >= 9 && hour <= 23)
    ) {
      this.showHours = true;
    }
  }

  loadData(): void {
    // Charger les images du header
    this.adminService.getHeaderImages().subscribe((images: string[]) => {
      this.headerImages = images;
    });

    // Charger toutes les photos
    this.adminService.getPhotos().subscribe((photos: Photo[]) => {
      this.photos = photos.filter((p) => p.category === 'photos');
      this.photosEvenements = photos.filter((p) => p.category === 'evenements');
    });
  }

  toggleHours() {
    this.showHours = !this.showHours;
  }

  afficherSection(section: string) {
    this.sectionActive = section;
  }

  ouvrirLightbox(photo: Photo) {
    this.lightboxImage = photo.src;
    this.lightboxAlt = photo.alt;
    this.lightboxActive = true;
  }

  fermerLightbox(event?: MouseEvent) {
    event?.stopPropagation();
    this.lightboxActive = false;
  }
}
