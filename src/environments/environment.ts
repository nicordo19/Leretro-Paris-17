/**
 * Environment configuration for development
 * Used for local development and testing
 */
export const environment = {
  production: false,

  // Admin Configuration
  admin: {
    password: 'LeRetro2025', // Change this for production!
  },

  // Storage Keys
  storage: {
    photos: 'retro_photos',
    headerImages: 'retro_header',
    adminAuth: 'admin_authenticated',
  },

  // API Configuration (for future use)
  api: {
    baseUrl: 'http://localhost:4200',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 5242880, // 5MB in bytes
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFilesPerUpload: 1,
  },
};
