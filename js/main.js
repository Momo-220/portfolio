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
    // Masquer le préchargeur
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
    
    // Initialiser les gestionnaires
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new ParticlesManager();
    new LanguageManager();

    // Éléments du DOM
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    let lastScroll = 0;

    // Gestion du menu mobile
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navContainer.classList.toggle('active');
    });

    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navContainer.classList.remove('active');
        });
    });

    // Gestion du scroll pour la navigation
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Ajouter/enlever la classe scrolled pour le style
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Cacher/montrer la navigation lors du scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Gestion des liens actifs dans la navigation
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    });

    // Gestion du carrousel portfolio
    const carousel = document.querySelector('.portfolio-carousel');
    const container = carousel.querySelector('.portfolio-container');
    const items = carousel.querySelectorAll('.portfolio-item');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    let currentIndex = 0;
    let isAnimating = false;
    const itemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;

    // Créer les 4 segments de la barre de progression
    const numberOfSegments = 4;
    for (let i = 0; i < numberOfSegments; i++) {
        const segment = document.createElement('span');
        segment.classList.add('dot');
        if (i === 0) {
            segment.classList.add('active');
            segment.style.setProperty('--progress', '0%');
        }
        segment.addEventListener('click', () => {
            if (!isAnimating) {
                stopAutoplay();
                // Calculer l'index du projet correspondant au segment
                const projectIndex = Math.floor((items.length / numberOfSegments) * i);
                goToSlide(projectIndex);
                startAutoplay();
            }
        });
        dotsContainer.appendChild(segment);
    }

    // Mettre à jour l'affichage avec animation
    function updateCarousel(direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        const slideWidth = carousel.clientWidth / itemsPerView;
        container.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Mettre à jour la barre de progression
        const segmentIndex = Math.floor((currentIndex / items.length) * numberOfSegments);
        dotsContainer.querySelectorAll('.dot').forEach((segment, index) => {
            segment.classList.toggle('active', index === segmentIndex);
            if (index === segmentIndex) {
                // Réinitialiser l'animation de la barre de progression
                segment.style.animation = 'none';
                segment.offsetHeight; // Force reflow
                segment.style.animation = null;
            }
        });

        // Mettre à jour les items avec animation
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next', 'sliding-in', 'sliding-out');
            
            if (index === currentIndex) {
                item.classList.add('active', direction === 'next' ? 'sliding-in' : 'sliding-out');
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === items.length - 1)) {
                item.classList.add('prev');
            } else if (index === currentIndex + 1 || (currentIndex === items.length - 1 && index === 0)) {
                item.classList.add('next');
            }
        });

        // Réinitialiser l'état d'animation après la transition
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Navigation
    function goToSlide(index, direction = 'next') {
        if (isAnimating) return;
        
        const previousIndex = currentIndex;
        currentIndex = Math.max(0, Math.min(index, items.length - itemsPerView));
        
        direction = currentIndex > previousIndex ? 'next' : 'prev';
        updateCarousel(direction);
    }

    function nextSlide() {
        if (isAnimating) return;
        const nextIndex = currentIndex + 1;
        if (nextIndex >= items.length - itemsPerView + 1) {
            currentIndex = 0;
        } else {
            currentIndex = nextIndex;
        }
        updateCarousel('next');
    }

    function prevSlide() {
        if (isAnimating) return;
        const prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            currentIndex = items.length - itemsPerView;
        } else {
            currentIndex = prevIndex;
        }
        updateCarousel('prev');
    }

    // Événements
    nextBtn.addEventListener('click', () => !isAnimating && nextSlide());
    prevBtn.addEventListener('click', () => !isAnimating && prevSlide());

    // Gestion du swipe sur mobile avec animation
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        if (isAnimating) return;
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        if (isAnimating) return;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Autoplay avec gestion de la barre de progression
    let autoplayInterval;
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
                // Réinitialiser l'animation de la barre active
                const activeSegment = dotsContainer.querySelector('.dot.active');
                if (activeSegment) {
                    activeSegment.style.animation = 'none';
                    activeSegment.offsetHeight; // Force reflow
                    activeSegment.style.animation = null;
                }
            }
        }, 5000);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    // Démarrer/arrêter l'autoplay au survol
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay);
    carousel.addEventListener('touchend', startAutoplay);

    // Démarrer l'autoplay initialement
    startAutoplay();

    // Mise à jour initiale
    updateCarousel();

    // Gestion du redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newItemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
            if (newItemsPerView !== itemsPerView) {
                itemsPerView = newItemsPerView;
                currentIndex = Math.min(currentIndex, items.length - itemsPerView);
                updateCarousel();
            }
        }, 250);
    });
}); 