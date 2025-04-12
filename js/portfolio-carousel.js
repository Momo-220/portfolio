class PortfolioCarousel {
    constructor() {
        this.carousel = document.querySelector('.portfolio-carousel');
        this.container = this.carousel.querySelector('.portfolio-container');
        this.items = this.carousel.querySelectorAll('.portfolio-item');
        this.dots = this.carousel.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.itemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        this.isAnimating = false;
        this.autoplayInterval = null;
        
        this.init();
    }

    init() {
        // Initialisation des points de navigation
        this.createDots();
        
        // Gestion du swipe sur mobile
        this.initTouchEvents();
        
        // Gestion du redimensionnement
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Mise à jour initiale
        this.updateCarousel();
        
        // Démarrer le défilement automatique
        this.startAutoplay();
    }

    startAutoplay() {
        // Arrêter tout intervalle existant
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        
        // Créer un nouvel intervalle pour le défilement automatique
        this.autoplayInterval = setInterval(() => {
            if (!document.hidden && !this.isAnimating) {
                this.navigate('next');
            }
        }, 5000); // Défilement toutes les 5 secondes
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    navigate(direction) {
        if (this.isAnimating) return;
        
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
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    updateCarousel(direction = 'next') {
        // Calcul de la translation
        const slideWidth = 100 / this.itemsPerView;
        const translateX = -(this.currentIndex * slideWidth);
        
        // Application de la translation avec animation
        this.container.style.transform = `translateX(${translateX}%)`;
        
        // Mise à jour des classes actives
        this.items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentIndex) {
                item.classList.add('active');
            } else if (index === this.currentIndex - 1 || 
                (this.currentIndex === 0 && index === this.items.length - 1)) {
                item.classList.add('prev');
            } else if (index === this.currentIndex + 1 || 
                (this.currentIndex === this.items.length - 1 && index === 0)) {
                item.classList.add('next');
            }
        });
        
        // Mise à jour des points
        this.updateDots();
    }

    createDots() {
        this.dots.innerHTML = '';
        const numberOfDots = Math.ceil(this.items.length / this.itemsPerView);
        
        for (let i = 0; i < numberOfDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                if (!this.isAnimating) {
                    // Arrêter temporairement le défilement automatique
                    this.stopAutoplay();
                    
                    const targetIndex = i * this.itemsPerView;
                    const direction = targetIndex > this.currentIndex ? 'next' : 'prev';
                    this.currentIndex = targetIndex;
                    this.updateCarousel(direction);
                    
                    // Redémarrer le défilement automatique après un clic
                    setTimeout(() => {
                        this.startAutoplay();
                    }, 5000);
                }
            });
            this.dots.appendChild(dot);
        }
    }

    updateDots() {
        const dots = this.dots.querySelectorAll('.dot');
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
            // Arrêter temporairement le défilement automatique lors du toucher
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
            }, 1000);
        });
    }

    handleResize() {
        const newItemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        
        if (newItemsPerView !== this.itemsPerView) {
            this.itemsPerView = newItemsPerView;
            this.currentIndex = Math.min(this.currentIndex, this.items.length - this.itemsPerView);
            this.createDots();
            this.updateCarousel();
        }
    }
}

// Initialisation du carrousel
document.addEventListener('DOMContentLoaded', () => {
    const portfolioCarousel = new PortfolioCarousel();
    
    // Gérer la visibilité de page
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            portfolioCarousel.stopAutoplay();
        } else {
            portfolioCarousel.startAutoplay();
        }
    });
}); 