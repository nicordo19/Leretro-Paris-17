import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appCarouselCover]',
  standalone: true,
})
export class CarouselCoverDirective implements OnInit {
  @Input() carouselImages: string[] = [];

  currentIndex = 0;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    if (!this.carouselImages.length) return;

    // Première image
    this.el.nativeElement.src = this.carouselImages[0];

    this.startCarousel();
  }

  startCarousel() {
    setInterval(() => {
      const img = this.el.nativeElement;

      // Préparer l'arrivée de la nouvelle image
      img.classList.add('carousel-slide-out');

      setTimeout(() => {
        // Avancer l'index
        this.currentIndex =
          (this.currentIndex + 1) % this.carouselImages.length;

        // Nouvelle image : on la place en dehors à gauche
        img.classList.remove('carousel-slide-out');
        img.classList.add('carousel-slide-in');

        img.src = this.carouselImages[this.currentIndex];

        // Lancer l'entrée fluide
        requestAnimationFrame(() => {
          img.classList.add('carousel-slide-in-active');
        });

        // Cleanup
        setTimeout(() => {
          img.classList.remove('carousel-slide-in');
          img.classList.remove('carousel-slide-in-active');
        }, 900);
      }, 900);
    }, 10000);
  }
}
export const CarouselCover = CarouselCoverDirective;
