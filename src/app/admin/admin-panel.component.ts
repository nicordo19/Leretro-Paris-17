import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AdminService, Photo } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

type PhotoForm = {
  src: string;
  alt: string;
  category: Photo['category'];
};

const DEFAULT_PHOTO_CATEGORY: Photo['category'] = 'photos';
const ADMIN_PANEL_IMPORTS = [CommonModule, FormsModule];

/**
 * Composant d'administration pour la gestion des photos et du carousel
 * Permet aux utilisateurs non-techniques de gérer le contenu du site
 */
@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: ADMIN_PANEL_IMPORTS,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  // Données de photos et carousel
  photos: Photo[] = [];
  headerImages: string[] = [];
  selectedCategory: 'header' | 'photos' | 'evenements' = DEFAULT_PHOTO_CATEGORY;

  // État de l'authentification
  isAuthenticated = false;
  email = '';
  password = '';

  // Données temporaires pour les nouveaux éléments
  newPhoto: PhotoForm = {
    src: '',
    alt: '',
    category: DEFAULT_PHOTO_CATEGORY,
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

  private authSubscription?: Subscription;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.loadData();
      } else {
        this.photos = [];
        this.headerImages = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  /**
   * Authentifie l'utilisateur avec le mot de passe
   */
  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.showError('Veuillez renseigner email et mot de passe');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.password);
      this.email = '';
      this.password = '';
      this.showSuccess('Connecté avec succès');
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      this.showError('Email ou mot de passe incorrect');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    this.isLoading = true;
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
      this.showSuccess('Déconnecté');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      this.showError('Erreur lors de la déconnexion');
    } finally {
      this.isLoading = false;
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
  async addPhoto(): Promise<void> {
    try {
      if (!this.newPhoto.src || !this.newPhoto.alt || !this.newPhoto.category) {
        this.showError('Veuillez remplir tous les champs');
        return;
      }

      this.isLoading = true;
      await this.adminService.addPhoto(this.newPhoto as Photo);
      this.newPhoto = { src: '', alt: '', category: this.selectedCategory };
      this.showSuccess('Photo ajoutée avec succès');
      this.loadData();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo", error);
      this.showError("Erreur lors de l'ajout de la photo");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Supprime une photo après confirmation
   * @param id - ID de la photo à supprimer
   */
  async deletePhoto(id: string): Promise<void> {
    try {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
        this.isLoading = true;
        await this.adminService.deletePhoto(id);
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
  async updatePhoto(id: string, field: string, value: any): Promise<void> {
    try {
      await this.adminService.updatePhoto(id, {
        [field]: value,
      } as Partial<Photo>);
      this.showSuccess('Photo mise à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo', error);
      this.showError('Erreur lors de la mise à jour');
    }
  }

  /**
   * Ajoute une nouvelle image au carousel
   */
  async addHeaderImage(): Promise<void> {
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
      await this.adminService.updateHeaderImages(updated);
      this.newHeaderImage = '';
      this.showSuccess('Image ajoutée au carousel');
      this.loadData();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'image", error);
      this.showError("Erreur lors de l'ajout de l'image");
    }
  }

  /**
   * Supprime une image du carousel
   * @param index - Index de l'image à supprimer
   */
  async removeHeaderImage(index: number): Promise<void> {
    try {
      const updated = this.headerImages.filter((_, i) => i !== index);
      await this.adminService.updateHeaderImages(updated);
      this.showSuccess('Image supprimée du carousel');
      this.loadData();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image", error);
      this.showError("Erreur lors de la suppression de l'image");
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
        `Fichier trop volumineux. Maximum: ${
          environment.upload.maxFileSize / 1024 / 1024
        }MB`
      );
    }

    if (!environment.upload.allowedMimeTypes.includes(file.type)) {
      throw new Error('Format non autorisé. Formats acceptés: JPEG, PNG, WebP');
    }
  }

  /**
   * Ajoute une image au carousel depuis un fichier uploadé
   */
  async addHeaderImageFromFile(): Promise<void> {
    try {
      if (!this.newHeaderImageFile) {
        this.showError('Veuillez sélectionner un fichier');
        return;
      }

      this.isLoading = true;
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          if (e.target && typeof e.target.result === 'string') {
            const base64Image = e.target.result;
            const updated = [...this.headerImages, base64Image];
            await this.adminService.updateHeaderImages(updated);
            this.clearFileUpload();
            this.showSuccess('Image ajoutée au carousel');
            this.loadData();
          }
        } catch (error) {
          console.error("Erreur lors de l'encodage du fichier", error);
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
      console.error("Erreur lors de l'upload du carousel", error);
      this.showError("Erreur lors de l'upload");
      this.isLoading = false;
    }
  }

  /**
   * Ajoute une photo depuis un fichier uploadé
   */
  async addPhotoFromFile(): Promise<void> {
    if (!this.newPhotoFile) {
      this.showError('Veuillez sélectionner un fichier');
      return;
    }

    if (!this.newPhoto.alt || !this.newPhoto.category) {
      this.showError('Veuillez remplir la description et la catégorie');
      return;
    }

    this.isLoading = true;
    try {
      await this.adminService.addPhotoFromFile(
        this.newPhotoFile,
        this.newPhoto.alt,
        this.newPhoto.category
      );
      this.clearFileUpload();
      this.newPhoto = {
        src: '',
        alt: '',
        category: this.selectedCategory,
      };
      this.showSuccess('Photo ajoutée avec succès');
      this.loadData();
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo", error);
      this.showError(
        (error as Error).message || "Erreur lors de l'upload de la photo"
      );
    } finally {
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
