const translations = {
    fr: {
        // Navigation
        "home": "Accueil",
        "about": "À Propos",
        "portfolio": "Portfolio",
        "skills": "Compétences",
        "contact": "Contact",

        // Hero Section
        "greeting": "Bonjour, je suis",
        "dev-title": "Développeur Web<br>Full Stack",
        "expertise-title": "🌟 Moderne | ",
        "contact-me": "Me Contacter",
        "scroll-text": "Scrollez pour découvrir",

        // About Section
        "about-title": "À Propos de Moi",
        "about-subtitle": "Développeur Full Stack Passionné",
        "about-description1": "Je suis Mohamed, développeur full-stack avec deux ans d'expérience dans la création de sites web et d'applications web responsives, fonctionnels, et intégrant l'intelligence artificielle. J'ai réalisé plus de 50 projets, dont des sites e-commerce Shopify, et je maîtrise les nouvelles technologies comme les agents intelligents et l'IA.",
        "about-description2": "Originaire du Niger, je parle sept langues, dont le français, le turc et l'anglais, ce qui m'aide à m'adapter facilement à des environnements multiculturels. Passionné de basketball et de fitness, j'ai développé un fort esprit d'équipe, de l'enthousiasme et une approche collaborative dans mon travail.",
        
        // Interests
        "interests-title": "Centres d'intérêt",
        "basketball": "Basketball",
        "fitness": "Fitness",
        "languages": "Langues",
        "ai": "Intelligence Artificielle",

        // Stats
        "completed-projects": "Projets Complétés",
        "years-experience": "Années d'Expérience",
        "satisfied-clients": "Clients Satisfaits",

        // Portfolio
        "portfolio-title": "Mes Projets",
        "all": "Tous",
        "web": "Web",
        "mobile": "Mobile",
        "design": "Design",
        "view-project": "Voir le projet",

        // Skills
        "skills-title": "Mes Compétences",
        "frontend": "Frontend",
        "backend": "Backend",
        "tools": "Outils & DevOps",
        "ai-skills": "Intelligence Artificielle",

        // Contact
        "contact-title": "Me Contacter",
        "name": "Nom",
        "email": "Email",
        "subject": "Sujet",
        "message": "Message",
        "send": "Envoyer",
        "phone": "Téléphone",
        "location": "Localisation",

        // Footer
        "footer-text": "© 2024 Mon Portfolio. Tous droits réservés.",

        // Chat Widget
        "ai-assistant": "Assistant IA",
        "minimize": "Réduire",
        "clear": "Effacer",
        "write-message": "Écrivez votre message...",
        "sending": "Envoi en cours...",
        "error-message": "Une erreur est survenue. Veuillez réessayer.",
        "retry": "Réessayer",

        // Testimonials
        "testimonials-title": "Ce Que Disent Mes Clients",
        "leave-review": "Laissez Votre Avis",
        "your-name": "Votre Nom",
        "your-position": "Votre Poste",
        "your-testimonial": "Votre Témoignage",
        "rating": "Note :",
        "send-testimonial": "Envoyer le témoignage",
        "testimonial-success": "Témoignage envoyé avec succès !",
        "testimonial-error": "Erreur lors de l'envoi du témoignage",
        "loading": "Chargement...",
        "carousel-error": "Désolé, le carrousel n'a pas pu être chargé"
    },
    en: {
        // Navigation
        "home": "Home",
        "about": "About",
        "portfolio": "Portfolio",
        "skills": "Skills",
        "contact": "Contact",

        // Hero Section
        "greeting": "Hi, I am",
        "dev-title": "Full Stack Web<br>Developer",
        "expertise-title": "🌟 Modern | ",
        "contact-me": "Contact Me",
        "scroll-text": "Scroll to discover",

        // About Section
        "about-title": "About Me",
        "about-subtitle": "Passionate Full Stack Developer",
        "about-description1": "I am Mohamed, a full-stack developer with two years of experience in creating responsive, functional websites and web applications integrating artificial intelligence. I have completed over 50 projects, including Shopify e-commerce sites, and I master new technologies like intelligent agents and AI.",
        "about-description2": "Originally from Niger, I speak seven languages, including French, Turkish, and English, which helps me adapt easily to multicultural environments. Passionate about basketball and fitness, I have developed strong team spirit, enthusiasm, and a collaborative approach in my work.",
        
        // Interests
        "interests-title": "Interests",
        "basketball": "Basketball",
        "fitness": "Fitness",
        "languages": "Languages",
        "ai": "Artificial Intelligence",

        // Stats
        "completed-projects": "Completed Projects",
        "years-experience": "Years of Experience",
        "satisfied-clients": "Satisfied Clients",

        // Portfolio
        "portfolio-title": "My Projects",
        "all": "All",
        "web": "Web",
        "mobile": "Mobile",
        "design": "Design",
        "view-project": "View Project",

        // Skills
        "skills-title": "My Skills",
        "frontend": "Frontend",
        "backend": "Backend",
        "tools": "Tools & DevOps",
        "ai-skills": "Artificial Intelligence",

        // Contact
        "contact-title": "Contact Me",
        "name": "Name",
        "email": "Email",
        "subject": "Subject",
        "message": "Message",
        "send": "Send",
        "phone": "Phone",
        "location": "Location",

        // Footer
        "footer-text": "© 2024 My Portfolio. All rights reserved.",

        // Chat Widget
        "ai-assistant": "AI Assistant",
        "minimize": "Minimize",
        "clear": "Clear",
        "write-message": "Write your message...",
        "sending": "Sending...",
        "error-message": "An error occurred. Please try again.",
        "retry": "Retry",

        // Testimonials
        "testimonials-title": "What My Clients Say",
        "leave-review": "Leave Your Review",
        "your-name": "Your Name",
        "your-position": "Your Position",
        "your-testimonial": "Your Testimonial",
        "rating": "Rating:",
        "send-testimonial": "Send Testimonial",
        "testimonial-success": "Testimonial sent successfully!",
        "testimonial-error": "Error sending testimonial",
        "loading": "Loading...",
        "carousel-error": "Sorry, the carousel could not be loaded"
    }
};

class TranslationManager {
    constructor() {
        // Récupérer la langue stockée ou utiliser le français par défaut
        this.currentLang = localStorage.getItem('lang') || 'fr';
        this.translations = translations;
        this.init();
    }

    init() {
        // Initialiser le document
        document.documentElement.lang = this.currentLang;
        
        // Ajouter les écouteurs d'événements aux boutons de langue existants
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchLanguage(btn.dataset.lang));
        });

        // Appliquer la langue initiale
        this.updateContent();
        
        // Mettre à jour l'état des boutons
        updateLanguageButtons(this.currentLang);
    }

    switchLanguage(lang) {
        if (this.currentLang === lang) return;
        
        if (this.translations[lang]) {
            this.currentLang = lang;
            document.documentElement.lang = lang;
            localStorage.setItem('lang', lang);
            
            // Mettre à jour le contenu
            this.updateContent();
            
            // Mettre à jour l'état des boutons de langue
            updateLanguageButtons(lang);
            
            // Déclencher un événement personnalisé pour informer les autres composants
            const event = new CustomEvent('languageChanged', { detail: { language: lang } });
            document.dispatchEvent(event);
        } else {
            console.error(`Language "${lang}" not supported`);
            // Afficher une notification d'erreur
            this.showErrorNotification(`Language "${lang}" not supported`);
        }
    }

    updateContent() {
        // Mettre à jour les éléments avec data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[this.currentLang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[this.currentLang][key];
                } else {
                    element.innerHTML = translations[this.currentLang][key];
                }
            }
        });

        // Mettre à jour les attributs aria-label
        document.querySelectorAll('[data-translate-aria]').forEach(element => {
            const key = element.dataset.translateAria;
            if (translations[this.currentLang][key]) {
                element.setAttribute('aria-label', translations[this.currentLang][key]);
            }
        });

        // Mettre à jour les placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.dataset.translatePlaceholder;
            if (translations[this.currentLang][key]) {
                element.placeholder = translations[this.currentLang][key];
            }
        });
    }

    showErrorNotification(message) {
        // Création d'une notification d'erreur
        const notification = document.createElement('div');
        notification.className = 'translation-error-notification';
        notification.textContent = message;
        
        // Ajout au document
        document.body.appendChild(notification);
        
        // Suppression automatique après 3 secondes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Fonction pour mettre à jour l'état actif des boutons de langue
function updateLanguageButtons(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Initialiser le gestionnaire de traductions lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.translationManager = new TranslationManager();
}); 