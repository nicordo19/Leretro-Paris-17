/**
 * Environment configuration for production
 * Used when deployed to Firebase
 */
export const environment = {
  production: true,

  // Storage Keys
  storage: {
    photos: 'retro_photos',
    headerImages: 'retro_header',
  },

  // API Configuration (for future use)
  api: {
    baseUrl: 'https://leretro-paris17.web.app',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 5242880, // 5MB in bytes
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFilesPerUpload: 1,
  },
};
