class TestimonialsCarousel {
    constructor() {
        try {
            this.carousel = document.querySelector('.testimonials-carousel');
            if (!this.carousel) {
                throw new Error('Carrousel des témoignages non trouvé dans le DOM');
            }

            this.container = this.carousel.querySelector('.testimonials-container');
            this.items = Array.from(this.carousel.querySelectorAll('.testimonial-card'));
            this.prevBtn = this.carousel.querySelector('.carousel-btn.prev');
            this.nextBtn = this.carousel.querySelector('.carousel-btn.next');
            this.dotsContainer = this.carousel.querySelector('.carousel-dots');

            if (!this.container || !this.items.length || !this.prevBtn || !this.nextBtn || !this.dotsContainer) {
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
            this.createDots();
            
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
        }, 5000);
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
        
        // Configuration des boutons
        this.prevBtn.setAttribute('aria-label', 'Témoignage précédent');
        this.nextBtn.setAttribute('aria-label', 'Témoignage suivant');
        
        // Configuration des cartes de témoignages
        this.items.forEach((item, index) => {
            item.setAttribute('role', 'listitem');
            item.setAttribute('aria-label', `Témoignage ${index + 1} sur ${this.items.length}`);
            item.setAttribute('tabindex', '0');
        });
    }

    setupEventListeners() {
        // Événements des boutons
        this.prevBtn.addEventListener('click', () => this.navigate('prev'));
        this.nextBtn.addEventListener('click', () => this.navigate('next'));
        
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
            const previousIndex = this.currentIndex;
            
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
            this.showErrorNotification('Une erreur est survenue lors de la navigation');
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

    createDots() {
        this.dotsContainer.innerHTML = '';
        const numberOfDots = Math.ceil(this.items.length / this.itemsPerView);
        
        for (let i = 0; i < numberOfDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                if (!this.isAnimating) {
                    const targetIndex = i * this.itemsPerView;
                    const direction = targetIndex > this.currentIndex ? 'next' : 'prev';
                    this.currentIndex = targetIndex;
                    this.updateCarousel(direction);
                }
            });
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.dot');
        const activeDotIndex = Math.floor(this.currentIndex / this.itemsPerView);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
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
        });
    }

    handleResize() {
        try {
            const newItemsPerView = this.getItemsPerView();
            
            if (newItemsPerView !== this.itemsPerView) {
                this.itemsPerView = newItemsPerView;
                this.currentIndex = Math.min(this.currentIndex, this.items.length - this.itemsPerView);
                this.createDots();
                this.updateCarousel();
            }
        } catch (error) {
            console.error('Erreur lors du redimensionnement:', error);
        }
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'carousel-error-notification';
        notification.textContent = message;
        
        this.carousel.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    destroy() {
        try {
            // Nettoyage des événements et des intervalles
            this.stopAutoplay();
            window.removeEventListener('resize', this.handleResize.bind(this));
            
            // Suppression des gestionnaires d'événements
            this.prevBtn.removeEventListener('click', this.navigate.bind(this, 'prev'));
            this.nextBtn.removeEventListener('click', this.navigate.bind(this, 'next'));
            
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