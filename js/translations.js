/**
 * Gestionnaire de traductions pour le site portfolio
 */

// Définition des traductions disponibles
const translations = {
    'fr': {
        // Navigation
        'accueil': 'Accueil',
        'apropos': 'À propos',
        'portfolio': 'Portfolio',
        'competences': 'Compétences',
        'contact': 'Contact',
        
        // Section Hero
        'bonjour': 'Bonjour, je suis',
        'dev-title': 'Développeur Web<br>Full Stack',
        'expertise-title': '🌟 Moderne | Créatif | Passionné',
        'me-contacter': 'Me contacter',
        'scroll-text': 'Défiler pour découvrir',
        
        // Section À propos
        'about-title': 'À Propos de Moi',
        'about-subtitle': 'Développeur Full Stack Passionné',
        'about-description1': 'Je suis Mohamed, développeur full-stack avec deux ans d\'expérience dans la création de sites web et d\'applications web responsives et fonctionnels intégrant l\'intelligence artificielle. J\'ai réalisé plus de 50 projets, notamment des sites e-commerce Shopify, et je maîtrise les nouvelles technologies comme les agents intelligents et l\'IA.',
        'about-description2': 'Originaire du Niger, je parle sept langues, dont le français, le turc et l\'anglais, ce qui m\'aide à m\'adapter facilement aux environnements multiculturels. Passionné de basketball et de fitness, j\'ai développé un fort esprit d\'équipe, de l\'enthousiasme et une approche collaborative dans mon travail.',
        'interests-title': 'Centres d\'intérêt',
        'basketball': 'Basketball',
        'fitness': 'Fitness',
        'languages': 'Langues',
        'ai': 'Intelligence Artificielle',
        'completed-projects': 'Projets Réalisés',
        'years-experience': 'Années d\'Expérience',
        'satisfied-clients': 'Clients Satisfaits',
        'download-cv': 'Télécharger CV',
        
        // Section Portfolio
        'portfolio-title': 'Mes Projets',
        'all': 'Tous',
        'web': 'Web',
        'mobile': 'Mobile',
        'design': 'Design',
        
        // Section Compétences
        'skills-title': 'Mes Compétences',
        
        // Section Contact
        'contact-title': 'Me Contacter',
        'email': 'Email',
        'phone': 'Téléphone',
        'location': 'Localisation',
        'name': 'Nom',
        'subject': 'Sujet',
        'message': 'Message',
        'send': 'Envoyer',
        
        // Section Témoignages
        'testimonials-title': 'Ce que disent mes clients',
        'leave-review': 'Laissez votre avis',
        'your-name': 'Votre Nom',
        'your-position': 'Votre Poste',
        'your-testimonial': 'Votre Témoignage',
        'rating': 'Note',
        'send-testimonial': 'Envoyer le témoignage',
        
        // Chat Widget
        'ai-assistant': 'Assistant IA',
        'minimize': 'Réduire',
        'clear': 'Effacer',
        'write-message': 'Écrivez votre message...',
        'sending': 'Envoi en cours...',
        'error-message': 'Une erreur est survenue. Veuillez réessayer.',
        'retry': 'Réessayer',
        
        // Messages de confirmation
        'testimonial-success': 'Merci pour votre témoignage !',
        'testimonial-error': 'Une erreur est survenue. Veuillez réessayer.',
        
        // États de chargement
        'loading': 'Chargement...',
        'carousel-error': 'Impossible de charger les données du carrousel.',
        
        // Footer
        'footer-text': '© 2024 Mon Portfolio. Tous droits réservés.'
    },
    'en': {
        // Navigation
        'accueil': 'Home',
        'apropos': 'About',
        'portfolio': 'Portfolio',
        'competences': 'Skills',
        'contact': 'Contact',
        
        // Section Hero
        'bonjour': 'Hi, I am',
        'dev-title': 'Full Stack Web<br>Developer',
        'expertise-title': '🌟 Modern | Creative | Passionate',
        'me-contacter': 'Contact Me',
        'scroll-text': 'Scroll to discover',
        
        // Section À propos
        'about-title': 'About Me',
        'about-subtitle': 'Passionate Full Stack Developer',
        'about-description1': 'I am Mohamed, a full-stack developer with two years of experience in creating responsive, functional websites and web applications integrating artificial intelligence. I have completed over 50 projects, including Shopify e-commerce sites, and I master new technologies like intelligent agents and AI.',
        'about-description2': 'Originally from Niger, I speak seven languages, including French, Turkish, and English, which helps me adapt easily to multicultural environments. Passionate about basketball and fitness, I have developed strong team spirit, enthusiasm, and a collaborative approach in my work.',
        'interests-title': 'Interests',
        'basketball': 'Basketball',
        'fitness': 'Fitness',
        'languages': 'Languages',
        'ai': 'Artificial Intelligence',
        'completed-projects': 'Completed Projects',
        'years-experience': 'Years of Experience',
        'satisfied-clients': 'Satisfied Clients',
        'download-cv': 'Download CV',
        
        // Section Portfolio
        'portfolio-title': 'My Projects',
        'all': 'All',
        'web': 'Web',
        'mobile': 'Mobile',
        'design': 'Design',
        
        // Section Compétences
        'skills-title': 'My Skills',
        
        // Section Contact
        'contact-title': 'Contact Me',
        'email': 'Email',
        'phone': 'Phone',
        'location': 'Location',
        'name': 'Name',
        'subject': 'Subject',
        'message': 'Message',
        'send': 'Send',
        
        // Section Témoignages
        'testimonials-title': 'What My Clients Say',
        'leave-review': 'Leave Your Review',
        'your-name': 'Your Name',
        'your-position': 'Your Position',
        'your-testimonial': 'Your Testimonial',
        'rating': 'Rating',
        'send-testimonial': 'Send Testimonial',
        
        // Chat Widget
        'ai-assistant': 'AI Assistant',
        'minimize': 'Minimize',
        'clear': 'Clear',
        'write-message': 'Write your message...',
        'sending': 'Sending...',
        'error-message': 'An error occurred. Please try again.',
        'retry': 'Retry',
        
        // Messages de confirmation
        'testimonial-success': 'Thank you for your testimonial!',
        'testimonial-error': 'An error occurred. Please try again.',
        
        // États de chargement
        'loading': 'Loading...',
        'carousel-error': 'Unable to load carousel data.',
        
        // Footer
        'footer-text': '© 2024 My Portfolio. All rights reserved.'
    }
};

/**
 * Classe qui gère les traductions et le changement de langue
 */
class TranslationManager {
    constructor() {
        // Utiliser une fonction auto-exécutante pour s'assurer que le code s'exécute une seule fois
        (() => {
            // Attendre que le DOM soit complètement chargé
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                // Si le DOM est déjà chargé, initialiser directement
                this.initialize();
            }
        })();
    }
    
    initialize() {
        try {
            console.log('Initialisation du gestionnaire de traductions...');
            
            this.currentLanguage = localStorage.getItem('language') || 'fr';
            document.documentElement.lang = this.currentLanguage;
            
            // S'assurer que les traductions existent
            if (!translations || !translations[this.currentLanguage]) {
                console.error('Erreur: Les traductions ne sont pas définies correctement');
                return;
            }
            
            // Initialiser les boutons après un court délai pour s'assurer que le DOM est prêt
            setTimeout(() => {
                this.initLanguageButtons();
                this.applyTranslations();
                
                // Notifier les autres composants du changement de langue
                this.dispatchLanguageEvent();
                
                console.log('Gestionnaire de traductions initialisé avec succès');
            }, 200);
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du gestionnaire de traductions:', error);
        }
    }
    
    /**
     * Initialise les boutons de langue dans la navigation
     */
    initLanguageButtons() {
        try {
            console.log('Initialisation des boutons de langue...');
            
            // Créer les boutons de langue s'ils n'existent pas déjà
            const navRight = document.querySelector('.nav-right');
            if (!navRight) {
                console.warn('Élément .nav-right non trouvé, impossible d\'ajouter les boutons de langue');
                return;
            }
            
            if (!document.querySelector('.lang-selector')) {
                console.log('Création des boutons de langue...');
                
                const langSelector = document.createElement('div');
                langSelector.className = 'lang-selector';
                
                const frBtn = document.createElement('button');
                frBtn.className = 'lang-btn' + (this.currentLanguage === 'fr' ? ' active' : '');
                frBtn.textContent = 'FR';
                frBtn.addEventListener('click', () => this.changeLanguage('fr'));
                
                const enBtn = document.createElement('button');
                enBtn.className = 'lang-btn' + (this.currentLanguage === 'en' ? ' active' : '');
                enBtn.textContent = 'EN';
                enBtn.addEventListener('click', () => this.changeLanguage('en'));
                
                langSelector.appendChild(frBtn);
                langSelector.appendChild(enBtn);
                
                // Insérer au début de nav-right
                navRight.insertBefore(langSelector, navRight.firstChild);
                console.log('Boutons de langue créés avec succès');
            } else {
                console.log('Mise à jour des boutons de langue existants...');
                
                // Mettre à jour l'état actif des boutons existants
                const langBtns = document.querySelectorAll('.lang-btn');
                langBtns.forEach(btn => {
                    if (!btn || !btn.textContent) return;
                    
                    const lang = btn.textContent.toLowerCase();
                    btn.classList.toggle('active', lang === this.currentLanguage);
                    
                    // Supprimer les anciens écouteurs pour éviter les doublons
                    const newBtn = btn.cloneNode(true);
                    newBtn.addEventListener('click', () => this.changeLanguage(lang));
                    btn.parentNode.replaceChild(newBtn, btn);
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des boutons de langue:', error);
        }
    }
    
    /**
     * Change la langue du site
     * @param {string} language - Code de langue ('fr' or 'en')
     */
    changeLanguage(language) {
        try {
            console.log(`Changement de langue vers: ${language}`);
            
            if (!translations[language]) {
                console.error(`Erreur: Traductions non disponibles pour la langue ${language}`);
                return;
            }
            
            this.currentLanguage = language;
            document.documentElement.lang = language;
            localStorage.setItem('language', language);
            
            this.applyTranslations();
            
            // Mettre à jour l'état actif des boutons de langue
            const langBtns = document.querySelectorAll('.lang-btn');
            langBtns.forEach(btn => {
                if (!btn || !btn.textContent) return;
                
                const btnLang = btn.textContent.toLowerCase();
                btn.classList.toggle('active', btnLang === language);
            });
            
            // Notifier les autres composants du changement de langue
            this.dispatchLanguageEvent();
            
            console.log(`Langue changée avec succès vers: ${language}`);
        } catch (error) {
            console.error('Erreur lors du changement de langue:', error);
        }
    }
    
    /**
     * Déclenche un événement personnalisé pour notifier du changement de langue
     */
    dispatchLanguageEvent() {
        try {
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: this.currentLanguage }
            }));
            
            document.dispatchEvent(new CustomEvent('translationsApplied', {
                detail: { language: this.currentLanguage }
            }));
        } catch (error) {
            console.error('Erreur lors de l\'envoi des événements de changement de langue:', error);
        }
    }
    
    /**
     * Applique les traductions sur toute la page
     */
    applyTranslations() {
        try {
            console.log('Application des traductions...');
            
            if (!translations || !translations[this.currentLanguage]) {
                console.error('Erreur: Les traductions ne sont pas disponibles');
                return;
            }
            
            // Traduire les éléments avec l'attribut data-translate
            this.translateElements('[data-translate]', element => {
                const key = element.getAttribute('data-translate');
                if (key && translations[this.currentLanguage][key]) {
                    element.innerHTML = translations[this.currentLanguage][key];
                }
            });
            
            // Traduire les placeholders
            this.translateElements('[data-translate-placeholder]', element => {
                const key = element.getAttribute('data-translate-placeholder');
                if (key && translations[this.currentLanguage][key]) {
                    element.placeholder = translations[this.currentLanguage][key];
                }
            });
            
            // Traduire les attributs aria-label
            this.translateElements('[data-translate-aria]', element => {
                const key = element.getAttribute('data-translate-aria');
                if (key && translations[this.currentLanguage][key]) {
                    element.setAttribute('aria-label', translations[this.currentLanguage][key]);
                }
            });
            
            console.log('Traductions appliquées avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'application des traductions:', error);
        }
    }
    
    /**
     * Fonction d'aide pour traduire un groupe d'éléments
     * @param {string} selector - Le sélecteur CSS pour les éléments
     * @param {Function} translateFn - La fonction de traduction à appliquer
     */
    translateElements(selector, translateFn) {
        try {
            const elements = document.querySelectorAll(selector);
            if (!elements || elements.length === 0) {
                console.warn(`Aucun élément trouvé avec le sélecteur: ${selector}`);
                return;
            }
            
            elements.forEach(element => {
                if (!element) return;
                
                try {
                    translateFn(element);
                } catch (e) {
                    console.warn(`Erreur lors de la traduction d'un élément avec ${selector}:`, e);
                }
            });
        } catch (error) {
            console.error(`Erreur lors de la traduction des éléments ${selector}:`, error);
        }
    }
}

// Attendre que les traductions soient définies avant d'initialiser
document.addEventListener('DOMContentLoaded', () => {
    // S'assurer que les traductions sont disponibles
    if (typeof translations !== 'undefined') {
        // Initialiser avec un léger délai pour s'assurer que tout est chargé
        setTimeout(() => {
            window.translationManager = new TranslationManager();
        }, 200);
    } else {
        console.error('Erreur: Les traductions ne sont pas disponibles.');
    }
}); 