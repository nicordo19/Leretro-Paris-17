import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CarouselCover } from '../../carousel-cover';
import { AdminService, Photo } from '../../services/admin.service';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'app-accueil.component',
  standalone: true,
  imports: [CommonModule, CarouselCover],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent implements OnInit {
  readonly theForkUrl =
    'https://widget.thefork.com/cb5cfd2d-88a4-438f-8cd9-6d5b551c63cd';
  showHours = false;
  sectionActive: string = '';
  menuOpen = false;
  photos: Photo[] = [];
  photosEvenements: Photo[] = [];
  headerImages: string[] = [];
  lightboxActive = false;
  lightboxImage = '';
  lightboxAlt = '';

  // Menus avec images
  menus = [
    {
      title: 'Menu du Jour',
      src: 'assets/imageretro/menu/menueJour.png',
      alt: 'Menu du jour',
    },
    {
      title: 'La Carte - Boissons',
      src: 'assets/imageretro/menu/LeRetro-Carte-Boisson.png',
      alt: 'Menu boisson',
    },
    {
      title: 'La Carte - Nos Classiques',
      src: 'assets/imageretro/menu/LeRetro-carte-NosClassiques.png',
      alt: 'Menu nos classiques',
    },
  ];

  constructor(
    private adminService: AdminService,
    private schemaService: SchemaService
  ) {}

  ngOnInit(): void {
    // Ajouter les schémas structurés pour le SEO
    this.schemaService.addRestaurantSchema();
    this.schemaService.addOrganizationSchema();
    this.schemaService.addLocalBusinessSchema();

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
    this.menuOpen = false;

    // Recharger les données quand on affiche photos/événements
    if (section === 'photos' || section === 'evenements') {
      this.loadData();
    }

    window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ouvrirLightbox(photo: Photo) {
    this.lightboxImage = photo.src;
    this.lightboxAlt = photo.alt;
    this.lightboxActive = true;
  }

  /**
   * Ouvre le lightbox avec une image de menu
   * @param menu - Objet menu contenant src et alt
   */
  ouvrirLightboxMenu(menu: any) {
    this.lightboxImage = menu.src;
    this.lightboxAlt = menu.alt;
    this.lightboxActive = true;
  }

  fermerLightbox(event?: MouseEvent) {
    event?.stopPropagation();
    this.lightboxActive = false;
  }

  @HostListener('document:keydown.escape')
  fermerLightboxAvecEchap() {
    if (this.lightboxActive) {
      this.lightboxActive = false;
    }
  }
}
