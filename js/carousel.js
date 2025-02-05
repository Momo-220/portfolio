class PortfolioCarousel {
    constructor() {
        this.container = document.querySelector('.portfolio-container');
        this.items = document.querySelectorAll('.portfolio-item');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.itemWidth = this.items[0]?.offsetWidth || 0;
        this.itemsPerView = window.innerWidth > 768 ? 3 : 1;
        
        this.init();
    }

    init() {
        // Ajout des écouteurs d'événements pour les boutons
        this.prevBtn?.addEventListener('click', () => this.slide('prev'));
        this.nextBtn?.addEventListener('click', () => this.slide('next'));
        
        // Ajout des écouteurs pour les points
        this.dots?.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Initialisation de l'état actif
        this.updateActiveStates();
        
        // Gestion du redimensionnement
        window.addEventListener('resize', () => {
            this.itemWidth = this.items[0]?.offsetWidth || 0;
            this.itemsPerView = window.innerWidth > 768 ? 3 : 1;
            this.updateSlidePosition();
        });
    }

    slide(direction) {
        if (direction === 'next') {
            this.currentIndex = Math.min(this.currentIndex + 1, this.items.length - this.itemsPerView);
        } else {
            this.currentIndex = Math.max(this.currentIndex - 1, 0);
        }

        this.updateSlidePosition();
        this.updateActiveStates();
    }

    goToSlide(index) {
        this.currentIndex = Math.min(Math.max(index, 0), this.items.length - this.itemsPerView);
        this.updateSlidePosition();
        this.updateActiveStates();
    }

    updateSlidePosition() {
        const offset = -this.currentIndex * (this.itemWidth + 40); // 40px est le gap entre les items
        this.container.style.transform = `translateX(${offset}px)`;
    }

    updateActiveStates() {
        // Mise à jour des états actifs des items
        this.items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            if (index === this.currentIndex) {
                item.classList.add('active');
            } else if (index === this.currentIndex - 1) {
                item.classList.add('prev');
            } else if (index === this.currentIndex + 1) {
                item.classList.add('next');
            }
        });

        // Mise à jour des points
        this.dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Gestion de la visibilité des boutons
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';
        }
        if (this.nextBtn) {
            const lastPossibleIndex = this.items.length - this.itemsPerView;
            this.nextBtn.style.opacity = this.currentIndex >= lastPossibleIndex ? '0.5' : '1';
            this.nextBtn.style.pointerEvents = this.currentIndex >= lastPossibleIndex ? 'none' : 'auto';
        }
    }
}

// Initialisation du carrousel quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioCarousel();
}); 