// Intégration de Vercel Analytics
import { inject } from '@vercel/analytics';

// Initialiser Vercel Analytics lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    inject();
    console.log('Vercel Analytics initialisé avec succès');
});

// Exporter la fonction inject pour une utilisation éventuelle dans d'autres modules
export { inject }; 