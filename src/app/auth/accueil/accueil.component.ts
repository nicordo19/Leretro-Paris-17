import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-accueil.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  showHours = false;
  sectionActive: string = '';
  ngOnInit() {
    const hour = new Date().getHours();
    const day = new Date().getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi

    // Exemple : ouvert de 9h à 23h30 sauf dimanche où c’est jusqu’à 20h
    if (
      (day === 0 && hour >= 9 && hour <= 20) || // Dimanche
      (day >= 1 && day <= 6 && hour >= 9 && hour <= 23)
    ) {
      this.showHours = true;
    }
  }
  toggleHours() {
    this.showHours = !this.showHours;
  }
  afficherSection(section: string) {
    this.sectionActive = section;
  }
}
