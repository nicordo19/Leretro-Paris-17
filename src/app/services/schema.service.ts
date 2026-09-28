import { Injectable } from '@angular/core';

/**
 * Service pour gérer les données structurées Schema.org (JSON-LD)
 * Améliore le SEO et l'indexation par Google
 */
@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  /**
   * Ajoute un schéma JSON-LD à la page
   * @param schema Objet du schéma à ajouter
   */
  addSchema(schema: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Ajoute le schéma Restaurant pour Le Rétro
   * Permet à Google de mieux comprendre le type de business
   */
  addRestaurantSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Le Rétro',
      url: 'https://leretro-paris.fr',
      description:
        'Bistrot parisien authentique avec cuisine maison au cœur du 17e arrondissement',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2 Rue de Tocqueville',
        addressLocality: 'Paris',
        postalCode: '75017',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.8765,
        longitude: 2.307,
      },
      telephone: '+33140189002',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '09:00',
          closes: '01:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '15:00',
          closes: '22:00',
        },
      ],
      priceRange: '€€',
      cuisineType: 'French',
      areaServed: {
        '@type': 'City',
        name: 'Paris',
        areaServed: 'FR',
      },
    };
    this.addSchema(schema);
  }

  /**
   * Ajoute le schéma Organization pour améliorer la reconnaissance de la marque
   */
  addOrganizationSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Le Rétro',
      url: 'https://leretro-paris.fr',
      logo: 'https://leretro-paris.fr/favicon.ico',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        telephone: '+33140189002',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2 Rue de Tocqueville',
        addressLocality: 'Paris',
        postalCode: '75017',
        addressCountry: 'FR',
      },
    };
    this.addSchema(schema);
  }

  /**
   * Ajoute le schéma LocalBusiness pour le SEO local
   */
  addLocalBusinessSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Le Rétro',
      image: 'https://leretro-paris.fr/assets/imageretro/header/main.jpg',
      description:
        'Bistrot parisien authentique avec cuisine maison au cœur du 17e arrondissement',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '2 Rue de Tocqueville',
        addressLocality: 'Paris',
        postalCode: '75017',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.8765,
        longitude: 2.307,
      },
      url: 'https://leretro-paris.fr',
      telephone: '+33140189002',
    };
    this.addSchema(schema);
  }
}
