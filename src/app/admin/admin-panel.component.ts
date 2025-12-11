import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, Photo } from '../services/admin.service';
import { environment } from '../../environments/environment';

/**
 * Composant d'administration pour la gestion des photos et du carousel
 * Permet aux utilisateurs non-techniques de gérer le contenu du site
 */
@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  // Données de photos et carousel
  photos: Photo[] = [];
  headerImages: string[] = [];
  selectedCategory: 'header' | 'photos' | 'evenements' = 'photos';

  // État de l'authentification
  isAuthenticated = false;
  password = '';

  // Données temporaires pour les nouveaux éléments
  newPhoto: Partial<Photo> = {
    src: '',
    alt: '',
    category: 'photos',
  };
  newHeaderImage = '';

  // Gestion des uploads de fichiers
  newHeaderImageFile: File | null = null;
  newPhotoFile: File | null = null;
  previewImage: string | null = null;

  // Feedback utilisateur
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuth();
    if (this.isAuthenticated) {
      this.loadData();
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié via la session
   */
  checkAuth(): void {
    const auth = sessionStorage.getItem(environment.storage.adminAuth);
    if (auth === 'true') {
      this.isAuthenticated = true;
    }
  }

  /**
   * Authentifie l'utilisateur avec le mot de passe
   */
  login(): void {
    try {
      if (this.password === environment.admin.password) {
        this.isAuthenticated = true;
        sessionStorage.setItem(environment.storage.adminAuth, 'true');
        this.password = '';
        this.loadData();
        this.showSuccess('Connecté avec succès');
      } else {
        this.showError('Mot de passe incorrect');
        this.password = '';
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      this.showError('Erreur lors de la connexion');
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    try {
      this.isAuthenticated = false;
      sessionStorage.removeItem(environment.storage.adminAuth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      this.showError('Erreur lors de la déconnexion');
    }
  }

  /**
   * Charge les photos et images du carousel depuis le service
   */
  loadData(): void {
    try {
      this.adminService.getPhotos().subscribe({
        next: (photos: Photo[]) => {
          this.photos = photos;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des photos', error);
          this.showError('Erreur lors du chargement des photos');
        },
      });

      this.adminService.getHeaderImages().subscribe({
        next: (images: string[]) => {
          this.headerImages = images;
        },
        error: (error) => {
          console.error('Erreur lors du chargement du carousel', error);
          this.showError('Erreur lors du chargement du carousel');
        },
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
      this.showError('Erreur lors du chargement des données');
    }
  }

  /**
   * Ajoute une nouvelle photo
   */
  addPhoto(): void {
    try {
      if (!this.newPhoto.src || !this.newPhoto.alt || !this.newPhoto.category) {
        this.showError('Veuillez remplir tous les champs');
        return;
      }

      this.isLoading = true;
      this.adminService.addPhoto(this.newPhoto as Photo);
      this.newPhoto = { src: '', alt: '', category: this.selectedCategory };
      this.showSuccess('Photo ajoutée avec succès');
      this.loadData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo', error);
      this.showError('Erreur lors de l\'ajout de la photo');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Supprime une photo après confirmation
   * @param id - ID de la photo à supprimer
   */
  deletePhoto(id: string): void {
    try {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
        this.isLoading = true;
        this.adminService.deletePhoto(id);
        this.showSuccess('Photo supprimée avec succès');
        this.loadData();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo', error);
      this.showError('Erreur lors de la suppression de la photo');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Met à jour une propriété d'une photo
   * @param id - ID de la photo
   * @param field - Propriété à mettre à jour
   * @param value - Nouvelle valeur
   */
  updatePhoto(id: string, field: string, value: any): void {
    try {
      this.adminService.updatePhoto(id, { [field]: value } as Partial<Photo>);
      this.showSuccess('Photo mise à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo', error);
      this.showError('Erreur lors de la mise à jour');
    }
  }

  /**
   * Ajoute une nouvelle image au carousel
   */
  addHeaderImage(): void {
    try {
      if (!this.newHeaderImage) {
        this.showError('Veuillez entrer une URL');
        return;
      }

      if (this.headerImages.includes(this.newHeaderImage)) {
        this.showError('Cette image existe déjà');
        return;
      }

      const updated = [...this.headerImages, this.newHeaderImage];
      this.adminService.updateHeaderImages(updated);
      this.newHeaderImage = '';
      this.showSuccess('Image ajoutée au carousel');
      this.loadData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image', error);
      this.showError('Erreur lors de l\'ajout de l\'image');
    }
  }

  /**
   * Supprime une image du carousel
   * @param index - Index de l'image à supprimer
   */
  removeHeaderImage(index: number): void {
    try {
      const updated = this.headerImages.filter((_, i) => i !== index);
      this.adminService.updateHeaderImages(updated);
      this.showSuccess('Image supprimée du carousel');
      this.loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image', error);
      this.showError('Erreur lors de la suppression de l\'image');
    }
  }

  /**
   * Retourne les photos de la catégorie sélectionnée
   * @returns Photos filtrées par catégorie
   */
  getPhotosByCategory(): Photo[] {
    return this.photos.filter((p) => p.category === this.selectedCategory);
  }

  /**
   * Gère la sélection d'une image pour le carousel
   * @param event - Événement du changement de fichier
   */
  onHeaderImageSelected(event: Event): void {
    try {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        this.validateFile(file);
        this.newHeaderImageFile = file;
        this.previewImage = URL.createObjectURL(file);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier', error);
      this.showError((error as Error).message || 'Erreur lors de la sélection');
    }
  }

  /**
   * Gère la sélection d'une photo
   * @param event - Événement du changement de fichier
   */
  onPhotoSelected(event: Event): void {
    try {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        this.validateFile(file);
        this.newPhotoFile = file;
        this.previewImage = URL.createObjectURL(file);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier', error);
      this.showError((error as Error).message || 'Erreur lors de la sélection');
    }
  }

  /**
   * Valide qu'un fichier respecte les contraintes configurées
   * @param file - Fichier à valider
   * @throws Error si le fichier ne respecte pas les contraintes
   */
  private validateFile(file: File): void {
    if (file.size > environment.upload.maxFileSize) {
      throw new Error(
        `Fichier trop volumineux. Maximum: ${environment.upload.maxFileSize / 1024 / 1024}MB`
      );
    }

    if (!environment.upload.allowedMimeTypes.includes(file.type)) {
      throw new Error('Format non autorisé. Formats acceptés: JPEG, PNG, WebP');
    }
  }

  /**
   * Ajoute une image au carousel depuis un fichier uploadé
   */
  addHeaderImageFromFile(): void {
    try {
      if (!this.newHeaderImageFile) {
        this.showError('Veuillez sélectionner un fichier');
        return;
      }

      this.isLoading = true;
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          if (e.target && typeof e.target.result === 'string') {
            const base64Image = e.target.result;
            const updated = [...this.headerImages, base64Image];
            this.adminService.updateHeaderImages(updated);
            this.clearFileUpload();
            this.showSuccess('Image ajoutée au carousel');
            this.loadData();
          }
        } catch (error) {
          console.error('Erreur lors de l\'encodage du fichier', error);
          this.showError('Erreur lors du traitement du fichier');
        } finally {
          this.isLoading = false;
        }
      };

      reader.onerror = () => {
        this.showError('Erreur lors de la lecture du fichier');
        this.isLoading = false;
      };

      reader.readAsDataURL(this.newHeaderImageFile);
    } catch (error) {
      console.error('Erreur lors de l\'upload du carousel', error);
      this.showError('Erreur lors de l\'upload');
      this.isLoading = false;
    }
  }

  /**
   * Ajoute une photo depuis un fichier uploadé
   */
  addPhotoFromFile(): void {
    try {
      if (!this.newPhotoFile) {
        this.showError('Veuillez sélectionner un fichier');
        return;
      }

      if (!this.newPhoto.alt || !this.newPhoto.category) {
        this.showError('Veuillez remplir la description et la catégorie');
        return;
      }

      this.isLoading = true;
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          if (e.target && typeof e.target.result === 'string') {
            const base64Image = e.target.result;
            const photo: Photo = {
              id: Date.now().toString(),
              src: base64Image,
              alt: this.newPhoto.alt || '',
              category: this.newPhoto.category as 'header' | 'photos' | 'evenements',
            };
            this.adminService.addPhoto(photo);
            this.clearFileUpload();
            this.newPhoto = { src: '', alt: '', category: this.selectedCategory };
            this.showSuccess('Photo ajoutée avec succès');
            this.loadData();
          }
        } catch (error) {
          console.error('Erreur lors de l\'encodage du fichier', error);
          this.showError('Erreur lors du traitement du fichier');
        } finally {
          this.isLoading = false;
        }
      };

      reader.onerror = () => {
        this.showError('Erreur lors de la lecture du fichier');
        this.isLoading = false;
      };

      reader.readAsDataURL(this.newPhotoFile);
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo', error);
      this.showError('Erreur lors de l\'upload');
      this.isLoading = false;
    }
  }

  /**
   * Annule l'upload de fichier en cours
   */
  cancelFileUpload(): void {
    this.clearFileUpload();
    this.showSuccess('Upload annulé');
  }

  /**
   * Réinitialise les variables d'upload de fichiers
   */
  private clearFileUpload(): void {
    this.newHeaderImageFile = null;
    this.newPhotoFile = null;
    this.previewImage = null;
  }

  /**
   * Affiche un message de succès à l'utilisateur
   * @param message - Message à afficher
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  /**
   * Affiche un message d'erreur à l'utilisateur
   * @param message - Message à afficher
   */
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
