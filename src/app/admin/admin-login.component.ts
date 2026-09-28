import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/admin']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez renseigner email et mot de passe';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      this.errorMessage = 'Email ou mot de passe incorrect';
    } finally {
      this.isLoading = false;
    }
  }
}
