// Intégration de Vercel Analytics
(function() {
    // Fonction pour charger le script Vercel Analytics
    function loadVercelAnalytics() {
        const script = document.createElement('script');
        script.src = 'https://va.vercel-scripts.com/v1/script.js';
        script.defer = true;
        script.dataset.websiteId = ''; // Laissez vide - sera automatiquement configuré par Vercel
        
        document.head.appendChild(script);
        console.log('Vercel Analytics initialisé avec succès');
    }
    
    // Charger l'analytics lorsque le DOM est chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadVercelAnalytics);
    } else {
        loadVercelAnalytics();
    }
})(); 