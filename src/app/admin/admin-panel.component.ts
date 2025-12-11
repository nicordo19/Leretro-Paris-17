import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, Photo } from '../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  photos: Photo[] = [];
  headerImages: string[] = [];
  selectedCategory: 'header' | 'photos' | 'evenements' = 'photos';
  isAuthenticated = false;
  password = '';
  adminPassword = 'LeRetro2025'; // À changer en prod !

  newPhoto: Partial<Photo> = {
    src: '',
    alt: '',
    category: 'photos',
  };

  newHeaderImage = '';
  newHeaderImageFile: File | null = null;
  newPhotoFile: File | null = null;
  previewImage: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
    this.loadData();
  }

  checkAuth(): void {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      this.isAuthenticated = true;
    }
  }

  login(): void {
    if (this.password === this.adminPassword) {
      this.isAuthenticated = true;
      sessionStorage.setItem('admin_authenticated', 'true');
      this.password = '';
    } else {
      alert('Mot de passe incorrect !');
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    sessionStorage.removeItem('admin_authenticated');
    this.router.navigate(['/']);
  }

  loadData(): void {
    this.adminService.getPhotos().subscribe((photos: Photo[]) => {
      this.photos = photos;
    });

    this.adminService.getHeaderImages().subscribe((images: string[]) => {
      this.headerImages = images;
    });
  }

  addPhoto(): void {
    if (this.newPhoto.src && this.newPhoto.alt && this.newPhoto.category) {
      this.adminService.addPhoto(this.newPhoto as Photo);
      this.newPhoto = { src: '', alt: '', category: this.selectedCategory };
      this.loadData();
    }
  }

  deletePhoto(id: string): void {
    if (confirm('Supprimer cette photo ?')) {
      this.adminService.deletePhoto(id);
      this.loadData();
    }
  }

  updatePhoto(id: string, field: string, value: any): void {
    this.adminService.updatePhoto(id, { [field]: value } as Partial<Photo>);
  }

  addHeaderImage(): void {
    if (
      this.newHeaderImage &&
      !this.headerImages.includes(this.newHeaderImage)
    ) {
      const updated = [...this.headerImages, this.newHeaderImage];
      this.adminService.updateHeaderImages(updated);
      this.newHeaderImage = '';
      this.loadData();
    }
  }

  removeHeaderImage(index: number): void {
    const updated = this.headerImages.filter((_, i) => i !== index);
    this.adminService.updateHeaderImages(updated);
    this.loadData();
  }

  getPhotosByCategory(): Photo[] {
    return this.photos.filter((p) => p.category === this.selectedCategory);
  }

  // Gestion de l'upload de fichiers
  onHeaderImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newHeaderImageFile = input.files[0];
      this.previewImage = URL.createObjectURL(input.files[0]);
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newPhotoFile = input.files[0];
      this.previewImage = URL.createObjectURL(input.files[0]);
    }
  }

  addHeaderImageFromFile(): void {
    if (this.newHeaderImageFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          const base64Image = e.target.result;
          const updated = [...this.headerImages, base64Image];
          this.adminService.updateHeaderImages(updated);
          this.newHeaderImageFile = null;
          this.previewImage = null;
          this.loadData();
        }
      };
      reader.readAsDataURL(this.newHeaderImageFile);
    }
  }

  addPhotoFromFile(): void {
    if (this.newPhotoFile && this.newPhoto.alt && this.newPhoto.category) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          const base64Image = e.target.result;
          const photo: Photo = {
            id: Date.now().toString(),
            src: base64Image,
            alt: this.newPhoto.alt || '',
            category: this.newPhoto.category as any,
          };
          this.adminService.addPhoto(photo);
          this.newPhotoFile = null;
          this.previewImage = null;
          this.newPhoto = { src: '', alt: '', category: this.selectedCategory };
          this.loadData();
        }
      };
      reader.readAsDataURL(this.newPhotoFile);
    }
  }

  cancelFileUpload(): void {
    this.newHeaderImageFile = null;
    this.newPhotoFile = null;
    this.previewImage = null;
  }
}
