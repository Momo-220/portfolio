// Gestionnaire de thème
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.icon = this.themeToggle.querySelector('i');
        this.body = document.body;
        
        // Initialiser le thème
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(this.currentTheme);
        
        // Ajouter l'écouteur d'événement
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    applyTheme(theme) {
        // Appliquer la classe au body
        this.body.classList.toggle('dark-theme', theme === 'dark');
        
        // Mettre à jour l'icône
        if (theme === 'dark') {
            this.icon.classList.remove('fa-moon');
            this.icon.classList.add('fa-sun');
        } else {
            this.icon.classList.remove('fa-sun');
            this.icon.classList.add('fa-moon');
        }
        
        // Sauvegarder la préférence
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
    }
}

// Gestionnaire de navigation
class NavigationManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.lastScroll = 0;
        
        this.init();
    }
    
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    init() {
        // Utilisation du debounce pour optimiser le scroll
        const debouncedHandleScroll = this.debounce(() => this.handleScroll(), 100);
        window.addEventListener('scroll', debouncedHandleScroll);
        this.setupSmoothScroll();
    }
    
    handleScroll() {
        const scrollPosition = window.scrollY;
        
        // Gestion de l'en-tête collant
        if (scrollPosition > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Mise à jour du lien actif
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const currentId = section.getAttribute('id');
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Gestion de l'apparition/disparition du header
        if (scrollPosition > this.lastScroll && scrollPosition > 100) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }
        this.lastScroll = scrollPosition;
    }
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                targetSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
}

// Gestionnaire d'animations
class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.animateHeroSection();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
    
    animateHeroSection() {
        const title = document.querySelector('.hero-title');
        const subtitle = document.querySelector('.hero-subtitle');
        const cta = document.querySelector('.cta-button');
        
        gsap.from(title, {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power3.out"
        });
        
        gsap.from(subtitle, {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: "power3.out"
        });
        
        gsap.from(cta, {
            duration: 1,
            y: 20,
            opacity: 0,
            delay: 0.6,
            ease: "power3.out"
        });
    }
}

// Gestionnaire de particules
class ParticlesManager {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    createParticles() {
        const numberOfParticles = Math.floor(window.innerWidth / 10);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#2563eb';
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }
}

// Gestionnaire de langue
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'fr';
        this.translations = {
            fr: {
                // Navigation
                accueil: "Accueil",
                apropos: "À Propos",
                portfolio: "Portfolio",
                competences: "Compétences",
                contact: "Contact",
                
                // Hero Section
                greeting: "Bonjour, je suis",
                title: "Développeur Web Full Stack",
                subtitle: "Création d'expériences web innovantes et interactives",
                contactBtn: "Me Contacter",
                scrollText: "Scrollez pour découvrir",
                
                // À propos
                aboutTitle: "À Propos",
                aboutSubtitle: "Développeur Full Stack Passionné",
                aboutDescription1: "Je suis Mohamed, développeur full-stack avec deux ans d'expérience dans la création de sites web et d'applications web responsives, fonctionnels, et intégrant l'intelligence artificielle. J'ai réalisé plus de 50 projets, dont des sites e-commerce Shopify, et je maîtrise les nouvelles technologies comme les agents intelligents et l'IA.",
                aboutDescription2: "Originaire du Niger, je parle sept langues, dont le français, le turc et l'anglais, ce qui m'aide à m'adapter facilement à des environnements multiculturels. Passionné de basketball et de fitness, j'ai développé un fort esprit d'équipe, de l'enthousiasme et une approche collaborative dans mon travail.",
                
                // Centres d'intérêt
                interestsTitle: "Centres d'intérêt",
                basketball: "Basketball",
                fitness: "Fitness",
                languages: "Langues",
                ai: "Intelligence Artificielle",
                
                // Stats
                projectsCompleted: "Projets Complétés",
                yearsExperience: "Années d'Expérience",
                satisfiedClients: "Clients Satisfaits",
                
                // Témoignages
                testimonialTitle: "Laissez votre avis",
                yourName: "Votre Nom",
                yourPosition: "Votre Poste",
                yourTestimonial: "Votre Témoignage",
                rating: "Note :",
                sendTestimonial: "Envoyer mon témoignage",
                
                // Footer
                copyright: "Tous droits réservés."
            },
            en: {
                // Navigation
                accueil: "Home",
                apropos: "About",
                portfolio: "Portfolio",
                competences: "Skills",
                contact: "Contact",
                
                // Hero Section
                greeting: "Hello, I am",
                title: "Full Stack Web Developer",
                subtitle: "Creating innovative and interactive web experiences",
                contactBtn: "Contact Me",
                scrollText: "Scroll to discover",
                
                // About
                aboutTitle: "About",
                aboutSubtitle: "Passionate Full Stack Developer",
                aboutDescription1: "I am Mohamed, a full-stack developer with two years of experience in creating responsive, functional websites and web applications integrating artificial intelligence. I have completed over 50 projects, including Shopify e-commerce sites, and I master new technologies like intelligent agents and AI.",
                aboutDescription2: "Originally from Niger, I speak seven languages, including French, Turkish, and English, which helps me adapt easily to multicultural environments. Passionate about basketball and fitness, I have developed a strong team spirit, enthusiasm, and collaborative approach in my work.",
                
                // Interests
                interestsTitle: "Interests",
                basketball: "Basketball",
                fitness: "Fitness",
                languages: "Languages",
                ai: "Artificial Intelligence",
                
                // Stats
                projectsCompleted: "Completed Projects",
                yearsExperience: "Years Experience",
                satisfiedClients: "Satisfied Clients",
                
                // Testimonials
                testimonialTitle: "Leave your feedback",
                yourName: "Your Name",
                yourPosition: "Your Position",
                yourTestimonial: "Your Testimonial",
                rating: "Rating:",
                sendTestimonial: "Send my testimonial",
                
                // Footer
                copyright: "All rights reserved."
            }
        };
        
        this.init();
    }
    
    init() {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => this.switchLanguage(btn.dataset.lang));
        });
        
        this.applyLanguage(this.currentLang);
    }
    
    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        this.applyLanguage(lang);
    }
    
    applyLanguage(lang) {
        const translations = this.translations[lang];
        
        // Navigation
        document.querySelectorAll('.nav-link span').forEach(span => {
            const key = span.closest('a').getAttribute('href').replace('#', '');
            if (translations[key]) {
                span.textContent = translations[key];
            }
        });
        
        // Hero Section
        document.querySelector('.greeting').textContent = translations.greeting;
        document.querySelector('.hero-title').textContent = translations.title;
        document.querySelector('.hero-subtitle').textContent = translations.subtitle;
        document.querySelector('.cta-button').textContent = translations.contactBtn;
        document.querySelector('.scroll-text').textContent = translations.scrollText;
        
        // À propos
        document.querySelector('#apropos .section-title').textContent = translations.aboutTitle;
        document.querySelector('.about-subtitle').textContent = translations.aboutSubtitle;
        document.querySelectorAll('.about-description')[0].textContent = translations.aboutDescription1;
        document.querySelectorAll('.about-description')[1].textContent = translations.aboutDescription2;
        
        // Centres d'intérêt
        document.querySelector('.interests-title').textContent = translations.interestsTitle;
        document.querySelectorAll('.interest-item span').forEach(span => {
            const text = span.textContent.toLowerCase();
            if (text.includes('basketball')) span.textContent = translations.basketball;
            if (text.includes('fitness')) span.textContent = translations.fitness;
            if (text.includes('langues')) span.textContent = translations.languages;
            if (text.includes('intelligence')) span.textContent = translations.ai;
        });
        
        // Stats
        document.querySelectorAll('.stat-label').forEach(label => {
            const text = label.textContent.toLowerCase();
            if (text.includes('projets')) label.textContent = translations.projectsCompleted;
            if (text.includes('années')) label.textContent = translations.yearsExperience;
            if (text.includes('clients')) label.textContent = translations.satisfiedClients;
        });
        
        // Témoignages
        document.querySelector('#ajouter-temoignage .section-title').textContent = translations.testimonialTitle;
        document.querySelector('label[for="testimonial-name"]').textContent = translations.yourName;
        document.querySelector('label[for="testimonial-position"]').textContent = translations.yourPosition;
        document.querySelector('label[for="testimonial-message"]').textContent = translations.yourTestimonial;
        document.querySelector('.rating-group label').textContent = translations.rating;
        document.querySelector('#testimonial-form button').textContent = translations.sendTestimonial;
        
        // Footer
        document.querySelector('.footer p').textContent = `© ${new Date().getFullYear()} Mon Portfolio. ${translations.copyright}`;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que le DOM soit complètement chargé avant d'initialiser
    setTimeout(() => {
        try {
            initApp();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'application:', error);
        }
    }, 300); // Augmentation du délai pour s'assurer que tout est bien chargé
});

function initApp() {
    // Variables DOM
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const themeToggle = document.querySelector('.theme-toggle');
    const preloader = document.querySelector('.preloader');
    
    // Retirer le préchargeur après le chargement complet
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    }
    
    // Navigation fixe au scroll avec animation de masquage/affichage
    let lastScrollY = 0;
    
    function handleScroll() {
        if (header) {
            const currentScrollY = window.scrollY;
            
            // Ajouter/enlever la classe scrolled
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Masquer/afficher la barre lors du défilement
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Défilement vers le bas - masquer la barre
                header.style.transform = 'translateY(-100%)';
            } else {
                // Défilement vers le haut - afficher la barre
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }
    }
    
    // Utiliser un debounce pour optimiser les performances
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll);
    });
    
    // Exécuter une fois au début pour initialiser l'état
    handleScroll();
    
    // Menu mobile
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navContainer.classList.toggle('active');
        });
    }
    
    // Fermer le menu mobile lorsqu'un lien est cliqué
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link) {
            link.addEventListener('click', () => {
                if (mobileMenuBtn && navContainer) {
                    mobileMenuBtn.classList.remove('active');
                    navContainer.classList.remove('active');
                }
            });
        }
    });
    
    // Liens de navigation actifs au scroll - avec gestion d'erreur améliorée
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLinks() {
        try {
            let scrollY = window.scrollY;
            
            sections.forEach(section => {
                if (!section) return;
                
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                // Vérification supplémentaire pour s'assurer que l'ID est valide
                if (!sectionId) return;
                
                // Utilisation d'une approche plus sûre pour sélectionner le lien
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    // Enlever la classe active de tous les liens
                    navLinks.forEach(link => {
                        if (link) link.classList.remove('active');
                    });
                    
                    // Ajouter la classe active au lien correspondant
                    if (navLink) navLink.classList.add('active');
                }
            });
        } catch (error) {
            console.warn('Erreur lors de la mise à jour des liens de navigation actifs:', error);
        }
    }
    
    // Initialiser les liens actifs au chargement et sur scroll
    window.addEventListener('scroll', updateActiveLinks);
    setTimeout(updateActiveLinks, 200); // S'assurer que tout est bien rendu avant l'activation initiale
    
    // Basculer le thème sombre/clair
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const themeIcon = themeToggle.querySelector('i');
        
        // Appliquer le thème sauvegardé ou le thème par défaut
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (themeIcon) {
                themeIcon.classList.toggle('fa-moon');
                themeIcon.classList.toggle('fa-sun');
            }
            
            // Sauvegarder la préférence de thème
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Animer les éléments au scroll
    const animateOnScroll = () => {
        const fadeElements = document.querySelectorAll('.fade-in, .slide-in');
        
        fadeElements.forEach(element => {
            if (!element) return;
            
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    setTimeout(animateOnScroll, 500); // Délai pour s'assurer que les éléments sont calculés correctement
    
    // Initialiser les animations de scroll
    try {
        initScrollAnimations();
    } catch (error) {
        console.warn('Erreur lors de l\'initialisation des animations de scroll:', error);
    }
    
    // Écouter l'événement de traduction appliquée
    document.addEventListener('translationsApplied', () => {
        // Réinitialiser les animations après les traductions
        setTimeout(animateOnScroll, 100);
    });
}

// Fonction pour initialiser les animations de scroll
function initScrollAnimations() {
    // Si GSAP est disponible, l'utiliser pour les animations avancées
    if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
        // Animation des compétences au scroll
        gsap.utils.toArray('.skill-progress').forEach(progress => {
            if (!progress) return;
            
            const width = progress.getAttribute('data-width') || '0%';
            
            gsap.to(progress, {
                width: width,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: progress,
                    start: 'top 80%',
                    once: true
                }
            });
        });
    }
} 