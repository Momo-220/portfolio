// Classe d'animation du texte de bienvenue
class WelcomeTextAnimation {
    constructor(element) {
        if (!element) return;
        
        this.element = element;
        this.texts = {
            fr: [
                "👨‍💻 Expert en Solutions Digitales",
                "🚀 Développeur Full Stack",
                "✨ Créateur d'Expériences Web",
                "💡 Passionné par l'Innovation",
                "🤖 Expert en Intelligence Artificielle",
                "🌟 Architecte de Solutions Modernes"
            ],
            en: [
                "👨‍💻 Digital Solutions Expert",
                "🚀 Full Stack Developer",
                "✨ Web Experience Creator",
                "💡 Innovation Enthusiast",
                "🤖 AI Integration Expert",
                "🌟 Modern Solutions Architect"
            ]
        };

        this.currentLang = document.documentElement.lang || 'fr';
        this.currentIndex = 0;
        this.charIndex = 0;
        this.isTyping = true;
        this.currentText = '';
        this.textElement = null;
        this.cursorElement = null;

        this.setupElements();
        this.start();
    }

    setupElements() {
        if (!this.element) return;
        
        this.element.innerHTML = '';
        this.textElement = document.createElement('span');
        this.textElement.classList.add('typed-text');
        this.cursorElement = document.createElement('span');
        this.cursorElement.classList.add('cursor');
        this.cursorElement.textContent = '|';
        
        this.element.appendChild(this.textElement);
        this.element.appendChild(this.cursorElement);
    }

    typeText() {
        if (!this.textElement || !this.texts[this.currentLang]) return;
        
        const currentText = this.texts[this.currentLang][this.currentIndex];
        
        if (this.charIndex < currentText.length) {
            const char = currentText.charAt(this.charIndex);
            const nextChar = currentText.charAt(this.charIndex + 1);
            
            if (char.match(/[\uD800-\uDBFF]/) && nextChar.match(/[\uDC00-\uDFFF]/)) {
                this.currentText += char + nextChar;
                this.charIndex += 2;
            } else {
                this.currentText += char;
                this.charIndex++;
            }
            
            if (this.textElement) {
                this.textElement.textContent = this.currentText;
            }
            setTimeout(() => this.typeText(), 100);
        } else {
            setTimeout(() => this.eraseText(), 2000);
        }
    }

    eraseText() {
        if (!this.textElement) return;
        
        if (this.currentText.length > 0) {
            const lastChar = this.currentText.slice(-2);
            if (lastChar.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)) {
                this.currentText = this.currentText.slice(0, -2);
            } else {
                this.currentText = this.currentText.slice(0, -1);
            }
            
            if (this.textElement) {
                this.textElement.textContent = this.currentText;
            }
            setTimeout(() => this.eraseText(), 50);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.texts[this.currentLang].length;
            this.charIndex = 0;
            setTimeout(() => this.typeText(), 500);
        }
    }

    start() {
        this.typeText();
    }

    setLanguage(lang) {
        if (this.texts[lang]) {
            this.currentLang = lang;
            this.currentIndex = 0;
            this.charIndex = 0;
            this.currentText = '';
            this.start();
        }
    }
}

// Gestionnaire des animations de scroll
class ScrollAnimationManager {
    constructor() {
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in, .slide-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        elements.forEach(element => observer.observe(element));
    }
}

// Gestionnaire des animations de la page
class PageAnimationManager {
    constructor() {
        this.initHeaderAnimation();
        this.initHeroAnimation();
    }

    initHeaderAnimation() {
        const header = document.querySelector('.header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    initHeroAnimation() {
        const elements = ['.welcome-message', '.hero-title', '.hero-subtitle', '.hero-cta'];
        
        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200 * (index + 1));
            }
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Animation du texte de bienvenue
    const typingContainer = document.querySelector('.typing-text');
    if (typingContainer) {
        const welcomeAnimation = new WelcomeTextAnimation(typingContainer);
        
        // Gestion du changement de langue
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                welcomeAnimation.setLanguage(lang);
            });
        });
    }

    // Initialisation des autres animations
    new ScrollAnimationManager();
    new PageAnimationManager();

    // Initialiser GSAP
    if (typeof gsap !== 'undefined') {
        // Enregistrer les plugins si disponibles
        if (gsap.ScrollTrigger) {
            gsap.registerPlugin(gsap.ScrollTrigger);
        }
        if (gsap.ScrollToPlugin) {
            gsap.registerPlugin(gsap.ScrollToPlugin);
        }
        
        // Animation de l'en-tête
        gsap.from('.header', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Animation du titre et du sous-titre
        gsap.from('.hero-title', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.typing-text', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.6,
            ease: 'power3.out'
        });
        
        // Animation des boutons
        gsap.from('.hero-actions', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.9,
            ease: 'power3.out'
        });
        
        // Animation des formes
        gsap.from('.shape', {
            scale: 0,
            opacity: 0,
            duration: 1,
            delay: 1.2,
            stagger: 0.2,
            ease: 'elastic.out(1, 0.3)'
        });
        
        // Animation du scroll indicator
        gsap.from('.scroll-indicator', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 1.5,
            ease: 'power3.out'
        });
        
        // Animations au scroll
        if (gsap.ScrollTrigger) {
            // Section à propos
            gsap.to('.about-image', {
                scrollTrigger: {
                    trigger: '.about-image',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power3.out'
            });
            
            // Animation des stats
            gsap.to('.stat-item', {
                scrollTrigger: {
                    trigger: '.about-stats',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
            
            // Animation des compétences
            gsap.to('.skills-category', {
                scrollTrigger: {
                    trigger: '.skills-container',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                stagger: 0.3,
                duration: 0.8,
                ease: 'power3.out'
            });
            
            // Animation des barres de progression
            gsap.to('.skill-progress', {
                scrollTrigger: {
                    trigger: '.skills-container',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                width: function(i, el) {
                    return el.getAttribute('style').split(':')[1].trim();
                },
                duration: 1.5,
                ease: 'power3.out',
                stagger: 0.1
            });
            
            // Animation du formulaire de contact
            gsap.to('.contact-form', {
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    } else {
        console.warn('GSAP n\'est pas disponible. Les animations sont désactivées.');
    }
}); 