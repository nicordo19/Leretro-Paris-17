/**
 * Firebase configuration loader.
 *
 * The actual credentials are injected at runtime through `assets/env.js`,
 * which defines `window.__env.firebase`. This file only keeps placeholder
 * values so that no secret is committed to git.
 */

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  databaseURL?: string;
};

declare global {
  interface Window {
    __env?: {
      firebase?: Partial<FirebaseConfig>;
    };
  }
}

const defaultConfig: FirebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  databaseURL: '',
};

const runtimeConfig =
  (typeof window !== 'undefined' && window.__env?.firebase) || {};

export const firebaseConfig: FirebaseConfig = {
  ...defaultConfig,
  ...runtimeConfig,
};
