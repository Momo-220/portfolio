class TestimonialsCarousel {
    constructor() {
        try {
            this.carousel = document.querySelector('.testimonials-carousel');
            if (!this.carousel) {
                throw new Error('Carrousel des témoignages non trouvé dans le DOM');
            }

            this.container = this.carousel.querySelector('.testimonials-container');
            this.items = Array.from(this.carousel.querySelectorAll('.testimonial-card'));
            this.dotsContainer = this.carousel.querySelector('.carousel-dots');

            if (!this.container || !this.items.length || !this.dotsContainer) {
                throw new Error('Éléments requis du carrousel manquants');
            }

            this.currentIndex = 0;
            this.itemsPerView = this.getItemsPerView();
            this.isAnimating = false;
            this.autoplayInterval = null;
            this.touchEnabled = 'ontouchstart' in window;
            
            this.init();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du carrousel:', error);
            this.handleInitError();
        }
    }

    handleInitError() {
        // Créer un message d'erreur visuellement agréable
        const errorMessage = document.createElement('div');
        errorMessage.className = 'testimonials-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <p>Désolé, le carrousel n'a pas pu être chargé.</p>
                <button class="retry-btn">Réessayer</button>
            </div>
        `;

        // Remplacer le carrousel par le message d'erreur
        if (this.carousel && this.carousel.parentNode) {
            this.carousel.parentNode.replaceChild(errorMessage, this.carousel);
        }

        // Ajouter un gestionnaire pour réessayer
        const retryBtn = errorMessage.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    init() {
        try {
            this.container.style.display = 'flex';
            this.container.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            this.setupAccessibility();
            this.setupEventListeners();
            
            if (this.touchEnabled) {
                this.initTouchEvents();
            }
            
            window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
            
            this.updateCarousel();
            this.startAutoplay();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.handleInitError();
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    startAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        
        this.autoplayInterval = setInterval(() => {
            if (!document.hidden && !this.isAnimating) {
                this.navigate('next');
            }
        }, 6000); // 6 secondes pour éviter la synchronisation avec le carousel du portfolio
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    setupAccessibility() {
        // Configuration du carrousel pour l'accessibilité
        this.carousel.setAttribute('role', 'region');
        this.carousel.setAttribute('aria-label', 'Témoignages des clients');
        this.container.setAttribute('role', 'list');
        
        // Configuration des cartes de témoignages
        this.items.forEach((item, index) => {
            item.setAttribute('role', 'listitem');
            item.setAttribute('aria-label', `Témoignage ${index + 1} sur ${this.items.length}`);
            item.setAttribute('tabindex', '0');
        });
    }

    setupEventListeners() {
        // Navigation au clavier
        this.carousel.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigate('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigate('next');
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.items.length - this.itemsPerView);
                    break;
            }
        });

        // Gestion du focus
        this.items.forEach(item => {
            item.addEventListener('focus', () => {
                const index = this.items.indexOf(item);
                if (index !== this.currentIndex) {
                    this.goToSlide(index);
                }
            });
        });
        
        // Ajouter des écouteurs aux points de navigation
        this.updateDots();
    }

    getItemsPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 768) return 2;
        return 1;
    }

    navigate(direction) {
        if (this.isAnimating || !this.items.length) return;
        
        try {
            this.isAnimating = true;
            
            if (direction === 'next') {
                this.currentIndex = this.currentIndex >= this.items.length - this.itemsPerView ? 
                    0 : this.currentIndex + 1;
            } else {
                this.currentIndex = this.currentIndex <= 0 ? 
                    this.items.length - this.itemsPerView : this.currentIndex - 1;
            }
            
            this.updateCarousel(direction);
            this.announceSlideChange();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        } catch (error) {
            console.error('Erreur lors de la navigation:', error);
            this.isAnimating = false;
        }
    }

    updateCarousel(direction = 'next') {
        // Calcul de la translation
        const itemWidth = 100 / this.itemsPerView;
        const translateX = -(this.currentIndex * itemWidth);

        // Application de la translation avec animation
        this.container.style.transform = `translateX(${translateX}%)`;

        // Mise à jour des états ARIA et des classes
        this.items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            item.setAttribute('aria-hidden', String(!(index >= this.currentIndex && index < this.currentIndex + this.itemsPerView)));
                            
            if (index === this.currentIndex) {
                item.classList.add('active');
                item.setAttribute('tabindex', '0');
            } else if (index === this.currentIndex - 1 ||
                (this.currentIndex === 0 && index === this.items.length - 1)) {
                item.classList.add('prev');
                item.setAttribute('tabindex', '-1');
            } else if (index === this.currentIndex + 1 ||
                (this.currentIndex === this.items.length - 1 && index === 0)) {
                item.classList.add('next');
                item.setAttribute('tabindex', '-1');
            }
        });

        // Mise à jour des points
        this.updateDots();
    }

    announceSlideChange() {
        // Création d'une annonce live pour les lecteurs d'écran
        const liveRegion = this.carousel.querySelector('.sr-only') || document.createElement('div');
        if (!this.carousel.querySelector('.sr-only')) {
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            this.carousel.appendChild(liveRegion);
        }

        const currentSlide = this.currentIndex + 1;
        const totalSlides = this.items.length;
        liveRegion.textContent = `Témoignage ${currentSlide} sur ${totalSlides}`;
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.dot');
        const activeDotIndex = Math.floor(this.currentIndex / this.itemsPerView);

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
        
        // Ajouter des écouteurs d'événements aux points
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isAnimating) {
                    // Arrêter temporairement le défilement automatique
                    this.stopAutoplay();
                    
                    const targetIndex = index * this.itemsPerView;
                    this.goToSlide(targetIndex);
                    
                    // Redémarrer le défilement automatique après 10 secondes
                    setTimeout(() => {
                        this.startAutoplay();
                    }, 10000);
                }
            });
        });
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        const direction = index > this.currentIndex ? 'next' : 'prev';
        this.currentIndex = index;
        this.updateCarousel(direction);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            // Arrêter le défilement automatique pendant le toucher
            this.stopAutoplay();
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.navigate('next');
                } else {
                    this.navigate('prev');
                }
            }
            
            // Redémarrer le défilement automatique après le toucher
            setTimeout(() => {
                this.startAutoplay();
            }, 3000);
        });
    }

    handleResize() {
        try {
            const newItemsPerView = this.getItemsPerView();

            if (newItemsPerView !== this.itemsPerView) {
                this.itemsPerView = newItemsPerView;
                this.currentIndex = Math.min(this.currentIndex, this.items.length - this.itemsPerView);
                this.updateCarousel();
            }
        } catch (error) {
            console.error('Erreur lors du redimensionnement:', error);
        }
    }

    destroy() {
        try {
            // Nettoyage des événements et des intervalles
            this.stopAutoplay();
            window.removeEventListener('resize', this.handleResize.bind(this));

            // Réinitialisation des styles
            this.container.style.transform = '';
            this.container.style.transition = '';

            // Suppression des classes ajoutées
            this.items.forEach(item => {
                item.classList.remove('active', 'prev', 'next');
                item.removeAttribute('aria-hidden');
                item.removeAttribute('tabindex');
            });
        } catch (error) {
            console.error('Erreur lors de la destruction du carrousel:', error);
        }
    }
}

// Initialisation sécurisée du carrousel
document.addEventListener('DOMContentLoaded', () => {
    try {
        const carousel = new TestimonialsCarousel();

        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                carousel.stopAutoplay();
            } else {
                carousel.startAutoplay();
            }
        });

        // Nettoyage lors de la destruction de la page
        window.addEventListener('beforeunload', () => {
            carousel.destroy();
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du carrousel:', error);
    }
}); 