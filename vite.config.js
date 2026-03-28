import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        tontePelouseLyon: resolve(__dirname, 'tonte-pelouse-lyon.html'),
        tailleHaiesLyon: resolve(__dirname, 'taille-haies-lyon.html'),
        debroussaillageLyon: resolve(__dirname, 'debroussaillage-lyon.html'),
        entretienJardinLyon: resolve(__dirname, 'entretien-jardin-lyon.html'),
        realisations: resolve(__dirname, 'realisations.html'),
        aPropos: resolve(__dirname, 'a-propos.html'),
        avisClients: resolve(__dirname, 'avis-clients.html'),
        contact: resolve(__dirname, 'contact.html'),
        mentionsLegales: resolve(__dirname, 'mentions-legales.html'),
        politiqueConfidentialite: resolve(__dirname, 'politique-confidentialite.html')
      }
    }
  }
});
